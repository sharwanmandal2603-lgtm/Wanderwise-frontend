import React from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import About from './pages/About'
import Register from './pages/Register'
import Login from './pages/Login'
import useAuth from './hooks/useAuth'
import { jwtDecode } from 'jwt-decode'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import AddTrip from './pages/trips/AddTrip'
import Trip from './pages/trips/Trip'
import EditTrip from './pages/trips/EditTrip'
import TripDetails from './pages/trips/TripDetails'
import AcceptInvite from './pages/trips/AcceptInvite'
import Baggage from './pages/baggage/Baggage'
import BaggageDetails from './pages/baggage/BaggageDetails'
import Itinerary from './pages/itinerary/Itinerary'
import AddItinerary from './pages/itinerary/AddItinerary'
import { Edititinerary } from './pages/itinerary/Edititinerary'
import ItineraryDetails from './pages/itinerary/ltinereryDetails'
import AdminPanel from './pages/admin/AdminPanel'

const App = () => {

  const { token, logout } = useAuth();

  const ProtectedRoutes = () => {
    try {
      const decodedToken = token ? jwtDecode(token) : null;
      const userId = decodedToken?.userId;

      if(!token || !userId){
        logout();
        return <Navigate to="/login" />
      }

       if (decodedToken && decodedToken.exp) {
        
        const currentTime = Date.now()/1000;

        if (currentTime > decodedToken?.exp) {
          logout();
          return <Navigate to="/login" />;
        }
      }

      return <AppLayout />

    } catch (error) {
      logout();
      return <Navigate to="/login" />
    }
  }

  const AdminRoute = () => {
    try {
      const decodedToken = token ? jwtDecode(token) : null;

      if (!decodedToken || decodedToken.role !== 'admin') {
        return <Navigate to="/dashboard" />
      }

      return <Outlet />

    } catch (error) {
      return <Navigate to="/dashboard" />
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />


        <Route element={<ProtectedRoutes />}>

          <Route path='/dashboard' element={<Dashboard />} />

          <Route path='/trips/add' element={<AddTrip />} />
          <Route path="/trips" element={<Trip />} />
          <Route path="/trips/edit/:tripId" element={<EditTrip />} />
          <Route path="/trips/:tripId/invite/accept" element={<AcceptInvite />} />
          <Route path="/trips/:tripId" element={<TripDetails />} />

          <Route path="/baggage" element={<Baggage />}/>
          <Route path="/baggage/:tripId" element={<BaggageDetails />} />

          <Route path='/itinerary' element={<Itinerary />} />
          <Route path="/itinerary/add/:tripId" element={<AddItinerary />} />
          <Route path="/itinerary/:tripId" element={<ItineraryDetails />} />
          <Route path="/itinerary/edit/:tripId/:itineraryId"
          element={<Edititinerary/>} />

          <Route element={<AdminRoute />}>
            <Route path="/dashboard/admin" element={<AdminPanel />} />
          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App