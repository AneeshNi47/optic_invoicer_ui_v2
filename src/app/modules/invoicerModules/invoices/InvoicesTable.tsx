/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState, useRef} from 'react'
import {KTIcon} from '../../../../_metronic/helpers'
import {useAuth} from '../../auth'
import {getInvoices} from './_requests'
import {InvoiceModel} from './_models'
import {InvoiceDetailsModal} from '../../../../_metronic/partials/modals/create-invoice/InvoiceDetailsModal'
import {IndividualInvoice} from './_models'
import {InvoicePaymentModal} from '../../../../_metronic/partials/modals/create-invoice/InvoicePaymentModal'
import {toast} from 'react-toastify'
import {useInventoryContext} from '../inventory/InventoryProvider'
import {formatDate, downloadInvoiceSlip} from '../utils'

type Props = {
  className: string
}

const InvoicesTable: React.FC<Props> = ({className}) => {
  const {auth} = useAuth()
  const [invoices, setInvoices] = useState<InvoiceModel | any>({})
  const [showModal, setShowModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [modalContent, setModalContent] = useState<IndividualInvoice | any>({})
  const [loading, setLoading] = useState(false)
  const [dataToDisplay, setDataToDisplay] = useState<Array<IndividualInvoice> | any[]>([])
  const [initialLoad, setInitialLoad] = useState<boolean>(true)
  const {setShouldFetchInvoice, shouldFetchInvoice} = useInventoryContext()
  const containerRef = useRef<HTMLDivElement | null>(null)
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

  const fetchInvoiceData = async () => {
    if (auth?.token) {
      setLoading(true)
      try {
        const responseData = await getInvoices(auth.token, invoices.next, 5, shouldFetchInvoice)
        setInvoices((prev: any) => ({
          ...prev,
          ...responseData.data,
        }))
        setLoading(false)

        setDataToDisplay((prev: any) => [...prev, ...(responseData.data as InvoiceModel).results])
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

  useEffect(() => {
    if (initialLoad || setShouldFetchInvoice) {
      setDataToDisplay([])
      fetchInvoiceData()
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
      </div>
      <div className='card-body py-3'>
        <div
          className='table-responsive'
          style={{overflowY: 'auto', maxHeight: '350px'}}
          ref={containerRef}
        >
          <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
            <thead>
              <tr className='fw-bold text-muted'>
                <th className='w-25px'>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      value='1'
                      data-kt-check='true'
                      data-kt-check-target='.widget-13-check'
                    />
                  </div>
                </th>
                <th className='min-w-150px'>Customer</th>
                <th className='min-w-120px'>Invoice No.</th>
                <th className='min-w-120px'>Total</th>
                <th className='min-w-100px text-end'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.results &&
                dataToDisplay.map((invoice, index) => (
                  <tr key={index}>
                    <td>
                      <div className='form-check form-check-sm form-check-custom form-check-solid'>
                        <input
                          className='form-check-input widget-13-check'
                          type='checkbox'
                          value='1'
                        />
                      </div>
                    </td>
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
                        {formatDate(invoice.created_on)}
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
                      </span>
                    </td>
                    <td className='text-dark fw-bold text-hover-primary fs-6'>
                      {invoice.total}
                      <span className='text-muted fw-semibold text-muted d-block fs-7'>
                        Balance: {invoice.balance}
                      </span>{' '}
                    </td>
                    <td className='text-end'>
                      <button className='btn btn-icon btn-bg-light btn-color-primary btn-active-color-primary btn-sm me-1'>
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
                ))}
            </tbody>
          </table>
          <div style={{height: '10px'}} />
          {loading && <p>Loading...</p>}
        </div>
      </div>
    </div>
  )
}

export {InvoicesTable}
