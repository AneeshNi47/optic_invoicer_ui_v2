import React from 'react'
import {Formik, Form, Field} from 'formik'

type Dropdown1Props = {
  updateFilters: (filters: {
    start_date: string
    end_date: string
    date_request_string: string
  }) => void
}

export function Dropdown1({updateFilters}: Dropdown1Props) {
  // Initial values for the form
  const initialValues = {
    date_request_string: 'this_month',
    start_date: '', // Default empty start date
    end_date: '', // Default empty end date
  }

  // Handling form submission
  const handleSubmit = (values) => {
    updateFilters({
      start_date: values.start_date,
      end_date: values.end_date,
      date_request_string: values.date_request_string,
    }) // Replace with your submission logic
  }

  return (
    <div className='menu menu-sub menu-sub-dropdown w-250px w-md-300px' data-kt-menu='true'>
      <div className='px-7 py-5'>
        <div className='fs-5 text-dark fw-bolder'>Filter Options</div>
      </div>

      <div className='separator border-gray-200'></div>

      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({values, resetForm}) => (
          <Form className='px-7 py-5'>
            <div className='mb-10'>
              <label className='form-label fw-bold'>Filter:</label>
              <Field
                as='select'
                name='date_request_string'
                className='form-select form-select-solid'
              >
                <option value='all_time'>All Time</option>
                <option value='this_month'>This Month</option>
                <option value='last_month'>Last Month</option>
                <option value='this_year'>This year</option>
                <option value='last_year'>Last Year</option>
                <option value='custom_dates'>Custom Dates</option>
              </Field>
            </div>

            {values.date_request_string === 'custom_dates' && (
              <>
                <div className='mb-10'>
                  <label className='form-label fw-bold'>Start Date:</label>
                  <Field
                    type='date'
                    name='start_date'
                    className='search-input form-control form-control-solid ps-13'
                  />
                </div>

                <div className='mb-10'>
                  <label className='form-label fw-bold'>End Date:</label>
                  <Field
                    type='date'
                    name='end_date'
                    className='search-input form-control form-control-solid ps-13'
                  />
                </div>
              </>
            )}

            <div className='d-flex justify-content-end'>
              <button
                onClick={() =>
                  updateFilters({
                    start_date: '',
                    end_date: '',
                    date_request_string: '',
                  })
                }
                className='btn btn-sm btn-light btn-active-light-primary me-2'
              >
                Reset
              </button>

              <button type='submit' className='btn btn-sm btn-primary'>
                Apply
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
