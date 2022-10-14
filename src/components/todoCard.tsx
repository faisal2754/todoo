import s from '@/styles/todoCard.module.scss'

const TodoCard = () => {
  return (
    <div className={s.todoCard}>
      <div className={s.check}>
        <input type='checkbox' id='checkbox' />
        <label htmlFor='checkbox'>
          <div className={s.tick}></div>
        </label>
      </div>
      <div className={s.text}>Do your stuff</div>
    </div>
  )
}
export default TodoCard
