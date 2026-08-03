import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'
import { Card, CardFooter, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import api from '@/api/axios'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const activitySchema = z.object({
    name: z.string().min(5, "Must be atleast 5 characters"),
    time: z.string().min(5, "Must be atleast 5 characters"),
    notes: z.array(
        z.string().min(5, "Must be at least 5 characters")
    )
})

const formSchema = z.object({
    title: z.string().min(5, "Must be atleast 5 characters"),
    description: z.string().optional(),
    activities: z.array(activitySchema),
    date: z.coerce.date()
})

const ActivityItem = ({ activityIndex, control, onRemove }) => {
    const { fields: noteFields, append: appendNote, remove: removeNote } = useFieldArray({
        control,
        name: `activities[${activityIndex}].notes`
    })

    return (
        <div className='border border-gray-200 p-4 rounded space-y-4'>
            <div className='flex items-center justify-between'>
                <h4 className='text-sm font-semibold'>Activity {activityIndex + 1}</h4>
                <Button type="button" variant='outline' size='sm' onClick={onRemove}>Remove Activity</Button>
            </div>

            <Controller
                name={`activities[${activityIndex}].name`}
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Name of activity</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            type="text"
                            placeholder="Visit to beach"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller
                name={`activities[${activityIndex}].time`}
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Time of activity</FieldLabel>
                        <Input
                            {...field}
                            id={field.name}
                            type="text"
                            placeholder="Morning first hour"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <div className='border border-gray-100 rounded p-3 space-y-3'>
                <div className='flex items-center justify-between'>
                    <h5 className='text-sm font-medium'>Notes</h5>
                    <Button type="button" variant='secondary' size='sm' onClick={() => appendNote("")}>Add Note</Button>
                </div>

                {noteFields.map((note, noteIndex) => (
                    <div key={note.id} className='flex items-start gap-2'>
                        <div className='flex-1'>
                            <Controller
                                name={`activities[${activityIndex}].notes[${noteIndex}]`}
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>Note {noteIndex + 1}</FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="text"
                                            placeholder="Add a note"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>
                        <Button type="button" variant='ghost' size='sm' onClick={() => removeNote(noteIndex)} className='mt-8'>Remove</Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

const ItineraryForm = ({itineraryData}) => {

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: itineraryData || {
            title: "",
            description: "",
            activities: [
                {
                    name: "",
                    time: "",
                    notes: [""]
                }
            ],
            date: new Date().toISOString().split("T")[0]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "activities"
    })

    const { tripId } = useParams();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        console.log(data);

        try{
            const response = await api.post(`/${tripId}/itineraries`, data);

            if(response.status === 201){
                toast.success("Itinerary Created Successfully");
                navigate("/itinerary");
            }else{
                toast.error( response.message || "Error creating itinerary");
            }
        }catch(error){
            toast.error( error.message || "Some error occured");
        }
    }

    const onEdit = async (data) => {
        console.log(data);

        try{
            const response = await api.patch(`/${tripId}/itineraries/${itineraryData._id}`, data);

            if(response.status === 200){
                toast.success("Itinerary updated successfully");
                navigate("/itinerary");
            }else{
                toast.error( response.message || "Error creating itinerary");
            }
        }catch(error){
            toast.error( error.message || "Some error occured");
        }
    }


    return (
        <form onSubmit={form.handleSubmit(itineraryData ? onEdit : onSubmit)}>
            <Card className="w-1/2 mx-auto mt-40 mb-20">
                <CardHeader>
                    <CardTitle>
                        {itineraryData ? "Edit Itinerary" : "create Itinerary"}
                    </CardTitle>
                    <CardDescription>Fill in the details for your itinerary</CardDescription>

                </CardHeader>
                <CardContent className="space-y-3">

                    <Controller
                        name="title"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Enter Trip Title</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="text"
                                    placeholder="Trip to Bali."
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Enter Description</FieldLabel>
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    placeholder="Trip to Bali."
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <div className='flex items-center justify-between'>
                        <h3 className='text-lg font-semibold'>Activities</h3>
                        <Button type="button" onClick={()=>{append({name: "", time: "", notes: [""]})}} variant='outline'>Add Activity</Button>
                    </div>

                    {
                        fields.map((activity, index) => {
                            return (
                                <ActivityItem
                                    key={activity.id}
                                    activityIndex={index}
                                    control={form.control}
                                    onRemove={() => remove(index)}
                                />
                            )
                        })
                    }

                    <Controller
                        name="date"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Date of activity</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="date"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />



                </CardContent>
                <CardFooter>
                        <Button type="submit">Submit</Button>
                </CardFooter>
            </Card>
        </form>
    )
}

export default ItineraryForm