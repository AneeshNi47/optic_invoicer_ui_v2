/* eslint-disable jsx-a11y/anchor-is-valid */
import {useState} from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useFormik} from 'formik'
import {getUserByToken, login} from '../core/_requests'
import {useAuth} from '../core/Auth'

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
  username: 'test_org1_user1',
  password: 'qwerty654',
}

export function Login() {
  const [loading, setLoading] = useState(false)
  const {saveAuth, setCurrentUser} = useAuth()

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        const {data: auth} = await login(values.username, values.password)
        saveAuth(auth)
        const {data: user} = await getUserByToken(auth.token)
        console.log(user)
        setCurrentUser(user)
      } catch (error) {
        console.error(error)
        saveAuth(undefined)
        setStatus('The login details are incorrect')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

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
            {'is-invalid': formik.touched.username && formik.errors.username},
            {
              'is-valid': formik.touched.username && !formik.errors.username,
            }
          )}
          type='text'
          name='username'
          autoComplete='off'
        />
        {formik.touched.username && formik.errors.username && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.username}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-3'>
        <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
        <input
          type='password'
          autoComplete='off'
          {...formik.getFieldProps('password')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.password && formik.errors.password,
            },
            {
              'is-valid': formik.touched.password && !formik.errors.password,
            }
          )}
        />
        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Wrapper */}
      <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
        <div />

        {/* begin::Link */}
        <Link to='/auth/forgot-password' className='link-primary'>
          Forgot Password ?
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
            <span className='indicator-progress' style={{display: 'block'}}>
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
