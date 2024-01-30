/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {CombinedChart} from './CombinedChart'
import {CountChart} from './CountChart'
import {CountValueChart} from './CountValueChart'

// import { InventoryItem, InventoryItems } from './_models';

type Props = {
  className: string
}

const ReportsDashboard: React.FC<Props> = ({className}) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <CombinedChart className='card-xl-stretch mb-xl-8' />
        <CountChart model='Customer' color='primary' className='card-xl-stretch mb-xl-8' />
        <CountChart model='Prescription' color='info' className='card-xl-stretch mb-xl-8' />
        <CountValueChart
          model='Inventory'
          color1='info'
          color2='danger'
          className='card-xl-stretch mb-xl-8'
        />
        <CountValueChart
          model='Invoice'
          color1='success'
          color2='danger'
          className='card-xl-stretch mb-xl-8'
        />
        {/* end::Table container */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export {ReportsDashboard}
