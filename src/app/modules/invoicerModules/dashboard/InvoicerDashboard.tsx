import {useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {PageLink, PageTitle} from '../../../../_metronic/layout/core'
import {StatisticsWidget4} from '../../../../_metronic/partials/widgets'
import {useAuth} from '../../auth'
import {getOrganizations} from './requests'
import {InvoicerDashboardModel} from './_models'
import {KTIcon} from '../../../../_metronic/helpers'
import {toast} from 'react-toastify'
import {getMonthByNumbers, processStatistics} from '../utils'

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
  const [organizationItems, setOrganisationItems] = useState<InvoicerDashboardModel | any>({})
  const [invoiceDataValues, setInvoiceDataValues] = useState([])
  const [invoiceDataKeys, setInvoiceDataKeys] = useState([])
  const [inventoryDataValues, setInventoryDataValues] = useState([])
  const [inventoryDataKeys, setInventoryDataKeys] = useState([])
  const [customerDataValues, setCustomerDataValues] = useState([])
  const [customerDataKeys, setCustomerDataKeys] = useState([])

  const [loading, setLoading] = useState(false)
  const [iconClickCount, setIconClickCount] = useState(0)

  const fetchInventoryData = async () => {
    if (auth?.token) {
      setLoading(true)
      try {
        const responseData = await getOrganizations(auth.token)
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

  useEffect(() => {

    const processedInvoiceStats = processStatistics(
      organizationItems.invoice_statistics,
      getMonthByNumbers
    )
    setInvoiceDataValues(processedInvoiceStats.dataValues)
    setInvoiceDataKeys(processedInvoiceStats.dataKeys)

    const processedInventoryStats = processStatistics(
      organizationItems.inventory_statistics,
      getMonthByNumbers
    )
    setInventoryDataValues(processedInventoryStats.dataValues)
    setInventoryDataKeys(processedInventoryStats.dataKeys)
    const processedCustomerStats = processStatistics(
      organizationItems.customer_statistics,
      getMonthByNumbers
    )
    console.log(processedCustomerStats.dataValues)
    console.log(processedCustomerStats.dataKeys)
    setCustomerDataValues(processedCustomerStats.dataValues)
    setCustomerDataKeys(processedCustomerStats.dataKeys)
  }, [organizationItems])

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
      {organizationItems.invoice_statistics && (
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
              data_values={invoiceDataValues}
              data_keys={invoiceDataKeys}
              key_name='Total Value'
              field_title='AED'
              change={`${
                organizationItems.total_invoices ? organizationItems.total_invoices : '...'
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
              data_values={inventoryDataValues}
              data_keys={inventoryDataKeys}
              key_name='Total Value'
              field_title='AED'
              change={`${
                organizationItems.total_inventory ? organizationItems.total_inventory : '...'
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
              data_values={customerDataValues}
              data_keys={customerDataKeys}
              key_name='Customers'
              field_title=''
              change={`${
                organizationItems.total_customers ? organizationItems.total_customers : '...'
              }`}
            />
          </div>
        </div>
      )}
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
