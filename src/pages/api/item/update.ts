import { Item } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { typeToFlattenedError, z, ZodError } from 'zod'

import { prisma } from '@/server/db/client'

const ItemUpdate = z.object({
  itemId: z.number(),
  completed: z.boolean(),
})

type UpdateItemResponse = {
  success: boolean
  data: Item | null
  errors: typeToFlattenedError<typeof ItemUpdate> | null
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await updateItem(req.body)
  res.status(200).json(result)
}

const updateItem = async (rawData: any): Promise<UpdateItemResponse> => {
  let item: Item | null

  try {
    const data = ItemUpdate.parse(rawData)
    item = await prisma.item.update({
      data: {
        completed: data.completed,
      },
      where: {
        id: data.itemId,
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
