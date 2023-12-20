import React, {useState, useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {KTIcon} from '../../../helpers';
import { AddInventoryItem } from '../../../../app/modules/invoicerModules/inventory/_models';
import { InventoryItem } from '../../../../app/modules/invoicerModules/inventory/_models';


// Add any additional types you need
type Props = {
  show: boolean
  handleClose: () => void
  modalContent: InventoryItem
  // Add additional props as required
}

const DetailsModal: React.FC<Props> = ({show, handleClose, modalContent  /*, other props */}) => {
  const [selectedCustomer, setSelectedCustomer] = useState(false)
  // ... Define other states

  // Equivalent to componentDidMount and componentDidUpdate:
  useEffect(
    () => {
      // Replace componentDidMount logic here
      // Replace componentDidUpdate logic here
    },
    [
      /* dependencies */
    ]
  )

  console.log(modalContent, "*******")

  // Event handlers and other functions
  const handleAddItem = () => {
    // Logic for adding item
  }

  // Other functions...

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
        <Modal.Title><h2 className='text-danger'>{modalContent && modalContent.name}</h2></Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div><h4 className='text-muted'>{modalContent && modalContent.description}</h4></div>
        <div className=''>{modalContent && modalContent.item_type}</div>
        <div>{modalContent && modalContent.SKU}</div>
        <div>{modalContent && modalContent.brand}</div>
        <div>{modalContent && modalContent.cost_value}</div>
        
        <div>{modalContent && modalContent.is_active ? <h5 className='text-success'>Active</h5> : <h5 className='text-danger'>Inactive</h5>}</div>
        <div>{modalContent && modalContent.qty}</div>
        <div>{modalContent && modalContent.sale_value}</div>
        <div>{modalContent && modalContent.status}</div>
        <div>{modalContent && modalContent.store_sku}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleClose}>
          Close
        </Button>
        {/* <Button variant='primary' onClick={handleAddItem}>
          Save Changes
        </Button> */}
      </Modal.Footer>
    </Modal>
  )
}

export {DetailsModal}
