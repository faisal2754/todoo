import { Session } from 'next-auth'
import Image from 'next/image'

import s from '@/styles/lists.module.scss'

type ListsProps = {
  session: Session | null
  status: 'authenticated' | 'unauthenticated' | 'loading'
}

const Lists = ({ session, status }: ListsProps) => {
  console.log(session)
  return (
    <div className={s.lists}>
      {status === 'loading' && (
        <Image
          src='/loader.svg'
          alt='loader'
          height='100%'
          width='50rem'
          layout='fixed'
        />
      )}
      {status === 'authenticated' && <h1 className={s.heading}>Your lists</h1>}
    </div>
  )
}

export default Lists
