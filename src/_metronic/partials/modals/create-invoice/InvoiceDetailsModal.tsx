import React, {useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {KTIcon} from '../../../helpers'
import {IndividualInvoice} from '../../../../app/modules/invoicerModules/invoices/_models'

// Add any additional types you need
type Props = {
  show: boolean
  handleClose: () => void
  modalContent: IndividualInvoice
  // Add additional props as required
}

const InvoiceDetailsModal: React.FC<Props> = ({
  show,
  handleClose,
  modalContent /*, other props */,
}) => {
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
          <KTIcon iconName='notepad' className='fs-1 text-primary text-lg-start symbol-50px px-1' />{' '}
          Invoice Details:{' '}
          <h2 className='text-primary'>{modalContent && modalContent.invoice_number}</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='card bg-light p-4'>
          <div className='d-flex'>
            <h2>Customer</h2>
          </div>
          <div className='row'>
            <div className='col-sm-6'>
              <div className='row'>
                <div className='col-6'>
                  <KTIcon iconName='user' className='fs-1 text-primary text-lg-start symbol-50px' />{' '}
                  Name:
                </div>
                <div className='col-6'>
                  <h6>
                    {`${
                      modalContent && modalContent.customer && modalContent.customer.first_name
                    } ${
                      modalContent && modalContent.customer && modalContent.customer.last_name
                    }` || '-'}
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-6'>
              <div className='row'>
                <div className='col-6'>
                  <KTIcon iconName='sms' className='fs-1 text-primary text-lg-start symbol-50px' />{' '}
                  Email:
                </div>
                <div className='col-6'>
                  <h6>
                    {(modalContent && modalContent.customer && modalContent.customer.email) || '-'}
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-6'>
              <div className='row'>
                <div className='col-6'>
                  <KTIcon
                    iconName='phone'
                    className='fs-1 text-primary text-lg-start symbol-50px'
                  />{' '}
                  Phone:
                </div>
                <div className='col-6'>
                  <h6>
                    {(modalContent && modalContent.customer && modalContent.customer.phone) || '-'}
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-6'>
              <div className='row'>
                <div className='col-6'>
                  <KTIcon
                    iconName='profile-user'
                    className='fs-1 text-primary text-lg-start symbol-50px'
                  />{' '}
                  Gender:
                </div>
                <div className='col-6'>
                  <h6>
                    {(modalContent &&
                      modalContent.customer &&
                      (modalContent.customer.gender === 'M' ? 'Male' : 'Female')) ||
                      '-'}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='p-4'>
          <h2 className='my-3'>
            <KTIcon iconName='briefcase' className='fs-1 text-primary text-lg-start symbol-50px' />{' '}
            Prescriptions
          </h2>
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
                    <td>
                      {(modalContent &&
                        modalContent.prescription &&
                        modalContent.prescription.left_add) ||
                        '-'}
                    </td>
                    <td>
                      {(modalContent &&
                        modalContent.prescription &&
                        modalContent.prescription.left_axis) ||
                        '-'}
                    </td>
                    <td>
                      {(modalContent &&
                        modalContent.prescription &&
                        modalContent.prescription.left_cylinder) ||
                        '-'}
                    </td>
                    <td>
                      {(modalContent &&
                        modalContent.prescription &&
                        modalContent.prescription.left_ipd) ||
                        '-'}
                    </td>
                    <td>
                      {(modalContent &&
                        modalContent.prescription &&
                        modalContent.prescription.left_prism) ||
                        '-'}
                    </td>
                    <td>
                      {(modalContent &&
                        modalContent.prescription &&
                        modalContent.prescription.left_sphere) ||
                        '-'}
                    </td>
                  </tr>
                  <tr>
                    <td>Right</td>
                    <td>
                      {(modalContent &&
                        modalContent.prescription &&
                        modalContent.prescription.right_add) ||
                        '-'}
                    </td>
                    <td>
                      {(modalContent &&
                        modalContent.prescription &&
                        modalContent.prescription.right_axis) ||
                        '-'}
                    </td>
                    <td>
                      {(modalContent &&
                        modalContent.prescription &&
                        modalContent.prescription.right_cylinder) ||
                        '-'}
                    </td>
                    <td>
                      {(modalContent &&
                        modalContent.prescription &&
                        modalContent.prescription.right_ipd) ||
                        '-'}
                    </td>
                    <td>
                      {(modalContent &&
                        modalContent.prescription &&
                        modalContent.prescription.right_prism) ||
                        '-'}
                    </td>
                    <td>
                      {(modalContent &&
                        modalContent.prescription &&
                        modalContent.prescription.right_sphere) ||
                        '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-4'>
              <div className='row'>
                <div className='col-6'>Pupillary Distance:</div>
                <div className='col-6'>
                  <h6>
                    {(modalContent &&
                      modalContent.prescription &&
                      modalContent.prescription.pupillary_distance) ||
                      '-'}
                  </h6>
                </div>
              </div>
            </div>
            <div className='col-sm-8'>
              <div className='row'>
                <div className='col-4'>Additional Notes:</div>
                <div className='col-8'>
                  <h6>
                    {(modalContent &&
                      modalContent.prescription &&
                      modalContent.prescription.additional_notes) ||
                      '-'}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='p-4'>
          <h2>
            <KTIcon iconName='purchase' className='fs-1 text-primary text-lg-start symbol-50px' />{' '}
            Inventory Items
          </h2>
          <div className='card-body py-3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table align-middle gs-0 gy-4'>
                {/* begin::Table head */}
                <thead>
                  <tr className='fw-bold text-muted bg-light'>
                    <th className='ps-4 min-w-125px'>Cost Value</th>
                    <th className='min-w-125px'>Quantity</th>
                    <th className='min-w-125px'>Sale Value</th>
                    <th className='min-w-130px'>Brand</th>
                    <th className='min-w-125px'>Item type</th>
                    <th className='min-w-200px'>Item name</th>
                    <th className='min-w-120px'>Is Active</th>
                    <th className='min-w-150px'>Store SKU</th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody>
                  {modalContent &&
                    modalContent.inventory_items &&
                    modalContent.inventory_items.map((element, index) => {
                      return (
                        <tr key={index}>
                          <td>{element.cost_value}</td>
                          <td>{element.quantity}</td>
                          <td>{element.sale_value}</td>
                          <td>{(element.inventory_item && element.inventory_item.brand) || ''}</td>

                          <td>
                            {(element.inventory_item && element.inventory_item.item_type) || ''}
                          </td>
                          <td>{(element.inventory_item && element.inventory_item.name) || ''}</td>
                          <td>
                            {(element.inventory_item && element.inventory_item.is_active
                              ? 'Active'
                              : 'Not Active') || ''}
                          </td>
                          <td>
                            {(element.inventory_item && element.inventory_item.store_sku) || ''}
                          </td>
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
        </div>
        <h2>
          <KTIcon iconName='dollar' className='fs-1 text-primary text-lg-start symbol-50px' />{' '}
          Invoice Payments
        </h2>
        <div className='card-body py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table align-middle gs-0 gy-4'>
              {/* begin::Table head */}
              <thead>
                <tr className='fw-bold text-muted bg-light'>
                  <th className='ps-4 min-w-100px'>Amount</th>
                  <th className='min-w-150px'>Payment Mode</th>
                  <th className='min-w-150px'>Payment Type</th>
                  <th className='min-w-125px'>Remarks</th>
                  <th className='min-w-125px'>Is Active</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody>
                {modalContent &&
                  modalContent.inventory_items &&
                  modalContent.invoice_payment.map((element, index) => {
                    return (
                      <tr key={index}>
                        <td>{element.amount}</td>
                        <td>{element.payment_mode}</td>
                        <td>{element.payment_type}</td>
                        <td>{element.remarks || '-'}</td>
                        <td>{element.is_active ? 'Active' : 'Not Active'}</td>
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
        <div className='card bg-light p-4'>
          <div className=''>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table align-middle gs-0 gy-4'>
                {/* begin::Table head */}
                <thead>
                  <tr className='fw-bold text-muted bg-light'>
                    <th className='ps-4 min-w-125px'>Total</th>
                    <th className='ps-4 min-w-300px rounded-start'>Discount</th>
                    <th className='min-w-125px'>Advance</th>
                    <th className='min-w-125px'>Balance</th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody>
                  <tr>
                    <td>
                      <h3 className='text-primary'>{`${
                        (modalContent && modalContent.total) || '-'
                      }`}</h3>
                    </td>
                    <td>
                      <h3 className='text-primary'>{`${
                        (modalContent && modalContent.discount) || '-'
                      }`}</h3>
                    </td>
                    <td>
                      <h3 className='text-primary'>{`${
                        (modalContent && modalContent.advance) || '-'
                      }`}</h3>
                    </td>
                    <td>
                      <h3 className='text-primary'>{`${
                        (modalContent && modalContent.balance) || '-'
                      }`}</h3>
                    </td>
                  </tr>
                </tbody>
                {/* end::Table body */}
              </table>
              {/* end::Table */}
            </div>
            {/* end::Table container */}
          </div>
        </div>
        <div className='card bg-light p-4 mt-3'>
          <div className='d-flex'>
            <h2>
              <KTIcon
                iconName='calendar-2'
                className='fs-1 text-primary text-lg-start symbol-50px'
              />{' '}
              Dates
            </h2>
          </div>
          <div className='row mt-2'>
            <div className='col-sm-6'>
              <div className='row'>
                <div className='col-6'>
                  <KTIcon
                    iconName='calendar'
                    className='fs-1 text-primary text-lg-start symbol-50px'
                  />{' '}
                  Invoice Date:
                </div>
                <div className='col-6'>
                  <div className='col-8'>
                    <h6>{`${(modalContent && modalContent.date) || '-'}`}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-6'>
              <div className='row'>
                <div className='col-6'>
                  <KTIcon
                    iconName='calendar-tick'
                    className='fs-1 text-primary text-lg-start symbol-50px'
                  />{' '}
                  Delivery Date:
                </div>
                <div className='col-6'>
                  <h6>{`${(modalContent && modalContent.delivery_date) || '-'}`}</h6>
                </div>
              </div>
            </div>
          </div>
          <h2 className='mt-4'>
            <KTIcon
              iconName='message-text-2'
              className='fs-1 text-primary text-lg-start symbol-50px'
            />{' '}
            Remarks
          </h2>
          <div className='col-6'>
            <h6>{`${(modalContent && modalContent.remarks) || '-'}`}</h6>
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
