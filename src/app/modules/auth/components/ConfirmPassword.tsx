import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link, useParams} from 'react-router-dom'
import {useFormik} from 'formik'
import {resetPasswordConfirm} from '../core/_requests'

const initialValues = {
  new_password: '',
  confirm_password: '',
}

const passwordResetSchema = Yup.object().shape({
  new_password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password cannot exceed 50 characters')
    .required('New password is required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('new_password'), ''], 'Passwords must match')
    .required('Confirm password is required'),
})

export function ConfirmPassword() {
  const [loading, setLoading] = useState(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)
  const {uid, token} = useParams<{uid: string; token: string}>()

  const formik = useFormik({
    initialValues,
    validationSchema: passwordResetSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      setHasErrors(undefined)
      setTimeout(() => {
        resetPasswordConfirm(uid, token, values.new_password, values.confirm_password)
          .then(({data: {message}}) => {
            console.log(message)
            setHasErrors(false)
            setLoading(false)
          })
          .catch(() => {
            setHasErrors(true)
            setLoading(false)
            setSubmitting(false)
            setStatus('The reset password link is invalid or has expired')
          })
      }, 1000)
    },
  })

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_password_reset_form'
      onSubmit={formik.handleSubmit}
    >
      <div className='text-center mb-10'>
        <h1 className='text-dark fw-bolder mb-3'>Reset Password</h1>
        <div className='text-gray-500 fw-semibold fs-6'>Enter your new password.</div>
      </div>

      {hasErrors === true && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>
            Sorry, there was an error. Please try again.
          </div>
        </div>
      )}

      {hasErrors === false && (
        <div className='mb-10 bg-light-info p-8 rounded'>
          <div className='text-info'>
            Password reset successful. You can now log in with your new password.
          </div>
        </div>
      )}

      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>New Password</label>
        <input
          type='password'
          autoComplete='off'
          {...formik.getFieldProps('new_password')}
          className={clsx(
            'form-control bg-transparent',
            {'is-invalid': formik.touched.new_password && formik.errors.new_password},
            {'is-valid': formik.touched.new_password && !formik.errors.new_password}
          )}
        />
        {formik.touched.new_password && formik.errors.new_password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.new_password}</span>
            </div>
          </div>
        )}
      </div>

      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Confirm Password</label>
        <input
          type='password'
          autoComplete='off'
          {...formik.getFieldProps('confirm_password')}
          className={clsx(
            'form-control bg-transparent',
            {'is-invalid': formik.touched.confirm_password && formik.errors.confirm_password},
            {'is-valid': formik.touched.confirm_password && !formik.errors.confirm_password}
          )}
        />
        {formik.touched.confirm_password && formik.errors.confirm_password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.confirm_password}</span>
            </div>
          </div>
        )}
      </div>

      <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
        <button type='submit' id='kt_password_reset_submit' className='btn btn-primary me-4'>
          <span className='indicator-label'>Submit</span>
          {loading && (
            <span className='indicator-progress'>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <Link to='/auth/login'>
          <button
            type='button'
            id='kt_login_password_reset_form_cancel_button'
            className='btn btn-light'
            disabled={formik.isSubmitting || !formik.isValid}
          >
            Cancel
          </button>
        </Link>
      </div>
    </form>
  )
}
