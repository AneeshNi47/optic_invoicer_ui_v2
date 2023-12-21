import {useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {StatisticsWidget4} from '../../../../_metronic/partials/widgets'
import {SelectLocationModal} from '../../../../_metronic/partials'

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
      <div className='row gy-5 g-xl-8'>
        {/* begin::Col */}
        <div className='col-xxl-4'>
          <StatisticsWidget4
            className='card-xxl-stretch-50 mb-5 mb-xl-4'
            svgIcon='element-11'
            color='danger'
            description='Organisations'
            change='750$'
          />
        </div>
      </div>
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
