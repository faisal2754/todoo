import { List, ListType } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { typeToFlattenedError, z, ZodError } from 'zod'

import { prisma } from '@/server/db/client'

const ListCreate = z.object({
  userId: z.string(),
  type: z.nativeEnum(ListType),
})

type CreateListResponse = {
  success: boolean
  data: List | null
  errors: typeToFlattenedError<typeof ListCreate> | null
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await createList(req.body)
  res.status(200).json(result)
}

const createList = async (rawData: unknown): Promise<CreateListResponse> => {
  let list: List | null = null

  try {
    const data = ListCreate.parse(rawData)
    list = await prisma.list.create({
      data: {
        userId: data.userId,
        type: data.type,
      },
    })
  } catch (err) {
    if (err instanceof ZodError) {
      return { success: false, data: null, errors: err.flatten() }
    }

    throw err
  }

  return { success: true, data: list, errors: null }
}

export default handler
