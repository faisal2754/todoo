import Image from 'next/future/image'

import s from '@/styles/create-list.module.scss'

type CreateListProps = {
  showCreateList: boolean
  setShowCreateList: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateList = ({ showCreateList, setShowCreateList }: CreateListProps) => {
  const handleCreateList = (e: React.MouseEvent<HTMLLIElement>) => {
    console.log(e.currentTarget.dataset.id)
  }

  return (
    <>
      <div
        className={`${s.createList} ${!showCreateList && s.hidden}`}
        onClick={() => setShowCreateList(false)}
      >
        <div className={s.card} onClick={(e) => e.stopPropagation()}>
          <div className={s.cardHeading}>Create a new list</div>
          <div className={s.cardContent}>
            <ul>
              <li className={s.work} data-id='work' onClick={handleCreateList}>
                <Image
                  src='/work.svg'
                  alt='icon'
                  width={35}
                  height={35}
                  className={s.icon}
                />
              </li>
              <li
                className={s.shopping}
                data-id='shopping'
                onClick={handleCreateList}
              >
                <Image src='/shopping.svg' alt='icon' width={35} height={35} />
              </li>
              <li
                className={s.travel}
                data-id='travel'
                onClick={handleCreateList}
              >
                <Image src='/travel.svg' alt='icon' width={35} height={35} />
              </li>
              <li
                className={s.sports}
                data-id='sports'
                onClick={handleCreateList}
              >
                <Image src='/sports.svg' alt='icon' width={35} height={35} />
              </li>
              <li
                className={s.other}
                data-id='other'
                onClick={handleCreateList}
              >
                <Image src='/other.svg' alt='icon' width={35} height={35} />
              </li>
              <span className={s.text}></span>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
export default CreateList
