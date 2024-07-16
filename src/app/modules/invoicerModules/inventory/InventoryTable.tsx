/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect, useRef} from 'react'
import {KTIcon} from '../../../../_metronic/helpers'
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
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [minAmount, setMinAmount] = useState<string>('')
  const [maxAmount, setMaxAmount] = useState<string>('')

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
          shouldFetchInventory,
          null
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
  const clearQueries = () => {
    setSearchQuery('')
    setMaxAmount('')
    setMinAmount('')
    setStartDate('')
    fetchInventoryData()
  }
  const handleSearch = async () => {
    if (auth?.token) {
      setLoading(true)
      try {
        const responseData = await getInventoryItems(
          auth.token,
          inventoryItems.next,
          5,
          shouldFetchInventory,
          searchQuery
        )
        setInventoryItems((prev: any) => ({
          ...prev,
          ...responseData.data,
        }))
        setLoading(false)
        setLoading(false)
      } catch (error: any) {
        toast.error(error.response.data.error)
        console.error('Error searching data:', error)
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
  const shouldRenderButtonClose = maxAmount !== '' || minAmount !== '' || endDate !== '' || searchQuery !== '';

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
       {/*
        <div className='d-flex align-items-center'>
          <input
            type='text'
            className='form-control me-2'
            placeholder='Search...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <input
            type='date'
            className='form-control me-2'
            placeholder='End Date'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <input
            type='number'
            className='form-control me-2'
            placeholder='Min Amount'
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
          />
          <input
            type='number'
            className='form-control me-2'
            placeholder='Max Amount'
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
          />
          <button className='me-1 btn btn-primary' onClick={handleSearch}>
            Search
          </button>
          {shouldRenderButtonClose && (
          <button className='me-1 btn btn-danger' onClick={()=>clearQueries()}>
            X
          </button>)} 
        </div>*/}
      </div> 
      <div className='card-body py-3'>
        <div
          className='table-responsive'
          style={{overflowY: 'scroll', maxHeight: '400px'}}
          ref={containerRef}
        >
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-5'>
            <thead>
              <tr className='fw-bold text-muted'>
                <th className='min-w-150px'>Name</th>
                <th className='min-w-150px'>Brand</th>
                <th className='min-w-150px'>Cost Value</th>
                <th className='min-w-150px'>Quantity</th>
                <th className='min-w-150px'>Info</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.results &&
                dataTodisplay.map((item, index) => (
                  <tr key={index}>
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
