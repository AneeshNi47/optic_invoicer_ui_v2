export interface Report {
  start_date: string
  end_date: string
  total_inventory: number
  total_invoices: number
  total_customers: number
  total_prescriptions: number
  invoice_statistics: any[]
  inventory_statistics: any[]
  customer_statistics: any[]
  prescription_statistics: any[]
}

export interface StatisticsItem {
  year: number
  month: number
  count?: number // Optional because it's not present in customer and prescription statistics
  value: number
}

export interface ReportData {
  start_date: string
  end_date: string
  total_inventory: number
  total_invoices: number
  total_customers: number
  total_prescriptions: number
  invoice_statistics: StatisticsItem[]
  inventory_statistics: StatisticsItem[]
  customer_statistics: Omit<StatisticsItem, 'count'>[] // 'count' is omitted because it's not in customer statistics
  prescription_statistics: Omit<StatisticsItem, 'count'>[] // 'count' is omitted because it's not in prescription statistics
}
