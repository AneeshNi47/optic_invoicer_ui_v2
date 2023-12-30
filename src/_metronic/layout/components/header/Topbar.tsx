/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useState} from 'react'
import {KTIcon} from '../../../helpers'
import {ThemeModeSwitcher} from '../../../partials'
import {CreateInvoiceModal} from '../../../partials'
import {SelectLocationModal} from '../../../partials'
import AddInventory from '../../../../app/modules/invoicerModules/inventory/AddInventory'
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../../app/modules/auth'

const Topbar: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState('');
  const {currentUser} = useAuth()
  console.log(currentUser)

  const handleOpenModal = (modalValue) => {
    setModal(modalValue)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <div className='d-flex flex-shrink-0'>
      <CreateInvoiceModal
        show={showModal}
        handleClose={handleCloseModal}
        modalName={`${modal}`}
      />
      {/* begin::Invite user */}

      {currentUser?.user_type == "staff" &&
      <>
      <div className='d-flex ms-3'>
        <button
          className='btn btn-flex flex-center bg-body btn-color-gray-700 btn-active-color-primary w-40px w-md-auto h-40px px-0 px-md-6'
          onClick={() => {
            handleOpenModal("invoice")
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
            handleOpenModal("inventory")
          }}
        >
          <KTIcon iconName='plus' className='fs-2 text-primary me-0 me-md-2' />
          <span className='d-none d-md-inline'>New Inventory</span>
        </button>
      </div>
      </>
      }

      {currentUser?.user_type == "admin" &&
      <>
      <div className='d-flex ms-3'>
        <button
          className='btn btn-flex flex-center bg-body btn-color-gray-700 btn-active-color-primary w-40px w-md-auto h-40px px-0 px-md-6'
          onClick={() => {
            handleOpenModal("admin")
          }}
        >
          <KTIcon iconName='plus' className='fs-2 text-primary me-0 me-md-2' />
          <span className='d-none d-md-inline'>New Organisation</span>
        </button>
      </div>
      </>
      }
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
    </div>
  )
}

export {Topbar}
