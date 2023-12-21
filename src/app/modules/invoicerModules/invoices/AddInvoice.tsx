import React, {SetStateAction, useState} from 'react'
import {Formik, Field, Form, ErrorMessage, useFormik, validateYupSchema} from 'formik'
import * as Yup from 'yup'
import {InvoiceModel} from './_models'
// import { addInventory } from './_requests';
import {useAuth} from '../../auth'
import {KTIcon} from '../../../../_metronic/helpers'
import {addInvoiceService} from './_requests'
import {InventoryItem} from './_models'

interface AddInvoiceProps {
  //   onSubmit: (formData: InvoiceModel) => void;
}

const AddInvoice: React.FC<AddInvoiceProps> = () => {
  const [materialDetails, setMaterialDetails] = useState<
    Array<{
      inventory_item: number
      quantity: number
    }>
  >([])
  const [showTable, setShowTable] = useState(true) // Control table visibility
  const [materialDetailsError, setMaterialDetailsError] = useState(false)
  const [currentlyEditedMaterial, setCurrentlyEditedMaterial] = useState(null)

  const initialValue = {
    inventory_item: 0,
    quantity: 0,
  }

  const validationSchem = Yup.object({
    inventory_item: Yup.number()
      .typeError('Inventory item must be a number')
      .positive('Inventory item must be a positive number')
      .required('Inventory item is required'),
    quantity: Yup.number()
      .typeError('Quantity must be a number')
      .positive('Quantity must be a positive number')
      .required('Quantity is required'),
  })

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchem,
    onSubmit: () => {
      // Handle form submission here
      console.log('Form values:', formik.values)

      // Create a new material object from the form values
      const newMaterial = {
        inventory_item: formik.values.inventory_item,
        quantity: formik.values.quantity,
      }

      // Add the new material to the array
      setMaterialDetails((prevDetails) => [...prevDetails, newMaterial])

      // Reset the form
      formik.resetForm()

      // Show the table after adding the first material
      setShowTable(true)
    },
  })

  const handleAddMaterial = () => {
    formik.validateForm().then(() => {
      if (formik.isValid) {
        formik.handleSubmit()
      } else {
        // Editing an existing material
        const updatedMaterial = {
          inventory_item: formik.values.inventory_item,
          quantity: formik.values.quantity,
        }
        const updatedMaterialDetails = materialDetails.map((material, index) =>
          index === currentlyEditedMaterial ? updatedMaterial : material
        )
        setMaterialDetails(updatedMaterialDetails)
        formik.resetForm()
        setCurrentlyEditedMaterial(null)
      }
    })
  }
  const handleEditMaterial = (index) => {
    // Set the currently edited material and populate the form fields
    setCurrentlyEditedMaterial(index)
    const editedMaterial = materialDetails[index]
    formik.setValues({
      inventory_item: editedMaterial.inventory_item,
      quantity: editedMaterial.quantity,
    })
  }

  const handleRemoveMaterial = (index) => {
    const updatedMaterialData = [...materialDetails]
    updatedMaterialData.splice(index, 1)
    setMaterialDetails(updatedMaterialData)
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
    left_sphere: Yup.number().required('Left Sphere is required'),
    right_sphere: Yup.number().required('Right Sphere is required'),
    left_cylinder: Yup.number().required('Left Cylinder is required'),
    right_cylinder: Yup.number().required('Right Cylinder is required'),
    left_axis: Yup.number().required('Left Axis is required'),
    right_axis: Yup.number().required('Right Axis is required'),
    left_prism: Yup.number().required('Left Prism is required'),
    right_prism: Yup.number().required('Right Prism is required'),
    left_add: Yup.number().required('Left Add is required'),
    right_add: Yup.number().required('Right Add is required'),
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
    const dataTosend: any = {
      customer: {
        phone: values.phone,
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        gender: values.gender,
      },
      prescription: {
        left_sphere: +values.left_sphere,
        right_sphere: +values.right_sphere,
        left_cylinder: +values.left_cylinder,
        right_cylinder: +values.right_cylinder,
        left_axis: +values.left_axis,
        right_axis: +values.right_axis,
        left_prism: +values.left_prism,
        right_prism: +values.right_prism,
        left_add: +values.left_add,
        right_add: +values.right_add,
        left_ipd: +values.left_ipd,
        right_ipd: +values.right_ipd,
        pupillary_distance: +values.pupillary_distance,
        additional_notes: values.additional_notes,
      },
      inventory_items: materialDetails,
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
      const response = await addInvoiceService(auth?.token, dataTosend)
      console.log(response)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <h4>Customer Details:</h4>
        <div className='row'>
          <div className='form-group col-md-4'>
            <label htmlFor='phone'>Phone:</label>
            <Field type='text' name='phone' className='form-control my-2' />
            <ErrorMessage name='phone' component='div' className='error-message' />
          </div>
          <div className='form-group col-md-4'>
            <label htmlFor='email'>Email:</label>
            <Field type='text' name='email' className='form-control my-2' />
            <ErrorMessage name='email' component='div' className='error-message' />
          </div>
          <div className='form-group col-md-4'>
            <label htmlFor='first_name'>First Name:</label>
            <Field type='text' name='first_name' className='form-control my-2' />
            <ErrorMessage name='first_name' component='div' className='error-message' />
          </div>
        </div>

        <div className='row'>
          <div className='form-group col-md-4'>
            <label htmlFor='last_name'>Last Name:</label>
            <Field type='text' name='last_name' className='form-control my-2' />
            <ErrorMessage name='last_name' component='div' className='error-message' />
          </div>
          <div className='form-group col-md-4'>
            <label htmlFor='gender'>Gender:</label>
            <Field as='select' name='gender' className='form-control my-2'>
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
            <label htmlFor='left_sphere'>Left sphere:</label>
            <Field type='number' name='left_sphere' className='form-control my-2' />
            <ErrorMessage name='left_sphere' component='div' className='error-message' />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='right_sphere'>Right Sphere:</label>
            <Field type='number' name='right_sphere' className='form-control my-2' />
            <ErrorMessage name='right_sphere' component='div' className='error-message' />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='left_cylinder'>Left Cylinder:</label>
            <Field type='number' name='left_cylinder' className='form-control my-2' />
            <ErrorMessage name='left_cylinder' component='div' className='error-message' />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='right_cylinder'>Right Cylinder:</label>
            <Field type='number' name='right_cylinder' className='form-control my-2' />
            <ErrorMessage name='right_cylinder' component='div' className='error-message' />
          </div>
        </div>
        <div className='row'>
          <div className='form-group col-md-3'>
            <label htmlFor='left_axis'>Left Axis:</label>
            <Field type='number' name='left_axis' className='form-control my-2' />
            <ErrorMessage name='left_axis' component='div' className='error-message' />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='right_axis'>Right Axis:</label>
            <Field type='number' name='right_axis' className='form-control my-2' />
            <ErrorMessage name='right_axis' component='div' className='error-message' />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='left_prism'>Left Prism:</label>
            <Field type='number' name='left_prism' className='form-control my-2' />
            <ErrorMessage name='left_prism' component='div' className='error-message' />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='right_prism'>Right Prism:</label>
            <Field type='number' name='right_prism' className='form-control my-2' />
            <ErrorMessage name='right_prism' component='div' className='error-message' />
          </div>
        </div>
        <div className='row'>
          <div className='form-group col-md-3'>
            <label htmlFor='left_add'>Left Add:</label>
            <Field type='number' name='left_add' className='form-control my-2' />
            <ErrorMessage name='left_add' component='div' className='error-message' />
          </div>
          <div className='form-group col-md-3'>
            <label htmlFor='right_add'>Right Add:</label>
            <Field type='number' name='right_add' className='form-control my-2' />
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

        <div className=' border border-secondary p-5 mt-5'>
          <h4 className='mb-3'>Inventory Details</h4>
          {showTable && materialDetails.length > 0 && (
            <div>
              <h5 className='mb-3 text-center'>Added Materials</h5>
              <table className='table table-bordered'>
                <thead>
                  <tr>
                    <th>Inventory Item</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {materialDetails.map((material, index) => (
                    <tr key={index}>
                      <td>{material.inventory_item}</td>
                      <td>{material.quantity}</td>
                      <td>
                        <div className='d-flex align-items-center list-user-action'>
                          {/* <span
                                                  data-placement="top"
                                                  data-toggle="tooltip"
                                                  title="Edit"
                                                >
                                                  <a  onClick={() =>
                                                      handleEditMaterial(
                                                        index
                                                      )
                                                    }>
                                                  <KTIcon iconName='pencil' className='fs-3'/>
                                                    
                                                  </a>
                                                </span> */}
                          <span data-placement='top' data-toggle='tooltip' title='remove'>
                            <a onClick={() => handleRemoveMaterial(index)}>
                              <KTIcon iconName='trash' className='fs-3' />
                            </a>
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {materialDetailsError && <div className='text-danger'>Material Details is required</div>}

          <div className='material-details'>
            <form noValidate onSubmit={formik.handleSubmit}>
              <div className='row'>
                <div className='form-group col-sm-6'>
                  <label>Inventory Item:</label>
                  <input
                    type='number'
                    className='form-control'
                    name='inventory_item'
                    placeholder='Enter Inventory item'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.inventory_item}
                  />
                  {formik.touched.inventory_item && formik.errors.inventory_item && (
                    <div className='text-danger'>{formik.errors.inventory_item}</div>
                  )}
                </div>
                <div className='form-group col-sm-6'>
                  <label>Quantity:</label>
                  <input
                    type='number'
                    className='form-control'
                    name='quantity'
                    placeholder='Enter Quantity'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.quantity}
                  />
                  {formik.touched.quantity && formik.errors.quantity && (
                    <div className='text-danger'>{formik.errors.quantity}</div>
                  )}
                </div>
              </div>

              <div className='row'>
                <div className='form-group col-sm-12'>
                  <button
                    type='button'
                    className='btn btn-warning p-1 my-2'
                    onClick={handleAddMaterial}
                  >
                    Add More
                  </button>
                </div>
              </div>
            </form>
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
    </Formik>
  )
}

export default AddInvoice
