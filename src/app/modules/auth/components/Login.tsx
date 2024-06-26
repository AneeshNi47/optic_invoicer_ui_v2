/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import axios from 'axios'
import { getUserByToken, login } from '../core/_requests'
import { useAuth } from '../core/Auth'
import { toast } from 'react-toastify'
import { KTIcon } from '../../../../_metronic/helpers'

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Username is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

const initialValues = {
  username: '',
  password: '',
}

export function Login() {
  const [viewPassword, setViewPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { saveAuth, setCurrentUser } = useAuth()

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      try {
        const { data: auth } = await login(values.username, values.password)
        saveAuth(auth)
        const { data: user } = await getUserByToken(auth.token)
        setCurrentUser(user)
        toast.success('Logged in successfully')
      } catch (error) {
        let errorMessage = 'An error occurred'
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.data) {
            errorMessage = error.response.data.detail || error.response.data.message || 'Incorrect Credentials'
          } else {
            errorMessage = error.message
          }
        } else if (error instanceof Error) {
          errorMessage = error.message
        }
        console.log(error)
        saveAuth(undefined)
        setStatus(errorMessage)
        setSubmitting(false)
        setLoading(false)
        toast.error(errorMessage)
      }
    },
  })

  const renderErrorMessage = (field: string) => {
    return (
      formik.touched[field] &&
      formik.errors[field] && (
        <div className='fv-plugins-message-container'>
          <span role='alert'>{formik.errors[field]}</span>
        </div>
      )
    )
  }

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'
    >
      {/* begin::Form group */}
      <div className='fv-row mb-8'>
        <label className='form-label fs-6 fw-bolder text-dark'>User Name</label>
        <input
          placeholder='Username'
          {...formik.getFieldProps('username')}
          className={clsx(
            'form-control bg-transparent',
            { 'is-invalid': formik.touched.username && formik.errors.username },
            { 'is-valid': formik.touched.username && !formik.errors.username }
          )}
          type='text'
          name='username'
          autoComplete='off'
        />
        {renderErrorMessage('username')}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-3'>
        <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
        <div className='input-group'>
          <input
            type={viewPassword ? 'text' : 'password'}
            autoComplete='off'
            {...formik.getFieldProps('password')}
            className={clsx(
              'form-control bg-transparent',
              { 'is-invalid': formik.touched.password && formik.errors.password },
              { 'is-valid': formik.touched.password && !formik.errors.password }
            )}
          />
          <button
            type='button'
            className='btn btn-outline-secondary'
            onClick={() => setViewPassword(!viewPassword)}
          >
            <KTIcon iconName={viewPassword ? 'eye-off' : 'eye'} />
          </button>
        </div>
        {renderErrorMessage('password')}
      </div>
      {/* end::Form group */}

      {/* begin::Wrapper */}
      <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
        <div />

        {/* begin::Link */}
        <Link to='/auth/forgot-password' className='link-primary'>
          Forgot Password?
        </Link>
        {/* end::Link */}
      </div>
      {/* end::Wrapper */}

      {/* begin::Action */}
      <div className='d-grid mb-10'>
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-primary'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Continue</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Action */}

      <div className='text-gray-500 text-center fw-semibold fs-6'>
        Not a Member yet?{' '}
        <Link to='/auth/registration' className='link-primary'>
          Sign up
        </Link>
      </div>
    </form>
  )
}
