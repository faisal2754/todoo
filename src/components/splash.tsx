import { useEffect, useRef } from 'react'
import { signIn } from 'next-auth/react'

import s from '@/styles/splash.module.scss'
import { col, R, G, B } from '@/utils/animation'

const SPEED = 0.05

const Splash = () => {
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
    <div className={s.splash}>
      <div className={s.container}>
        <canvas ref={canvasRef} width='32px' height='32px' />
        <main className={s.main}>
          <h1>A convenient Todo app</h1>
          <div className={s.authContainer}>
            <button className={s.googleBtn} onClick={() => signIn('google')}>
              Sign in with Google
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Splash
