/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect, useRef} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../../_metronic/helpers'
import {Dropdown1} from '../../../../_metronic/partials'
import {useAuth} from '../../auth'
import {getCustomerItems} from './_requests'
import {CustomerDetailsModal} from '../../../../_metronic/partials/modals/create-invoice/CustomerDetailsModal'
import {toast} from 'react-toastify'

// import { InventoryItem, InventoryItems } from './_models';

type Props = {
  className: string
}

const CustomerTable: React.FC<Props> = ({className}) => {
  const {auth} = useAuth()
  const [customerItems, setCustomerItems] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [dataToDisplay, setDataToDisplay] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState<any>({})

  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleOpenModal = (values) => {
    setShowModal(true)
    setModalContent(values)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const fetchInventoryData = async () => {
    if (auth?.token) {
      setLoading(true)
      try {
        const responseData = await getCustomerItems(auth.token, customerItems.next, 5)
        setCustomerItems((prev: any) => ({
          ...prev,
          ...responseData.data,
        }))
        setDataToDisplay((prev: any) => [...prev, ...responseData.data.results])
      } catch (error: any) {
        toast.error(error.response.data.error)
        console.error('Error fetching data:', error)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventoryData()
  }, [auth?.token])

  useEffect(() => {
    const SCROLL_THRESHOLD = 10
    const handleScroll = () => {
      const isScrollingDown =
        containerRef.current &&
        containerRef.current.scrollTop + containerRef.current.clientHeight >=
          containerRef.current.scrollHeight - SCROLL_THRESHOLD
      if (isScrollingDown && !loading && customerItems.next) {
        fetchInventoryData()
      }
    }

    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll)
      }
    }
  }, [auth?.token, loading])

  return (
    <div className={`card ${className}`}>
      <CustomerDetailsModal
        show={showModal}
        handleClose={handleCloseModal}
        modalContent={modalContent}
      />

      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Latest Arrivals</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>More than 100 new products</span>
        </h3>
        <div className='card-toolbar'>
          {/* begin::Menu */}
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTIcon iconName='category' className='fs-2' />
          </button>
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTIcon iconName='plus' className='fs-2' />
          </button>
          <Dropdown1 />
          {/* end::Menu */}
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div
          className='table-responsive'
          style={{overflowY: 'auto', maxHeight: '450px'}}
          ref={containerRef}
        >
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-5'>
            {/* begin::Table head */}
            <thead>
              <tr>
                <th className='p-0 min-w-100px'></th>
                <th className='p-0 min-w-100px'>
                  <h4>Name</h4>
                </th>
                <th className='p-0 min-w-100px'>
                  <h4>Phone</h4>
                </th>
                <th className='p-0 min-w-125px'>
                  <h4>Is Active</h4>
                </th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {customerItems.results &&
                dataToDisplay.map((item, index) => (
                  <tr key={index}>
                    <td
                      onClick={() => {
                        handleOpenModal(item)
                      }}
                    >
                      <div className='symbol symbol-50px me-2'>
                        <span className='symbol-label'>
                          <img
                            src={
                              item.gender === 'M'
                                ? toAbsoluteUrl('/media/svg/avatars/001-boy.svg')
                                : item.gender === 'F'
                                ? toAbsoluteUrl('/media/svg/avatars/002-girl.svg')
                                : toAbsoluteUrl('/media/svg/avatars/blank.svg')
                            }
                            className='h-50 align-self-center hover-primary'
                            alt=''
                          />
                        </span>
                      </div>
                    </td>
                    <td>
                      <a
                        href='#'
                        className='text-dark fw-bold text-hover-primary mb-1 fs-6'
                        onClick={() => {
                          handleOpenModal(item)
                        }}
                      >
                        {item.first_name + ' ' + item.last_name}
                      </a>
                      <span className='text-muted fw-semibold d-block fs-7'>{item.email}</span>
                    </td>
                    <td className='text-start'>
                      <span className='badge badge-light-danger fw-semibold me-1'>
                        <h5>{item.phone}</h5>
                      </span>
                    </td>
                    <td className='text-start'>
                      <span className='text-muted fw-semibold'>
                        {item.is_active ? (
                          <h5 className='text-success'>Active</h5>
                        ) : (
                          <h5 className='text-danger'>Not Active</h5>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
            {/* end::Table body */}
          </table>
          <div style={{height: '10px'}} />
          {loading && <p>Loading...</p>}
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export {CustomerTable}
