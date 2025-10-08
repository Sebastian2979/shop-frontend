import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../myComponents/Navbar'
import Footer from '@/myComponents/Footer'

const Layout = () => {
    return (
        <>
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default Layout