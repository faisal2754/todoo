import { List, ListType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Session } from 'next-auth'
import Image from 'next/future/image'
import { toast } from 'react-toastify'
import { typeToFlattenedError, z } from 'zod'

import { queryClient } from '@/pages/_app'
import s from '@/styles/create-list.module.scss'

type CreateListProps = {
  showCreateList: boolean
  setShowCreateList: React.Dispatch<React.SetStateAction<boolean>>
  setShowCreateListMessage: React.Dispatch<React.SetStateAction<boolean>>
  session: Session | null
}

const ZodListCreate = z.object({
  userId: z.string(),
  type: z.nativeEnum(ListType),
})

type CreateListResponse = {
  success: boolean
  data: List | null
  errors: typeToFlattenedError<typeof ZodListCreate> | null
}

type ListCreate = {
  userId: string
  type: ListType
}

const CreateList = ({
  showCreateList,
  setShowCreateList,
  setShowCreateListMessage,
  session,
}: CreateListProps) => {
  const createListMutation = useMutation<
    CreateListResponse,
    CreateListResponse,
    ListCreate
  >(
    (data) => {
      return axios.post('/api/list/create', data)
    },
    {
      onSuccess: () => {
        setShowCreateList(false)
        setShowCreateListMessage(false)
        queryClient.invalidateQueries(['lists'])
        toast.success('List created!')
      },
      onError: (err) => {
        console.log(err)
        toast.error('Something went wrong :(')
      },
    }
  )

  const handleCreateList = (e: React.MouseEvent<HTMLLIElement>) => {
    if (session?.user) {
      createListMutation.mutate({
        userId: session.user.id,
        type: e.currentTarget.dataset.id?.toUpperCase() as ListType,
      })
    } else {
      toast.error('Something went wrong :(')
    }
  }

  return (
    <>
      <div
        className={`${s.createList} ${!showCreateList && s.hidden}`}
        onClick={() => setShowCreateList(false)}
      >
        <div className={s.card} onClick={(e) => e.stopPropagation()}>
          <div className={s.cardHeading}>Create a new list</div>
          <div className={s.cardContent}>
            <ul>
              <li className={s.work} data-id='work' onClick={handleCreateList}>
                <Image
                  src='/work.svg'
                  alt='icon'
                  width={35}
                  height={35}
                  className={s.icon}
                />
              </li>
              <li
                className={s.shopping}
                data-id='shopping'
                onClick={handleCreateList}
              >
                <Image src='/shopping.svg' alt='icon' width={35} height={35} />
              </li>
              <li
                className={s.travel}
                data-id='travel'
                onClick={handleCreateList}
              >
                <Image src='/travel.svg' alt='icon' width={35} height={35} />
              </li>
              <li
                className={s.sports}
                data-id='sports'
                onClick={handleCreateList}
              >
                <Image src='/sports.svg' alt='icon' width={35} height={35} />
              </li>
              <li
                className={s.other}
                data-id='other'
                onClick={handleCreateList}
              >
                <Image src='/other.svg' alt='icon' width={35} height={35} />
              </li>
              <span className={s.text}></span>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
export default CreateList
