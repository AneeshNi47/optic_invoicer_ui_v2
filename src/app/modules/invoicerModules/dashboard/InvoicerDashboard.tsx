import {useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {StatisticsWidget4} from '../../../../_metronic/partials/widgets'
import {useAuth} from '../../auth'
import {getOrganisations} from './requests'
import {InvoicerDashboardModel} from './_models'
import {KTIcon} from '../../../../_metronic/helpers'
import {toast} from 'react-toastify'

const dashboardBreadCrumbs: Array<PageLink> = [
  {
    title: 'Home',
    path: '/dashboard',
    isSeparator: false,
    isActive: false,
  },
]

const DashboardPage = () => {
  const {auth} = useAuth()
  const [organisationItems, setOrganisationItems] = useState<InvoicerDashboardModel | any>({})
  const [loading, setLoading] = useState(false)
  const [iconClickCount, setIconClickCount] = useState(0)

  const fetchInventoryData = async () => {
    if (auth?.token) {
      setLoading(true)
      try {
        const responseData = await getOrganisations(auth.token)
        console.log(responseData.data)
        setOrganisationItems((prev: any) => ({
          ...prev,
          ...responseData.data,
        }))
      } catch (error: any) {
        toast.error(error.response.data.error)
        console.error('Error fetching data:', error)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventoryData()
  }, [auth?.token, iconClickCount])

  useEffect(() => {
    // We have to show toolbar only for dashboard page
    document.getElementById('kt_layout_toolbar')?.classList.remove('d-none')
    return () => {
      document.getElementById('kt_layout_toolbar')?.classList.add('d-none')
    }
  }, [])

  const handleIconClick = () => {
    // Update the state to trigger a re-render
    setIconClickCount((prevCount) => prevCount + 1)
  }

  return (
    <>
      {/* begin::Row */}
      <div className='d-flex justify-content-end m-5'>
        <button
          className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
          onClick={handleIconClick}
        >
          <KTIcon iconName='arrows-circle' className='fs-3' />
        </button>
        {/* <span onClick={handleIconClick}><KTIcon iconName='arrows-circle' className='fs-1 text-primary text-lg-start symbol-50px' /></span> */}
      </div>

      <div className='row gy-5 g-xl-8'>
        {/* begin::Col */}
        <div
          className='col-xxl-4'
          onClick={() => {
            window.location.href = '/organization/invoices'
          }}
        >
          <StatisticsWidget4
            className='card-xxl-stretch-50 mb-5 mb-xl-4'
            svgIcon='element-11'
            color='danger'
            description='Invoices'
            change={`${
              organisationItems.total_invoices ? organisationItems.total_invoices : '...'
            }`}
          />
        </div>
        <div
          className='col-xxl-4'
          onClick={() => {
            window.location.href = '/organization/inventory'
          }}
        >
          <StatisticsWidget4
            className='card-xxl-stretch-50 mb-xl-4'
            svgIcon='basket'
            color='success'
            description='Inventory'
            change={`${
              organisationItems.total_inventory ? organisationItems.total_inventory : '...'
            }`}
          />
        </div>
        <div
          className='col-xxl-4'
          onClick={() => {
            window.location.href = '/organization/customers'
          }}
        >
          <StatisticsWidget4
            className='card-xxl-stretch-50 mb-5 mb-xl-4'
            svgIcon='element-11'
            color='primary'
            description='Customers'
            change={`${
              organisationItems.total_customers ? organisationItems.total_customers : '...'
            }`}
          />
        </div>
      </div>
      {/* end::Row */}
    </>
  )
}

const InvoiceDashboardWrapper = () => {
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

export {InvoiceDashboardWrapper}
