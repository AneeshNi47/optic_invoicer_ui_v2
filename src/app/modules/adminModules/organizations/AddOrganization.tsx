import React, {useState} from 'react'
import {Formik, Field, Form, ErrorMessage, FieldArray} from 'formik'
import * as Yup from 'yup'
import {useAuth} from '../../auth'
import {addOrganisation} from './_requests'
import {toast} from 'react-toastify'
import {useInventoryContext} from '../../invoicerModules/inventory/InventoryProvider'

interface AddInventoryProps {
  handleClose: () => void
  //   onSubmit: (formData: AddInventoryItem) => void;
}
const AddInventory: React.FC<AddInventoryProps> = (handleClose) => {
  const {setShouldFetchOrganisation} = useInventoryContext()
  const [phoneExtension, setPhoneExtension] = useState('+971')

  const {auth} = useAuth()
  interface InitialValues {
    org_name: string
    org_address_first_line: string
    org_email: string
    org_secondary_email: string
    org_primary_phone_mobile: string
    org_other_contact_numbers: string
    org_phone_landline: string
    org_logo: string
    org_translation_required: boolean
    org_country: string
    org_city: string
    org_post_box_number: string
    org_services: string[]
    org_is_active: boolean
    staff_first_name: string
    staff_last_name: string
    staff_designation: string
    staff_phone: string
    staff_email: string
    staff_superuser: boolean
    staff_username: string
    staff_password: string
    staff_confirm_password: string
  }
  const initialValues: InitialValues = {
    org_name: '',
    org_address_first_line: '',
    org_email: '',
    org_secondary_email: '',
    org_primary_phone_mobile: '',
    org_other_contact_numbers: '',
    org_phone_landline: '',
    org_logo: '',
    org_translation_required: false,
    org_country: 'United Arab Emirates',
    org_city: '',
    org_post_box_number: '',
    org_services: [],
    org_is_active: true,
    staff_first_name: '',
    staff_last_name: '',
    staff_designation: '',
    staff_phone: '',
    staff_email: '',
    staff_superuser: true,
    staff_username: '',
    staff_password: '',
    staff_confirm_password: '',
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/

  const validationSchema = Yup.object({
    org_name: Yup.string().required('Organisation name Required'),
    org_address_first_line: Yup.string().required('Organisaation address Required'),
    org_email: Yup.string().required('Organisation email Required'),
    org_secondary_email: Yup.string().required('Organisation secondory email Required'),
    org_primary_phone_mobile: Yup.string().required('Phone number required'),
    org_other_contact_numbers: Yup.string().required('Secondory contact required'),
    org_phone_landline: Yup.string().required('Organisation landline required'),
    // org_logo: Yup.string().required('Logo is required'),
    org_translation_required: Yup.boolean().required('Required'),
    org_country: Yup.string().required('Country is required'),
    org_city: Yup.string().required('City is required'),
    org_post_box_number: Yup.string().required('Post box number is required'),
    org_services: Yup.array()
      .of(Yup.string().required('Service name is required'))
      .min(1, 'At least one service is required'),
    org_is_active: Yup.string().required('Active state is required'),
    staff_first_name: Yup.string().required('Staff first name is required'),
    staff_last_name: Yup.string().required('Staff last name is required'),
    staff_designation: Yup.string().required('Staff designation is required'),
    staff_phone: Yup.string().required('Staff phone is required'),
    staff_email: Yup.string().required('Staff email is required'),
    staff_superuser: Yup.boolean().required('Super staff state is required'),
    staff_username: Yup.string().required('username is required'),
    // staff_password: Yup.string()
    //   .required('Password is required')
    //   .matches(
    //     passwordRegex,
    //     'Password must be at least 8 characters long, contain at least one letter, and one number'
    //   ),
    // staff_confirm_password: Yup.string()
    //   .required('Confirm password is required')
    //   .oneOf([Yup.ref('staff_password'), ''], 'Passwords must match'),
  })

  const handleSubmit = async (values: InitialValues) => {
    const dataTosend = {
      organization: {
        name: values.org_name,
        address_first_line: values.org_address_first_line,
        email: values.org_email,
        secondary_email: values.org_secondary_email,
        primary_phone_mobile: values.org_primary_phone_mobile,
        other_contact_numbers: values.org_other_contact_numbers,
        phone_landline: values.org_phone_landline,
        logo: null,
        translation_required: values.org_translation_required,
        country: values.org_country,
        city: values.org_city,
        post_box_number: values.org_post_box_number,
        services: values.org_services.join(', '),
        is_active: values.org_is_active,
      },
      staff: {
        first_name: values.staff_first_name,
        last_name: values.staff_last_name,
        designation: values.staff_designation,
        phone: values.staff_phone,
        email: values.staff_email,
        staff_superuser: values.staff_superuser,
        user: {
          username: values.staff_username,
          password: values.staff_password,
        },
      },
    }
    if (auth?.token) {
      try {
        const response = await addOrganisation(auth?.token, dataTosend)
        console.log(response)
        if (response && response.status === 201) {
          toast.success('Organization added successfully!')
          setShouldFetchOrganisation(true)
          handleClose.handleClose()
        } else {
          toast.error('Failed to add organization. Please try again.')
          handleClose.handleClose()
        }
      } catch (error: any) {
        toast.error(error.response.data.error)
        handleClose.handleClose()
      }
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({values, errors, touched}) => {
        return (
          <Form>
            {/* Organization Section */}
            <h2 className='my-2'>Organisation Details</h2>
            <div className='row mt-2'>
              <div className='form-group col-md-6'>
                <Field
                  type='text'
                  name='org_name'
                  placeholder='Organization Name'
                  className='form-control my-2'
                />
                <ErrorMessage name='org_name' component='div' className='error-message' />
              </div>
              <div className='form-group col-md-6'>
                <Field
                  type='text'
                  placeholder='Address Line 1'
                  name='org_address_first_line'
                  className='form-control my-2'
                />
                <ErrorMessage
                  name='org_address_first_line'
                  component='div'
                  className='error-message'
                />
              </div>
            </div>
            <div className='row mt-2'>
              <div className='form-group col-md-6'>
                <Field
                  type='text'
                  name='org_email'
                  placeholder='Organization Email'
                  className='form-control my-2'
                />
                <ErrorMessage name='org_email' component='div' className='error-message' />
              </div>
              <div className='form-group col-md-6'>
                <Field
                  type='text'
                  name='org_secondary_email'
                  placeholder='Organization Secondary Email'
                  className='form-control my-2'
                />
                <ErrorMessage
                  name='org_secondary_email'
                  component='div'
                  className='error-message'
                />
              </div>
            </div>
            <div className='row mt-2'>
              <div className='form-group col-md-6'>
                <Field
                  type='text'
                  name='org_primary_phone_mobile'
                  placeholder='Organization Phone'
                  className='form-control my-2'
                />
                <ErrorMessage
                  name='org_primary_phone_mobile'
                  component='div'
                  className='error-message'
                />
              </div>
              <div className='form-group col-md-6'>
                <Field
                  type='text'
                  name='org_other_contact_numbers'
                  placeholder='Organization Phone 2'
                  className='form-control my-2'
                />
                <ErrorMessage
                  name='org_other_contact_numbers'
                  component='div'
                  className='error-message'
                />
              </div>
            </div>
            <div className='row mt-2'>
              <div className='form-group col-md-6'>
                <Field
                  type='text'
                  name='org_phone_landline'
                  placeholder='Organization Landline'
                  className='form-control my-2'
                />
                <ErrorMessage name='org_phone_landline' component='div' className='error-message' />
              </div>
              {/* <div className='form-group col-md-6'>
              <Field type='file' name='org_logo' className='form-control my-2' />
              <ErrorMessage name='org_logo' component='div' className='error-message' />
            </div> */}
            </div>
            <div className='row mt-2'>
              <div className='form-group col-md-6'>
                <Field
                  type='text'
                  name='org_city'
                  placeholder='City'
                  className='form-control my-2'
                />
                <ErrorMessage name='org_city' component='div' className='error-message' />
              </div>
              <div className='form-group col-md-6'>
                <Field
                  type='text'
                  name='org_post_box_number'
                  placeholder='PO Box'
                  className='form-control my-2'
                />
                <ErrorMessage
                  name='org_post_box_number'
                  component='div'
                  className='error-message'
                />
              </div>
            </div>
            <div className='row mt-2'>
              <div className='form-group col-md-6'>
                <select name='org_country' placeholder='Country' className='form-control my-2'>
                  <option key='India' value='India'>
                    India
                  </option>
                  <option key='United Arab Emirates' value='United Arab Emirate'>
                    United Arab Emirates
                  </option>
                  <option key='Canada' value='Canada'>
                    Canada
                  </option>
                </select>
                <ErrorMessage name='org_country' component='div' className='error-message' />
              </div>
            </div>
            {/* Services Section */}
            <label className='my-2'>Services</label>
            <FieldArray name='org_services'>
              {({push, remove}) => (
                <div className='border border-secondory p-2'>
                  {values.org_services.map((service, index) => (
                    <div key={index} className='row mt-2'>
                      <div className='form-group col-md-6'>
                        <label htmlFor={`org_services.${index}`}>Service Name:</label>
                        <Field
                          type='text'
                          name={`org_services.${index}`}
                          className='form-control mt-2'
                        />
                        <ErrorMessage
                          name={`org_services.${index}`}
                          component='div'
                          className='error-message'
                        />
                      </div>
                      <div className='col-md-6 mt-2 d-flex align-items-end'>
                        <button
                          type='button'
                          onClick={() => remove(index)}
                          className='btn btn-danger'
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className='row mt-2'>
                    <div className='col-md-12'>
                      <button type='button' onClick={() => push('')} className='btn btn-primary'>
                        Add Service
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </FieldArray>
            <div className='row mt-2'>
              <div className='form-group col-md-6'>
                <label htmlFor='org_translation_required'>Translation Required:</label>
                <Field
                  type='checkbox'
                  name='org_translation_required'
                  className='form-check my-2'
                />
                <ErrorMessage
                  name='org_translation_required'
                  component='div'
                  className='error-message'
                />
              </div>
              {/* <div className='form-group col-md-6'>
              <label htmlFor='org_is_active'>Active:</label>
              <Field type='checkbox' name='org_is_active' className='form-check my-2' />
              <ErrorMessage name='org_is_active' component='div' className='error-message' />
            </div> */}
            </div>
            <h2 className='my-2'>Staff Details</h2>

            {/* Staff Section */}
            <div className='row mt-2'>
              <div className='form-group col-md-6'>
                <Field
                  type='text'
                  name='staff_first_name'
                  placeholder='First Name'
                  className='form-control my-2'
                />
                <ErrorMessage name='staff_first_name' component='div' className='error-message' />
              </div>
              <div className='form-group col-md-6'>
                <Field
                  type='text'
                  name='staff_last_name'
                  placeholder='Last Name'
                  className='form-control my-2'
                />
                <ErrorMessage name='staff_last_name' component='div' className='error-message' />
              </div>
            </div>
            <div className='row mt-2'>
              <div className='form-group col-md-6'>
                <Field
                  type='text'
                  name='staff_email'
                  placeholder='Email'
                  className='form-control my-2'
                />
                <ErrorMessage name='staff_email' component='div' className='error-message' />
              </div>

              <div className='form-group col-md-6' style={{display: 'flex', alignItems: 'center'}}>
                <div style={{marginRight: '5px', fontSize: '16px'}}>{phoneExtension}</div>
                <Field
                  type='text'
                  name='staff_phone'
                  placeholder='Phone'
                  className='form-control my-2'
                />
                <ErrorMessage name='staff_phone' component='div' className='error-message' />
              </div>
            </div>
            <div className='row mt-2'>
              <div className='form-group col-md-12'>
                <Field
                  type='text'
                  name='staff_designation'
                  placeholder='Designation'
                  className='form-control my-2'
                />
                <ErrorMessage name='staff_designation' component='div' className='error-message' />
              </div>
              {/* <div className='form-group col-md-6'>
              <label htmlFor='staff_superuser'>Superuser:</label>
              <Field type='checkbox' name='staff_superuser' className='form-check my-2' />
              <ErrorMessage name='staff_superuser' component='div' className='error-message' />
            </div> */}
            </div>
            <div className='row mt-2'>
              <div className='form-group col-md-12'>
                <Field
                  type='text'
                  name='staff_username'
                  placeholder='Username'
                  className='form-control my-2'
                />
                <ErrorMessage name='staff_username' component='div' className='error-message' />
              </div>
            </div>
            {/* <div className='row mt-2'>
              <div className='form-group col-md-6'>
                <Field
                  type='password'
                  name='staff_password'
                  placeholder='Password'
                  className='form-control my-2'
                />
                <ErrorMessage name='staff_password' component='div' className='error-message' />
              </div>
              <div className='form-group col-md-6'>
                <Field
                  type='password'
                  name='staff_confirm_password'
                  placeholder='Confirm Password'
                  className='form-control my-2'
                />
                <ErrorMessage
                  name='staff_confirm_password'
                  component='div'
                  className='error-message'
                />
              </div>
            </div> */}
            {/* Submit Button */}
            <div className='row mt-2 mt-5'>
              <div className='form-group col-md-12 d-flex justify-content-center'>
                <button type='submit' className='btn btn-primary'>
                  Submit
                </button>
              </div>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

export default AddInventory
