import React from 'react'
import CustomButton from '../shared/CustomButton'

const Navbar = () => {
  return (
    <header className="px-20 py-4 fixed top-0 z-30 bg-white w-full flex justify-between items-center">
        {/* left part */}
        <div>
            <h1 className="text-4xl font-semibold">WanderWise</h1>
        </div>

        {/* right part  */}
        <div className='flex items-center gap-16'>
            <nav className='text-lg space-x-8'>
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
            </nav>

            <CustomButton text="Login" link="/login" isLogin={true} />
            

        </div>
    </header>
  )
}

export default Navbar