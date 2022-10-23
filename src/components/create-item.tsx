import { Item } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { typeToFlattenedError, z } from 'zod'

import { queryClient } from '@/pages/_app'
import s from '@/styles/create-item.module.scss'

type CreateItemProps = {
  activeListId: number
}

type CreateItemResponse = {
  success: boolean
  data: Item | null
  errors: typeToFlattenedError<typeof ZodItemCreate> | null
}

const ZodItemCreate = z.object({
  listId: z.number(),
  description: z.string(),
})

type ItemCreate = {
  listId: number
  description: string
}

const CreateItem = ({ activeListId }: CreateItemProps) => {
  const [description, setDescription] = useState('')

  const createItemMutation = useMutation<
    CreateItemResponse,
    CreateItemResponse,
    ItemCreate
  >(
    (data) => {
      return axios.post('/api/item/create', data)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['items'])
        setDescription('')
        toast.success('Item created!')
      },
      onError: (err) => {
        console.log(err)
        toast.error('Something went wrong :(')
      },
    }
  )

  const handleCreateItem = () => {
    createItemMutation.mutate({
      listId: activeListId,
      description: description,
    })
  }

  return (
    <>
      <div className={s.newItem}>
        <div className={s.input}>
          <input
            type='text'
            placeholder='Add an item'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className={s.icon} title='Add item' onClick={handleCreateItem}>
            +
          </div>
        </div>
      </div>
    </>
  )
}
export default CreateItem
