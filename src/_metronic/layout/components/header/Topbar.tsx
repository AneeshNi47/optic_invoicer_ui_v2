/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useState} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import {ThemeModeSwitcher} from '../../../partials'
import {CreateInvoiceModal} from '../../../partials'
import {useAuth} from '../../../../app/modules/auth'
import {HeaderUserMenu} from '../../../partials'

const Topbar: FC = () => {
  const [showModal, setShowModal] = useState(false)
  const [modal, setModal] = useState('')
  const {currentUser} = useAuth()

  const handleOpenModal = (modalValue) => {
    setModal(modalValue)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <div className='d-flex flex-shrink-0'>
      <CreateInvoiceModal show={showModal} handleClose={handleCloseModal} modalName={`${modal}`} />
      {/* begin::Invite user */}

      {currentUser?.user_type === 'staff' && (
        <>
          <div className='d-flex ms-3'>
            <button
              className='btn btn-flex flex-center bg-body btn-color-gray-700 btn-active-color-primary w-40px w-md-auto h-40px px-0 px-md-6'
              onClick={() => {
                handleOpenModal('invoice')
              }}
            >
              <KTIcon iconName='plus' className='fs-2 text-primary me-0 me-md-2' />
              <span className='d-none d-md-inline'>New Invoice</span>
            </button>
          </div>
          <div className='d-flex ms-3'>
            <button
              className='btn btn-flex flex-center bg-body btn-color-gray-700 btn-active-color-primary w-40px w-md-auto h-40px px-0 px-md-6'
              onClick={() => {
                handleOpenModal('inventory')
              }}
            >
              <KTIcon iconName='plus' className='fs-2 text-primary me-0 me-md-2' />
              <span className='d-none d-md-inline'>New Inventory</span>
            </button>
          </div>
        </>
      )}

      {currentUser?.user_type === 'admin' && (
        <>
          <div className='d-flex ms-3'>
            <button
              className='btn btn-flex flex-center bg-body btn-color-gray-700 btn-active-color-primary w-40px w-md-auto h-40px px-0 px-md-6'
              onClick={() => {
                handleOpenModal('admin')
              }}
            >
              <KTIcon iconName='plus' className='fs-2 text-primary me-0 me-md-2' />
              <span className='d-none d-md-inline'>New Organization</span>
            </button>
          </div>
        </>
      )}
      {/* end::Invite user */}

      {/* begin::Theme mode */}
      <div className='d-flex align-items-center  ms-3'>
        <ThemeModeSwitcher toggleBtnClass=' flex-center bg-body btn-color-gray-600 btn-active-color-primary h-40px' />
      </div>
      {/* end::Theme mode */}

      {/* CHAT */}
      <div className='d-flex align-items-center ms-3'>
        {/* begin::Menu wrapper */}
        <div
          className='btn btn-icon btn-primary w-40px h-40px pulse pulse-white'
          id='kt_drawer_chat_toggle'
        >
          <KTIcon iconName='message-text-2' className='fs-2' />
          <span className='pulse-ring' />
        </div>
        {/* end::Menu wrapper */}
      </div>

      {/* begin::User */}
      <div className='d-flex align-items-center ms-3' id='kt_header_user_menu_toggle'>
        {/* begin::Menu wrapper */}
        <div
          className='cursor-pointer symbol symbol-40px'
          data-kt-menu-trigger='click'
          data-kt-menu-overflow='false'
          data-kt-menu-placement='top-start'
          title='User profile'
        >
          <img src={toAbsoluteUrl('/media/avatars/300-1.jpg')} alt='avatar' />
        </div>
        {/* end::Menu wrapper */}
        <HeaderUserMenu />
      </div>
      {/* end::User */}
    </div>
  )
}

export {Topbar}
