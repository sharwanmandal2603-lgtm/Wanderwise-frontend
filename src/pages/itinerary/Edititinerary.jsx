import React from 'react'
import ItineraryForm from '@/components/shared/ItineraryForm';
import { useParams } from 'react-router-dom';
import {Loader2} from 'lucide-react';
import useApi from '@/hooks/useApi';



export const Edititinerary = () => {
    const { tripId, itineraryId } = useParams();
    const{ data, error, loading } = useApi(`/${tripId}/itineraries/${itineraryId}`);

    if(loading){
        return <Loader2 className='animate-spin mt-40 mx-auto' />
    }

    if(error){
        return <div className='mt-40 text-center'>Error: {error.message}</div>
    }

    const itineraryData = {
        ...data,
        date: data.date.split("T")[0]
    }

  return (
    <div>
        <ItineraryForm itineraryData={itineraryData} />
    </div>
  )
}
