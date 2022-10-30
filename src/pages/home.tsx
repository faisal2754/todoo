import { Item, List } from '@prisma/client'
import { QueryFunctionContext, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import CreateList from '@/components/create-list'
import TodoCard from '@/components/todo-card'
import s from '@/styles/home.module.scss'
import { B, col, G, R } from '@/utils/animation'
import CreateItem from '@/components/create-item'
import Header from '@/components/header'

const ANIMATION_SPEED = 0.05

type ListWithIcon = List & { icon: string }

type GetListsResponse = {
  success: boolean
  data: ListWithIcon[]
  errors: unknown
}

type GetItemsResponse = {
  success: boolean
  data: Item[]
  errors: unknown
}

const fetchLists = async (): Promise<GetListsResponse> => {
  return (await axios.post('/api/list/get')).data
}

const fetchItems = async ({
  queryKey,
}: QueryFunctionContext): Promise<GetItemsResponse> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, body] = queryKey
  return (await axios.post('/api/item/get', body)).data
}

const Home = () => {
  const { data: session, status } = useSession()
  const [showCreateList, setShowCreateList] = useState(false)
  const [activeListId, setActiveListId] = useState(1)
  const [activeList, setActiveList] = useState<ListWithIcon>()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (canvas) {
      const ctx = canvas.getContext('2d')

      if (ctx == null) throw new Error('Could not get context')

      let t = 0
      let x
      let y

      const animate = function () {
        for (x = 0; x <= 35; x++) {
          for (y = 0; y <= 35; y++) {
            col(ctx, x, y, R(x, y, t), G(x, y, t), B(x, y, t))
          }
        }
        t = t + ANIMATION_SPEED
        window.requestAnimationFrame(animate)
      }

      animate()
    }
  }, [])

  useEffect(() => {
    if (showCreateList) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [showCreateList])

  const { data: lists } = useQuery<GetListsResponse, Error>(
    ['lists'],
    fetchLists,
    {
      onSuccess: (data) => {
        if (data.data[0]) {
          setActiveListId(data.data[0].id)
          setActiveList(data.data[0])
        }
      },
      onError: (err) => {
        console.log(err)
        toast.error('Error fetching lists!')
      },
    }
  )

  const { data: items } = useQuery<GetItemsResponse, Error>(
    ['items', { listId: activeListId }],
    fetchItems,
    {
      onSuccess: (data) => {
        console.log(data)
      },
      onError: (err) => {
        console.log(err)
        toast.error('Error fetching items!')
      },
      enabled: !!lists,
    }
  )

  return (
    <div className={s.home}>
      <Head>
        <title>Home</title>
      </Head>
      <CreateList
        showCreateList={showCreateList}
        setShowCreateList={setShowCreateList}
        session={session}
      />
      <div className={s.hero}>
        <canvas ref={canvasRef} width='32px' height='32px' />
        <Header
          status={status}
          session={session}
          lists={lists}
          activeListId={activeListId}
          setActiveListId={setActiveListId}
          activeList={activeList}
          setActiveList={setActiveList}
          setShowCreateList={setShowCreateList}
        />
        <CreateItem activeListId={activeListId} />
      </div>
      <main className={s.main}>
        <h1 className={s.heading}>Your items</h1>
        {items &&
          items.data &&
          items.data.map((item, idx: number) => {
            return (
              <TodoCard
                key={idx}
                itemId={item.id}
                initialCheck={item.completed}
                text={item.description}
              />
            )
          })}
        <div className={s.blob}></div>
      </main>
    </div>
  )
}
export default Home
