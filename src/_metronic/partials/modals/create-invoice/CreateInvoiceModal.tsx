import React, {useState, useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {KTIcon} from '../../../helpers'
import {AddInventoryItem} from '../../../../app/modules/invoicerModules/inventory/_models'
import AddInventory from '../../../../app/modules/invoicerModules/inventory/AddInventory'
import AddInvoice from '../../../../app/modules/invoicerModules/invoices/AddInvoice'
import AddOrganizations from '../../../../app/modules/adminModules/organizations/AddOrganization'

// Add any additional types you need
type Props = {
  show: boolean
  handleClose: () => void
  modalName: string
  // Add additional props as required
}

const CreateInvoiceModal: React.FC<Props> = ({show, handleClose, modalName /*, other props */}) => {
  const [selectedCustomer, setSelectedCustomer] = useState(false)
  let title: string = ''
  let componentToRender: JSX.Element = <></>

  if (modalName === 'inventory') {
    title = 'Add Inventory'
    componentToRender = <AddInventory handleClose={handleClose} />
  } else if (modalName === 'invoice') {
    title = 'Add Invoice'
    componentToRender = <AddInvoice handleClose={handleClose} />
  } else if (modalName === 'admin') {
    title = 'Add Organization'
    componentToRender = <AddOrganizations handleClose={handleClose} />
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
      // ... other modal props
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{componentToRender}</Modal.Body>
    </Modal>
  )
}

export {CreateInvoiceModal}
