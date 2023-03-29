import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Item } from '@prisma/client'
import { typeToFlattenedError } from 'zod'
import { toast } from 'react-toastify'

import s from '@/styles/todo-card.module.scss'
import axios from 'axios'

type ItemUpdate = {
  itemId: number
  completed: boolean
}

type UpdateItemResponse = {
  success: boolean
  data: Item | null
  errors: typeToFlattenedError<ItemUpdate> | null
}

type TodoCardProps = {
  itemId: number
  initialCheck: boolean
  text: string
}

const TodoCard = ({ itemId, initialCheck, text }: TodoCardProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [checked, setChecked] = useState(initialCheck)

  const updateItemMutation = useMutation<
    UpdateItemResponse,
    UpdateItemResponse,
    ItemUpdate
  >(
    (data) => {
      return axios.post('/api/item/update', data)
    },
    {
      onMutate: () => {
        setIsLoading(true)
      },
      onSuccess: () => {
        setChecked(!checked)
      },
      onError: (err) => {
        console.log(err)
        toast.error('Something went wrong :(')
      },
      onSettled: () => {
        setIsLoading(false)
      },
    }
  )

  const handleCheck = () => {
    updateItemMutation.mutate({ itemId, completed: !checked })
  }

  return (
    <div className={`${s.todoCard} ${isLoading && s.blur}`}>
      <div className={s.check}>
        <input
          type='checkbox'
          id={itemId as unknown as string}
          checked={checked}
          onChange={handleCheck}
        />
        <label htmlFor={itemId as unknown as string}>
          <div className={s.tick}></div>
        </label>
      </div>
      <div className={s.text}>{text}</div>
    </div>
  )
}
export default TodoCard
