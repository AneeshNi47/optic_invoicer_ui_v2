import React from 'react'
import {Modal} from 'react-bootstrap'
import AddInventory from '../../../../app/modules/invoicerModules/inventory/AddInventory'
import AddInvoice from '../../../../app/modules/invoicerModules/invoices/AddInvoice'
import AddOrganizations from '../../../../app/modules/adminModules/organizations/AddOrganization'
import AddWholesaleInventory from '../../../../app/modules/invoicerModules/wholesaleInventory/AddWholesaleInventory'
import AddWholesaleVendor from '../../../../app/modules/invoicerModules/wholesaleVendors/AddWholesaleVendor'
import AddWholesaleClient from '../../../../app/modules/invoicerModules/wholesaleClients/AddWholesaleClient'

// Define a type for modal configurations
type ModalConfig = {
  title: string
  component: JSX.Element
}

// Add any additional types you need
type Props = {
  show: boolean
  handleClose: () => void
  modalName: string
  invoiceData?: any // Add invoiceData prop
  // Add additional props as required
}

// Mapping modal names to their corresponding titles and components
const getModalConfigMap = (handleClose: () => void, invoiceData?: any): Record<string, ModalConfig> => ({
  inventory: {title: 'Add Inventory', component: <AddInventory handleClose={handleClose} />},
  invoice: { title: invoiceData ? 'Edit Invoice' : 'Add Invoice', component: <AddInvoice handleClose={handleClose} invoiceData={invoiceData} />},
  admin: {title: 'Add Organization', component: <AddOrganizations handleClose={handleClose} />},
  'wholesale-inventory': {
    title: 'Add Wholesale Inventory',
    component: <AddWholesaleInventory handleClose={handleClose} />,
  },
  'wholesale-vendor': {
    title: 'Add Wholesale Vendor',
    component: <AddWholesaleVendor handleClose={handleClose} />,
  },
  'wholesale-client': {
    title: 'Add Wholesale Client',
    component: <AddWholesaleClient handleClose={handleClose} />,
  },
})

const CreateInvoiceModal: React.FC<Props> = ({show, handleClose, modalName,invoiceData /*, other props */}) => {
  const modalConfigMap = getModalConfigMap(handleClose,invoiceData)
  const modalConfig = modalConfigMap[modalName]

  if (!modalConfig) {
    // If the modalName does not match any key in modalConfigMap, return null to avoid rendering the modal
    return null
  }

  return (
    <Modal
      className='modal fade'
      id='kt_modal_create_invoice'
      data-backdrop='static'
      tabIndex={-1}
      role='dialog'
      show={show}
      dialogClassName='modal-xl'
      aria-hidden='true'
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>{modalConfig.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalConfig.component}</Modal.Body>
    </Modal>
  )
}

export {CreateInvoiceModal}
