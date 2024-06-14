/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect, useRef} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../../_metronic/helpers'
import {Dropdown1} from '../../../../_metronic/partials'
import {useAuth} from '../../auth'
import {getWholesaleVendorItems} from './_requests'
import {WholeSaleVendorItems, WholeSaleVendorItem} from './_models'
import {toast} from 'react-toastify'
import {CreateInvoiceModal} from '../../../../_metronic/partials'

import {useCombinedContext} from '../CombinedProvider'

type Props = {
  className: string
}

const WholesaleVendorTable: React.FC<Props> = ({className}) => {
  const {auth} = useAuth()
  const [vendorItems, setVendorItems] = useState<WholeSaleVendorItems | any>({})
  const [showModal, setShowModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [modalContent, setModalContent] = useState<WholeSaleVendorItem | any>({})
  const [loading, setLoading] = useState(false)
  const [dataToDisplay, setDataToDisplay] = useState<WholeSaleVendorItem[] | any[]>([])
  const [initialLoad, setInitialLoad] = useState<boolean>(true)

  const {shouldFetchVendor, setShouldFetchVendor} = useCombinedContext()

  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleOpenModal = (values) => {
    setShowModal(true)
    setModalContent(values)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleOpenAddModal = (modalValue) => {
    setAddModal(modalValue)
    setShowAddModal(true)
  }

  const handleCloseAddModal = () => {
    setShowAddModal(false)
  }

  const fetchVendorData = async () => {
    if (auth?.token) {
      setLoading(true)
      try {
        const responseData = await getWholesaleVendorItems(
          auth.token,
          vendorItems.next,
          5,
          shouldFetchVendor
        )
        setVendorItems((prev: any) => ({
          ...prev,
          ...responseData.data,
        }))
        setLoading(false)

        setDataToDisplay((prev: any) => [...prev, ...responseData.data.results])
      } catch (error: any) {
        toast.error(error.response.data.error)
        console.error('Error fetching data:', error)
      }
    }
  }

  useEffect(() => {
    if (initialLoad || shouldFetchVendor) {
      setDataToDisplay([])
      fetchVendorData()
      setShouldFetchVendor(false)
      setInitialLoad(false)
    }
  }, [auth?.token, shouldFetchVendor, initialLoad])

  useEffect(() => {
    const SCROLL_THRESHOLD = 10 // Adjust the threshold as needed

    const handleScroll = () => {
      const isScrollingUp =
        containerRef.current && containerRef.current.scrollTop <= SCROLL_THRESHOLD
      const isScrollingDown =
        containerRef.current &&
        containerRef.current.scrollTop + containerRef.current.clientHeight >=
          containerRef.current.scrollHeight - SCROLL_THRESHOLD

      if (isScrollingDown && !loading && vendorItems.next) {
        fetchVendorData()
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
      <CreateInvoiceModal
        show={showAddModal}
        handleClose={handleCloseAddModal}
        modalName={`${addModal}`}
      />
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Latest Vendors</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>More than 100 vendors available</span>
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
            onClick={() => {
              handleOpenAddModal('wholesale-vendor')
            }}
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
                <th className='p-0 w-50px'></th>
                <th className='p-0 min-w-120px'>
                  <h4>Name</h4>
                </th>
                <th className='p-0 min-w-120px'>
                  <h4>Address</h4>
                </th>
                <th className='p-0 min-w-125px'>
                  <h4>Phone</h4>
                </th>
                <th className='p-0 min-w-125px'>
                  <h4>Email</h4>
                </th>
                <th className='p-0 min-w-125px'>
                  <h4>Contact Person</h4>
                </th>
                <th className='p-0 min-w-90px'>
                  <h4>Website</h4>
                </th>
                <th className='p-0 min-w-50px'>
                  <h4>Info</h4>
                </th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {vendorItems.results &&
                dataToDisplay.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className='symbol symbol-50px me-2'>
                        <span className='symbol-label'>
                          <img
                            src={toAbsoluteUrl('/media/svg/brand-logos/plurk.svg')}
                            className='h-50 align-self-center'
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
                        {item.name}
                      </a>
                      <span className='text-muted fw-semibold d-block fs-7'>
                        {item.contact_person}
                      </span>
                    </td>
                    <td className='text-start'>
                      <span className='text-muted fw-semibold'>{item.address}</span>
                    </td>
                    <td className='text-start'>
                      <span className='text-muted fw-semibold'>{item.phone}</span>
                    </td>
                    <td className='text-start'>
                      <span className='text-muted fw-semibold'>{item.email}</span>
                    </td>
                    <td className='text-start'>
                      <span className='text-muted fw-semibold'>{item.contact_person}</span>
                    </td>
                    <td className='text-start'>
                      <span className='text-muted fw-semibold'>{item.website}</span>
                    </td>
                    <td className='text-start'>
                      <a
                        href='#'
                        className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                        onClick={() => {
                          handleOpenModal(item)
                        }}
                      >
                        <KTIcon iconName='eye' className='fs-2' />
                      </a>
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

export {WholesaleVendorTable}
