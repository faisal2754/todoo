import Image from 'next/future/image'
import { signOut } from 'next-auth/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { List } from '@prisma/client'

import s from '@/styles/header.module.scss'
import { Session } from 'next-auth'

type ListWithIcon = List & { icon: string }

type GetListsResponse = {
  success: boolean
  data: ListWithIcon[]
  errors: unknown
}

type HeaderProps = {
  status: 'loading' | 'authenticated' | 'unauthenticated'
  session: Session | null
  lists: GetListsResponse | undefined
  activeListId: number | undefined
  setActiveListId: Dispatch<SetStateAction<number | undefined>>
  activeList: ListWithIcon | undefined
  setActiveList: Dispatch<SetStateAction<ListWithIcon | undefined>>
  setShowCreateList: Dispatch<SetStateAction<boolean>>
}

const Header = ({
  status,
  session,
  lists,
  activeListId,
  setActiveListId,
  activeList,
  setActiveList,
  setShowCreateList,
}: HeaderProps) => {
  const [showList, setShowList] = useState(false)

  useEffect(() => {
    setActiveList(lists?.data.find((list) => list.id === activeListId))
  }, [activeListId, lists?.data, setActiveList])

  return (
    <header className={s.header}>
      <div className={s.listContainer}>
        {lists && lists.data && lists.data[0] && activeList && (
          <div className={s.selectWrapper}>
            <div
              className={`${s.select} ${showList && s.isActive}`}
              onClick={() => setShowList(!showList)}
            >
              <>
                <div className={s.selectTrigger}>
                  <div className={s.selectedList}>
                    <Image
                      src={activeList.icon}
                      alt='icon'
                      width={20}
                      height={20}
                      className={s.icon}
                    />
                    <div className={s.text}>
                      {activeList.type.charAt(0) +
                        activeList.type.slice(1).toLowerCase()}
                    </div>
                  </div>
                  <div className={s.selectIcon}>
                    <Image
                      src='/arrow.svg'
                      alt='arrow'
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
                <div className={s.selectOptions}>
                  {lists.data.map((list, idx: number) => {
                    return (
                      <div
                        key={idx}
                        className={s.selectOption}
                        onClick={() => setActiveListId(list.id)}
                      >
                        <div className={s.icon}>
                          <Image
                            src={list.icon}
                            alt='icon'
                            width={20}
                            height={20}
                          />
                        </div>
                        <div className={s.text}>
                          {list.type.charAt(0) +
                            list.type.slice(1).toLowerCase()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            </div>
          </div>
        )}
        <Image
          src='/plus.svg'
          alt='addList'
          width={50}
          height={50}
          title='Create list'
          className={s.addIcon}
          onClick={() => setShowCreateList(true)}
        />
      </div>
      <div className={s.logoContainer}>
        <Image
          src='/logo.svg'
          alt='logo'
          width={150}
          height={40}
          className={s.logo}
        />
      </div>
      <div className={s.profileContainer}>
        {status === 'loading' && (
          <Image
            src='/loader.svg'
            alt='loader'
            width={50}
            height={50}
            className={s.loader}
          />
        )}
        {status === 'authenticated' && (
          <div className={s.profileContainer}>
            <div className={s.profile}>
              <div className={s.name}>{session?.user?.name}</div>
              <div className={s.dpContainer}>
                {session?.user?.image && (
                  <Image
                    src={session.user?.image}
                    alt='dp'
                    width={100}
                    height={100}
                    className={s.dp}
                  />
                )}
              </div>
            </div>
            <div
              className={s.logout}
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
export default Header
