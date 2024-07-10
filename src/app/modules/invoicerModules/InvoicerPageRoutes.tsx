import {Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {InvoicesTable} from './invoices/InvoicesTable'
import {InventoryTable} from './inventory/InventoryTable'
import {CustomerTable} from './customers/CustomerTable'
import {ReportsDashboard} from './reports/ReportsDashboard'
import {WholesaleInventoryTable} from './wholesaleInventory/WholesaleInventoryTable'
import {WholesaleVendorTable} from './wholesaleVendors/WholesaleVendorTable'
import {WholesaleClientTable} from './wholesaleClients/WholesaleClientTable'

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
              <InvoicesTable className='custom-list d-flex px-5 py-4' />
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
        <Route
          path='wholesale-vendor'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>Wholesale Vendor</PageTitle>
              <WholesaleVendorTable className='custom-list d-flex px-5 py-4' />
            </>
          }
        />
        <Route
          path='wholesale-inventory'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>Wholesale Inventory</PageTitle>
              <WholesaleInventoryTable className='custom-list d-flex px-5 py-4' />
            </>
          }
        />
        <Route
          path='wholesale-clients'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>Wholesale Clients</PageTitle>
              <WholesaleClientTable className='custom-list d-flex px-5 py-4' />
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export default InvoicePage
