import api from '@/api/axios';
import { Button } from '@/components/ui/button';
import React from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner';

const AcceptInvite = () => {

    const navigate = useNavigate();

    const { tripId } = useParams();

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const accept = async () => {
        try {
            const response = await api.get(`trips/${tripId}/invite/accept?token=${token}`);

            if(response.status == 200){
                toast.success("Invitation accepted");
                navigate(`/trips/${tripId}`);
            }else{
                toast.error( response.message || "Some error occured");
            }
        } catch (error) {
            toast.error( error.message || "Some error occured");
        }
    }

  return (
    <div className='w-full h-90 flex items-center justify-center'>

        <Button onClick={accept}>Accept</Button>

    </div>
  )
}

export default AcceptInvite