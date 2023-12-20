import {Outlet, Route, Routes} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
// import {InvoicesTable} from './invoices/InvoicesTable'
// import {InventoryTable} from './inventory/InventoryTable'
import {OrganizationsTable} from './organizations/OrganizationsTable'

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

const AdminPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='organizations'
          element={
            <>
              <PageTitle breadcrumbs={widgetsBreadCrumbs}>Organizations</PageTitle>
              <OrganizationsTable className='custom-list d-flex px-5 py-4' />
            </>
          }
        />
      </Route>
    </Routes>
  )
}

export default AdminPage
