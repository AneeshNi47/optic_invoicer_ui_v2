import {Suspense} from 'react'
import {Outlet} from 'react-router-dom'
import {I18nProvider} from '../_metronic/i18n/i18nProvider'
import {LayoutProvider, LayoutSplashScreen} from '../_metronic/layout/core'
import {MasterInit} from '../_metronic/layout/MasterInit'
import {AuthInit} from './modules/auth'
import {ThemeModeProvider} from '../_metronic/partials'
import { ToastContainer } from "react-toastify";
import { InventoryProvider } from './modules/invoicerModules/inventory/InventoryProvider'
import './app.css'


const App = () => {
  return (
    <>
    <Suspense fallback={<LayoutSplashScreen />}>
      <I18nProvider>
        <InventoryProvider>
        <LayoutProvider>
          <ThemeModeProvider>
            <AuthInit>
              <Outlet />
              <MasterInit />
            </AuthInit>
          </ThemeModeProvider>
        </LayoutProvider>
      </InventoryProvider>  
      </I18nProvider>
    </Suspense>
    <ToastContainer position="bottom-right" />
    </>
  )
}

export {App}
