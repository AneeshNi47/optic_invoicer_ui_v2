import {Table} from 'react-bootstrap'
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
