import { List } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth'

import { getServerAuthSession } from '@/server/common/get-server-auth-session'
import { prisma } from '@/server/db/client'

type ListWithIcon = List & { icon: string }

type GetListsResponse = {
  success: boolean
  data: ListWithIcon[] | null
  errors: any
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res })
  if (!session) {
    return res
      .status(401)
      .json({ success: false, data: null, errors: 'Unauthorized' })
  }

  const data = await getLists(session)

  return res.status(200).json(data)
}

const getLists = async (session: Session): Promise<GetListsResponse> => {
  const lists = await prisma.list.findMany({
    where: { userId: session.user?.id },
  })

  const listsWithIcon: ListWithIcon[] = []
  lists.forEach((list) => {
    listsWithIcon.push({
      ...list,
      icon:
        list.type === 'SPORTS'
          ? '/sports.svg'
          : list.type === 'WORK'
          ? '/work.svg'
          : list.type === 'SHOPPING'
          ? '/shopping.svg'
          : list.type === 'TRAVEL'
          ? '/travel.svg'
          : list.type === 'OTHER'
          ? '/other.svg'
          : '/other.svg',
    })
  })

  return { success: true, data: listsWithIcon, errors: null }
}

export default handler
