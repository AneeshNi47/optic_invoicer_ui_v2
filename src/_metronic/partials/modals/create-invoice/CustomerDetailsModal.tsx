import React, {useState, useEffect} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {useAuth} from '../../../../app/modules/auth'
import {KTIcon} from '../../../helpers'
import {getCustomerObject} from '../../../../app/modules/invoicerModules/customers/_requests'
import {InvoiceDetailsModal} from './InvoiceDetailsModal'
import {toast} from 'react-toastify'
import {IndividualInvoice} from '../../../../app/modules/invoicerModules/invoices/_models'
import {Customer} from '../../../../app/modules/invoicerModules/customers/_models'

// Add any additional types you need
type Props = {
  show: boolean
  handleClose: () => void
  modalContent: any
}

const CustomerDetailsModal: React.FC<Props> = ({show, handleClose, modalContent}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [invoiceContent, setInvoiceContent] = useState<IndividualInvoice | null>(null)
  const {auth} = useAuth()

  const fetchIndividualCustomerData = async (modalContent) => {
    if (auth?.token) {
      try {
        const responseData = await getCustomerObject(auth.token, modalContent.id)
        setSelectedCustomer(responseData.data)
      } catch (error: any) {
        toast.error(error.response.data.error)
        console.error('Error fetching data:', error)
      }
    }
  }

  useEffect(() => {
    fetchIndividualCustomerData(modalContent)
  }, [modalContent])

  const handleCloseModal = () => {
    setShowModal(false)
  }
  const handleOpenModal = (invoice) => {
    setInvoiceContent(invoice)
    setShowModal(true)
  }

  return (
    <>
      <InvoiceDetailsModal
        show={showModal}
        handleClose={handleCloseModal}
        modalContent={invoiceContent}
      />

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
                  <h6>
                    {selectedCustomer &&
                      selectedCustomer.first_name + ' ' + selectedCustomer.last_name}
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-6'>
              <div className='row'>
                <div className='col-6'>Email:</div>
                <div className='col-6'>
                  <h6>{selectedCustomer && selectedCustomer.email}</h6>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-6'>
              <div className='row'>
                <div className='col-6'>Gender:</div>
                <div className='col-6'>
                  <h6>{selectedCustomer && selectedCustomer.gender === 'M' ? 'Male' : 'Female'}</h6>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-sm-6'>
              <div className='row'>
                <div className='col-6'>Phone:</div>
                <div className='col-6'>
                  <h6>{selectedCustomer && selectedCustomer.phone}</h6>
                </div>
              </div>
            </div>
          </div>

          <div className='p-4'>
            <h2>
              <KTIcon iconName='purchase' className='fs-1 text-primary text-lg-start symbol-50px' />{' '}
              Related Invoices
            </h2>
            <div className='card-body py-3'>
              {/* begin::Table container */}
              <div className='table-responsive'>
                {/* begin::Table */}
                <table className='table align-middle gs-0 gy-4'>
                  {/* begin::Table head */}
                  <thead>
                    <tr className='fw-bold text-muted bg-light'>
                      <th className='ps-4 min-w-125px'>Number</th>
                      <th className='min-w-125px'>Date</th>
                      <th className='min-w-125px'>Status</th>
                      <th className='min-w-130px'>Total</th>
                    </tr>
                  </thead>
                  {/* end::Table head */}
                  {/* begin::Table body */}
                  <tbody>
                    {selectedCustomer &&
                      selectedCustomer.invoices &&
                      selectedCustomer.invoices.map((element, index) => {
                        return (
                          <tr key={index}>
                            <td
                              className='text-dark fw-bold text-hover-primary mb-1 fs-6'
                              onClick={() => {
                                handleOpenModal(element)
                              }}
                            >
                              {element.invoice_number}
                            </td>
                            <td>{element.date}</td>
                            <td>{element.status}</td>
                            <td>{element.total}</td>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export {CustomerDetailsModal}
