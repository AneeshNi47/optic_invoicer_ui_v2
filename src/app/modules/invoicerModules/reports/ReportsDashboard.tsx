/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {
  ChartsWidget2,
  ChartsWidget3,
  ChartsWidget4,
  ChartsWidget5,
  ChartsWidget6,
  ChartsWidget7,
  ChartsWidget8,
} from '../../../../_metronic/partials/widgets'
import {CombinedChart} from './CombinedChart'

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
        <ChartsWidget2 className='card-xl-stretch mb-xl-8' />
        <ChartsWidget3 className='card-xl-stretch mb-xl-8' />
        <ChartsWidget4 className='card-xl-stretch mb-xl-8' />
        <ChartsWidget5 className='card-xl-stretch mb-xl-8' />
        <ChartsWidget6 className='card-xl-stretch mb-xl-8' />
        <ChartsWidget7 className='card-xl-stretch mb-xl-8' />
        <ChartsWidget8 className='card-xl-stretch mb-xl-8' />
        {/* end::Table container */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export {ReportsDashboard}
