/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect, useRef} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../../_metronic/helpers'
import {Dropdown1} from '../../../../_metronic/partials'
import {useAuth} from '../../auth'
import {getInventoryItems} from './_requests'
import {InventoryDetailsModal} from '../../../../_metronic/partials/modals/create-invoice/InventoryDetailsModal'
import {InventoryItem, InventoryItems} from './_models'
import {toast} from 'react-toastify'
import  UpdateInventoryQtyForm from './UpdateInventoryQtyForm'

import {useCombinedContext} from '../CombinedProvider'

type Props = {
  className: string
}

const InventoryTable: React.FC<Props> = ({className}) => {
  const {auth} = useAuth()
  const [inventoryItems, setInventoryItems] = useState<InventoryItems | any>({})
  const [showModal, setShowModal] = useState(false)
  const [showQtyModal, setShowQtyModal] = useState(false)
  const [modalContent, setModalContent] = useState<InventoryItem | any>({})
  const [loading, setLoading] = useState(false)
  const [dataTodisplay, setDataToDisplay] = useState<InventoryItem[] | any[]>([])
  const [initialLoad, setInitialLoad] = useState<boolean>(true)
  const {shouldFetchInventory, setShouldFetchInventory} = useCombinedContext()

  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleOpenModal = (values) => {
    setShowModal(true)
    setModalContent(values)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleOpenQtyModal = (values) => {
    setShowQtyModal(true)
    setModalContent(values)
  }

  const handleCloseQtyModal = () => {
    setShowQtyModal(false)
  }
  const fetchInventoryData = async () => {
    if (auth?.token) {
      setLoading(true)
      try {
        const responseData = await getInventoryItems(
          auth.token,
          inventoryItems.next,
          5,
          shouldFetchInventory
        )
        setInventoryItems((prev: any) => ({
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
    if (initialLoad || shouldFetchInventory) {
      setDataToDisplay([])
      fetchInventoryData()
      setShouldFetchInventory(false)
      setInitialLoad(false)
    }
  }, [auth?.token, shouldFetchInventory, initialLoad])

  useEffect(() => {
    const SCROLL_THRESHOLD = 10 // Adjust the threshold as needed

    const handleScroll = () => {
      const isScrollingUp =
        containerRef.current && containerRef.current.scrollTop <= SCROLL_THRESHOLD
      const isScrollingDown =
        containerRef.current &&
        containerRef.current.scrollTop + containerRef.current.clientHeight >=
          containerRef.current.scrollHeight - SCROLL_THRESHOLD

      // if (isScrollingUp && !loading) {
      //   fetchInventoryData();
      // }
      if (isScrollingDown && !loading && inventoryItems.next) {
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
      <InventoryDetailsModal
        show={showModal}
        handleClose={handleCloseModal}
        modalContent={modalContent}
      />
      <UpdateInventoryQtyForm
        show={showQtyModal}
        handleClose={handleCloseQtyModal}
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
                <th className='p-0 w-50px'></th>
                <th className='p-0 min-w-120px'>
                  <h4>Name</h4>
                </th>
                <th className='p-0 min-w-120px'>
                  <h4>Brand</h4>
                </th>
                <th className='p-0 min-w-125px'>
                  <h4>Cost Value</h4>
                </th>
                <th className='p-0 min-w-90px'>
                  <h4>Quantity</h4>
                </th>
                <th className='p-0 min-w-50px'>
                  <h4>Info</h4>
                </th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {inventoryItems.results &&
                dataTodisplay.map((item, index) => (
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
                      <span className='text-muted fw-semibold d-block fs-7'>{item.item_type}</span>
                    </td>
                    <td className='text-start'>
                      <span className='badge badge-light-danger fw-semibold me-1'>
                        <h5>{item.brand}</h5>
                      </span>
                    </td>
                    <td className='text-start'>
                      <span className='text-muted fw-semibold'>{item.cost_value}</span>
                    </td>
                    <td className='text-start'>
                      <span className='text-muted fw-semibold'>{item.qty}</span>
                    </td>
                    <td className='text-start'>
                      <a
                        href='#'
                        className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                        onClick={() => {
                          handleOpenQtyModal(item)
                        }}
                      >
                        <KTIcon iconName='pencil' className='fs-2' />
                      </a>
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

export {InventoryTable}
