/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef, useState} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {getCSS, getCSSVariableValue} from '../../../../_metronic/assets/ts/_utils'
import {useThemeMode} from '../../../../_metronic/partials'
import {useAuth} from '../../auth'
import {toast} from 'react-toastify'
import {getMonthByNumbers} from '../utils'
import {getOrganizationModelReport} from './_requests'

type Props = {
  className: string
  model: string
  color: string
}

const CountChart: React.FC<Props> = ({className, model, color}) => {
  const {auth} = useAuth()
  const chartRef = useRef<HTMLDivElement | null>(null)
  const {mode} = useThemeMode()
  const [start_date, setStartDate] = useState('')
  const [end_date, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [chartData, setChartData] = useState({})
  const [date_request_string, setDateRequestString] = useState('all_time')

  const fetchOrganizationReport = async () => {
    if (auth?.token) {
      setLoading(true)
      try {
        const responseData = await getOrganizationModelReport(
          auth.token,
          start_date,
          end_date,
          model,
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
  }, [start_date, end_date, date_request_string]) // Depend on start_date and end_date

  const refreshMode = () => {
    if (!chartRef.current) {
      return
    }
    const height = parseInt(getCSS(chartRef.current, 'height'))
    const chart = new ApexCharts(chartRef.current, getChartOptions(height, chartData, color))
    if (chart) {
      chart.render()
    }
    return chart
  }

  useEffect(() => {
    const chart = refreshChart()
    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [chartRef, mode, chartData, date_request_string, start_date, end_date])

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }
    const height = parseInt(getCSS(chartRef.current, 'height'))
    const chart = new ApexCharts(chartRef.current, getChartOptions(height, chartData, color))
    if (chart) {
      chart.render()
    }
    return chart
  }

  useEffect(() => {
    const chart = refreshMode()

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [chartRef, mode])

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Recent {model}</span>

          <span className='text-muted fw-semibold fs-7'>More than 1000 new {model}</span>
        </h3>

        {/* begin::Toolbar */}
        <div className='card-toolbar' data-kt-buttons='true'>
          <a
            className={
              date_request_string === 'last_year'
                ? `btn btn-sm btn-color-muted btn-active btn-active-primary active px-4 me-1`
                : `btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1`
            }
            id='kt_charts_widget_3_year_btn'
            onClick={() => setDateRequestString('last_year')}
          >
            Last Year
          </a>
          <a
            className={
              date_request_string === 'this_year'
                ? `btn btn-sm btn-color-muted btn-active btn-active-primary active px-4 me-1`
                : `btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1`
            }
            id='kt_charts_widget_3_year_btn'
            onClick={() => setDateRequestString('this_year')}
          >
            This Year
          </a>

          <a
            className={
              date_request_string === 'this_month'
                ? `btn btn-sm btn-color-muted btn-active btn-active-primary active px-4 me-1`
                : `btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1`
            }
            id='kt_charts_widget_3_month_btn'
            onClick={() => setDateRequestString('this_month')}
          >
            Month
          </a>

          <a
            className={
              date_request_string === 'this_week'
                ? `btn btn-sm btn-color-muted btn-active btn-active-primary active px-4 me-1`
                : `btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1`
            }
            id='kt_charts_widget_3_month_btn'
            onClick={() => setDateRequestString('this_week')}
          >
            Week
          </a>
          <a
            className={
              date_request_string === 'all_time'
                ? `btn btn-sm btn-color-muted btn-active btn-active-primary active px-4 me-1`
                : `btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1`
            }
            id='kt_charts_widget_3_week_btn'
            onClick={() => setDateRequestString('all_time')}
          >
            All
          </a>
        </div>
        {/* end::Toolbar */}
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className='card-body'>
        {/* begin::Chart */}
        <div ref={chartRef} id='kt_charts_widget_3_chart' style={{height: '350px'}}></div>
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export {CountChart}

function getChartOptions(height: number, data, color): ApexOptions {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')
  const baseColor = getCSSVariableValue(`--bs-${color}`)
  const lightColor = getCSSVariableValue(`--bs-${color}-light`)

  return {
    series: [
      {
        name: 'Count',
        data: data.monthly_statistics ? data.monthly_statistics.map((item) => item.count) : [],
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {},
    legend: {
      show: true,
    },
    dataLabels: {
      enabled: true,
    },
    fill: {
      type: 'solid',
      opacity: 1,
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: [baseColor],
    },
    xaxis: {
      categories: data.monthly_statistics
        ? data.monthly_statistics.map((item) => `${item.year},${getMonthByNumbers(item.month)}`)
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
      crosshairs: {
        position: 'front',
        stroke: {
          color: baseColor,
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
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
          return '' + val + ' Numbers'
        },
      },
    },
    colors: [lightColor],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      strokeColors: baseColor,
      strokeWidth: 3,
    },
  }
}
