import React, {useState, useEffect} from 'react'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import {useAuth} from '../../auth'
import {KTIcon} from '../../../../_metronic/helpers'
import {SubscriptionResponse} from './_models'
import AsyncSelect from 'react-select/async'
import {
  addInvoiceService,
  fetchSearchedCustomers,
  fetchSearchedInventory,
  checkSubscription,
} from './_requests'
import Swal from 'sweetalert2'
import {toast} from 'react-toastify'
import {useCombinedContext} from '../CombinedProvider'
import {formatDate, PrescriptionTable, prescriptionCorrector} from '../utils'

interface AddInvoiceProps {
  //   onSubmit: (formData: InvoiceModel) => void;
  handleClose: () => void
}

const AddInvoice: React.FC<AddInvoiceProps> = ({handleClose}) => {
  interface CustomerDetails {
    phone: string
    email: string
    first_name: string
    last_name: string
    gender: string
  }

  const [searchInput, setSearchInput] = useState('')
  const [selectedOption, setSelectedOption] = useState<CustomerDetails | any>({})
  const [customerFieldDisable, setCustomerFieldDisable] = useState(false)
  const [selectCustomerBy, setSelectCustomerBy] = useState('phone')
  const [selectInventoryBy, setSelectInventoryBy] = useState('name')
  const [is_taxable, setIs_taxable] = useState(false)
  const [tax_percentage, setTaxPercentage] = useState(5)
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [customerPrescriptionDisable, setCustomerPrescriptionDisable] = useState(false)
  const [searchInventoryInput, setSearchInventoryInput] = useState('')
  const [selectedInventoryOption, setSelectedInventoryOption] = useState<any>([])
  const [itemQuantities, setItemQuantities] = useState({})
  const [totalCost, setTotalCost] = useState(0)
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionResponse | any>({})
  const [createInvoicePermission, setCreateInvoicePermission] = useState(false)

  const {setShouldFetchInvoice} = useCombinedContext()
  const {auth} = useAuth()
  const handleRemoveItem = (itemId) => {
    setSelectedInventoryOption((prevOptions) => {
      const updatedOptions = prevOptions.filter((element) => element.id !== itemId)
      const updatedItemQuantities = {...itemQuantities}
      delete updatedItemQuantities[itemId]

      setItemQuantities(updatedItemQuantities)
      return updatedOptions
    })
  }

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

  useEffect(() => {
    const total = calculateTotal()
    setTotalCost(total)
  }, [selectedInventoryOption, itemQuantities, is_taxable, tax_percentage])

  // Original calculateTotal function
  const calculateTotal = () => {
    let subtotal = selectedInventoryOption.reduce((total, item) => {
      const itemTotal = item.sale_value * (itemQuantities[item.id] || 1)
      return total + itemTotal
    }, 0)

    if (is_taxable) {
      return subtotal + (subtotal * tax_percentage) / 100
    } else {
      return subtotal
    }
  }

  // New function to calculate total with discount
  const calculateTotalWithDiscount = (discount) => {
    const subtotal = calculateTotal() // Use original calculateTotal for subtotal
    const discountedTotal = subtotal - (discount || 0)

    // Apply tax if taxable
    if (is_taxable) {
      return discountedTotal + (discountedTotal * tax_percentage) / 100
    } else {
      return discountedTotal
    }
  }

  const handleIsTaxableChange = (event, setFieldValue) => {
    const isChecked = event.target.checked
    setIs_taxable(isChecked) // Update local state
    setFieldValue('is_taxable', isChecked) // Update Formik state
  }

  const handleQuantityChange = (itemId, change) => {
    setItemQuantities((prevQuantities) => {
      const newQuantity = (prevQuantities[itemId] || 0) + change

      if (newQuantity <= 0) {
        // Remove the item from both lists
        setSelectedInventoryOption((prevOptions) =>
          prevOptions.filter((option) => option.id !== itemId)
        )
        const updatedQuantities = {...prevQuantities}
        delete updatedQuantities[itemId]
        return updatedQuantities
      } else {
        // Update the quantity
        return {...prevQuantities, [itemId]: newQuantity}
      }
    })
  }

  const initialValues: any = {
    phone: '',
    email: '',
    first_name: '',
    last_name: '',
    gender: '',
    left_sphere: '',
    right_sphere: '',
    left_cylinder: '',
    right_cylinder: '',
    left_axis: '',
    right_axis: '',
    left_prism: '',
    right_prism: '',
    left_add: '',
    right_add: '',
    left_ipd: '',
    right_ipd: '',
    pupillary_distance: '',
    additional_notes: '',
    inventory_items: [] as Array<{
      inventory_item: number
      quantity: number
    }>,
    date: '',
    remarks: '',
    delivery_date: '',
    discount: 0,
    advance: 0,
    advance_payment_mode: 'Cash',
    tax_percentage: tax_percentage,
    is_taxable: is_taxable,
  }

  function numberOrNaNValidation(fieldName, min, max) {
    return Yup.mixed().test(
      `${fieldName} must be a number between ${min} and ${max} or NaN`,
      (value) => {
        if (value === '' || value === undefined) {
          return true
        }
        const numValue = Number(value)
        return isNaN(numValue) || (numValue >= min && numValue <= max)
      }
    )
  }

  const validationSchema = Yup.object().shape({
    phone: Yup.string().required('Phone is required'),
    email: Yup.string().email('Invalid email'),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string(),
    gender: Yup.string().required('Gender is required'),
    left_sphere: numberOrNaNValidation('Left Sphere', -20, 20),
    right_sphere: numberOrNaNValidation('Right Sphere', -20, 20),
    left_cylinder: numberOrNaNValidation('Left Cylinder', -10, 10),
    right_cylinder: numberOrNaNValidation('Right Cylinder', -10, 10),
    left_axis: numberOrNaNValidation('Left Axis', 1, 181),
    right_axis: numberOrNaNValidation('Right axis', 1, 181),
    left_prism: numberOrNaNValidation('Left Prism', 0, 10),
    right_prism: numberOrNaNValidation('Right Prism', 0, 10),
    left_add: numberOrNaNValidation('Left Add', 0, 4),
    right_add: numberOrNaNValidation('Right Add', 0, 4),
    left_ipd: numberOrNaNValidation('Left IPD', 10, 100),
    right_ipd: numberOrNaNValidation('Right IPD', 10, 100),
    pupillary_distance: numberOrNaNValidation('Pupillary Distance', 10, 100),
    additional_notes: Yup.string(),
    remarks: Yup.string(),
    delivery_date: Yup.string().required('Delivery Date is required'),
    discount: Yup.number().max(totalCost, 'Discount cannot exceed total cost'),
    advance: Yup.number().max(totalCost, 'Advance cannot exceed total cost'),
    advance_payment_mode: Yup.string().required('Advance Payment mode is required'),
    tax_percentage: Yup.string(),
  })

  const handleSubmit = async (values, {setSubmitting}) => {
    const inventoryItems = Object.entries(itemQuantities).map(([inventory_item, quantity]) => ({
      inventory_item: Number(inventory_item), // Convert the key to a number if needed
      quantity: quantity || 1, // Use 0 if quantity is undefined
    }))
    const invoiceData: any = {
      customer: {
        phone: values.phone,
        email: values.email === "" ? null : values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        gender: values.gender,
        ...(values.id && {id: values.id}),
      },
      prescription: {
        left_sphere: prescriptionCorrector(values.left_sphere),
        right_sphere: prescriptionCorrector(values.right_sphere),
        left_cylinder: prescriptionCorrector(values.left_cylinder),
        right_cylinder: prescriptionCorrector(values.right_cylinder),
        left_axis: prescriptionCorrector(values.left_axis),
        right_axis: prescriptionCorrector(values.right_axis),
        left_prism: prescriptionCorrector(values.left_prism),
        right_prism: prescriptionCorrector(values.right_prism),
        left_add: prescriptionCorrector(values.left_add),
        right_add: prescriptionCorrector(values.right_add),
        left_ipd: prescriptionCorrector(values.left_ipd),
        right_ipd: prescriptionCorrector(values.right_ipd),
        pupillary_distance: +values.pupillary_distance,
        additional_notes: values.additional_notes,
        ...(values.prescriptionId && {id: values.prescriptionId}),
      },
      inventory_items: inventoryItems,
      date: values.date,
      remarks: values.remarks,
      delivery_date: formatDate(new Date(values.delivery_date)),
      discount: values.discount,
      advance: values.advance,
      advance_payment_mode: values.advance_payment_mode,
      is_taxable: values.is_taxable,
      tax_percentage: values.tax_percentage,
    }

    if (auth?.token && createInvoicePermission) {
      try {
        const response = await addInvoiceService(auth?.token, invoiceData)
        if (response.status === 201) {
          toast.success('Invoice Added Successfully')
          setShouldFetchInvoice(true)
          handleClose()
        } else {
          toast.error('Unable to add Invoice')
          handleClose()
        }
      } catch (error: any) {
        toast.error(error.response.data.error || 'Unable to add invoice')
        handleClose()
      } finally {
        setSubmitting(false)
      }
    }
  }

  const loadOptions = async (inputValue) => {
    try {
      if (auth?.token && inputValue) {
        const response = await fetchSearchedCustomers(auth.token, inputValue, selectCustomerBy)
        const options =
          response &&
          response.data &&
          response.data.results.map((customer) => {
            const labelValue = selectCustomerBy === 'phone' ? customer.phone : customer.email
            return {
              label: `${customer.first_name} ${customer.last_name} ${labelValue}`,
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
        const options =
          response &&
          response.data &&
          response.data.results.map((inventory) => ({
            label: `${inventory.name} - ${inventory.qty === 0 ? "No stock Available" : ""}`,
            availability: inventory.qty === 0 ? false : true,
            value: inventory,
            isDisabled: inventory.qty === 0 ? true : false,
          }))
        return options
      }
    } catch (error: any) {
      console.error('Error fetching Inventory:', error)
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
          <div className='row'>
            <div className='col-md-2'>
              <select
                className='form-select form-select-solid'
                data-kt-select2='true'
                data-placeholder='Search Customer..'
                data-allow-clear='true'
                defaultValue={'phone'}
                onChange={(e) => {
                  setSelectCustomerBy(e.target.value)
                }}
              >
                <option value='phone'>Phone</option>
                <option value='email'>Email</option>
              </select>
            </div>
            <div className='col-md-10'>
              <AsyncSelect
                styles={{
                  option: (provided, state) => ({
                    ...provided,
                    color: 'black', // set the desired text color
                  }),
                }}
                placeholder='Search Customers..'
                cacheOptions
                loadOptions={(inputValue) => loadOptions(inputValue)}
                defaultOptions
                onChange={(selectedOption: any | {}) => {
                  formikProps.setValues({
                    ...formikProps.values,
                    phone: selectedOption?.value?.phone || '',
                    email: selectedOption?.value?.email || '',
                    first_name: selectedOption?.value?.first_name || '',
                    last_name: selectedOption?.value?.last_name || '',
                    gender: selectedOption?.value?.gender || '',
                    id: selectedOption?.value?.id || '',
                  })

                  setSelectedOption({...selectedOption.value})
                  setCustomerFieldDisable(true)
                }}
                onInputChange={(inputValue) => {
                  setSearchInput((prevInput) => inputValue)
                }}
              />
            </div>
            <div className='col-md-5'>
              {Object.keys(selectedOption).length !== 0 && (
                <>
                  <div className='d-flex justify-content-center align-iems-center my-3'>
                    <button
                      className='btn btn-icon btn-bg-light btn-active-color-success btn-color-primary btn-sm me-1'
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
                            setCustomerPrescriptionDisable(false)
                          } else if (result.dismiss === Swal.DismissReason.cancel) {
                            setCustomerFieldDisable(true)
                            setCustomerPrescriptionDisable(true)
                          }
                        })
                      }}
                    >
                      <KTIcon iconName='pencil' className='fs-3' />
                    </button>
                    <button
                      className='btn btn-icon btn-bg-light btn-active-color-danger btn-color-primary btn-sm me-1'
                      onClick={() => {
                        setSelectedOption({})
                        formikProps.setValues({
                          ...formikProps.values,
                          phone: '',
                          email: '',
                          first_name: '',
                          last_name: '',
                          gender: '',
                          left_add: '',
                          right_add: '',
                          left_axis: '',
                          right_axis: '',
                          left_cylinder: '',
                          right_cylinder: '',
                          left_ipd: '',
                          right_ipd: '',
                          left_prism: '',
                          right_prism: '',
                          left_sphere: '',
                          right_sphere: '',
                          pupillary_distance: '',
                          additional_notes: '',
                          prescriptionId: '',
                        })
                        setCustomerFieldDisable(false)
                        setCustomerPrescriptionDisable(false)
                      }}
                    >
                      <KTIcon iconName='trash' className='fs-3' />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <Field name='id' id='id' type='hidden' />
          <div className='row'>
            <div className='form-group col-md-6'>
              <Field
                type='text'
                name='phone'
                placeholder='+971XXXXXXX'
                className='form-control my-2'
                disabled={customerFieldDisable}
              />
              <ErrorMessage name='phone' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <Field
                type='text'
                name='email'
                placeholder='example@mail.com'
                className='form-control my-2'
                disabled={customerFieldDisable}
              />
              <ErrorMessage name='email' component='div' className='error-message' />
            </div>
          </div>

          <div className='row'>
            <div className='form-group col-md-2'>
              <Field
                as='select'
                name='gender'
                className='form-control my-2'
                disabled={customerFieldDisable}
              >
                <option value=''>Gender</option>
                <option value='M'>Male</option>
                <option value='F'>Female</option>
              </Field>
              <ErrorMessage name='gender' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-5'>
              <Field
                type='text'
                name='first_name'
                placeholder='First Name'
                className='form-control my-2'
                disabled={customerFieldDisable}
              />
              <ErrorMessage name='first_name' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-5'>
              <Field
                type='text'
                name='last_name'
                placeholder='Last Name'
                className='form-control my-2'
                disabled={customerFieldDisable}
              />
              <ErrorMessage name='last_name' component='div' className='error-message' />
            </div>
          </div>
          <hr />
          {Object.keys(selectedOption).length !== 0 && selectedOption.prescriptions && (
            <div className='card-body py-3'>
              {/* begin::Table container */}
              <div className='table-responsive'>
                {/* begin::Table */}
                <table className='table align-middle gs-0 gy-4'>
                  {/* begin::Table head */}
                  <thead>
                    <tr className='fw-bold text-muted bg-light'>
                      <th className='ps-4 min-w-50'>Action</th>
                      <th className='ps-4 min-w-100'>Created On</th>
                      <th className='ps-4 min-w-50px'></th>
                      <th className='ps-4 min-w-50px'>ADD</th>
                      <th className='ps-4 min-w-50px'>AXIS</th>
                      <th className='ps-4 min-w-50px'>CYL</th>
                      <th className='ps-4 min-w-50px'>IPD</th>
                      <th className='ps-4 min-w-50px'>PRISM</th>
                      <th className='ps-4 min-w-50px'>SPH</th>
                      <th className='ps-4 min-w-125px'>Pupillary Distance</th>
                      <th className='ps-4 min-w-125px'>Additional Notes</th>
                    </tr>
                  </thead>
                  {/* end::Table head */}
                  {/* begin::Table body */}
                  <tbody>
                    {selectedOption.prescriptions.length > 0 &&
                      selectedOption.prescriptions.map((element) => {
                        return (
                          <tr>
                            <td style={{alignContent: 'center'}}>
                              <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                <input
                                  className='form-check-input widget-13-check'
                                  type='checkbox'
                                  checked={selectedPrescription === element}
                                  onChange={() => {
                                    // Check if the checkbox is currently checked
                                    const isChecked = selectedPrescription === element

                                    if (!isChecked) {
                                      setCustomerPrescriptionDisable(true)
                                    } else {
                                      setCustomerPrescriptionDisable(false)
                                    }

                                    // Update form values based on checkbox state
                                    formikProps.setValues({
                                      ...formikProps.values,
                                      left_add: isChecked ? '' : element?.left_add || '',
                                      right_add: isChecked ? '' : element?.right_add || '',
                                      left_axis: isChecked ? '' : element?.left_axis || '',
                                      right_axis: isChecked ? '' : element?.right_axis || '',
                                      left_cylinder: isChecked ? '' : element?.left_cylinder || '',
                                      right_cylinder: isChecked
                                        ? ''
                                        : element?.right_cylinder || '',
                                      left_ipd: isChecked ? '' : element?.left_ipd || '',
                                      right_ipd: isChecked ? '' : element?.right_ipd || '',
                                      left_prism: isChecked ? '' : element?.left_prism || '',
                                      right_prism: isChecked ? '' : element?.right_prism || '',
                                      left_sphere: isChecked ? '' : element?.left_sphere || '',
                                      right_sphere: isChecked ? '' : element?.right_sphere || '',
                                      pupillary_distance: isChecked
                                        ? ''
                                        : element?.pupillary_distance || '',
                                      additional_notes: isChecked
                                        ? ''
                                        : element?.additional_notes || '',
                                      prescriptionId: isChecked ? '' : element?.id || '',
                                    })

                                    // Toggle the selected prescription state
                                    setSelectedPrescription((prevSelected) =>
                                      prevSelected === element ? null : element
                                    )
                                  }}
                                />
                              </div>
                            </td>
                            <PrescriptionTable prescriptionData={element} />
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className='row'>
            <div className='form-group col-md-2 text-center'> SPH</div>
            <div className='form-group col-md-2 text-center'> CYL</div>
            <div className='form-group col-md-2 text-center'> AXIS</div>
            <div className='form-group col-md-2 text-center'> PRISM</div>
            <div className='form-group col-md-2 text-center'> ADD</div>
            <div className='form-group col-md-2 text-center'> IPD</div>
          </div>
          <div className='row'>
            <Field name='prescriptionId' id='prescriptionId' type='hidden' />
            <div className='form-group col-md-2'>
              <Field
                type='number'
                name='left_sphere'
                className='form-control my-2'
                min='-20'
                max='20'
                step='0.01'
                disabled={customerPrescriptionDisable}
              />
              <ErrorMessage name='left_sphere' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-2'>
              <Field
                type='number'
                name='left_cylinder'
                className='form-control my-2'
                min='-10'
                max='10'
                step='0.01'
                disabled={customerPrescriptionDisable}
              />
              <ErrorMessage name='left_cylinder' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-2'>
              <Field
                type='number'
                name='left_axis'
                className='form-control my-2'
                min='1'
                max='181'
                disabled={customerPrescriptionDisable}
              />
              <ErrorMessage name='left_axis' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-2'>
              <Field
                type='number'
                name='left_prism'
                className='form-control my-2'
                min='0'
                max='10'
                step='0.01'
                disabled={customerPrescriptionDisable}
              />
              <ErrorMessage name='left_prism' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-2'>
              <Field
                type='number'
                name='left_add'
                className='form-control my-2'
                min='0'
                max='4'
                step='0.01'
                disabled={customerPrescriptionDisable}
              />
              <ErrorMessage name='left_add' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-2'>
              <Field
                type='number'
                name='left_ipd'
                className='form-control my-2'
                disabled={customerPrescriptionDisable}
              />
              <ErrorMessage name='left_ipd' component='div' className='error-message' />
            </div>
          </div>

          <div className='row'></div>
          <div className='row'>
            <div className='form-group col-md-2'>
              <Field
                type='number'
                name='right_sphere'
                className='form-control my-2'
                min='-20'
                max='20'
                step='0.01'
                disabled={customerPrescriptionDisable}
              />
              <ErrorMessage name='right_sphere' component='div' className='error-message' />
            </div>

            <div className='form-group col-md-2'>
              <Field
                type='number'
                name='right_cylinder'
                className='form-control my-2'
                min='-10'
                max='10'
                step='0.01'
                disabled={customerPrescriptionDisable}
              />
              <ErrorMessage name='right_cylinder' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-2'>
              <Field
                type='number'
                name='right_axis'
                className='form-control my-2'
                min='1'
                max='181'
                disabled={customerPrescriptionDisable}
              />
              <ErrorMessage name='right_axis' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-2'>
              <Field
                type='number'
                name='right_prism'
                className='form-control my-2'
                min='0'
                max='10'
                step='0.01'
                disabled={customerPrescriptionDisable}
              />
              <ErrorMessage name='right_prism' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-2'>
              <Field
                type='number'
                name='right_add'
                className='form-control my-2'
                min='0'
                max='4'
                step='0.01'
                disabled={customerPrescriptionDisable}
              />
              <ErrorMessage name='right_add' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-2'>
              <Field
                type='number'
                name='right_ipd'
                className='form-control my-2'
                disabled={customerPrescriptionDisable}
              />
              <ErrorMessage name='right_ipd' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <Field
                type='number'
                name='pupillary_distance'
                placeholder='Pupillary Distance'
                className='form-control my-2'
                disabled={customerPrescriptionDisable}
              />
              <ErrorMessage name='pupillary_distance' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <Field
                type='text-area'
                name='additional_notes'
                placeholder='Additional Notes....'
                className='form-control my-2'
                disabled={customerPrescriptionDisable}
              />
              <ErrorMessage name='additional_notes' component='div' className='error-message' />
            </div>
          </div>

          <hr />
          <div className='row'>
            <div className='col-md-2'>
              <select
                className='form-select form-select-solid'
                data-kt-select2='true'
                data-placeholder='Search Items'
                data-allow-clear='true'
                defaultValue={'name'}
                name='selectInventoryBy'
                onChange={(e) => {
                  setSelectInventoryBy(e.target.value)
                }}
              >
                <option value='name'>Name</option>
                <option value='sku'>Sku</option>
                <option value='type'>Type</option>
              </select>
            </div>
            <div className='col-md-10 mt-3'>
              <AsyncSelect
                styles={{
                  option: (provided, state) => ({
                    ...provided,
                    color: 'black', // set the desired text color
                  }),
                }}
                cacheOptions
                placeholder='Search Inventory..'
                loadOptions={(inputValue) => loadOptionsInventory(inputValue)}
                defaultOptions
                onChange={(selectedOption: any | {}) => {
                  setSelectedInventoryOption((prev) => {
                    // Add the selected inventory item if it's not already included
                    const isAlreadySelected = prev.some(
                      (item) => item.id === selectedOption.value.id
                    )
                    if (!isAlreadySelected) {
                      return [...prev, selectedOption.value]
                    }
                    return prev
                  })
                  setItemQuantities((prevQuantities) => {
                    // Set the quantity to 1 if this item is not already in the quantities object
                    if (!prevQuantities[selectedOption.value.id]) {
                      return {...prevQuantities, [selectedOption.value.id]: 1}
                    }
                    return prevQuantities
                  })
                }}
                onInputChange={(inputValue) => {
                  setSearchInventoryInput((prevInput) => inputValue)
                }}
              />
            </div>
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
                      <th className='min-w-200px'>Item name</th>
                      <th className='ps-4 min-w-125px'>Price</th>
                      {formikProps.values.is_taxable && (
                        <th className='ps-4 min-w-125px'>Tax</th>
                      )}
                      <th className='min-w-125px'>Quantity</th>
                      <th className='min-w-80px'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInventoryOption.length > 0 &&
                      selectedInventoryOption.map((element) => {
                        const itemId = element.id // Assuming each item has a unique id

                        return (
                          <tr key={itemId}>
                            <td className='text-primary'>
                              {element.name}
                              <span className='text-muted fw-semibold text-muted d-block fs-7'>
                                {element.item_type}
                              </span>
                            </td>
                            <td>{element.sale_value}</td>
                            {formikProps.values.is_taxable && (
                              <td className='ps-4 min-w-125px'>
                                {element.sale_value * (tax_percentage / 100)}
                              </td>
                            )}
                            <td>
                              <div className='d-flex align-items-center'>
                                <button
                                  type='button'
                                  className='btn btn-light btn-sm'
                                  onClick={() => handleQuantityChange(itemId, -1)}
                                >
                                  -
                                </button>
                                <span className='mx-2'>{itemQuantities[itemId] || 1}</span>
                                <button
                                  type='button'
                                  className='btn btn-light btn-sm'
                                  onClick={() => handleQuantityChange(itemId, 1)}
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            <td>
                              <button
                                className='btn btn-icon btn-bg-light btn-color-primary btn-active-color-danger btn-sm me-1'
                                onClick={() => handleRemoveItem(itemId)}
                              >
                                <KTIcon iconName='trash' className='fs-3' />
                              </button>
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

          <div className='row'>
            <div className='form-group col-md-12'>
              <Field
                type='textArea'
                name='remarks'
                placeholder='Remarks'
                className='form-control my-2'
              />
              <ErrorMessage name='remarks' component='div' className='error-message' />
            </div>
          </div>
          <div className='form-check form-switch form-check-custom form-check-solid'>
            <Field
              name='is_taxable'
              class='form-check-input'
              type='checkbox'
              checked={formikProps.values.is_taxable}
              onChange={(e) => handleIsTaxableChange(e, formikProps.setFieldValue)}
            />
            <span className='toggle-slider'></span>
            <label className='form-check-label'>Tax Invoice</label>
          </div>

          <div className='row' style={{display: 'flex', alignItems: 'center'}}>
            <h4 style={{textAlign: 'right', marginBottom: 0}} className='form-group col-md-3'>
              Date Of Delivery
            </h4>

            <div className='form-group col-md-3'>
              <Field
                type='date'
                name='delivery_date'
                placeholder='Delivery Date'
                className='form-control my-2'
              />
              <ErrorMessage name='delivery_date' component='div' className='error-message' />
            </div>

            <h4 style={{textAlign: 'right', marginBottom: 0}} className='form-group col-md-3'>
              Discount
            </h4>

            <div className='form-group col-md-3'>
              <Field
                type='number'
                name='discount'
                placeholder='Discount'
                className='form-control my-2'
                onChange={(e) => {
                  const discountValue = parseFloat(e.target.value) || 0
                  formikProps.setFieldValue('discount', discountValue)
                  const totalWithDiscount = calculateTotalWithDiscount(discountValue)
                  setTotalCost(totalWithDiscount)
                }}
              />
            </div>
          </div>

          <div className='row' style={{display: 'flex', alignItems: 'center'}}>
            <h4 style={{textAlign: 'right', marginBottom: 0}} className='form-group col-md-8'>
              Total
            </h4>

            <div className='form-group col-md-4'>
              <Field
                type='number'
                name='total'
                placeholder='Total'
                className='form-control my-2'
                disabled
                value={totalCost.toFixed(2)}
              />
              <ErrorMessage name='discount' component='div' className='error-message' />
            </div>
          </div>

          <div className='row' style={{display: 'flex', alignItems: 'center'}}>
            <h4 style={{textAlign: 'right', marginBottom: 0}} className='form-group col-md-8'>
              Advance
            </h4>

            <div className='form-group col-md-4'>
              <Field
                type='number'
                name='advance'
                placeholder='Advance'
                className='form-control my-2'
              />
              <ErrorMessage name='advance' component='div' className='error-message' />
            </div>
          </div>

          <div className='row' style={{display: 'flex', alignItems: 'center'}}>
            <h4 style={{textAlign: 'right', marginBottom: 0}} className='form-group col-md-8'>
              Payment Mode
            </h4>
            <div className='form-group col-md-4'>
              <Field
                as='select'
                name='advance_payment_mode'
                placeholder='Payment Mode'
                className='form-control my-2'
              >
                <option value=''>Select</option>
                <option value='Card'>Card</option>
                <option value='Cash'>Cash</option>
                <option value='Online'>Online</option>
                <option value='Others'>Others</option>
              </Field>
              <ErrorMessage name='advance_payment_mode' component='div' className='error-message' />
            </div>
          </div>
          <div className='row mt-12'>
            <div className='form-group col-md-12 d-flex justify-content-center'>
              <button
                disabled={formikProps.isSubmitting || !createInvoicePermission}
                type='submit'
                className='btn btn-primary'
              >
                Submit
              </button>
            </div>
            {!createInvoicePermission && (
              <div className='form-group col-md-12 text-center mt-2'>
                <span className='text-danger'>
                  Your {subscriptionDetails ? subscriptionDetails.subscription_type : '-'}{' '}
                  subscription has ended, please contact the administrator to add more invoices.
                </span>
              </div>
            )}
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default AddInvoice
