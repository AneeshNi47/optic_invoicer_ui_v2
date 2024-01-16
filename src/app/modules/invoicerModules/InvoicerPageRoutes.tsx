import {Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {InvoicesTable} from './invoices/InvoicesTable'
import {InventoryTable} from './inventory/InventoryTable'
import {CustomerTable} from './customers/CustomerTable'
import {ReportsDashboard} from './reports/ReportsDashboard'

const widgetsBreadCrumbs: Array<PageLink> = [
  {
    title: 'Tables',
    path: '/crafted/widgets/charts',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const InvoicePage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='invoices'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>Invoices</PageTitle>
              <InvoicesTable className='custom-list' />
            </>
          }
        />
        <Route
          path='inventory'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>Inventory</PageTitle>
              <InventoryTable className='custom-list d-flex px-5 py-4' />
            </>
          }
        />
        <Route
          path='customers'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>Customers</PageTitle>
              <CustomerTable className='custom-list d-flex px-5 py-4' />
            </>
          }
        />
        <Route
          path='reports'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>Reports</PageTitle>
              <ReportsDashboard className='custom-list d-flex px-5 py-4' />
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export default InvoicePage
