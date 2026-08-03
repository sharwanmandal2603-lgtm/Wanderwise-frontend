import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import * as z from "zod"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import api from '@/api/axios'
import { toast } from 'sonner'

const formSchema = z.object({
    collaboratorEmails: z.array(
        z.string().email("Invalid email address").min(5, "Must be atleast 5 characters."),
    ).min(1, "Atleast one email is required.")
})



const InviteForm = ({tripId}) => {

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            collaboratorEmails: [""]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "collaboratorEmails"
    })

    const onSubmit = async (data) => {
        console.log(data)
        try{
            const response = await api.post(`/trips/${tripId}/invite`, data);

            if(response.status === 200){
                toast.success("Invitation sent successfully");
                form.reset();
            }else{
                toast.error( response.message || "Error sending invitation");
            }
        }catch(error){
            console.log(error)
            toast.error( error.message || "Some error occured");
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>Invite Collaborators</CardTitle>
                    <CardDescription>Enter emails of people you want to invite.</CardDescription>
                    <CardAction>
                        <Button type="button" onClick={() => append(" ")} variant='outline' size='icon'>
                            <Plus />
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    {
                        fields.map((item, index) => {
                            return (
                                <Controller
                                    key={index}
                                    name={`collaboratorEmails[${index}]`}
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={field.name}>Collaborator Email {index + 1}</FieldLabel>
                                            <Input
                                                {...field}
                                                id={field.name}
                                                type="email"
                                                placeholder="abc@example.com"
                                                aria-invalid={fieldState.invalid}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            )
                        })
                }
                </CardContent>
                <CardFooter>
                    <Button className={"w-full"} type='submit'>Send Invites</Button>
                </CardFooter>
            </Card>
        </form>
    )
}

export default InviteForm