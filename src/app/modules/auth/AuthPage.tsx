import {Route, Routes} from 'react-router-dom'
import {Registration} from './components/Registration'
import {ForgotPassword} from './components/ForgotPassword'
import {ConfirmPassword} from './components/ConfirmPassword'
import {Login} from './components/Login'
import {AuthLayout} from './AuthLayout'

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path='login' element={<Login />} />
      <Route path='registration' element={<Registration />} />
      <Route path='forgot-password' element={<ForgotPassword />} />
      <Route path='reset-password/:uid/:token' element={<ConfirmPassword />} />
      <Route index element={<Login />} />
    </Route>
  </Routes>
)

export {AuthPage}
