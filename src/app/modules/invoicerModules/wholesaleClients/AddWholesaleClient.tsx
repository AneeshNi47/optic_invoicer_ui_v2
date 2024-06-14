import React, {useState, useEffect} from 'react'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import {AddWholeSaleClient} from './_models'
import {addWholesaleClient} from './_requests'
import {useAuth} from '../../auth'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import {checkSubscription} from '../invoices/_requests'
import {SubscriptionResponse} from '../invoices/_models'
import {useCombinedContext} from '../CombinedProvider'

interface AddWholesaleClientProps {
  handleClose: () => void
}

const AddWholesaleClient: React.FC<AddWholesaleClientProps> = ({handleClose}) => {
  const {setShouldFetchInventory} = useCombinedContext()
  const {auth} = useAuth()
  const initialValues: AddWholeSaleClient = {
    id_no: '',
    name: '',
    address: '',
    country: '',
    tax_number: '',
    tax_percentage: 5.0,
    phone: '',
    email: '',
    website: '',
    contact_person: '',
    contact_person_phone: '',
    contact_person_email: '',
    contact_person_designation: '',
  }
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionResponse | any>({})
  const [createInvoicePermission, setCreateInvoicePermission] = useState(false)

  const validationSchema = Yup.object({
    id_no: Yup.string().required('Required'),
    name: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    country: Yup.string().required('Required'),
    tax_number: Yup.string().required('Required'),
    tax_percentage: Yup.number().min(0, 'Must be greater than or equal to 0').required('Required'),
    phone: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    website: Yup.string().url('Invalid URL').required('Required'),
    contact_person: Yup.string().required('Required'),
    contact_person_phone: Yup.string().required('Required'),
    contact_person_email: Yup.string().email('Invalid email').required('Required'),
    contact_person_designation: Yup.string().required('Required'),
  })

  useEffect(() => {
    if (auth?.token) {
      const fetchApi = async () => {
        try {
          const responseData = await checkSubscription(auth.token)
          setSubscriptionDetails(responseData.data)
          setCreateInvoicePermission(responseData.data.create_invoice_permission)
        } catch (error) {
          console.error('Error fetching API', error)
          // Handle error as needed
        }
      }

      fetchApi()
    }
  }, [auth?.token])

  const handleSubmit = async (values: AddWholeSaleClient) => {
    console.log('Form values:', values)
    if (auth?.token && createInvoicePermission) {
      try {
        const response = await addWholesaleClient(auth?.token, values)

        if (response.status === 201) {
          toast.success('Client created successfully')
          setShouldFetchInventory(true)
          handleClose()
        } else {
          toast.error('Unable to create Client')
          handleClose()
        }
      } catch (error: any) {
        console.error('Error adding client:', error)
        toast.error(error.response.data.error)
        handleClose()
      }
    } else {
      console.log('No token or no permission')
    }
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label>ID No</label>
              <Field type='text' name='id_no' className='form-control my-2' />
              <ErrorMessage name='id_no' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <label>Name</label>
              <Field type='text' name='name' className='form-control my-2' />
              <ErrorMessage name='name' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label>Address</label>
              <Field type='text' name='address' className='form-control my-2' />
              <ErrorMessage name='address' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <label>Country</label>
              <Field type='text' name='country' className='form-control my-2' />
              <ErrorMessage name='country' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label>Tax Number</label>
              <Field type='text' name='tax_number' className='form-control my-2' />
              <ErrorMessage name='tax_number' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <label>Tax Percentage</label>
              <Field type='number' name='tax_percentage' className='form-control my-2' />
              <ErrorMessage name='tax_percentage' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label>Phone</label>
              <Field type='text' name='phone' className='form-control my-2' />
              <ErrorMessage name='phone' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <label>Email</label>
              <Field type='email' name='email' className='form-control my-2' />
              <ErrorMessage name='email' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label>Website</label>
              <Field type='text' name='website' className='form-control my-2' />
              <ErrorMessage name='website' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <label>Contact Person</label>
              <Field type='text' name='contact_person' className='form-control my-2' />
              <ErrorMessage name='contact_person' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label>Contact Person Phone</label>
              <Field type='text' name='contact_person_phone' className='form-control my-2' />
              <ErrorMessage name='contact_person_phone' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <label>Contact Person Email</label>
              <Field type='email' name='contact_person_email' className='form-control my-2' />
              <ErrorMessage name='contact_person_email' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label>Contact Person Designation</label>
              <Field type='text' name='contact_person_designation' className='form-control my-2' />
              <ErrorMessage
                name='contact_person_designation'
                component='div'
                className='error-message'
              />
            </div>
          </div>

          <div className='row mt-12'>
            <div className='form-group col-md-12 d-flex justify-content-center'>
              <button disabled={!createInvoicePermission} type='submit' className='btn btn-primary'>
                Submit
              </button>
            </div>
            {!createInvoicePermission && (
              <div className='form-group col-md-12 text-center mt-2'>
                <span className='text-danger'>
                  Your {subscriptionDetails ? subscriptionDetails.subscription_type : '-'}{' '}
                  subscription has ended, please contact the administrator to add more Clients.
                </span>
              </div>
            )}
          </div>
        </Form>
      </Formik>
    </>
  )
}

export default AddWholesaleClient
