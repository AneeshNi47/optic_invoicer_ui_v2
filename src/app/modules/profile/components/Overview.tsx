import React from 'react'
import {
  FeedsWidget2,
  FeedsWidget3,
  FeedsWidget4,
  FeedsWidget5,
  FeedsWidget6,
  ChartsWidget1,
  ListsWidget5,
  ListsWidget2,
} from '../../../../_metronic/partials/widgets'
const testData = {
  start_date: '2023-08-15',
  end_date: '2024-01-12',
  total_inventory: 20,
  total_invoices: 18,
  total_customers: 13,
  total_prescriptions: 42,
  invoice_statistics: [
    {
      year: 2023,
      month: 11,
      count: 4,
      value: 370.0,
    },
    {
      year: 2023,
      month: 12,
      count: 3,
      value: 541.95,
    },
    {
      year: 2024,
      month: 1,
      count: 11,
      value: 3121.84,
    },
  ],
  inventory_statistics: [
    {
      year: 2023,
      month: 10,
      count: 4,
      value: 505.96,
    },
    {
      year: 2023,
      month: 11,
      count: 15,
      value: 2055.0,
    },
    {
      year: 2023,
      month: 12,
      count: 1,
      value: 354.45,
    },
  ],
  customer_statistics: [
    {
      year: 2023,
      month: 10,
      value: 4,
    },
    {
      year: 2023,
      month: 11,
      value: 5,
    },
    {
      year: 2023,
      month: 12,
      value: 1,
    },
    {
      year: 2024,
      month: 1,
      value: 3,
    },
  ],
  prescription_statistics: [
    {
      year: 2023,
      month: 10,
      value: 5,
    },
    {
      year: 2023,
      month: 11,
      value: 25,
    },
    {
      year: 2023,
      month: 12,
      value: 3,
    },
    {
      year: 2024,
      month: 1,
      value: 9,
    },
  ],
}

export function Overview() {
  return (
    <div className='row g-5 g-xxl-8'>
      <div className='col-xl-6'>
        <FeedsWidget2 className='mb-5 mb-xxl-8' />

        <FeedsWidget3 className='mb-5 mb-xxl-8' />

        <FeedsWidget4 className='mb-5 mb-xxl-8' />

        <FeedsWidget5 className='mb-5 mb-xxl-8' />

        <FeedsWidget6 className='mb-5 mb-xxl-8' />
      </div>

      <div className='col-xl-6'>
        <ListsWidget5 className='mb-5 mb-xxl-8' />

        <ListsWidget2 className='mb-5 mb-xxl-8' />
      </div>
    </div>
  )
}
