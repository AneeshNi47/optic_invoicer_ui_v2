import React, {useState, useEffect} from 'react'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import {useAuth} from '../../auth'
import {KTIcon} from '../../../../_metronic/helpers'
import AsyncSelect from 'react-select/async'
import Swal from 'sweetalert2'
import {toast} from 'react-toastify'
import {useCombinedContext} from '../CombinedProvider'
import {formatDate} from '../utils'
import {addWholesaleOrder, fetchSearchedInventory} from './_requests' // Make sure to import your createWholesaleOrder request function

interface AddInvoiceProps {
  handleClose: () => void
}

const AddWholesaleOrder: React.FC<AddInvoiceProps> = ({handleClose}) => {
  const {auth} = useAuth()
  const [searchInventoryInput, setSearchInventoryInput] = useState('')
  const [selectedInventoryOption, setSelectedInventoryOption] = useState<any>([])
  const [itemQuantities, setItemQuantities] = useState({})
  const [totalCost, setTotalCost] = useState(0)
  const [is_taxable, setIs_taxable] = useState(false)
  const [tax_percentage, setTaxPercentage] = useState(5)
  const {setShouldFetchInvoice} = useCombinedContext()

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
    const total = calculateTotal()
    setTotalCost(total)
  }, [selectedInventoryOption, itemQuantities, is_taxable, tax_percentage])

  const calculateTotal = () => {
    let subtotal = selectedInventoryOption.reduce((total, item) => {
      const itemTotal = item.selected_selling_price * (itemQuantities[item.id] || 1)
      return total + itemTotal
    }, 0)

    if (is_taxable) {
      return subtotal + (subtotal * tax_percentage) / 100
    } else {
      return subtotal
    }
  }

  const handleIsTaxableChange = (event, setFieldValue) => {
    const isChecked = event.target.checked
    setIs_taxable(isChecked)
    setFieldValue('is_taxable', isChecked)
  }

  const handleQuantityChange = (itemId, change) => {
    setItemQuantities((prevQuantities) => {
      const newQuantity = (prevQuantities[itemId] || 0) + change

      if (newQuantity <= 0) {
        setSelectedInventoryOption((prevOptions) =>
          prevOptions.filter((option) => option.id !== itemId)
        )
        const updatedQuantities = {...prevQuantities}
        delete updatedQuantities[itemId]
        return updatedQuantities
      } else {
        return {...prevQuantities, [itemId]: newQuantity}
      }
    })
  }

  const initialValues: any = {
    order_no: '',
    order_date: '',
    is_taxable: is_taxable,
    total_amount: '',
    total_discount: '',
    total_tax: '',
    total_payment: '',
    total_credit: '',
    payment_due_date: '',
    payment_status: '',
    order_status: '',
    remarks: '',
    created_on: '',
    updated_on: '',
    client: '',
    created_by: '',
    updated_by: '',
    organization: '',
  }

  const validationSchema = Yup.object().shape({
    order_no: Yup.string().required('Order number is required'),
    order_date: Yup.string().required('Order date is required'),
    is_taxable: Yup.boolean(),
    payment_due_date: Yup.string().required('Payment due date is required'),
    remarks: Yup.string(),
    order_status: Yup.number().required('Order status is required'),
    payment_status: Yup.number().required('Payment status is required'),
  })

  const handleSubmit = async (values) => {
    const inventoryItems = Object.entries(itemQuantities).map(([inventory_item, quantity]) => ({
      inventory_item: Number(inventory_item),
      quantity: quantity || 1,
    }))
    const orderData: any = {
      order_no: values.order_no,
      order_date: formatDate(new Date(values.order_date)),
      is_taxable: values.is_taxable,
      total_amount: totalCost.toFixed(2),
      payment_due_date: formatDate(new Date(values.payment_due_date)),
      order_status: values.order_status,
      payment_status: values.payment_status,
      remarks: values.remarks,
      inventory_items: inventoryItems,
    }

    if (auth?.token) {
      try {
        const response = await addWholesaleOrder(auth.token, orderData) // Make sure to create this function
        if (response.status === 201) {
          toast.success('Wholesale Order Added Successfully')
          setShouldFetchInvoice(true)
          handleClose()
        } else {
          toast.error('Unable to add Wholesale Order')
          handleClose()
        }
      } catch (error: any) {
        toast.error(error.response.data.error || 'Unable to add wholesale order')
        handleClose()
      }
    }
  }

  const loadOptionsInventory = async (inputValue) => {
    try {
      if (auth?.token && inputValue) {
        const response = await fetchSearchedInventory(auth.token, inputValue, 'name') // Replace 'name' with the required search field
        const options =
          response &&
          response.data &&
          response.data.results.map((inventory) => ({
            label: `${inventory.item_name}`,
            value: inventory,
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
            <div className='form-group col-md-6'>
              <Field
                type='text'
                name='order_no'
                placeholder='Order Number'
                className='form-control my-2'
              />
              <ErrorMessage name='order_no' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <Field
                type='date'
                name='order_date'
                placeholder='Order Date'
                className='form-control my-2'
              />
              <ErrorMessage name='order_date' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-check form-switch form-check-custom form-check-solid'>
              <Field
                name='is_taxable'
                class='form-check-input'
                type='checkbox'
                checked={formikProps.values.is_taxable}
                onChange={(e) => handleIsTaxableChange(e, formikProps.setFieldValue)}
              />
              <span className='toggle-slider'></span>
              <label className='form-check-label'>Taxable Order</label>
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <Field
                type='date'
                name='payment_due_date'
                placeholder='Payment Due Date'
                className='form-control my-2'
              />
              <ErrorMessage name='payment_due_date' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <Field
                type='text'
                name='remarks'
                placeholder='Remarks'
                className='form-control my-2'
              />
              <ErrorMessage name='remarks' component='div' className='error-message' />
            </div>
          </div>
          <div className='row'>
            <div className='form-group col-md-6'>
              <Field
                type='number'
                name='order_status'
                placeholder='Order Status'
                className='form-control my-2'
              />
              <ErrorMessage name='order_status' component='div' className='error-message' />
            </div>
            <div className='form-group col-md-6'>
              <Field
                type='number'
                name='payment_status'
                placeholder='Payment Status'
                className='form-control my-2'
              />
              <ErrorMessage name='payment_status' component='div' className='error-message' />
            </div>
          </div>

          <div className='row'>
            <div className='col-md-12 mt-3'>
              <AsyncSelect
                styles={{
                  option: (provided, state) => ({
                    ...provided,
                    color: 'black',
                  }),
                }}
                cacheOptions
                placeholder='Search Inventory..'
                loadOptions={(inputValue) => loadOptionsInventory(inputValue)}
                defaultOptions
                onChange={(selectedOption: any | {}) => {
                  setSelectedInventoryOption((prev) => {
                    const isAlreadySelected = prev.some(
                      (item) => item.id === selectedOption.value.id
                    )
                    if (!isAlreadySelected) {
                      return [...prev, selectedOption.value]
                    }
                    return prev
                  })
                  setItemQuantities((prevQuantities) => {
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
              <div className='table-responsive'>
                <table className='table align-middle gs-0 gy-4'>
                  <thead>
                    <tr className='fw-bold text-muted bg-light'>
                      <th className='min-w-200px'>Item name</th>
                      <th className='ps-4 min-w-125px'>Price</th>
                      {formikProps.values.is_taxable ? (
                        <th className='ps-4 min-w-125px'>Tax</th>
                      ) : (
                        ''
                      )}
                      <th className='min-w-125px'>Quantity</th>
                      <th className='min-w-80px'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInventoryOption.map((element) => {
                      const itemId = element.id

                      return (
                        <tr key={itemId}>
                          <td className='text-primary'>
                            {element.item_name}
                            <span className='text-muted fw-semibold text-muted d-block fs-7'>
                              {element.item_type}
                            </span>
                          </td>
                          <td>{element.selected_selling_price}</td>
                          {formikProps.values.is_taxable ? (
                            <td className='ps-4 min-w-125px'>
                              {element.selected_selling_price * (tax_percentage / 100)}
                            </td>
                          ) : (
                            ''
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
                </table>
              </div>
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
            <label className='form-check-label'>Taxable Order</label>
          </div>

          <div className='row mt-12'>
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

export default AddWholesaleOrder
