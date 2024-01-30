/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef, useState} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {KTIcon} from '../../../../_metronic/helpers'
import {Dropdown1} from './Dropdown1'
import {getCSS, getCSSVariableValue} from '../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../_metronic/partials'
import {toast} from 'react-toastify'
import {getMonthByNumbers} from '../utils'
import {getOrganizationReport} from './_requests'
import {useAuth} from '../../auth'

type Props = {
  className: string
}

const CombinedChart: React.FC<Props> = ({className}) => {
  const {auth} = useAuth()
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()
  const [start_date, setStartDate] = useState('')
  const [end_date, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState({})
  const [date_request_string, setDateRequestString] = useState('')

  const fetchOrganizationReport = async () => {
    if (auth?.token) {
      setLoading(true)
      try {
        const responseData = await getOrganizationReport(
          auth.token,
          start_date,
          end_date,
          date_request_string
        )
        setChartData(responseData.data)
      } catch (error: any) {
        toast.error(error.response.data.error)
        console.error('Error fetching data:', error)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrganizationReport()
  }, [])

  useEffect(() => {
    fetchOrganizationReport()
  }, [start_date, end_date]) // Depend on start_date and end_date

  useEffect(() => {
    const chart = refreshChart()
    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [chartRef, mode, chartData])

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }
    const height = parseInt(getCSS(chartRef.current, 'height'))
    const chart = new ApexCharts(chartRef.current, getChartOptions(height, chartData))
    if (chart) {
      chart.render()
    }
    return chart
  }

  const updateFilters = async (new_filters) => {
    if (auth?.token) {
      setLoading(true)
      try {
        const responseData = await getOrganizationReport(
          auth.token,
          new_filters.start_date,
          new_filters.end_date,
          new_filters.date_request_string
        )
        setChartData(responseData.data)
      } catch (error: any) {
        toast.error(error.response.data.error)
        console.error('Error fetching data:', error)
      }
      setLoading(false)
    }
  }

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        {/* begin::Title */}
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Recent Statistics</span>

          <span className='text-muted fw-semibold fs-7'>More than 50 new Items</span>
        </h3>
        {/* end::Title */}

        {/* begin::Toolbar */}
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
          <Dropdown1 updateFilters={updateFilters} />
          {/* end::Menu */}
        </div>
        {/* end::Toolbar */}
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className='card-body'>
        {/* begin::Chart */}
        <div ref={chartRef} id='kt_charts_widget_1_chart' style={{height: '350px'}} />
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export {CombinedChart}

function getChartOptions(height: number, data): ApexOptions {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')
  const baseColor = getCSSVariableValue('--bs-primary')
  const secondaryColor = getCSSVariableValue('--bs-gray-300')
  const tertiaryColor = getCSSVariableValue('--bs-gray-150')

  return {
    series: [
      {
        name: 'Invoices',
        data: data.invoice_statistics ? data.invoice_statistics.map((item) => item.count) : [],
      },
      {
        name: 'Inventory',
        data: data.inventory_statistics ? data.inventory_statistics.map((item) => item.count) : [],
      },
      {
        name: 'Customers',
        data: data.customer_statistics ? data.customer_statistics.map((item) => item.count) : [],
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: height,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '30%',
        borderRadius: 5,
      },
    },
    legend: {
      show: true,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: data.invoice_statistics
        ? data.invoice_statistics.map((item) => `${item.year},${getMonthByNumbers(item.month)}`)
        : [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    fill: {
      opacity: 1,
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val) {
          return '' + val + ''
        },
      },
    },
    colors: [baseColor, secondaryColor, tertiaryColor],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 3,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  }
}
