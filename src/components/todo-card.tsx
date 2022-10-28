import { useState } from 'react'

import s from '@/styles/todo-card.module.scss'

type TodoCardProps = {
  itemId: number
  initialCheck: boolean
  text: string
}

const TodoCard = ({ itemId, initialCheck, text }: TodoCardProps) => {
  const [checked, setChecked] = useState(initialCheck)

  const handleCheck = () => {
    setChecked(!checked)
  }

  return (
    <div className={s.todoCard}>
      <div className={s.check}>
        <input
          type='checkbox'
          id={itemId as unknown as string}
          checked={checked}
          onChange={handleCheck}
        />
        <label htmlFor={itemId as unknown as string}>
          <div className={s.tick}></div>
        </label>
      </div>
      <div className={s.text}>{text}</div>
    </div>
  )
}
export default TodoCard
