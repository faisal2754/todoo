import { Item } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { z, ZodError } from 'zod'

import { getServerAuthSession } from '@/server/common/get-server-auth-session'
import { prisma } from '@/server/db/client'

type GetItemsResponse = {
  success: boolean
  data: Item[] | null
  errors: any
}

const ItemsGet = z.object({
  listId: z.number(),
})

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res })
  if (!session) {
    return res
      .status(401)
      .json({ success: false, data: null, errors: 'Unauthorized' })
  }

  const data = await getItems(req.body)

  return res.status(200).json(data)
}

const getItems = async (rawData: any): Promise<GetItemsResponse> => {
  let items: Item[]

  try {
    const data = ItemsGet.parse(rawData)
    items = await prisma.item.findMany({
      where: { listId: data.listId },
    })
  } catch (err) {
    if (err instanceof ZodError) {
      return { success: false, data: null, errors: err.flatten() }
    }

    throw err
  }

  return { success: true, data: items, errors: null }
}

export default handler
