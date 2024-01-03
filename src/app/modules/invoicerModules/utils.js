export function formatDate(dateString) {
  console.log(dateString)
  const date = new Date(dateString)
  const year = date.getFullYear()
  // Adding 1 because getMonth() returns month from 0-11
  const month = date.getMonth() + 1
  const day = date.getDate()
  console.log(date, year, month, day)

  // Ensuring two-digit month and day format
  const formattedMonth = month < 10 ? `0${month}` : month
  const formattedDay = day < 10 ? `0${day}` : day

  return `${year}-${formattedMonth}-${formattedDay}`
}
