/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useState, useRef} from 'react'
import {KTIcon} from '../../../../_metronic/helpers'
import {useAuth} from '../../auth'
import {getInvoices, generateInvoicePDF, printInvoice} from './_requests'
import {InvoiceModel} from './_models'
import {InvoiceDetailsModal} from '../../../../_metronic/partials/modals/create-invoice/InvoiceDetailsModal'
import {InvidualInvoice} from './_models'
import { InvoicePaymentModal } from '../../../../_metronic/partials/modals/create-invoice/InvoicePaymentModal'
import { toast } from 'react-toastify'
import { useInventoryContext } from '../inventory/InventoryProvider'


type Props = {
  className: string
}

const InvoicesTable: React.FC<Props> = ({className}) => {
  const {auth} = useAuth()
  const [invoices, setInvoices] = useState<InvoiceModel | any>({})
  const [showModal, setShowModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [modalContent, setModalContent] = useState<InvidualInvoice | any>({})
  const [loading, setLoading] = useState(false)
  const [dataTodisplay, setDataToDisplay] = useState<Array<InvidualInvoice> | any[]>([])
  const [initialLoad, setInitialLoad] = useState<boolean>(true)
  const {setShouldFetchInvoice, shouldFetchInvoice} = useInventoryContext();
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

  const fileDownload = async (values) => {
    if (auth?.token) {
      setLoading(true)
      try {
        const responseData = await generateInvoicePDF(auth.token, values);

        if(responseData.status == 200) {
          const blob = new Blob([responseData.data], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${values}.pdf`);
          document.body.appendChild(link);
          link.click();
          toast.success("File saved successfully")
        } else {
          toast.error(responseData.data.error)
        }
      } catch (error: any) {
        console.error('Error fetching data:', error)
        toast.error(error.response.data.error)
      }
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
      const isScrollingUp =
        containerRef.current && containerRef.current.scrollTop <= SCROLL_THRESHOLD
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
        <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTIcon iconName='category' className='fs-2' />
          </button>
          <div
            className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold w-200px'
            data-kt-menu='true'
          >
            <div className='menu-item px-3'>
              <div className='menu-content fs-6 text-dark fw-bold px-3 py-4'>Quick Actions</div>
            </div>
            <div className='separator mb-3 opacity-75'></div>
            <div className='menu-item px-3'>
              <a href='#' className='menu-link px-3'>
                New Ticket
              </a>
            </div>
            <div className='menu-item px-3'>
              <a href='#' className='menu-link px-3'>
                New Customer
              </a>
            </div>
            <div
              className='menu-item px-3'
              data-kt-menu-trigger='hover'
              data-kt-menu-placement='right-start'
              data-kt-menu-flip='left-start, top'
            >
              <a href='#' className='menu-link px-3'>
                <span className='menu-title'>New Group</span>
                <span className='menu-arrow'></span>
              </a>
              <div className='menu-sub menu-sub-dropdown w-175px py-4'>
                <div className='menu-item px-3'>
                  <a href='#' className='menu-link px-3'>
                    Admin Group
                  </a>
                </div>
                <div className='menu-item px-3'>
                  <a href='#' className='menu-link px-3'>
                    Staff Group
                  </a>
                </div>
                <div className='menu-item px-3'>
                  <a href='#' className='menu-link px-3'>
                    Member Group
                  </a>
                </div>
              </div>
            </div>
            <div className='menu-item px-3'>
              <a href='#' className='menu-link px-3'>
                New Contact
              </a>
            </div>
            <div className='separator mt-3 opacity-75'></div>
            <div className='menu-item px-3'>
              <div className='menu-content px-3 py-3'>
                <a className='btn btn-primary btn-sm px-4' href='#'>
                  Generate Reports
                </a>
              </div>
            </div>
          </div>
        </div>
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
                <th className='min-w-150px'>Order Id</th>
                <th className='min-w-120px'>Date</th>
                <th className='min-w-120px'>Total</th>
                <th className='min-w-120px'>Status</th>
                <th className='min-w-100px text-end'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.results &&
                dataTodisplay.map((invoice, index) => (
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
                      <a href='#' className='text-dark fw-bold text-hover-primary fs-6' onClick={() =>{
                        handleOpenModal(invoice)
                      }}>
                        {invoice.invoice_number}
                      </a>
                    </td>
                    <td>
                      <a
                        href='#'
                        className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'
                      >
                        {invoice.created_on}
                      </a>
                      <span className='text-muted fw-semibold text-muted d-block fs-7'>
                        Code: Paid
                      </span>
                    </td>
                    <td className='text-dark fw-bold text-hover-primary fs-6'>{invoice.total}</td>
                    <td>
                      <span className='badge badge-light-success'>{invoice.status}</span>
                    </td>
                    <td className='text-end'>
                      <a className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'>
                        <KTIcon iconName='pencil' className='fs-3' />
                      </a>
                      <a
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                        onClick={() => {
                          handleOpenModal(invoice)
                        }}
                      >
                        <KTIcon iconName='eye' className='fs-3' />
                      </a>
                      <a
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                        onClick={() => {
                          handlePaymentOpenModal(invoice)
                        }}
                      >
                        <KTIcon iconName='dollar' className='fs-3' />
                      </a>
                      <a
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                        onClick={() => {
                          fileDownload(invoice.id)
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
