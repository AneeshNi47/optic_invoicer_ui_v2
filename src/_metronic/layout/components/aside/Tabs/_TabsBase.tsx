/* eslint-disable react/jsx-no-target-blank */
import {FC} from 'react'
import {AuthorsTab} from './AuthorsTab'
import {MenuTab} from './MenuTab'
import {NotificationsTab} from './NotificationsTab'
import {ProjectsTab} from './ProjectsTab'
import {SubscriptionsTab} from './SubscriptionsTab'
import {TasksTab} from './TasksTab'
import {AsideFooter} from '../AsideFooter'
import {AdminTab} from './AdminTab'
import {StaffTab} from './StaffTab'

type Props = {
  link: string
}

const SelectedTab: FC<Props> = ({link}) => {
  switch (link) {
    case 'admin':
      return <AdminTab />
    case 'staff':
      return <StaffTab />
    case 'menu':
      return <MenuTab />
    case 'subscription':
      return <SubscriptionsTab />
    case 'tasks':
      return <TasksTab />
    case 'notifications':
      return <NotificationsTab />
    case 'authors':
      return <AuthorsTab />
    default:
      return <StaffTab />
  }
}

const TabsBase: FC<Props> = ({link}) => {
  return (
    <div className='d-flex h-100 flex-column'>
      {/* begin::Wrapper */}
      <div
        className='flex-column-fluid hover-scroll-y'
        data-kt-scroll='true'
        data-kt-scroll-activate='true'
        data-kt-scroll-height='auto'
        data-kt-scroll-wrappers='#kt_aside_wordspace'
        data-kt-scroll-dependencies='#kt_aside_secondary_footer'
        data-kt-scroll-offset='0px'
      >
        {/* begin::Tab content */}
        <div className='tab-content'>
          <div
            className='tab-pane fade active show'
            id={`kt_aside_nav_tab_${link}`}
            role='tabpanel'
          >
            <SelectedTab link={link} />
          </div>
        </div>
        {/* end::Tab content */}
      </div>
      {/* begin::Footer */}
      <div className='flex-column-auto pt-10 px-5' id='kt_aside_secondary_footer'>
        <AsideFooter />
      </div>
      {/* end::Footer */}
      {/* end::Wrapper */}
    </div>
  )
}

export {TabsBase}
