/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import clsx from 'clsx'
import {Dispatch, FC, SetStateAction} from 'react'
import {KTIcon} from '../../../helpers'
import {useAuth} from '../../../../app/modules/auth'

const adminTab: ReadonlyArray<{link: string; icon: string; tooltip: string}> = [
  {
    link: 'admin',
    icon: 'element-11',
    tooltip: 'Projects',
  },
]

const staffTab: ReadonlyArray<{link: string; icon: string; tooltip: string}> = [
  {
    link: 'staff',
    icon: 'briefcase',
    tooltip: 'Menu',
  },
]

type Props = {
  link: string
  setLink: Dispatch<SetStateAction<string>>
}

const AsideTabs: FC<Props> = ({link, setLink}) => {
  const {currentUser} = useAuth()
  const selectedTabs =
    currentUser?.user_type === 'admin'
      ? adminTab
      : currentUser?.user_type === 'staff'
      ? staffTab
      : []
  return (
    <div
      className='hover-scroll-y mb-10'
      data-kt-scroll='true'
      data-kt-scroll-activate='{default: false, lg: true}'
      data-kt-scroll-height='auto'
      data-kt-scroll-wrappers='#kt_aside_nav'
      data-kt-scroll-dependencies='#kt_aside_logo, #kt_aside_footer'
      data-kt-scroll-offset='0px'
    >
      {/* begin::Nav */}
      <ul className='nav flex-column' id='kt_aside_nav_tabs'>
        {/* begin::Nav item */}
        {selectedTabs.map((t) => (
          <li key={t.link}>
            {/* begin::Nav link */}
            <a
              className={clsx(
                'nav-link btn btn-icon btn-active-color-primary btn-color-gray-400 btn-active-light',
                {active: t.link === link}
              )}
              onClick={() => setLink(t.link)}
            >
              <KTIcon iconName={t.icon} className='fs-2x' />
            </a>
            {/* end::Nav link */}
          </li>
        ))}
        {/* end::Nav link */}
      </ul>
      {/* end::Tabs */}
    </div>
  )
}

export {AsideTabs}
