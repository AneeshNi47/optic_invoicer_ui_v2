import React, { useEffect, useState, useRef } from 'react'
import { KTIcon } from '../../../../_metronic/helpers'
import { useAuth } from '../../auth'
import { getInvoices } from './_requests' // Import searchInventory function
import { InvoiceModel,IndividualInvoice } from './_models'
import { CreateInvoiceModal } from '../../../../_metronic/partials'
import { InvoiceDetailsModal } from '../../../../_metronic/partials/modals/create-invoice/InvoiceDetailsModal'
import { InvoicePaymentModal } from '../../../../_metronic/partials/modals/create-invoice/InvoicePaymentModal'
import { toast } from 'react-toastify'
import { useCombinedContext } from '../CombinedProvider'
import { formatDate, downloadInvoiceSlip } from '../utils'

type Props = {
  className: string
}

const InvoicesTable: React.FC<Props> = ({ className }) => {
  const { auth } = useAuth()
  const [invoices, setInvoices] = useState<InvoiceModel | any>({})
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editModalData, setEditModalData] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [modalContent, setModalContent] = useState<IndividualInvoice | any>({})
  const [loading, setLoading] = useState(false)
  const [dataToDisplay, setDataToDisplay] = useState<Array<IndividualInvoice> | any[]>([])
  const [initialLoad, setInitialLoad] = useState<boolean>(true)
  const { setShouldFetchInvoice, shouldFetchInvoice } = useCombinedContext()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [minAmount, setMinAmount] = useState<string>('')
  const [maxAmount, setMaxAmount] = useState<string>('')


  const handleOpenEditModal = (invoiceData) => {
    setEditModalData(invoiceData)
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
  }

  const handleOpenModal = (values) => {
    setShowModal(true)
    setModalContent(values)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handlePaymentOpenModal = (values) => {
    setShowPaymentModal(true)
    setModalContent(values)
  }

  const handlePaymentCloseModal = () => {
    setShowPaymentModal(false)
  }

  const fetchInvoiceData = async (isNewSearch = false) => {
    if (auth?.token) {
      setLoading(true)
      try {
        const responseData = await getInvoices(auth.token, isNewSearch ? null : invoices.next, 5, shouldFetchInvoice, searchQuery)
        setInvoices((prev: any) => ({
          ...prev,
          ...responseData.data,
        }))
        setLoading(false)

        if (isNewSearch) {
          setDataToDisplay(responseData.data.results)
        } else {
          setDataToDisplay((prev: any) => [...prev, ...responseData.data.results])
        }
      } catch (error: any) {
        toast.error(error.response.data.error)
        console.error('Error fetching data:', error)
      }
    }
  }

  const fileDownload = async (invoice) => {
    if (auth?.token) {
      setLoading(true)
      downloadInvoiceSlip(invoice, auth.token)
      setLoading(false)
    }
  }

  const clearQueries = () => {
    setSearchQuery('')
    setMaxAmount('')
    setMinAmount('')
    setStartDate('')
    fetchInvoiceData(true)
  }

  useEffect(() => {
    if (initialLoad || shouldFetchInvoice) {
      setDataToDisplay([])
      fetchInvoiceData(true)
      setShouldFetchInvoice(false)
      setInitialLoad(false)
    }
  }, [auth?.token, shouldFetchInvoice, initialLoad])

  useEffect(() => {
    const SCROLL_THRESHOLD = 10

    const handleScroll = () => {
      const isScrollingDown =
        containerRef.current &&
        containerRef.current.scrollTop + containerRef.current.clientHeight >=
          containerRef.current.scrollHeight - SCROLL_THRESHOLD

      if (isScrollingDown && !loading && invoices.next) {
        fetchInvoiceData()
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

<CreateInvoiceModal show={showEditModal} handleClose={handleCloseEditModal} invoiceData={editModalData} modalName={`invoice`} />
      <InvoiceDetailsModal
        show={showModal}
        handleClose={handleCloseModal}
        modalContent={modalContent}
      />
      <InvoicePaymentModal
        show={showPaymentModal}
        handleClose={handlePaymentCloseModal}
        modalContent={modalContent}
      />
      <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bold fs-3 mb-1'>Recent Orders</span>
            <span className='text-muted mt-1 fw-semibold fs-7'>Over 500 orders</span>
          </h3>
        <div className='d-flex align-items-center'>
          <input
            type='text'
            className='form-control me-2'
            placeholder='Search...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* 
          <input
            type='date'
            className='form-control me-2'
            placeholder='Invoice Date'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
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
          />*/}
          <button className='me-1 btn btn-primary' onClick={() => fetchInvoiceData(true)}>
            Search
          </button>
          <button className='me-1 btn btn-danger' onClick={clearQueries}>
            X
          </button>
        </div>
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
                <th className='min-w-150px'>Customer</th>
                <th className='min-w-120px'>Invoice No.</th>
                <th className='min-w-120px'>Total</th>
                <th className='min-w-100px text-end'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dataToDisplay.length > 0 ? (
                dataToDisplay.map((invoice, index) => (
                  <tr key={index}>
                    <td>
                      <a
                        href='#'
                        className='text-dark fw-bold text-hover-primary fs-6'
                        onClick={() => {
                          handleOpenModal(invoice)
                        }}
                      >
                        {invoice.customer.first_name}
                      </a>
                      <span className='text-muted fw-semibold text-muted d-block fs-7'>
                        {invoice.customer.phone}
                      </span>
                    </td>
                    <td>
                      <a
                        href='#'
                        className='text-dark fw-bold text-hover-primary fs-6'
                        onClick={() => {
                          handleOpenModal(invoice)
                        }}
                      >
                        {invoice.invoice_number}
                      </a>
                      <span className='text-muted fw-semibold text-muted d-block fs-7'>
                        <span
                          className={
                            invoice.status === 'Created'
                              ? 'badge badge-light-success'
                              : invoice.status === 'Paid'
                              ? 'badge badge-light-primary'
                              : 'badge badge-light-danger'
                          }
                        >
                          {invoice.status}
                        </span>
                        <span>{formatDate(invoice.created_on)}</span>
                      </span>
                    </td>
                    <td className='text-dark fw-bold text-hover-primary fs-6'>
                      {invoice.total}
                      <span className='text-muted fw-semibold text-muted d-block fs-7'>
                        Balance: {invoice.balance}
                      </span>{' '}
                    </td>
                    <td className='text-end'>
                      <button disabled={invoice.status==="Paid"}className='btn btn-icon btn-bg-light btn-color-primary btn-active-color-primary btn-sm me-1'
                        onClick={() => {
                          handleOpenEditModal(invoice)
                        }}>
                        <KTIcon iconName='pencil' className='fs-3' />
                      </button>
                      <button
                        className='btn btn-icon btn-bg-light btn-color-warning btn-active-color-primary btn-sm me-1'
                        onClick={() => {
                          handleOpenModal(invoice)
                        }}
                      >
                        <KTIcon iconName='eye' className='fs-3' />
                      </button>
                      <a
                        className='btn btn-icon btn-bg-light btn-color-success btn-active-color-primary btn-sm me-1'
                        onClick={() => {
                          handlePaymentOpenModal(invoice)
                        }}
                      >
                        <KTIcon iconName='dollar' className='fs-3' />
                      </a>
                      <a
                        className='btn btn-icon btn-bg-light btn-color-dark  btn-active-color-primary btn-sm me-1'
                        onClick={() => {
                          fileDownload(invoice)
                        }}
                      >
                        <KTIcon iconName='file-down' className='fs-3' />
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className='text-center'>
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div style={{ height: '10px' }} />
          {loading && <p>Loading...</p>}
        </div>
      </div>
    </div>
  )
}

export { InvoicesTable }
