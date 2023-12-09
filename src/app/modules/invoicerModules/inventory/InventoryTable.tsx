/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {KTIcon, toAbsoluteUrl} from '../../../../_metronic/helpers'
import {Dropdown1} from '../../../../_metronic/partials'
import {useAuth} from '../../auth'
import {InventoryItem} from './_models'
import {getInventoryItems} from './_requests'

type Props = {
  className: string
}

const InventoryTable: React.FC<Props> = ({className}) => {
  const {auth} = useAuth()
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])

  useEffect(() => {
    if (auth?.token) {
      getInventoryItems(auth.token)
        .then((response) => {
          setInventoryItems(response.data)
        })
        .catch((error) => {
          // Handle the error
        })
    }
  }, [auth?.token])
  return (
    <div className={`card ${className}`}>
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
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-5'>
            {/* begin::Table head */}
            <thead>
              <tr>
                <th className='p-0 w-50px'></th>
                <th className='p-0 min-w-150px'></th>
                <th className='p-0 min-w-150px'></th>
                <th className='p-0 min-w-125px'>Brand</th>
                <th className='p-0 min-w-40px'>Quantity</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {inventoryItems.map((item, index) => (
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
                    <span className='text-muted fw-semibold d-block fs-7'>{item.item_type}</span>
                  </td>
                  <td className='text-end'>
                    <span className='badge badge-light-danger fw-semibold me-1'>{item.brand}</span>
                    <span className='badge badge-light-info fw-semibold me-1'>
                      {item.cost_value}
                    </span>
                  </td>
                  <td className='text-end'>
                    <span className='text-muted fw-semibold'>{item.qty}</span>
                  </td>
                  <td className='text-end'>
                    <a
                      href='#'
                      className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                    >
                      <KTIcon iconName='arrow-right' className='fs-2' />
                    </a>
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

export {InventoryTable}
