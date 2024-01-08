import {generateInvoicePDF} from './invoices/_requests'
import {toast} from 'react-toastify'

export async function downloadInvoiceSlip(invoice, token) {
  try {
    const responseData = await generateInvoicePDF(token, invoice.id)
    if (responseData.status === 200) {
      const blob = new Blob([responseData.data], {type: 'application/pdf'})
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${invoice.invoice_number}_${invoice.customer.first_name}.pdf`)
      document.body.appendChild(link)
      link.click()
      toast.success('File saved successfully')
    } else {
      toast.error(responseData.data.error)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    toast.error(error.response.data.error)
  }
}

export function formatDate(dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  // Adding 1 because getMonth() returns month from 0-11
  const month = date.getMonth() + 1
  const day = date.getDate()
  // Ensuring two-digit month and day format
  const formattedMonth = month < 10 ? `0${month}` : month
  const formattedDay = day < 10 ? `0${day}` : day
  return `${year}-${formattedMonth}-${formattedDay}`
}

export function prescriptionCorrector(value) {
  return value === 0.0 ? null : parseFloat(value)
}

export function PrescriptionTable({prescriptionData}) {
  return (
    <>
      <td>{formatDate(prescriptionData.created_on)}</td>
      <td>
        <tr>
          <strong>LHS</strong>
        </tr>
        <tr>
          <strong>RHS</strong>
        </tr>
      </td>
      <td>
        <tr>{prescriptionData.left_add}</tr>
        <tr>{prescriptionData.right_add}</tr>
      </td>

      <td>
        <tr>{prescriptionData.left_axis}</tr>
        <tr>{prescriptionData.right_axis}</tr>
      </td>

      <td>
        <tr>{prescriptionData.left_cylinder}</tr>
        <tr>{prescriptionData.right_cylinder}</tr>
      </td>

      <td>
        <tr>{prescriptionData.left_ipd}</tr>
        <tr>{prescriptionData.right_ipd}</tr>
      </td>

      <td>
        <tr>{prescriptionData.left_prism}</tr>
        <tr>{prescriptionData.right_prism}</tr>
      </td>
      <td>
        <tr>{prescriptionData.left_sphere}</tr>
        <tr>{prescriptionData.right_sphere}</tr>
      </td>
      <td>{prescriptionData.pupillary_distance}</td>
      <td>{prescriptionData.additional_notes}</td>
    </>
  )
}
