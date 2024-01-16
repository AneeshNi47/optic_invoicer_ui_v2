import {useEffect} from 'react'
import {useIntl} from 'react-intl'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'

const dashboardBreadCrumbs: Array<PageLink> = [
  {
    title: 'Home',
    path: '/dashboard',
    isSeparator: false,
    isActive: false,
  },
]

const DashboardPage = () => {
  useEffect(() => {
    // We have to show toolbar only for dashboard page
    document.getElementById('kt_layout_toolbar')?.classList.remove('d-none')
    return () => {
      document.getElementById('kt_layout_toolbar')?.classList.add('d-none')
    }
  }, [])

  return (
    <>
      {/* begin::Row */}
      <div className='row gy-5 g-xl-8'>{/* begin::Col */}</div>
      {/* end::Row */}
    </>
  )
}

const AdminDashboardWrapper = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={dashboardBreadCrumbs}>
        {intl.formatMessage({id: 'MENU.DASHBOARD'})}
      </PageTitle>
      <DashboardPage />
    </>
  )
}

export {AdminDashboardWrapper}
