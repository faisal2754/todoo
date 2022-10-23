import { Item } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { typeToFlattenedError, z, ZodError } from 'zod'

import { prisma } from '@/server/db/client'

const ItemCreate = z.object({
  listId: z.number(),
  description: z.string(),
})

type CreateItemResponse = {
  success: boolean
  data: Item | null
  errors: typeToFlattenedError<typeof ItemCreate> | null
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await createItem(req.body)
  res.status(200).json(result)
}

const createItem = async (rawData: unknown): Promise<CreateItemResponse> => {
  let item: Item | null

  try {
    const data = ItemCreate.parse(rawData)
    item = await prisma.item.create({
      data: {
        listId: data.listId,
        description: data.description,
      },
    })
  } catch (err) {
    if (err instanceof ZodError) {
      return { success: false, data: null, errors: err.flatten() }
    }

    throw err
  }

  return { success: true, data: item, errors: null }
}

export default handler
