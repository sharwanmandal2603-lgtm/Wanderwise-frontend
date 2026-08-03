import TripForm from '@/components/shared/TripForm'
import useApi from '@/hooks/useApi';
import { Loader2 } from 'lucide-react';
import React from 'react'
import { useParams } from 'react-router-dom'

const EditTrip = () => {

    const {tripId} = useParams();
    console.log(tripId);

    const { error, loading, data } = useApi(`/trips/${tripId}`);

    if(loading){
        return <Loader2 className="animate-spin" />
    }

    if(error){
        return <div>Error: {error.message}</div>
    }

    const tripData = {
        ...data,
        startDate: data.startDate.split("T")[0],
        endDate: data.endDate.split("T")[0]
    }

  return (
    <div>
        <TripForm tripData={tripData} />
    </div>
  )
}

export default EditTrip