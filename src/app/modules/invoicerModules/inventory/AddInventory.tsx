import React, {useState, useEffect} from 'react'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import {AddInventoryItem} from './_models'
import {addInventory} from './_requests'
import {useAuth} from '../../auth'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import {checkSubscription} from '../invoices/_requests'
import {SubscriptionResponse} from '../invoices/_models'
import {useCombinedContext} from '../CombinedProvider'

interface AddInventoryProps {
  handleClose: () => void
}

const AddInventory: React.FC<AddInventoryProps> = (handleClose) => {
  const {setShouldFetchInventory} = useCombinedContext()
  const {auth} = useAuth()
  const initialValues: AddInventoryItem = {
    item_type: 'Frames',
    store_sku: '',
    name: '',
    description: '',
    qty: 0,
    sale_value: 0,
    cost_value: 0,
    brand: '',
  }
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionResponse | any>({})
  const [createInvoicePermission, setCreateInvoicePermission] = useState(false)

  const validationSchema = Yup.object({
    item_type: Yup.string().required('Required'),
    store_sku: Yup.string().required('Required'),
    name: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
    qty: Yup.number().min(0, 'Must be greater than or equal to 0').required('Required'),
    sale_value: Yup.number().min(0, 'Must be greater than or equal to 0').required('Required'),
    cost_value: Yup.number()
      .min(0, 'Must be greater than or equal to 0')
      .required('Required')
      .test(
        'is-less-than-sale',
        'Cost value should be less than or equal to sale value',
        function (value) {
          const {sale_value} = this.parent
          return !value || !sale_value || value <= sale_value
        }
      ),
    brand: Yup.string().required('Required'),
  })
  useEffect(() => {
    if (auth?.token) {
      const fetchApi = async () => {
        try {
          const responseData = await checkSubscription(auth.token)
          setSubscriptionDetails(responseData.data)
          setCreateInvoicePermission(responseData.data.create_invoice_permission)
          console.log('create permission:', responseData.data.create_invoice_permission)
        } catch (error) {
          console.error('Error fetching API', error)
          // Handle error as needed
        }
      }

      fetchApi()
    }
  }, [])
  const handleSubmit = async (values: AddInventoryItem) => {
    if (auth?.token && createInvoicePermission) {
      try {
        const response = await addInventory(auth?.token, values)

        if (response.status === 201) {
          toast.success('Inventory created successfully')
          setShouldFetchInventory(true)
          // dispatch(setShouldFetchInventory(true));
          handleClose.handleClose()
        } else {
          toast.error('Unable to create Inventory')
          handleClose.handleClose()
        }
      } catch (error: any) {
        console.error('Error adding inventory:', error)
        toast.error(error.response.data.error)
        handleClose.handleClose()
      }
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
              <Field as='select' name='item_type' className='form-control my-2'>
                <option value=''>Select Item Type</option>
                <option value='Frames'>Frames</option>
                <option value='Lens'>Lens</option>
                <option value='Others'>Others</option>
              </Field>
              <ErrorMessage name='item_type' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <Field
                type='text'
                placeholder='Store SKU'
                name='store_sku'
                className='form-control my-2'
              />
              <ErrorMessage name='store_sku' component='div' className='error-message' />
            </div>
          </div>

          <div className='row'>
            <div className='form-group col-md-6'>
              <Field
                type='text'
                placeholder='Item Name'
                name='name'
                className='form-control my-2'
              />
              <ErrorMessage name='name' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <Field
                type='text'
                placeholder='Description'
                name='description'
                className='form-control my-2'
              />
              <ErrorMessage name='description' component='div' className='error-message' />
            </div>
          </div>

          <div className='row'>
            <div className='form-group col-md-6'>
              <label htmlFor='qty'>Quantity:</label>
              <Field type='number' name='qty' className='form-control my-2' />
              <ErrorMessage name='qty' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <label htmlFor='sale_value'>Sale Value:</label>
              <Field type='number' name='sale_value' className='form-control my-2' />
              <ErrorMessage name='sale_value' component='div' className='error-message' />
            </div>
          </div>

          <div className='row'>
            <div className='form-group col-md-6'>
              <label htmlFor='cost_value'>Cost Value:</label>
              <Field type='number' name='cost_value' className='form-control' />
              <ErrorMessage name='cost_value' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <label htmlFor='brand'>Brand:</label>
              <Field type='text' name='brand' className='form-control' />
              <ErrorMessage name='brand' component='div' className='error-message' />
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
                  subscription has ended, please contact the administrator to add more Inventory.
                </span>
              </div>
            )}
          </div>
        </Form>
      </Formik>
    </>
  )
}

export default AddInventory
