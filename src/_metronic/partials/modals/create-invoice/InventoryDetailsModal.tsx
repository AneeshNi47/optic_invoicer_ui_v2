import React, {useState, useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {KTIcon} from '../../../helpers'
import {AddInventoryItem} from '../../../../app/modules/invoicerModules/inventory/_models'
import {InventoryItem} from '../../../../app/modules/invoicerModules/inventory/_models'

// Add any additional types you need
type Props = {
  show: boolean
  handleClose: () => void
  modalContent: InventoryItem
  // Add additional props as required
}

const InventoryDetailsModal: React.FC<Props> = ({
  show,
  handleClose,
  modalContent /*, other props */,
}) => {
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

  console.log(modalContent, '*******')

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
        <Modal.Title className='d-flex'>
          <h2 className='text-primary'>{modalContent && modalContent.name}</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='row'>
              <div className='col-6'>Item Type:</div>
              <div className='col-6'>
                <h6>{(modalContent && modalContent.item_type) || '-'}</h6>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='row'>
              <div className='col-6'>SKU:</div>
              <div className='col-6'>
                <h6>{(modalContent && modalContent.SKU) || '-'}</h6>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='row'>
              <div className='col-6'>Brand:</div>
              <div className='col-6'>
                <h6>{(modalContent && modalContent.brand) || '-'}</h6>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='row'>
              <div className='col-6'>Cost Value:</div>
              <div className='col-6'>
                <h6>{(modalContent && modalContent.cost_value) || '-'}</h6>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='row'>
              <div className='col-6'>Quantity:</div>
              <div className='col-6'>
                <h6>{(modalContent && modalContent.qty) || '-'}</h6>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='row'>
              <div className='col-6'>Sale Value:</div>
              <div className='col-6'>
                <h6>{(modalContent && modalContent.sale_value) || '-'}</h6>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='row'>
              <div className='col-6'>Status:</div>
              <div className='col-6'>
                <h6>{(modalContent && modalContent.status) || '-'}</h6>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='row'>
              <div className='col-6'>Store SKU:</div>
              <div className='col-6'>
                <h6>{(modalContent && modalContent.store_sku) || '-'}</h6>
              </div>
            </div>
          </div>
        </div>
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

export {InventoryDetailsModal}
