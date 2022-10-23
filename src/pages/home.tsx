import { Item, List } from '@prisma/client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/future/image'
import React, { useEffect, useRef, useState } from 'react'

import TodoCard from '@/components/todo-card'
import { getServerAuthSession } from '@/server/common/get-server-auth-session'
import { prisma } from '@/server/db/client'
import s from '@/styles/home.module.scss'
import { B, col, G, R } from '@/utils/animation'
import Head from 'next/head'
import CreateList from '@/components/create-list'

const SPEED = 0.05

const Home = ({
  lists,
  items,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession()
  const [showCreateList, setShowCreateList] = useState(false)
  const [showList, setShowList] = useState(false)
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
        t = t + SPEED
        window.requestAnimationFrame(animate)
      }

      animate()
    }
  }, [])

  return (
    <div className={s.home}>
      <Head>
        <title>Home</title>
      </Head>
      <CreateList
        showCreateList={showCreateList}
        setShowCreateList={setShowCreateList}
      />
      <div className={s.hero}>
        <canvas ref={canvasRef} width='32px' height='32px' />
        <header className={s.header}>
          <div className={s.listContainer}>
            <div className={s.selectWrapper}>
              <div
                className={`${s.select} ${showList && s.isActive}`}
                onClick={() => setShowList(!showList)}
              >
                <div className={s.selectTrigger}>
                  <div className={s.selectedList}>
                    <Image
                      src={lists[0]!.icon}
                      alt='icon'
                      width={20}
                      height={20}
                      className={s.icon}
                    />
                    <div className={s.text}>
                      {lists[0]!.type.charAt(0) +
                        lists[0]!.type.slice(1).toLowerCase()}
                    </div>
                  </div>
                  <div className={s.selectIcon}>
                    <Image
                      src='/arrow.svg'
                      alt='arrow'
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
                <div className={s.selectOptions}>
                  {lists.map((list, idx: number) => {
                    return (
                      <div key={idx} className={s.selectOption}>
                        <div className={s.icon}>
                          <Image
                            src={list.icon}
                            alt='icon'
                            width={20}
                            height={20}
                          />
                        </div>
                        <div className={s.text}>
                          {list.type.charAt(0) +
                            list.type.slice(1).toLowerCase()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <Image
              src='/plus.svg'
              alt='addList'
              width={50}
              height={50}
              title='Create list'
              className={s.addIcon}
              onClick={() => setShowCreateList(true)}
            />
          </div>
          <div className={s.logoContainer}>
            <Image
              src='/logo.svg'
              alt='logo'
              width={150}
              height={40}
              className={s.logo}
            />
          </div>
          <div className={s.profileContainer}>
            {status === 'loading' && (
              <Image
                src='/loader.svg'
                alt='loader'
                width={50}
                height={50}
                className={s.loader}
              />
            )}
            {status === 'authenticated' && (
              <div className={s.profileContainer}>
                <div className={s.profile}>
                  <div className={s.name}>{session.user?.name}</div>
                  <div className={s.dpContainer}>
                    {session.user?.image && (
                      <Image
                        src={session.user?.image}
                        alt='dp'
                        width={100}
                        height={100}
                        className={s.dp}
                      />
                    )}
                  </div>
                </div>
                <div
                  className={s.logout}
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
          {/* <Lists session={session} status={status} /> */}
        </header>
        <div className={s.newItem}>
          <div className={s.input}>
            <input type='text' placeholder='Add an item' />
            <div className={s.icon} title='Add item'>
              +
            </div>
          </div>
        </div>
      </div>
      <main className={s.main}>
        <h1 className={s.heading}>Your items</h1>
        {items.map((item, idx: number) => {
          return (
            <TodoCard
              key={idx}
              id={item.id}
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

type ListWithIcon = List & { icon: string }

type Props = {
  lists: ListWithIcon[]
  items: Item[]
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
}) => {
  const session = await getServerAuthSession({ req, res })

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  // get all lists
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

  // get all items
  let items = Array<Item>()
  if (lists.length > 0) {
    items = await prisma.item.findMany({
      where: { listId: lists[0]?.id },
    })
  }

  return {
    props: {
      lists: listsWithIcon,
      items,
    },
  }
}
