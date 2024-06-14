import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../../helpers'
import {useAuth} from '../../../../../app/modules/auth'
import {getOrganizations} from '../../../../../app/modules/invoicerModules/dashboard/requests' // Assuming getOrganization is imported from the correct path
import {toast} from 'react-toastify'

const staffOptions: ReadonlyArray<{key: string; image: string; title: string}> = [
  {
    key: 'invoices',
    image: '/media/svg/brand-logos/bebo.svg',
    title: 'Invoices',
  },
  {
    key: 'inventory',
    image: '/media/svg/brand-logos/vimeo.svg',
    title: 'Inventory',
  },
  {
    key: 'customers',
    image: '/media/svg/brand-logos/kickstarter.svg',
    title: 'Customers',
  },
  {
    key: 'reports',
    image: '/media/svg/general/rhone.svg',
    title: 'Reports',
  },
]

const StaffTab = () => {
  const {auth} = useAuth()
  const [organization, setOrganization] = useState<any>(null)

  useEffect(() => {
    const fetchOrganization = async () => {
      if (auth?.token) {
        try {
          const response = await getOrganizations(auth.token)
          setOrganization(response.data)
        } catch (error) {
          toast.error('Error fetching organization data')
          console.error('Error fetching organization data:', error)
        }
      }
    }

    fetchOrganization()
  }, [auth?.token])

  const wholesaleOptions = [
    {
      key: 'wholesale-vendor',
      image: '/media/svg/humans/custom-1.svg', // Update with the correct image path
      title: 'Wholesale Vendor',
    },
    {
      key: 'wholesale-inventory',
      image: '/media/svg/misc/eolic-energy.svg', // Update with the correct image path
      title: 'Wholesale Inventory',
    },
    {
      key: 'wholesale-clients',
      image: '/media/svg/misc/taieri.svg', // Update with the correct image path
      title: 'Wholesale Clients',
    },
    {
      key: 'wholesale-orders',
      image: '/media/svg/misc/puzzle.svg', // Update with the correct image path
      title: 'Wholesale Orders',
    },
    {
      key: 'wholesale-statement',
      image: '/media/svg/misc/infography.svg', // Update with the correct image path
      title: 'Wholesale Statements',
    },
  ]

  return (
    <div className='m-0'>
      {/*begin::Projects*/}
      <div className='m-0'>
        {/*begin::Heading*/}
        <h1 className='text-gray-800 fw-bold mb-6 mx-5'>Menu</h1>
        {/*end::Heading*/}

        {/*begin::Items*/}
        <div className='mb-10'>
          {staffOptions.map((p) => (
            <Link
              key={p.key}
              to={`/organization/${p.key}`}
              className='custom-list d-flex align-items-center px-5 py-4'
            >
              {/*begin::Symbol*/}
              <div className='symbol symbol-40px me-5'>
                <span className='symbol-label'>
                  <img
                    src={toAbsoluteUrl(p.image)}
                    alt={p.title}
                    className='h-50 align-self-center'
                  />
                </span>
              </div>
              {/*end::Symbol*/}

              {/*begin::Description*/}
              <div className='d-flex flex-column flex-grow-1'>
                {/*begin::Title*/}
                <h5 className='custom-list-title fw-bold text-gray-800 mb-1'>{p.title}</h5>
                {/*end::Title*/}
              </div>
              {/*begin::Description*/}
            </Link>
          ))}
          {organization?.is_wholesale && (
            <>
              <hr className='my-5' />
              {wholesaleOptions.map((p) => (
                <Link
                  key={p.key}
                  to={`/organization/${p.key}`}
                  className='custom-list d-flex align-items-center px-5 py-4'
                >
                  {/*begin::Symbol*/}
                  <div className='symbol symbol-40px me-5'>
                    <span className='symbol-label'>
                      <img
                        src={toAbsoluteUrl(p.image)}
                        alt={p.title}
                        className='h-50 align-self-center'
                      />
                    </span>
                  </div>
                  {/*end::Symbol*/}

                  {/*begin::Description*/}
                  <div className='d-flex flex-column flex-grow-1'>
                    {/*begin::Title*/}
                    <h5 className='custom-list-title fw-bold text-gray-800 mb-1'>{p.title}</h5>
                    {/*end::Title*/}
                  </div>
                  {/*begin::Description*/}
                </Link>
              ))}
            </>
          )}
        </div>
        {/*end::Items*/}
      </div>
      {/*end::Projects*/}
    </div>
  )
}

export {StaffTab}
