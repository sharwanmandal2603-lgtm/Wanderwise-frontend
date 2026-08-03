import Footer from '@/components/landingComponents/Footer'
import AppNavbar from '@/components/shared/AppNavbar'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  return (
    <div>
        <AppNavbar />
        <Outlet />
        <Footer />

    </div>
  )
}

export default AppLayout