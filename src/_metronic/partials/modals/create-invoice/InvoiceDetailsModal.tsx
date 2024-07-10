import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useAuth } from '../../../../app/modules/auth'
import { KTIcon } from '../../../helpers'
import { IndividualInvoice } from '../../../../app/modules/invoicerModules/invoices/_models'
import { toast } from 'react-toastify'
import { getInvoiceObject } from '../../../../app/modules/invoicerModules/invoices/_requests'
import { AnyMxRecord } from 'dns'

type Props = {
  show: boolean
  handleClose: () => void
  modalContent: IndividualInvoice | null
}

const InvoiceDetailsModal: React.FC<Props> = ({ show, handleClose, modalContent }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<IndividualInvoice | null>(null)
  const { auth } = useAuth()

  const fetchIndividualCustomerData = async (invoice: IndividualInvoice | null) => {
    if (auth?.token && invoice?.id) {
      try {
        const responseData = await getInvoiceObject(auth.token, invoice.id)
        setSelectedInvoice(responseData.data)
      } catch (error: any) {
        toast.error(error.response.data.error)
        console.error('Error fetching data:', error)
      }
    }
  }

  useEffect(() => {
    fetchIndividualCustomerData(modalContent)
  }, [modalContent])

  const taxRate = selectedInvoice ? selectedInvoice.tax_percentage as any / 100 : 0
  const taxAmount = selectedInvoice ? (selectedInvoice.total * taxRate / (1 + taxRate)) : 0
  const taxAmountFormatted = taxAmount.toFixed(2)
  const totalWithoutTax = selectedInvoice ? (selectedInvoice.total - taxAmount) : 0
  const totalWithoutTaxFormatted = totalWithoutTax.toFixed(2)

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
        <Modal.Title className='d-flex'>
          <KTIcon iconName='notepad' className='fs-1 text-primary text-lg-start symbol-50px px-1' />{' '}
          <h2 className='text-primary'>{selectedInvoice?.invoice_number || '-'}</h2>
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
                  <KTIcon iconName='user' className='fs-1 text-primary text-lg-start symbol-50px' /> Name:
                </div>
                <div className='col-6'>
                  <h6>
                    {selectedInvoice?.customer
                      ? `${selectedInvoice.customer.first_name} ${selectedInvoice.customer.last_name}`
                      : '-'}
                  </h6>
                </div>
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='row'>
                <div className='col-6'>
                  <KTIcon iconName='sms' className='fs-1 text-primary text-lg-start symbol-50px' /> Email:
                </div>
                <div className='col-6'>
                  <h6>{selectedInvoice?.customer?.email || '-'}</h6>
                </div>
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='row'>
                <div className='col-6'>
                  <KTIcon iconName='phone' className='fs-1 text-primary text-lg-start symbol-50px' /> Phone:
                </div>
                <div className='col-6'>
                  <h6>{selectedInvoice?.customer?.phone || '-'}</h6>
                </div>
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='row'>
                <div className='col-6'>
                  <KTIcon iconName='profile-user' className='fs-1 text-primary text-lg-start symbol-50px' /> Gender:
                </div>
                <div className='col-6'>
                  <h6>{selectedInvoice?.customer?.gender === 'M' ? 'Male' : 'Female' || '-'}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='p-4'>
          <h2 className='my-3'>
            <KTIcon iconName='briefcase' className='fs-1 text-primary text-lg-start symbol-50px' /> Prescriptions
          </h2>
          <div className='card-body py-3'>
            <div className='table-responsive'>
              <table className='table align-middle gs-0 gy-4'>
                <thead>
                  <tr className='fw-bold text-muted bg-light'>
                    <th className='ps-4 min-w-125px'>Direction</th>
                    <th className='ps-4 min-w-125px rounded-start'>SPH</th>
                    <th className='min-w-125px'>CYL</th>
                    <th className='min-w-125px'>AXIS</th>
                    <th className='min-w-125px'>PRISM</th>
                    <th className='min-w-125px'>ADD</th>
                    <th className='ps-4 min-w-125px'>IPD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Right</td>
                    <td>{selectedInvoice?.prescription?.right_sphere || '-'}</td>
                    <td>{selectedInvoice?.prescription?.right_cylinder || '-'}</td>
                    <td>{selectedInvoice?.prescription?.right_axis || '-'}</td>
                    <td>{selectedInvoice?.prescription?.right_prism || '-'}</td>
                    <td>{selectedInvoice?.prescription?.right_add || '-'}</td>
                    <td>{selectedInvoice?.prescription?.right_ipd || '-'}</td>
                  </tr>
                  <tr>
                    <td>Left</td>
                    <td>{selectedInvoice?.prescription?.left_sphere || '-'}</td>
                    <td>{selectedInvoice?.prescription?.left_cylinder || '-'}</td>
                    <td>{selectedInvoice?.prescription?.left_axis || '-'}</td>
                    <td>{selectedInvoice?.prescription?.left_prism || '-'}</td>
                    <td>{selectedInvoice?.prescription?.left_add || '-'}</td>
                    <td>{selectedInvoice?.prescription?.left_ipd || '-'}</td>
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
                  <h6>{selectedInvoice?.prescription?.pupillary_distance || '-'}</h6>
                </div>
              </div>
            </div>
            <div className='col-sm-8'>
              <div className='row'>
                <div className='col-4'>Additional Notes:</div>
                <div className='col-8'>
                  <h6>{selectedInvoice?.prescription?.additional_notes || '-'}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='p-4'>
          <h2>
            <KTIcon iconName='purchase' className='fs-1 text-primary text-lg-start symbol-50px' /> Inventory Items
          </h2>
          <div className='card-body py-3'>
            <div className='table-responsive'>
              <table className='table align-middle gs-0 gy-4'>
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
                <tbody>
                  {selectedInvoice?.inventory_items?.map((element, index) => (
                    <tr key={index}>
                      <td>{element.cost_value}</td>
                      <td>{element.quantity}</td>
                      <td>{element.sale_value}</td>
                      <td>{element.inventory_item?.brand || ''}</td>
                      <td>{element.inventory_item?.item_type || ''}</td>
                      <td>{element.inventory_item?.name || ''}</td>
                      <td>{element.inventory_item?.is_active ? 'Active' : 'Not Active'}</td>
                      <td>{element.inventory_item?.store_sku || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <h2>
          <KTIcon iconName='dollar' className='fs-1 text-primary text-lg-start symbol-50px' /> Invoice Payments
        </h2>
        <div className='card-body py-3'>
          <div className='table-responsive'>
            <table className='table align-middle gs-0 gy-4'>
              <thead>
                <tr className='fw-bold text-muted bg-light'>
                  <th className='ps-4 min-w-100px'>Amount</th>
                  <th className='min-w-150px'>Payment Mode</th>
                  <th className='min-w-150px'>Payment Type</th>
                  <th className='min-w-125px'>Remarks</th>
                  <th className='min-w-125px'>Is Active</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice?.invoice_payment?.map((element, index) => (
                  <tr key={index}>
                    <td>{element.amount}</td>
                    <td>{element.payment_mode}</td>
                    <td>{element.payment_type}</td>
                    <td>{element.remarks || '-'}</td>
                    <td>{element.is_active ? 'Active' : 'Not Active'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className='card bg-light p-4'>
          <div className='table-responsive'>
            <table className='table align-middle gs-0 gy-4'>
              <thead>
                <tr className='fw-bold text-muted bg-light'>
                <th className='ps-4 min-w-120px rounded-start'>Discount</th>
                  {selectedInvoice?.is_taxable ? (
                    <>
                  <th className='ps-4 min-w-125px'>Sub Total</th>
                    <th className='ps-4 min-w-120px rounded-start'>Tax {selectedInvoice.tax_percentage} %</th>
                    <th className='ps-4 min-w-1200px rounded-start'>Total </th>
                    </>
                  ) : <th className='ps-4 min-w-300px rounded-start'>Total </th>}
                  <th className='min-w-125px'>Advance</th>
                  <th className='min-w-125px'>Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <h3 className='text-primary'>{selectedInvoice?.discount || '-'}</h3>
                  </td>
                  {selectedInvoice?.is_taxable ? (
                    <>
                  <td>
                    <h3 className='text-primary'>{selectedInvoice?.is_taxable  ? totalWithoutTaxFormatted :selectedInvoice?.total || '-'}</h3>
                  </td>
                    <td>
                      <h3 className='text-primary'>{taxAmountFormatted}</h3>
                    </td>
                  <td>
                    <h3 className='text-primary'>{selectedInvoice?.total || '-'}</h3>
                  </td>
                    </>
                  ) :<td>
                  <h3 className='text-primary'>{selectedInvoice?.total || '-'}</h3>
                </td> }
                  <td>
                    <h3 className='text-primary'>{selectedInvoice?.advance || '-'}</h3>
                  </td>
                  <td>
                    <h3 className='text-primary'>{selectedInvoice?.balance || '-'}</h3>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className='card bg-light p-4 mt-3'>
          <div className='d-flex'>
            <h2>
              <KTIcon iconName='calendar-2' className='fs-1 text-primary text-lg-start symbol-50px' /> Dates
            </h2>
          </div>
          <div className='row mt-2'>
            <div className='col-sm-6'>
              <div className='row'>
                <div className='col-6'>
                  <KTIcon iconName='calendar' className='fs-1 text-primary text-lg-start symbol-50px' /> Invoice Date:
                </div>
                <div className='col-6'>
                  <h6>{selectedInvoice?.date || '-'}</h6>
                </div>
              </div>
            </div>
            <div className='col-sm-6'>
              <div className='row'>
                <div className='col-6'>
                  <KTIcon iconName='calendar-tick' className='fs-1 text-primary text-lg-start symbol-50px' /> Delivery Date:
                </div>
                <div className='col-6'>
                  <h6>{selectedInvoice?.delivery_date || '-'}</h6>
                </div>
              </div>
            </div>
          </div>
          <h2 className='mt-4'>
            <KTIcon iconName='message-text-2' className='fs-1 text-primary text-lg-start symbol-50px' /> Remarks
          </h2>
          <div className='col-6'>
            <h6>{selectedInvoice?.remarks || '-'}</h6>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export { InvoiceDetailsModal }
