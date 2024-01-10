import React, {useState} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import {useAuth} from '../../../../app/modules/auth'
import * as Yup from 'yup'
import {invoicePayment} from '../../../../app/modules/invoicerModules/invoices/_requests'
import {toast} from 'react-toastify'

// Add any additional types you need
type Props = {
  show: boolean
  handleClose: () => void
  modalContent: any
  // Add additional props as required
}

const InvoicePaymentModal: React.FC<Props> = ({
  show,
  handleClose,
  modalContent /*, other props */,
}) => {
  const {auth} = useAuth()
  const initialValues: any = {
    payment_type: 'General',
    payment_mode: 'Cash',
    amount: 0,
  }

  const validationSchema = Yup.object().shape({
    payment_type: Yup.string().required('Payment type is required'),
    payment_mode: Yup.string().required('Payment mode is required'),
    amount: Yup.number()
      .min(1, `Amount must be greater than or equal to ${1}`)
      .max(modalContent.balance, `Amount must be less than or equal to ${modalContent.balance}`),
  })
  const completePayment = async (values) => {
    const paymentDetails: any = {
      invoice_number: modalContent.invoice_number,
      invoice: modalContent.id,
      amount: modalContent.balance,
      payment_mode: values.payment_mode,
      payment_type: values.payment_type,
    }
    if (auth?.token) {
      try {
        const response = await invoicePayment(auth?.token, paymentDetails)
        if (response.status === 201) {
          toast.success('Payment completed')
          handleClose()
        } else {
          toast.error(response.data.error)
          handleClose()
        }
      } catch (error: any) {
        console.log(error)
        toast.error(error.response.data.error)
        handleClose()
      }
    }
  }
  const handleSubmit = async (values) => {
    const paymentDetails: any = {
      invoice_number: modalContent.invoice_number,
      invoice: modalContent.id,
      amount: values.amount,
      payment_mode: values.payment_mode,
      payment_type: values.payment_type,
    }

    if (auth?.token) {
      try {
        const response = await invoicePayment(auth?.token, paymentDetails)
        if (response.status === 201) {
          toast.success('Payment completed')
          handleClose()
        } else {
          toast.error(response.data.error)
          handleClose()
        }
      } catch (error: any) {
        console.log(error)
        toast.error(error.response.data.error)
        handleClose()
      }
    }
  }

  return (
    <Modal
      className='modal fade'
      id='kt_modal_create_invoice'
      data-backdrop='static'
      tabIndex={-1}
      role='dialog'
      show={show}
      dialogClassName='modal-l'
      aria-hidden='true'
      onHide={handleClose}
      // ... other modal props
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h2 className='text-danger'>Invoice Payment</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formikProps) => (
            <Form>
              <div className='row'>
                {/* Left Column */}
                <div className='col-md-5'>
                  <div className='form-group'>
                    <Field as='select' name='payment_mode' className='form-control my-2'>
                      <option value=''>Select</option>
                      <option value='Cash'>Cash</option>
                      <option value='Card'>Card</option>
                      <option value='Online'>Online</option>
                      <option value='Others'>Others</option>
                    </Field>
                    <ErrorMessage name='payment_mode' component='div' className='error-message' />
                  </div>

                  {/* Uncomment and include this section if needed
              <div className='form-group'>
                <label htmlFor='payment_type'>Payment Type:</label>
                <Field as='select' name='payment_type' className='form-control my-2'>
                  <option value=''>Select</option>
                  <option value='Advance'>Advance</option>
                  <option value='General'>General</option>
                  <option value='Return'>Return</option>
                  <option value='Others'>Others</option>
                </Field>
                <ErrorMessage name='payment_type' component='div' className='error-message' />
              </div>
              */}

                  <div className='form-group'>
                    <Field type='number' name='amount' className='form-control my-2' />
                    <ErrorMessage name='amount' component='div' className='error-message' />
                  </div>
                  <div style={{textAlign: 'center', marginTop: '20px'}}>
                    <button type='submit' className='btn btn-primary text-center'>
                      Submit
                    </button>
                  </div>
                </div>{' '}
                {/* Vertical Divider */}
                <div className='col-md-1 d-none d-md-block'>
                  <div
                    style={{
                      borderLeft: '1px solid #dee2e6',
                      height: '100%',
                      position: 'absolute',
                      left: '50%',
                      top: 0,
                    }}
                  />
                </div>
                {/* Right Column */}
                <div className='col-md-5 d-flex align-items-center justify-content-center'>
                  <button className='btn btn-success' onClick={completePayment}>
                    Complete Payment {modalContent.balance}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export {InvoicePaymentModal}
