import React, {useState} from 'react'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import {useAuth} from '../../auth'
import {KTIcon} from '../../../../_metronic/helpers'
import {addInvoiceService} from './_requests'
import AsyncSelect from 'react-select/async'
import {fetchSearchedCustomers, fetchSearchedInventory} from './_requests'
import Swal from 'sweetalert2'
import {toast} from 'react-toastify'
import {useInventoryContext} from '../inventory/InventoryProvider'
import {formatDate, PrescriptionTable} from '../utils'

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
  const [customerFieldDisable, setCustomerFieldDisable] = useState(false)
  const [selectCustomerBy, setSelectCustomerBy] = useState('phone')
  const [selectInventoryBy, setSelectInventoryBy] = useState('name')
  const [selectedPrescription, setSelectedPrescription] = useState(null)

  const [customerPrescriptionDisable, setCustomerPrescriptionDisable] = useState(false)

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

  console.log('Selected Prescripton', selectedPrescription)

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
    discount: 0,
    advance: 0,
    advance_payment_mode: 'Cash',
    tax_percentage: 0,
  }

  const validationSchema = Yup.object().shape({
    phone: Yup.string().required('Phone is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    gender: Yup.string().required('Gender is required'),
    left_sphere: Yup.number()
      .min(-20, `Left Sphere must be greater than or equal to ${-20}`)
      .max(20, `Left Sphere must be less than or equal to ${20}`),
    right_sphere: Yup.number()
      .min(-20, `Right Sphere must be greater than or equal to ${-20}`)
      .max(20, `Right Sphere must be less than or equal to ${20}`),
    left_cylinder: Yup.number()
      .min(-10, `Left Cylinder must be greater than or equal to ${-10}`)
      .max(10, `Left Cylinder must be less than or equal to ${10}`),
    right_cylinder: Yup.number()
      .min(-10, `Right Sphere must be greater than or equal to ${-10}`)
      .max(10, `Right Sphere must be less than or equal to ${10}`),
    left_axis: Yup.number()
      .min(1, `Left Axis must be greater than or equal to ${1}`)
      .max(181, `Left Axis must be less than or equal to ${181}`),
    right_axis: Yup.number()
      .min(1, `Right axis must be greater than or equal to ${1}`)
      .max(181, `Right axis must be less than or equal to ${181}`),
    left_prism: Yup.number()
      .min(0, `Left Prism must be greater than or equal to ${0}`)
      .max(10, `Left Prism must be less than or equal to ${10}`),
    right_prism: Yup.number()
      .min(0, `Right Prism must be greater than or equal to ${0}`)
      .max(10, `Right Prism must be less than or equal to ${10}`),
    left_add: Yup.number()
      .min(0, `Left Add must be greater than or equal to ${0}`)
      .max(4, `Left Add must be less than or equal to ${4}`),
    right_add: Yup.number()
      .min(0, `Right Add must be greater than or equal to ${0}`)
      .max(4, `Right Add must be less than or equal to ${4}`),
    left_ipd: Yup.number(),
    right_ipd: Yup.number(),
    pupillary_distance: Yup.number(),
    additional_notes: Yup.string(),
    remarks: Yup.string(),
    delivery_date: Yup.string(),
    discount: Yup.string(),
    advance: Yup.string(),
    advance_payment_mode: Yup.string().required('Advance Payment mode is required'),
    tax_percentage: Yup.string(),
  })

  function formatDateToYYYYMMDD(date) {
    if (!(date instanceof Date)) {
      throw new Error('Invalid date object.')
    }
    console.log(date)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    console.log(`${year}-${month}-${day}`)

    return `${year}-${month}-${day}`
  }

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
        ...(values.prescriptionId && {id: values.prescriptionId}),
      },
      inventory_items: inventoryItems,
      date: values.date,
      remarks: values.remarks,
      delivery_date: formatDateToYYYYMMDD(new Date(values.delivery_date)),
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
        if (response.status === 201) {
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
        const response = await fetchSearchedCustomers(auth.token, inputValue, selectCustomerBy)
        console.log(response.data)
        const options =
          response &&
          response.data &&
          response.data.results.map((customer) => {
            const labelValue = selectCustomerBy === 'phone' ? customer.phone : customer.email
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
            <div className='col-md-2'>
              <select
                className='form-select form-select-solid'
                data-kt-select2='true'
                data-placeholder='Select option'
                data-allow-clear='true'
                defaultValue={'phone'}
                onChange={(e) => {
                  setSelectCustomerBy(e.target.value)
                }}
              >
                <option></option>
                <option value='phone'>Phone</option>
                <option value='email'>Email</option>
              </select>
            </div>
            <div className='col-md-5'>
              <AsyncSelect
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
          <h4>Prescriptions</h4>
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

          <h4>Inventory Items</h4>
          <div className='row'>
            <div className='col-md-2'>
              <select
                className='form-select form-select-solid'
                data-kt-select2='true'
                data-placeholder='Select option'
                data-allow-clear='true'
                defaultValue={'name'}
                name='selectInventoryBy'
                onChange={(e) => {
                  setSelectCustomerBy(e.target.value)
                }}
              >
                <option value='name'>Name</option>
                <option value='sku'>Sku</option>
                <option value='type'>Type</option>
              </select>
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
                  setSelectedInventoryOption((prev) => {
                    return [...prev, selectedOption.value]
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
                      <th className='min-w-125px'>Quantity</th>
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
                            <td className='text-primary'>
                              {element.name}
                              <span className='text-muted fw-semibold text-muted d-block fs-7'>
                                {element.item_type}
                              </span>
                            </td>
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

          <div className='row'>
            <div className='form-group col-md-8'>
              <Field
                type='textArea'
                name='remarks'
                placeholder='Remarks'
                className='form-control my-2'
              />
              <ErrorMessage name='remarks' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-4'>
              <Field
                type='date'
                name='delivery_date'
                placeholder='Delivery Date'
                className='form-control my-2'
              />
              <ErrorMessage name='delivery_date' component='div' className='error-message' />
            </div>
          </div>

          <div className='row'>
            <div className='form-group col-md-4'>
              <Field
                type='number'
                name='discount'
                placeholder='Discount'
                className='form-control my-2'
              />
              <ErrorMessage name='discount' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-4'>
              <Field
                type='number'
                name='advance'
                placeholder='Advance'
                className='form-control my-2'
              />
              <ErrorMessage name='advance' component='div' className='error-message' />
            </div>
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
              {/* <Field type='text' name='advance_payment_mode' className='form-control my-2' />
              <ErrorMessage name='advance_payment_mode' component='div' className='error-message' /> */}
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-4'>
              <label htmlFor='tax_percentage'>Tax Percentage:</label>
              <Field type='number' name='tax_percentage' className='form-control my-2' />
              <ErrorMessage name='tax_percentage' component='div' className='error-message' />
            </div>
          </div>
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
