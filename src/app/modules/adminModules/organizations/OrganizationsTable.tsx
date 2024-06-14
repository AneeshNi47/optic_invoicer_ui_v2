/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect, useRef} from 'react'
import {KTIcon} from '../../../../_metronic/helpers'
import {Dropdown1} from '../../../../_metronic/partials'
import {useAuth} from '../../auth'
import {getOrganisations} from './_requests'
import {OrganisationModel} from './_models'
import {toast} from 'react-toastify'
import {useCombinedContext} from '../../invoicerModules/CombinedProvider'

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

  const {setShouldFetchOrganisation, shouldFetchOrganisation} = useCombinedContext()

  const containerRef = useRef<HTMLDivElement | null>(null)

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
                <th className='p-0 min-w-90px'>
                  <h4>Phone</h4>
                </th>
                <th className='p-0 min-w-50px'>
                  <h4>Staff</h4>
                </th>
                <th className='p-0 min-w-50px'>
                  <h4>Subscription</h4>
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
                      <div
                        className={
                          item.is_active
                            ? 'btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                            : 'btn btn-sm btn-icon btn-color-danger btn-active-light-danger'
                        }
                      >
                        {item.is_active ? (
                          <KTIcon iconName='check-square' className='fs-2' />
                        ) : (
                          <KTIcon iconName='cross-square' className='fs-2' />
                        )}
                      </div>
                    </td>
                    <td>
                      <a href='#' className='text-dark fw-bold text-hover-primary mb-1 fs-6'>
                        {item.name}
                      </a>
                      <span className='text-muted fw-semibold d-block fs-7'>
                        {item.staff_count}
                      </span>
                    </td>
                    <td>
                      {item.email}
                      <span className='text-muted'>
                        <h5>{item.primary_phone_mobile}</h5>
                      </span>
                    </td>
                    <td className='text-start'>
                      <h5>{item.superstaff_first_name}</h5>
                    </td>
                    <td className='text-start'>
                      <h5>{item.subscription_status ? item.subscription_status.status : '-'}</h5>
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
