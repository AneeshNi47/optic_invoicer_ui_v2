/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect, useRef} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../../_metronic/helpers'
import {Dropdown1} from '../../../../_metronic/partials'
import {useAuth} from '../../auth'
import {getOrganisations} from './_requests'
import {InventoryDetailsModal} from '../../../../_metronic/partials/modals/create-invoice/InventoryDetailsModal'
import {OrganisationModel} from './_models'
import { toast } from 'react-toastify'
import { useInventoryContext } from '../../invoicerModules/inventory/InventoryProvider'

type Props = {
  className: string
}

const OrganizationsTable: React.FC<Props> = ({className}) => {
  const {auth} = useAuth()
  const [inventoryItems, setInventoryItems] = useState<OrganisationModel[] | any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState<OrganisationModel | any>({})
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState<boolean>(true)

  const {setShouldFetchOrganisation, shouldFetchOrganisation} = useInventoryContext()

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
        const responseData = await getOrganisations(auth.token)

        console.log(responseData)
        setInventoryItems(responseData.data as any)
      } catch (error: any) {
        toast.error(error.response.data.error)
        console.error('Error fetching data:', error)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialLoad || shouldFetchOrganisation) {
      fetchInventoryData()
      setShouldFetchOrganisation(false)
      setInitialLoad(false)
    }
    fetchInventoryData()
  }, [auth?.token, initialLoad, shouldFetchOrganisation])

  return (
    <div className={`card ${className}`}>
      {/* <InventoryDetailsModal show={showModal} handleClose={handleCloseModal} modalContent={modalContent} setLoading={setLoading}/> */}
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
                  <h4>Email</h4>
                </th>
                <th className='p-0 min-w-125px'>
                  <h4>Is Active</h4>
                </th>
                <th className='p-0 min-w-90px'>
                  <h4>Mobile</h4>
                </th>
                <th className='p-0 min-w-50px'>
                  <h4>Staff Count</h4>
                </th>
                <th className='p-0 min-w-50px'>
                  <h4>Staff First Name</h4>
                </th>
                <th className='p-0 min-w-50px'>
                  <h4>Subscription Status</h4>
                </th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {inventoryItems &&
                inventoryItems.map((item, index) => (
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
                      <a href='#' className='text-dark fw-bold text-hover-primary mb-1 fs-6'>
                        {item.name}
                      </a>
                      <span className='text-muted fw-semibold d-block fs-7'>{item.email}</span>
                    </td>
                    <td className='text-start'>
                      <span className='badge badge-light-danger fw-semibold me-1'>
                        <h5>{item.email}</h5>
                      </span>
                    </td>
                    <td className='text-start'>
                      <span className='text-muted fw-semibold'>
                        {item.is_active ? (
                          <h4 className='text-success'>Active</h4>
                        ) : (
                          <h4 className='text-danger'>Not Active</h4>
                        )}
                      </span>
                    </td>
                    <td className='text-start'>
                      <span className='text-muted fw-semibold'>
                        <h5>{item.primary_phone_mobile}</h5>
                      </span>
                    </td>
                    <td className='text-start'>
                      <h5>{item.staff_count}</h5>
                    </td>
                    <td className='text-start'>
                      <h5>{item.superstaff_first_name}</h5>
                    </td>
                    <td className='text-start'>
                      {/* <h5>{item.subscription_status || '-'}</h5> */}
                    </td>
                  </tr>
                ))}
            </tbody>
            {/* end::Table body */}
          </table>

          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export {OrganizationsTable}
