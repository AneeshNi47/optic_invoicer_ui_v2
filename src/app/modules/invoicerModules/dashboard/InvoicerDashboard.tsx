import {useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {StatisticsWidget4} from '../../../../_metronic/partials/widgets'
import {SelectLocationModal} from '../../../../_metronic/partials'
import {useAuth} from '../../auth'
import {getOrganisations} from './requests'
import {InvoicerDashboardModel} from './_models'
import {CreateInvoiceModal} from '../../../../_metronic/partials'

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
  const [showModal, setShowModal] = useState(false)
  const [currentPath, setCurrentPath] = useState('')

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }
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
      } catch (error) {
        console.error('Error fetching data:', error)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventoryData()
  }, [auth?.token])

  useEffect(() => {
    // We have to show toolbar only for dashboard page
    document.getElementById('kt_layout_toolbar')?.classList.remove('d-none')
    return () => {
      document.getElementById('kt_layout_toolbar')?.classList.add('d-none')
    }
  }, [])

  return (
    <>
      <CreateInvoiceModal
        show={showModal}
        handleClose={handleCloseModal}
        currentPath={`${currentPath}`}
      />

      {/* begin::Row */}
      <div className='row gy-5 g-xl-8'>
        {/* begin::Col */}
        <div
          className='col-xxl-4'
          onClick={() => {
            setCurrentPath('/organization/invoices')
            handleOpenModal()
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
            setCurrentPath('/organization/inventory')
            handleOpenModal()
          }}
        >
          {/* <StatisticsWidget4
            className='card-xxl-stretch-50 mb-5 mb-xl-4'
            svgIcon='element-11'
            color='danger'
            description='Weekly Income'
            change='750$'
          /> */}

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
        <div className='col-xxl-4'>
          <StatisticsWidget4
            className='card-xxl-stretch-50 mb-5 mb-xl-4'
            svgIcon='element-11'
            color='primary'
            description='Customers'
            change={`${
              organisationItems.total_customers ? organisationItems.total_customers : '...'
            }`}
          />

          {/* <StatisticsWidget4
            className='card-xxl-stretch-50 mb-xl-4'
            svgIcon='basket'
            color='success'
            description='Sales Change'
            change='+259'
          /> */}
        </div>
      </div>
      {/* end::Row */}
    </>
  )
}

const InvoicerDashboardWrapper = () => {
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

export {InvoicerDashboardWrapper}
