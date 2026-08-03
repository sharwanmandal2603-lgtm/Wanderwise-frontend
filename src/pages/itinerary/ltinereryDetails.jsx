import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import useApi from '@/hooks/useApi';
import { formatDate } from '@/lib/formatter';
import { Edit, Loader2, Trash2 } from 'lucide-react';
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '@/api/axios';
import { toast } from 'sonner';

const ItineraryDetails = () => {

    const { tripId } = useParams();
    const navigate = useNavigate();

    const [dependency, setDependency] = React.useState(0);

    const { data, error, loading } = useApi(`/${tripId}/itineraries`, {}, [dependency]);

    if(loading){
      return <Loader2 className='animate-spin mt-40 mx-auto' />
    }

    if(error){
      return <div className='mt-40 text-center'>Error: {error.message}</div>
    }

    const handleDelete = async (itineraryId) => {
      try {
        const response = await api.delete(`/${tripId}/itineraries/${itineraryId}`);

        if (response.status === 200) {
          toast.success("Itinerary deleted successfully");
          setDependency(dependency + 1);
        } else {
          toast.error(response.message || "Error deleting itinerary");
        }
      } catch (error) {
        console.error('Error deleting itinerary:', error);
        toast.error(error.message || "Some error occured");
      }
    };

  return (
    <div className='px-20 py-20'>
        <Card>
          <CardHeader>
            <CardTitle className={"text-xl font-semibold"}>Itineraries for this trip</CardTitle>
            <CardDescription>View and manage itineraries for this trip.</CardDescription>

            <CardAction>
                <Button onClick={()=>{navigate(`/itinerary/add/${tripId}`)}}>Add Itinerary</Button>
            </CardAction>
          </CardHeader>

          <CardContent className={"grid grid-cols-2 gap-4"}>
            {
              data?.length == 0 ?
              <div>No itineraries to show for this trip. Add one first.</div>
              :
              data?.map((item, index)=>{
                return (
                  <Card key={item._id}>
                    <CardHeader>
                      <CardTitle>{item.title} - {formatDate(item.date)}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                      <CardAction>
                        <div className='flex gap-2'>
                          <Button
                            size='icon'
                            variant='outline'
                            onClick={()=>{navigate(`/itinerary/edit/${tripId}/${item._id}`)}}
                          >
                            <Edit />
                          </Button>
                          <Button
                            size='icon'
                            variant='outline'
                            onClick={()=>{handleDelete(item._id)}}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </CardAction>
                    </CardHeader>

                    <CardContent>
                      {
                        item.activities.map((activity, activityIndex)=>{
                          return (
                            <div key={activityIndex} className='border border-gray-200 p-4 rounded mb-3'>
                                <p className='text-lg font-medium'>{activity.name}</p>
                                <p>{activity.time}</p>

                                <ul className='list-disc pl-6'>
                                  {
                                    activity.notes.map((note, noteIndex)=>{
                                      return (
                                        <li key={noteIndex}>{note}</li>
                                      )
                                    })
                                  }
                                </ul>
                            </div>
                          )
                        })
                      }
                    </CardContent>
                  </Card>
                )
              })
            }
          </CardContent>
        </Card>
    </div>
  )
}

export default ItineraryDetails
