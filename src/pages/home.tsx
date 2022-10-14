import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

import s from '@/styles/home.module.scss'
import { col, R, G, B } from '@/utils/animation'
import Lists from '@/components/lists'
import TodoCard from '@/components/todoCard'

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
      <div className={s.lists}>
        <canvas ref={canvasRef} width='32px' height='32px' />
        <div className={s.content}>
          <Lists session={session} status={status} />
        </div>
      </div>
      <main className={s.main}>
        <h1>Your items</h1>
        <TodoCard />
      </main>
    </div>
  )
}
export default Home
