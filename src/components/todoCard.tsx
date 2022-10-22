import { useState } from 'react'

import s from '@/styles/todoCard.module.scss'

type TodoCardProps = {
  id: number
  initialCheck: boolean
  text: string
}

const TodoCard = ({ id, initialCheck, text }: TodoCardProps) => {
  const [checked, setChecked] = useState(initialCheck)

  const handleCheck = () => {
    setChecked(!checked)
  }

  return (
    <div className={s.todoCard}>
      <div className={s.check}>
        <input
          type='checkbox'
          id={id as unknown as string}
          checked={checked}
          onChange={handleCheck}
        />
        <label htmlFor={id as unknown as string}>
          <div className={s.tick}></div>
        </label>
      </div>
      <div className={s.text}>{text}</div>
    </div>
  )
}
export default TodoCard
