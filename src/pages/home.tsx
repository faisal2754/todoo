import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/future/image'
import { useEffect, useRef, useState } from 'react'
import { List } from '@prisma/client'

import { prisma } from '@/server/db/client'
import TodoCard from '@/components/todoCard'
import { getServerAuthSession } from '@/server/common/get-server-auth-session'
import s from '@/styles/home.module.scss'
import { B, col, G, R } from '@/utils/animation'

const SPEED = 0.05

const Home = ({
  lists,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession()
  const [showCreateList, setShowCreateList] = useState(false)
  const [showList, setShowList] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  console.log(lists)

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
      <div
        className={`${s.addList} ${!showCreateList && s.hidden}`}
        onClick={() => setShowCreateList(false)}
      >
        <div className={s.card} onClick={(e) => e.stopPropagation()}>
          <div className={s.cardHeading}>Create a new list</div>
          <div className={s.cardContent}>
            <ul>
              <li>a</li>
              <li>b</li>
              <li>c</li>
              <li>d</li>
              <li>e</li>
            </ul>
          </div>
        </div>
      </div>
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
                  <div className={s.text}>test</div>
                  <div className={s.icon}>
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
                            src='/work.svg'
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
        <TodoCard initialCheck={true} text='your text' />
        <div className={s.blob}></div>
      </main>
    </div>
  )
}
export default Home

type Props = {
  lists: List[]
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

  const lists = await prisma.list.findMany({
    where: { userId: session.user?.id },
  })

  return {
    props: {
      lists: lists,
    },
  }
}
