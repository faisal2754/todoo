import { useEffect, useRef } from 'react'
import { signIn } from 'next-auth/react'
import Image from 'next/future/image'

import s from '@/styles/splash.module.scss'
import { col, R, G, B } from '@/utils/animation'

const ANIMATION_SPEED = 0.05

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
        t = t + ANIMATION_SPEED
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
          <div className={s.header}>
            <div className={s.logoContainer}>
              <Image
                src='/logo-white.svg'
                alt='logo'
                width={150}
                height={40}
                className={s.logo}
              />
            </div>
            <div className={s.slogan}>Organise your work.</div>
          </div>
          <div className={s.divider} />
          <div className={s.authContainer}>
            <button
              className={s.googleBtn}
              onClick={() => signIn('google', { callbackUrl: '/home' })}
            >
              <div className={s.icon}>
                <Image
                  src='/google.svg'
                  alt='logo'
                  width={30}
                  height={30}
                  className={s.logo}
                />
              </div>
              <div className={s.text}>Continue with Google</div>
            </button>
            <button
              className={s.githubBtn}
              onClick={() => signIn('github', { callbackUrl: '/home' })}
            >
              <div className={s.icon}>
                <Image
                  src='/github.svg'
                  alt='logo'
                  width={30}
                  height={30}
                  className={s.logo}
                />
              </div>
              <div className={s.text}>Continue with GitHub</div>
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Splash
