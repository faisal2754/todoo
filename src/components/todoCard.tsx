import { useState } from 'react'

import s from '@/styles/todoCard.module.scss'

type TodoCardProps = {
  initialCheck: boolean
  text: string
}

const TodoCard = ({ initialCheck, text }: TodoCardProps) => {
  const [checked, setChecked] = useState(initialCheck)

  const handleCheck = () => {
    setChecked(!checked)
  }

  return (
    <div className={s.todoCard}>
      <div className={s.check}>
        <input
          type='checkbox'
          id='checkbox'
          checked={checked}
          onChange={handleCheck}
        />
        <label htmlFor='checkbox'>
          <div className={s.tick}></div>
        </label>
      </div>
      <div className={s.text}>{text}</div>
    </div>
  )
}
export default TodoCard
