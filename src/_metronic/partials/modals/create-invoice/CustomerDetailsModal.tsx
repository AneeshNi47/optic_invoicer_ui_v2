import React, {useState, useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {KTIcon} from '../../../helpers'
import {AddInventoryItem} from '../../../../app/modules/invoicerModules/inventory/_models'
import {InventoryItem} from '../../../../app/modules/invoicerModules/inventory/_models'

// Add any additional types you need
type Props = {
  show: boolean
  handleClose: () => void
  modalContent: any
  // Add additional props as required
}

const CustomerDetailsModal: React.FC<Props> = ({
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
        <Modal.Title>
          <h2 className='text-primary'>Customer details</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='row'>
              <div className='col-6'>Name:</div>
              <div className='col-6'>
                <h6>{modalContent && modalContent.first_name + ' ' + modalContent.last_name}</h6>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='row'>
              <div className='col-6'>Email:</div>
              <div className='col-6'>
                <h6>{modalContent && modalContent.email}</h6>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='row'>
              <div className='col-6'>Gender:</div>
              <div className='col-6'>
                <h6>{modalContent && modalContent.gender == 'M' ? 'Male' : 'Female'}</h6>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='row'>
              <div className='col-6'>Phone:</div>
              <div className='col-6'>
                <h6>{modalContent && modalContent.phone}</h6>
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

export {CustomerDetailsModal}
