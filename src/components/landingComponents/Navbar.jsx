import React from 'react'
import CustomButton from '../shared/CustomButton'
import { Menu, X } from 'lucide-react'
import { Button } from '../ui/button'

const Navbar = () => {

    const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="px-4 sm:px-6 md:px-8 lg:px-20 py-4 fixed top-0 z-30 bg-white w-full">
        <div className="flex justify-between items-center">
            {/* left part */}
            <div>
                <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold">WanderWise</h1>
            </div>

            {/* right part  */}
            <div className='flex items-center gap-3 md:gap-16'>
                <nav className='hidden md:block text-lg space-x-8'>
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/contact">Contact</a>
                </nav>

                <div className="hidden md:block">
                    <CustomButton text="Login" link="/login" isLogin={true} />
                </div>

                {/* mobile menu toggle */}
                <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    { mobileOpen ? <X /> : <Menu /> }
                </Button>
            </div>
        </div>

        {/* mobile menu panel */}
        {
            mobileOpen &&
            <nav className="md:hidden mt-4 pb-2 text-lg [&>a]:block [&>a]:py-2 [&>a]:text-base [&>a]:border-b [&>a]:border-gray-100">
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>

                <div className="mt-4">
                    <CustomButton text="Login" link="/login" isLogin={true} />
                </div>
            </nav>
        }
    </header>
  )
}

export default Navbar