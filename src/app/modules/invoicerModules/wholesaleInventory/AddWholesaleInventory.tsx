import React, {useState, useEffect, useRef} from 'react'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import {AddWholeSaleInventoryItem} from './_models'
import {addWholesaleInventory} from './_requests'
import {getWholesaleVendorItems} from '../wholesaleVendors/_requests'
import {useAuth} from '../../auth'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import {checkSubscription} from '../invoices/_requests'
import {SubscriptionResponse} from '../invoices/_models'
import {useCombinedContext} from '../CombinedProvider'

interface AddInventoryProps {
  handleClose: () => void
}

const AddWholesaleInventory: React.FC<AddInventoryProps> = ({handleClose}) => {
  const {setShouldFetchInventory} = useCombinedContext()
  const {auth} = useAuth()
  const [vendors, setVendors] = useState<any[]>([])
  const [nextPage, setNextPage] = useState<string | null>(null)
  const [loadingVendors, setLoadingVendors] = useState(false)

  const vendorDropdownRef = useRef<HTMLSelectElement | null>(null)

  const initialValues: AddWholeSaleInventoryItem = {
    item_code: '',
    item_type: '',
    item_property: '',
    group: '',
    category: '',
    item_name: '',
    description: '',
    brand: '',
    origin: '',
    part_model_no: '',
    size: '',
    color: '',
    basic_unit_of_measure: '',
    std_cost: 0,
    selling_price_1: 0,
    selling_price_2: 0,
    selling_price_3: 0,
    re_order_qty: 0,
    min_price: 0,
    max_discount_percentage: 0,
    preferred_vendor: null,
    vendor_ref_no: '',
  }

  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionResponse | any>({})
  const [createInvoicePermission, setCreateInvoicePermission] = useState(false)

  const validationSchema = Yup.object({
    item_code: Yup.string().required('Required'),
    item_type: Yup.string().required('Required'),
    item_property: Yup.string().required('Required'),
    group: Yup.string().required('Required'),
    category: Yup.string().required('Required'),
    item_name: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
    brand: Yup.string().required('Required'),
    origin: Yup.string().required('Required'),
    part_model_no: Yup.string().required('Required'),
    size: Yup.string().required('Required'),
    color: Yup.string().required('Required'),
    basic_unit_of_measure: Yup.string().required('Required'),
    std_cost: Yup.number().min(0, 'Must be greater than or equal to 0').required('Required'),
    selling_price_1: Yup.number().min(0, 'Must be greater than or equal to 0').required('Required'),
    selling_price_2: Yup.number().min(0, 'Must be greater than or equal to 0').required('Required'),
    selling_price_3: Yup.number().min(0, 'Must be greater than or equal to 0').required('Required'),
    re_order_qty: Yup.number().min(0, 'Must be greater than or equal to 0').required('Required'),
    min_price: Yup.number().min(0, 'Must be greater than or equal to 0').required('Required'),
    max_discount_percentage: Yup.number()
      .min(0, 'Must be greater than or equal to 0')
      .required('Required'),
    preferred_vendor: Yup.number().nullable(),
    vendor_ref_no: Yup.string().required('Required'),
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
        }
      }

      fetchApi()
      fetchVendors()
    }
  }, [auth?.token])

  const fetchVendors = async () => {
    if (auth?.token && !loadingVendors) {
      setLoadingVendors(true)
      try {
        //
        const responseData = await getWholesaleVendorItems(auth.token, nextPage ?? '', 5, false)
        setVendors((prev) => [...prev, ...responseData.data.results])
        setNextPage(responseData.data.next)
      } catch (error) {
        console.error('Error fetching vendors:', error)
        toast.error('Error fetching vendors')
      } finally {
        setLoadingVendors(false)
      }
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (
        vendorDropdownRef.current &&
        vendorDropdownRef.current.scrollTop + vendorDropdownRef.current.clientHeight >=
          vendorDropdownRef.current.scrollHeight
      ) {
        fetchVendors()
      }
    }

    if (vendorDropdownRef.current) {
      vendorDropdownRef.current.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (vendorDropdownRef.current) {
        vendorDropdownRef.current.removeEventListener('scroll', handleScroll)
      }
    }
  }, [nextPage])

  const handleSubmit = async (values: AddWholeSaleInventoryItem) => {
    if (auth?.token && createInvoicePermission) {
      try {
        const response = await addWholesaleInventory(auth?.token, values)

        if (response.status === 201) {
          toast.success('Inventory created successfully')
          setShouldFetchInventory(true)
          handleClose()
        } else {
          toast.error('Unable to create Inventory')
          handleClose()
        }
      } catch (error: any) {
        console.error('Error adding inventory:', error)
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
              <label>Item Code</label>
              <Field type='text' name='item_code' className='form-control my-2' />
              <ErrorMessage name='item_code' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label>Item Type</label>
              <Field as='select' name='item_type' className='form-control my-2'>
                <option value=''>Select Item Type</option>
                <option value='Frames'>Frames</option>
                <option value='Lens'>Lens</option>
                <option value='Others'>Others</option>
              </Field>
              <ErrorMessage name='item_type' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <label>Group</label>
              <Field type='text' name='group' className='form-control my-2' />
              <ErrorMessage name='group' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label>Category</label>
              <Field type='text' name='category' className='form-control my-2' />
              <ErrorMessage name='category' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <label>Item Property</label>
              <Field type='text' name='item_property' className='form-control my-2' />
              <ErrorMessage name='item_property' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label>Item Name</label>
              <Field type='text' name='item_name' className='form-control my-2' />
              <ErrorMessage name='item_name' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <label>Description</label>
              <Field type='text' name='description' className='form-control my-2' />
              <ErrorMessage name='description' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label>Brand</label>
              <Field type='text' name='brand' className='form-control my-2' />
              <ErrorMessage name='brand' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <label>Origin</label>
              <Field type='text' name='origin' className='form-control my-2' />
              <ErrorMessage name='origin' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label>Part Model No</label>
              <Field type='text' name='part_model_no' className='form-control my-2' />
              <ErrorMessage name='part_model_no' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <label>Size</label>
              <Field type='text' name='size' className='form-control my-2' />
              <ErrorMessage name='size' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label>Color</label>
              <Field type='text' name='color' className='form-control my-2' />
              <ErrorMessage name='color' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <label>Basic Unit of Measure</label>
              <Field type='text' name='basic_unit_of_measure' className='form-control my-2' />
              <ErrorMessage
                name='basic_unit_of_measure'
                component='div'
                className='error-message'
              />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label>Standard Cost</label>
              <Field type='number' name='std_cost' className='form-control my-2' />
              <ErrorMessage name='std_cost' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <label>Selling Price 1</label>
              <Field type='number' name='selling_price_1' className='form-control my-2' />
              <ErrorMessage name='selling_price_1' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label>Selling Price 2</label>
              <Field type='number' name='selling_price_2' className='form-control my-2' />
              <ErrorMessage name='selling_price_2' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <label>Selling Price 3</label>
              <Field type='number' name='selling_price_3' className='form-control my-2' />
              <ErrorMessage name='selling_price_3' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label>Reorder Quantity</label>
              <Field type='number' name='re_order_qty' className='form-control my-2' />
              <ErrorMessage name='re_order_qty' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <label>Minimum Price</label>
              <Field type='number' name='min_price' className='form-control my-2' />
              <ErrorMessage name='min_price' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label>Max Discount Percentage</label>
              <Field type='number' name='max_discount_percentage' className='form-control my-2' />
              <ErrorMessage
                name='max_discount_percentage'
                component='div'
                className='error-message'
              />
            </div>
            <div className='form-group col-md-6'>
              <label>Preferred Vendor</label>
              <Field
                as='select'
                name='preferred_vendor'
                className='form-control my-2'
                innerRef={vendorDropdownRef}
              >
                <option value=''>Select Preferred Vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name='preferred_vendor' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <label>Vendor Ref No</label>
              <Field type='text' name='vendor_ref_no' className='form-control my-2' />
              <ErrorMessage name='vendor_ref_no' component='div' className='error-message' />
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

export default AddWholesaleInventory
