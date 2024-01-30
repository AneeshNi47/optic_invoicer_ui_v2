import {Link} from 'react-router-dom'
import {KTIcon, toAbsoluteUrl} from '../../../../helpers'
import {Dropdown1, Search} from '../../../../partials'

const adminOptions: ReadonlyArray<{key: string; image: string; title: string}> = [
  {
    key: 'organizations',
    image: '/media/icons/duotune/finance/fin001.svg',
    title: 'Organizations',
  },
  {
    key: 'reports',
    image: '/media/icons/duotune/finance/fin002.svg',
    title: 'Reports',
  },
]

const AdminTab = () => {
  return (
    <div className='m-0'>
      {/* begin::Toolbar */}
      <div className='d-flex mb-10'>
        <Search />
        {/* begin::Filter */}
        <div className='flex-shrink-0 ms-2'>
          {/* begin::Menu toggle */}
          <button
            type='button'
            className='btn btn-icon btn-bg-light btn-active-icon-primary btn-color-gray-400'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
          >
            <KTIcon iconName='filter' className='fs-2' />
          </button>
          {/* end::Menu toggle */}

          <Dropdown1 />
        </div>
        {/* end::Filter */}
      </div>
      {/* end::Toolbar */}

      {/*begin::Projects*/}
      <div className='m-0'>
        {/*begin::Heading*/}
        <h1 className='text-gray-800 fw-bold mb-6 mx-5'>Menu</h1>
        {/*end::Heading*/}

        {/*begin::Items*/}
        <div className='mb-10'>
          {adminOptions.map((p) => (
            <Link
              key={p.key}
              to='/admin/organizations'
              className='custom-list d-flex align-items-center px-5 py-4'
            >
              {/*begin::Symbol*/}
              <div className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'>
                <span className='symbol-label'>
                  <img src={toAbsoluteUrl(p.image)} alt={p.title} className='fs-2' />
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
        </div>
        {/*end::Items*/}
      </div>
      {/*end::Projects*/}
    </div>
  )
}

export {AdminTab}
