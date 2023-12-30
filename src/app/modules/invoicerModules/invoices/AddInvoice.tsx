import React, {SetStateAction, useEffect, useState} from 'react'
import {Formik, Field, Form, ErrorMessage, useFormik, validateYupSchema, useField} from 'formik'
import * as Yup from 'yup'
import {InvoiceModel} from './_models'
import {useAuth} from '../../auth'
import {KTIcon} from '../../../../_metronic/helpers'
import {addInvoiceService} from './_requests'
import {InventoryItem} from './_models'
import AsyncSelect from 'react-select/async'
import {fetchSearchedCustomers, fetchSearchedInventory} from './_requests'
import Swal from 'sweetalert2'
import {toast} from 'react-toastify'
import {useInventoryContext} from '../inventory/InventoryProvider'

interface AddInvoiceProps {
  //   onSubmit: (formData: InvoiceModel) => void;
  handleClose: () => void
}

const AddInvoice: React.FC<AddInvoiceProps> = (handleClose) => {

  interface CustomerDetails {
    phone: string
    email: string
    first_name: string
    last_name: string
    gender: string
  }
  const [searchInput, setSearchInput] = useState('')
  const [selectedOption, setSelectedOption] = useState<CustomerDetails | any>({})
  const [customeFieldDisable, setCustomerFieldDisable] = useState(false)
  const [selectCusomerBy, setSelectCusomerBy] = useState('phone')
  const [selectInventoryBy, setSelectInventoryBy] = useState('name')

  const [searchInventoryInput, setSearchInventoryInput] = useState('')
  const [selectedInventoryOption, setSelectedInventoryOption] = useState<any>([])
  const [itemQuantities, setItemQuantities] = useState({})

  const {setShouldFetchInvoice} = useInventoryContext()

  const handleRemoveItem = (itemId) => {
    setSelectedInventoryOption((prevOptions) => {
      const updatedOptions = prevOptions.filter((element) => element.id !== itemId)
      const updatedItemQuantities = {...itemQuantities}
      delete updatedItemQuantities[itemId]

      setItemQuantities(updatedItemQuantities)
      return updatedOptions
    })
  }

  const handleQuantityChange = (itemId, change) => {
    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: Math.max(Number(prevQuantities[itemId] || 0) + change, 0),
    }))
  }

  const {auth} = useAuth()
  const initialValues: any = {
    phone: '',
    email: '',
    first_name: '',
    last_name: '',
    gender: '',
    left_sphere: 0,
    right_sphere: 0,
    left_cylinder: 0,
    right_cylinder: 0,
    left_axis: 0,
    right_axis: 0,
    left_prism: 0,
    right_prism: 0,
    left_add: 0,
    right_add: 0,
    left_ipd: 0,
    right_ipd: 0,
    pupillary_distance: 0,
    additional_notes: '',
    inventory_items: [] as Array<{
      inventory_item: number
      quantity: number
    }>,
    date: '',
    remarks: '',
    delivery_date: '',
    discount: '',
    advance: 0,
    advance_payment_mode: '',
    tax_percentage: 0,
  }

  const validationSchema = Yup.object().shape({
    phone: Yup.string().required('Phone is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    gender: Yup.string().required('Gender is required'),
    left_sphere: Yup.number()
      .required('Left Sphere is required')
      .min(-20, `Left Sphere must be greater than or equal to ${-20}`)
      .max(20, `Left Sphere must be less than or equal to ${20}`),
    right_sphere: Yup.number()
      .required('Right Sphere is required')
      .min(-20, `Right Sphere must be greater than or equal to ${-20}`)
      .max(20, `Right Sphere must be less than or equal to ${20}`),
    left_cylinder: Yup.number()
      .required('Left Cylinder is required')
      .min(-10, `Left Cylinder must be greater than or equal to ${-10}`)
      .max(10, `Left Cylinder must be less than or equal to ${10}`),
    right_cylinder: Yup.number()
      .required('Right Sphere is required')
      .min(-10, `Right Sphere must be greater than or equal to ${-10}`)
      .max(10, `Right Sphere must be less than or equal to ${10}`),
    left_axis: Yup.number()
      .required('Left Axis is required')
      .min(1, `Left Axis must be greater than or equal to ${1}`)
      .max(181, `Left Axis must be less than or equal to ${181}`),
    right_axis: Yup.number()
      .required('Right axis is required')
      .min(1, `Right axis must be greater than or equal to ${1}`)
      .max(181, `Right axis must be less than or equal to ${181}`),
    left_prism: Yup.number()
      .required('Left Prism is required')
      .min(0, `Left Prism must be greater than or equal to ${0}`)
      .max(10, `Left Prism must be less than or equal to ${10}`),
    right_prism: Yup.number()
      .required('Right Prism is required')
      .min(0, `Right Prism must be greater than or equal to ${0}`)
      .max(10, `Right Prism must be less than or equal to ${10}`),
    left_add: Yup.number()
      .required('Left Add is required')
      .min(0, `Left Add must be greater than or equal to ${0}`)
      .max(4, `Left Add must be less than or equal to ${4}`),
    right_add: Yup.number()
      .required('Right Add is required')
      .min(0, `Right Add must be greater than or equal to ${0}`)
      .max(4, `Right Add must be less than or equal to ${4}`),
    left_ipd: Yup.number().required('Left IPD is required'),
    right_ipd: Yup.number().required('Right IPD is required'),
    pupillary_distance: Yup.number().required('Pupillary Distance is required'),
    additional_notes: Yup.string(),
    date: Yup.string().required('Date is required'),
    remarks: Yup.string(),
    delivery_date: Yup.string(),
    discount: Yup.string(),
    advance: Yup.string(),
    advance_payment_mode: Yup.string(),
    tax_percentage: Yup.string(),
  })

  const handleSubmit = async (values) => {
    const inventoryItems = Object.entries(itemQuantities).map(([inventory_item, quantity]) => ({
      inventory_item: Number(inventory_item), // Convert the key to a number if needed
      quantity: quantity || 0, // Use 0 if quantity is undefined
    }))
    const dataTosend: any = {
      customer: {
        phone: values.phone,
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        gender: values.gender,
        ...(values.id && {id: values.id}),
      },
      prescription: {
        left_sphere: parseFloat(values.left_sphere), // 2.00
        right_sphere: parseFloat(values.right_sphere), // 2.00
        left_cylinder: parseFloat(values.left_cylinder), // 2.00
        right_cylinder: parseFloat(values.right_cylinder), // 2.00
        left_axis: parseFloat(values.left_axis),
        right_axis: parseFloat(values.right_axis),
        left_prism: parseFloat(values.left_prism), // 2.00
        right_prism: parseFloat(values.right_prism), // 2.00
        left_add: parseFloat(values.left_add), // 2.00
        right_add: parseFloat(values.right_add), // 2.00
        left_ipd: parseFloat(values.left_ipd), // 2.00
        right_ipd: parseFloat(values.right_ipd), // 2.00
        pupillary_distance: +values.pupillary_distance,
        additional_notes: values.additional_notes,
      },
      inventory_items: inventoryItems,
      date: values.date,
      remarks: values.remarks,
      delivery_date: values.delivery_date,
      discount: values.discount,
      advance: values.advance,
      advance_payment_mode: values.advance_payment_mode,
      tax_percentage: values.tax_percentage,
    }

    console.log(dataTosend)

    if (auth?.token) {
      try {
        const response = await addInvoiceService(auth?.token, dataTosend)
        console.log(response)
        if (response.status == 201) {
          toast.success('Invoice Added Successfully')
          setShouldFetchInvoice(true)
          handleClose.handleClose()
        } else {
          toast.error('Unable to add Invoice')
          handleClose.handleClose()
        }
      } catch (error: any) {
        console.log(error)
        toast.error(error.response.data.error || 'Unable to add invoice')
        handleClose.handleClose()
      }
    }
  }

  const loadOptions = async (inputValue) => {
    try {
      if (auth?.token && inputValue) {
        const response = await fetchSearchedCustomers(auth.token, inputValue, selectCusomerBy)
        console.log(response.data)
        const options =
          response &&
          response.data &&
          response.data.results.map((customer) => {
            const labelValue = selectCusomerBy == 'phone' ? customer.phone : customer.email
            return {
              label: `${labelValue}`,
              value: customer,
            }
          })
        return options
      }
    } catch (error: any) {
      console.error('Error fetching customers:', error)
      toast.error(error.response.data.error)
      return [auth?.token, searchInput]
    }
  }

  const loadOptionsInventory = async (inputValue) => {
    try {
      if (auth?.token && inputValue) {
        const response = await fetchSearchedInventory(auth.token, inputValue, selectInventoryBy)
        console.log(response.data)
        const options =
          response &&
          response.data &&
          response.data.results.map((inventory) => ({
            label: `${inventory.name}`,
            value: inventory, // Adjust the property based on your customer model
          }))
        return options
      }
    } catch (error: any) {
      console.error('Error fetching customers:', error)
      toast.error(error.response.data.error)
      return [auth?.token, searchInventoryInput]
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(formikProps) => (
        <Form>
          <h4>Customer Details:</h4>
          <div className='row'>
            <div className='col-md-6'>
              <label htmlFor='selectCustomerBy'>Select Customer by:</label>
              <Field
                as='select'
                name='selectCustomerBy'
                className='form-control my-2'
                onChange={(e) => {
                  setSelectCusomerBy(e.target.value)
                }}
              >
                <option value='phone'>Phone</option>
                <option value='email'>Email</option>
              </Field>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6'>
              <AsyncSelect
                className='my-3'
                styles={{
                  option: (provided, state) => ({
                    ...provided,
                    color: 'black', // set the desired text color
                  }),
                }}
                cacheOptions
                loadOptions={(inputValue) => loadOptions(inputValue)}
                defaultOptions
                onChange={(selectedOption: any | {}) => {
                  // Handle the selected customer option
                  console.log('Selected Customer:', selectedOption)

                  // Set form values based on the selected customer
                  formikProps.setValues({
                    ...formikProps.values,
                    phone: selectedOption?.value?.phone || '',
                    email: selectedOption?.value?.email || '',
                    first_name: selectedOption?.value?.first_name || '',
                    last_name: selectedOption?.value?.last_name || '',
                    gender: selectedOption?.value?.gender || '',
                    id: selectedOption?.value?.id || '',
                  })

                  // Update the state with the selected option
                  setSelectedOption({...selectedOption.value})
                  setCustomerFieldDisable(true)
                }}
                onInputChange={(inputValue) => {
                  setSearchInput((prevInput) => inputValue)
                  console.log('Input Value:', inputValue)
                }}
              />
            </div>
            <div className='col-md-6'>
              {Object.keys(selectedOption).length !== 0 && (
                <>
                  <div className='d-flex justify-content-center align-iems-center my-3'>
                    <a
                      className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      onClick={() => {
                        Swal.fire({
                          title: 'Are you sure?',
                          text: 'You want to edit an existing customer',
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#3085d6',
                          cancelButtonColor: '#d33',
                          confirmButtonText: 'Yes',
                        }).then((result) => {
                          if (result.isConfirmed) {
                            Swal.fire({
                              title: 'Confirmed!',
                              text: 'Your deatils are added for editting.',
                              icon: 'success',
                            })
                            setCustomerFieldDisable(false)
                          } else if (result.dismiss === Swal.DismissReason.cancel) {
                            setCustomerFieldDisable(true)
                          }
                        })
                      }}
                    >
                      <KTIcon iconName='pencil' className='fs-3' />
                    </a>
                    <a
                      className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      onClick={() => {
                        formikProps.setValues({
                          ...formikProps.values,
                          phone: '',
                          email: '',
                          first_name: '',
                          last_name: '',
                          gender: '',
                        })

                        setSelectedOption({})
                        setCustomerFieldDisable(false)
                      }}
                    >
                      <KTIcon iconName='trash' className='fs-3' />
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          <Field name='id' id='id' type='hidden' />
          <div className='row'>
            <div className='form-group col-md-4'>
              <label htmlFor='phone'>Phone:</label>
              <Field
                type='text'
                name='phone'
                className='form-control my-2'
                disabled={customeFieldDisable}
              />
              <ErrorMessage name='phone' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-4'>
              <label htmlFor='email'>Email:</label>
              <Field
                type='text'
                name='email'
                className='form-control my-2'
                disabled={customeFieldDisable}
              />
              <ErrorMessage name='email' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-4'>
              <label htmlFor='first_name'>First Name:</label>
              <Field
                type='text'
                name='first_name'
                className='form-control my-2'
                disabled={customeFieldDisable}
              />
              <ErrorMessage name='first_name' component='div' className='error-message' />
            </div>
          </div>

          <div className='row'>
            <div className='form-group col-md-4'>
              <label htmlFor='last_name'>Last Name:</label>
              <Field
                type='text'
                name='last_name'
                className='form-control my-2'
                disabled={customeFieldDisable}
              />
              <ErrorMessage name='last_name' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-4'>
              <label htmlFor='gender'>Gender:</label>
              <Field
                as='select'
                name='gender'
                className='form-control my-2'
                disabled={customeFieldDisable}
              >
                <option value=''>Select Gender</option>
                <option value='M'>Male</option>
                <option value='F'>Female</option>
              </Field>
              <ErrorMessage name='gender' component='div' className='error-message' />
            </div>
          </div>
          <h4>Prescriptions</h4>
          <div className='row'>
            <div className='form-group col-md-3'>
              <label htmlFor='left_sphere'>Left Sphere:</label>
              <Field
                type='number'
                name='left_sphere'
                className='form-control my-2'
                min='-20'
                max='20'
                step='0.01'
              />
              <ErrorMessage name='left_sphere' component='div' className='error-message' />
            </div>

            <div className='form-group col-md-3'>
              <label htmlFor='right_sphere'>Right Sphere:</label>
              <Field
                type='number'
                name='right_sphere'
                className='form-control my-2'
                min='-20'
                max='20'
                step='0.01'
              />
              <ErrorMessage name='right_sphere' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-3'>
              <label htmlFor='left_cylinder'>Left Cylinder:</label>
              <Field
                type='number'
                name='left_cylinder'
                className='form-control my-2'
                min='-10'
                max='10'
                step='0.01'
              />
              <ErrorMessage name='left_cylinder' component='div' className='error-message' />
            </div>

            <div className='form-group col-md-3'>
              <label htmlFor='right_cylinder'>Right Cylinder:</label>
              <Field
                type='number'
                name='right_cylinder'
                className='form-control my-2'
                min='-10'
                max='10'
                step='0.01'
              />
              <ErrorMessage name='right_cylinder' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-3'>
              <label htmlFor='left_axis'>Left Axis:</label>
              <Field
                type='number'
                name='left_axis'
                className='form-control my-2'
                min='1'
                max='181'
              />
              <ErrorMessage name='left_axis' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-3'>
              <label htmlFor='right_axis'>Right Axis:</label>
              <Field
                type='number'
                name='right_axis'
                className='form-control my-2'
                min='1'
                max='181'
              />
              <ErrorMessage name='right_axis' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-3'>
              <label htmlFor='left_prism'>Left Prism:</label>
              <Field
                type='number'
                name='left_prism'
                className='form-control my-2'
                min='0'
                max='10'
                step='0.01'
              />
              <ErrorMessage name='left_prism' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-3'>
              <label htmlFor='right_prism'>Right Prism:</label>
              <Field
                type='number'
                name='right_prism'
                className='form-control my-2'
                min='0'
                max='10'
                step='0.01'
              />
              <ErrorMessage name='right_prism' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-3'>
              <label htmlFor='left_add'>Left Add:</label>
              <Field
                type='number'
                name='left_add'
                className='form-control my-2'
                min='0'
                max='4'
                step='0.01'
              />
              <ErrorMessage name='left_add' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-3'>
              <label htmlFor='right_add'>Right Add:</label>
              <Field
                type='number'
                name='right_add'
                className='form-control my-2'
                min='0'
                max='4'
                step='0.01'
              />
              <ErrorMessage name='right_add' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-3'>
              <label htmlFor='left_ipd'>Left Ipd:</label>
              <Field type='number' name='left_ipd' className='form-control my-2' />
              <ErrorMessage name='left_ipd' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-3'>
              <label htmlFor='right_ipd'>Right Ipd:</label>
              <Field type='number' name='right_ipd' className='form-control my-2' />
              <ErrorMessage name='right_ipd' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-3'>
              <label htmlFor='pupillary_distance'>Pupillary Distance:</label>
              <Field type='number' name='pupillary_distance' className='form-control my-2' />
              <ErrorMessage name='pupillary_distance' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-3'>
              <label htmlFor='additional_notes'>Additional Notes:</label>
              <Field type='text-area' name='additional_notes' className='form-control my-2' />
              <ErrorMessage name='additional_notes' component='div' className='error-message' />
            </div>
          </div>

          <div className='row'>
            <div className='form-group col-md-4'>
              <label htmlFor='date'>Date:</label>
              <Field type='date' name='date' className='form-control my-2' />
              <ErrorMessage name='date' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-4'>
              <label htmlFor='remarks'>Remarks:</label>
              <Field type='text' name='remarks' className='form-control my-2' />
              <ErrorMessage name='remarks' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-4'>
              <label htmlFor='delivery_date'>Delivery Date:</label>
              <Field type='date' name='delivery_date' className='form-control my-2' />
              <ErrorMessage name='delivery_date' component='div' className='error-message' />
            </div>
          </div>

          <div className='row'>
            <div className='form-group col-md-4'>
              <label htmlFor='discount'>Discount:</label>
              <Field type='number' name='discount' className='form-control my-2' />
              <ErrorMessage name='discount' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-4'>
              <label htmlFor='advance'>Advance:</label>
              <Field type='number' name='advance' className='form-control my-2' />
              <ErrorMessage name='advance' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-4'>
              <label htmlFor='advance_payment_mode'>Advance Payment Mode:</label>
              <Field type='text' name='advance_payment_mode' className='form-control my-2' />
              <ErrorMessage name='advance_payment_mode' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-4'>
              <label htmlFor='tax_percentage'>Tax Percentage:</label>
              <Field type='number' name='tax_percentage' className='form-control my-2' />
              <ErrorMessage name='tax_percentage' component='div' className='error-message' />
            </div>
          </div>

          <h4>Inventory Items</h4>
          <div className='row'>
            <div className='col-md-6'>
              <label htmlFor='selectInventoryBy'>Select Inventory by:</label>
              <Field
                as='select'
                name='selectInventoryBy'
                className='form-control my-2'
                onChange={(e) => {
                  setSelectInventoryBy(e.target.value)
                }}
              >
                <option value='name'>Name</option>
                <option value='sku'>Sku</option>
                <option value='type'>Type</option>
              </Field>
            </div>
          </div>
          <div className='col-md-6 mt-3'>
            <AsyncSelect
              styles={{
                option: (provided, state) => ({
                  ...provided,
                  color: 'black', // set the desired text color
                }),
              }}
              cacheOptions
              loadOptions={(inputValue) => loadOptionsInventory(inputValue)}
              defaultOptions
              onChange={(selectedOption: any | {}) => {
                // Handle the selected customer option
                console.log('Selected Customer:', selectedOption)

                // Set form values based on the selected customer

                // Update the state with the selected option
                setSelectedInventoryOption((prev) => {
                  return [...prev, selectedOption.value]
                })
              }}
              onInputChange={(inputValue) => {
                setSearchInventoryInput((prevInput) => inputValue)
                console.log('Input Value:', inputValue)
              }}
            />
          </div>
          {selectedInventoryOption.length > 0 && (
            <div className='card-body py-3'>
              {/* begin::Table container */}
              <div className='table-responsive'>
                {/* begin::Table */}
                <table className='table align-middle gs-0 gy-4'>
                  {/* begin::Table head */}
                  <thead>
                    <tr className='fw-bold text-muted bg-light'>
                      <th className='min-w-125px'>Item type</th>
                      <th className='min-w-200px'>Item name</th>
                      <th className='ps-4 min-w-125px'>Cost Value</th>
                      <th className='ps-4 min-w-125px'>Sale Value</th>
                      <th className='min-w-125px'>Quantity</th>
                      <th className='ps-4 min-w-300px rounded-start'>Description</th>
                      <th className='min-w-80px'>Action</th>
                    </tr>
                  </thead>
                  {/* end::Table head */}
                  {/* begin::Table body */}
                  <tbody>
                    {selectedInventoryOption.length > 0 &&
                      selectedInventoryOption.map((element) => {
                        const itemId = element.id // Assuming each item has a unique id

                        return (
                          <tr key={itemId}>
                            <td>{element.item_type}</td>
                            <td className='text-primary'>{element.name}</td>
                            <td>{element.cost_value}</td>
                            <td>{element.sale_value}</td>
                            <td>
                              <div className='d-flex align-items-center'>
                                <button
                                  type='button'
                                  className='btn btn-light btn-sm'
                                  onClick={() => handleQuantityChange(itemId, -1)}
                                >
                                  -
                                </button>
                                <span className='mx-2'>{itemQuantities[itemId] || 0}</span>
                                <button
                                  type='button'
                                  className='btn btn-light btn-sm'
                                  onClick={() => handleQuantityChange(itemId, 1)}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td>{element.description}</td>
                            <td>
                              <a
                                className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                onClick={() => handleRemoveItem(itemId)}
                              >
                                <KTIcon iconName='trash' className='fs-3' />
                              </a>
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
          )}
          <div className='row mt-5'>
            <div className='form-group col-md-12 d-flex justify-content-center'>
              <button type='submit' className='btn btn-primary'>
                Submit
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default AddInvoice
