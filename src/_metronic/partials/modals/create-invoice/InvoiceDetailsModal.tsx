import React, {useState, useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {KTIcon} from '../../../helpers';
import { AddInventoryItem } from '../../../../app/modules/invoicerModules/inventory/_models';
import { InvidualInvoice, InvoiceModel } from '../../../../app/modules/invoicerModules/invoices/_models';


// Add any additional types you need
type Props = {
  show: boolean
  handleClose: () => void
  modalContent: InvidualInvoice
  // Add additional props as required
}

const InvoiceDetailsModal: React.FC<Props> = ({show, handleClose, modalContent  /*, other props */}) => {
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
        <Modal.Title><h2 className='text-danger'></h2></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='d-flex'>
          <h2>Customer</h2>
          {modalContent && modalContent.customer && modalContent.customer.is_active ? <h5 className='bg-success text-white p-0 d-flex align-items-center'>Active</h5> :<h5 className='bg-danger text-white p-0 d-flex align-items-center'>Inactive</h5>}
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='row'>
              <div className='col-6'>Name:</div>
              <div className='col-6'><h6>{`${modalContent && modalContent.customer && modalContent.customer.first_name} ${modalContent && modalContent.customer && modalContent.customer.last_name}`  || '-'}</h6></div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='row'>
              <div className='col-6'>Email:</div>
              <div className='col-6'><h6>{modalContent && modalContent.customer && modalContent.customer.email || '-'}</h6></div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-6'>
            <div className='row'>
              <div className='col-6'>Phone:</div>
              <div className='col-6'><h6>{modalContent && modalContent.customer && modalContent.customer.phone || '-'}</h6></div>
            </div>
          </div>
        </div>
        <div className='row'>
        <div className='col-sm-6'>
            <div className='row'>
              <div className='col-6'>Gender:</div>
              <div className='col-6'><h6>{modalContent && modalContent.customer && (modalContent.customer.gender =='M' ? 'Male' : 'Female') || '-'}</h6></div>
            </div>
          </div>
        </div>
        <h2 className='my-3'>Prescriptions</h2>
        <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted bg-light'>
                <th className='ps-4 min-w-125px'>Direction</th>
                <th className='ps-4 min-w-125px rounded-start'>Add</th>
                <th className='min-w-125px'>Axis</th>
                <th className='min-w-125px'>Cylinder</th>
                <th className='min-w-125px'>IPD</th>
                <th className='min-w-125px'>Prism</th>
                <th className='ps-4 min-w-125px'>Sphere</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              <tr>
                <td>Left</td>
                <td>{modalContent && modalContent.prescription && modalContent.prescription.left_add || '-'}</td>
                <td>{modalContent && modalContent.prescription && modalContent.prescription.left_axis || '-'}</td>
                <td>{modalContent && modalContent.prescription && modalContent.prescription.left_cylinder || '-'}</td>
                <td>{modalContent && modalContent.prescription && modalContent.prescription.left_ipd || '-'}</td>
                <td>{modalContent && modalContent.prescription && modalContent.prescription.left_prism || '-'}</td>
                <td>{modalContent && modalContent.prescription && modalContent.prescription.left_sphere || '-'}</td>
              </tr>
              <tr>
                <td>Right</td>
                <td>{modalContent && modalContent.prescription && modalContent.prescription.right_add || '-'}</td>
                <td>{modalContent && modalContent.prescription && modalContent.prescription.right_axis || '-'}</td>
                <td>{modalContent && modalContent.prescription && modalContent.prescription.right_cylinder || '-'}</td>
                <td>{modalContent && modalContent.prescription && modalContent.prescription.right_ipd || '-'}</td>
                <td>{modalContent && modalContent.prescription && modalContent.prescription.right_prism || '-'}</td>
                <td>{modalContent && modalContent.prescription && modalContent.prescription.right_sphere || '-'}</td>
              </tr>
            </tbody>
          </table>
          </div>
         </div>
         <div className='row'>
          <div className='col-sm-4'>
            <div className='row'>
              <div className='col-6'>Pupilliary Distance:</div>
              <div className='col-6'><h6>{modalContent && modalContent.prescription && modalContent.prescription.pupillary_distance || '-'}</h6></div>
            </div>
          </div>
          <div className='col-sm-8'>
            <div className='row'>
              <div className='col-4'>Additional Notes:</div>
              <div className='col-8'><h6>{modalContent && modalContent.prescription && modalContent.prescription.additional_notes || '-'}</h6></div>
            </div>
          </div>
        </div>
        <h2>Inventory Items</h2>
        <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted bg-light'>
                <th className='ps-4 min-w-125px'>Cost Value</th>
                <th className='ps-4 min-w-300px rounded-start'>Invoice</th>
                <th className='min-w-125px'>Quantity</th>
                <th className='min-w-125px'>Sale Value</th>
                <th className='min-w-150px'>SKU</th>
                <th className='min-w-130px'>Brand</th>
                <th className='ps-4 min-w-300px rounded-start'>Description</th>
                <th className='min-w-125px'>Item type</th>
                <th className='min-w-200px'>Item name</th>
                <th className='min-w-80px'>Qty</th>
                <th className='min-w-120px'>Status</th>
                <th className='min-w-150px'>Store SKU</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
            {modalContent && modalContent.inventory_items && modalContent.inventory_items.map((element, index) => {
              return (
                <tr key={index}>
                  <td>{element.cost_value}</td>
                  <td>{element.invoice}</td>
                  <td>{element.quantity}</td>
                  <td>{element.sale_value}</td>
                  <td>{element.inventory_item && element.inventory_item.SKU || ''}</td>
                  <td>{element.inventory_item && element.inventory_item.brand || ''}</td>
                  <td>{element.inventory_item && element.inventory_item.description || ''}</td>
                  <td>{element.inventory_item && element.inventory_item.item_type || ''}</td>
                  <td>{element.inventory_item && element.inventory_item.name || ''}</td>
                  <td>{element.inventory_item && element.inventory_item.qty || ''}</td>
                  <td>{element.inventory_item && element.inventory_item.status || ''}</td>
                  <td>{element.inventory_item && element.inventory_item.store_sku || ''}</td>
                </tr>
              )
            })}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      <h2>Invoice Payments</h2>
        <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted bg-light'>
                <th className='ps-4 min-w-300px'>Id</th>
                <th className='ps-4 min-w-100px'>Amount</th>
                <th className='min-w-300px'>Invoice</th>
                <th className='min-w-125px'>Invoice Number</th>
                <th className='min-w-150px'>Payment Mode</th>
                <th className='min-w-150px'>Payment Type</th>
                <th className='min-w-125px'>Created By</th>
                <th className='min-w-125px'>Organisation</th>
                
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
            {modalContent && modalContent.inventory_items && modalContent.invoice_payment.map((element, index) => {
              return (
                <tr key={index}>
                  <td>{element.id}</td>
                  <td>{element.amount}</td>
                  <td>{element.invoice}</td>
                  <td>{element.invoice_number}</td>
                  <td>{element.payment_mode}</td>
                  <td>{element.payment_type}</td>
                  <td>{element.created_by}</td>
                  <td>{element.organization}</td>
                </tr>
              )
            })}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
       </div>
       <div className='row'>
          <div className='col-sm-8'>
            <div className='row'>
              <div className='col-4'>Advance:</div>
              <div className='col-8'><h6>{`${modalContent && modalContent.advance  || '-'}`}</h6></div>
            </div>
          </div>
        </div>
       <div className='row'>
          <div className='col-sm-8'>
            <div className='row'>
              <div className='col-4'>Advance Payment Mode:</div>
              <div className='col-8'><h6>{`${modalContent && modalContent.advance_payment_mode  || '-'}`}</h6></div>
            </div>
          </div>
        </div>
       <div className='row'>
          <div className='col-sm-8'>
            <div className='row'>
              <div className='col-4'>Balance:</div>
              <div className='col-8'><h6>{`${modalContent && modalContent.balance  || '-'}`}</h6></div>
            </div>
          </div>
        </div>
       <div className='row'>
          <div className='col-sm-8'>
            <div className='row'>
              <div className='col-4'>Created By:</div>
              <div className='col-8'><h6>{`${modalContent && modalContent.created_by  || '-'}`}</h6></div>
            </div>
          </div>
        </div>
       <div className='row'>
          <div className='col-sm-8'>
            <div className='row'>
              <div className='col-4'>Created On:</div>
              <div className='col-8'><h6>{`${modalContent && modalContent.created_on  || '-'}`}</h6></div>
            </div>
          </div>
        </div>
       <div className='row'>
          <div className='col-sm-8'>
            <div className='row'>
              <div className='col-4'>Discount:</div>
              <div className='col-8'><h6>{`${modalContent && modalContent.discount  || '-'}`}</h6></div>
            </div>
          </div>
        </div>
       <div className='row'>
          <div className='col-sm-8'>
            <div className='row'>
              <div className='col-4'>Date:</div>
              <div className='col-8'><h6>{`${modalContent && modalContent.date  || '-'}`}</h6></div>
            </div>
          </div>
        </div>
       <div className='row'>
          <div className='col-sm-8'>
            <div className='row'>
              <div className='col-4'>Delivery Date:</div>
              <div className='col-8'><h6>{`${modalContent && modalContent.delivery_date  || '-'}`}</h6></div>
            </div>
          </div>
        </div>
       <div className='row'>
          <div className='col-sm-8'>
            <div className='row'>
              <div className='col-4'>Id:</div>
              <div className='col-8'><h6>{`${modalContent && modalContent.id  || '-'}`}</h6></div>
            </div>
          </div>
        </div>
       <div className='row'>
          <div className='col-sm-8'>
            <div className='row'>
              <div className='col-4'>Invoice Number:</div>
              <div className='col-8'><h6>{`${modalContent && modalContent.invoice_number  || '-'}`}</h6></div>
            </div>
          </div>
        </div>
       <div className='row'>
          <div className='col-sm-8'>
            <div className='row'>
              <div className='col-4'>Is Active:</div>
              <div className='col-8'><h6>{`${modalContent && modalContent.is_active  ? "Active" : "Not Active" || '-'}`}</h6></div>
            </div>
          </div>
        </div>
       <div className='row'>
          <div className='col-sm-8'>
            <div className='row'>
              <div className='col-4'>Is Taxable:</div>
              <div className='col-8'><h6>{`${modalContent && modalContent.is_taxable ? "Yes" : "No"  || '-'}`}</h6></div>
            </div>
          </div>
        </div>
       <div className='row'>
          <div className='col-sm-8'>
            <div className='row'>
              <div className='col-4'>Organisation:</div>
              <div className='col-8'><h6>{`${modalContent && modalContent.organization  || '-'}`}</h6></div>
            </div>
          </div>
        </div>
       <div className='row'>
          <div className='col-sm-8'>
            <div className='row'>
              <div className='col-4'>Remarks:</div>
              <div className='col-8'><h6>{`${modalContent && modalContent.remarks  || '-'}`}</h6></div>
            </div>
          </div>
        </div>
       <div className='row'>
          <div className='col-sm-8'>
            <div className='row'>
              <div className='col-4'>Status:</div>
              <div className='col-8'><h6>{`${modalContent && modalContent.status  || '-'}`}</h6></div>
            </div>
          </div>
        </div>
       <div className='row'>
          <div className='col-sm-8'>
            <div className='row'>
              <div className='col-4'>Tax Percentage:</div>
              <div className='col-8'><h6>{`${modalContent && modalContent.tax_percentage  || '-'}`}</h6></div>
            </div>
          </div>
        </div>
       <div className='row'>
          <div className='col-sm-8'>
            <div className='row'>
              <div className='col-4'>Total:</div>
              <div className='col-8'><h6>{`${modalContent && modalContent.total  || '-'}`}</h6></div>
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

export {InvoiceDetailsModal}
