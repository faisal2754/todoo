import { useSession } from 'next-auth/react'
import Image from 'next/future/image'
import { useEffect, useRef } from 'react'

import TodoCard from '@/components/todoCard'
import s from '@/styles/home.module.scss'
import { B, col, G, R } from '@/utils/animation'

const SPEED = 0.05

const Home = () => {
  const { data: session, status } = useSession()
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
      <div className={s.hero}>
        <canvas ref={canvasRef} width='32px' height='32px' />
        <header className={s.header}>
          <h1>lists</h1>
          <div className={s.logoContainer}>
            <Image
              src='/logo.svg'
              alt='logo'
              width={150}
              height={40}
              className={s.logo}
            />
          </div>
          <div className={s.profile}>
            {status === 'loading' && (
              <Image
                src='/loader.svg'
                alt='loader'
                width={100}
                height={100}
                className={s.loader}
              />
            )}
            {status === 'authenticated' && (
              <>
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
              </>
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
