import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from "zod"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeClosed } from 'lucide-react'
import api from '@/api/axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const formSchema = z.object({
    name: z.string().min(5, "Name should be at least 5 characters."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password should be at least 8 characters."),
    confirmPassword: z.string().min(8, "Password should be at least 8 characters.")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
})

const Register = () => {

    const navigate = useNavigate();

    const [show, setShow] = React.useState(false);
    
    const [showConfirm, setShowConfirm] = React.useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
    })

    const onSubmit = async (data) => {
        console.log(data);

        const { confirmPassword, ...userData } = data; 

        try {
            const response = await api.post("/auth/register", userData);

            if(response.status === 201){
                toast.success("Account created successfully");
                navigate("/login");
            }else{
                toast.error(response.message || "Some error occured");
            }
        } catch (error) {
            toast.error(error.message || "Some error occured");
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="w-1/4 mx-auto mt-32">
                <CardHeader>
                    <CardTitle>Register to WanderWise</CardTitle>
                    <CardDescription>Fill your details to create an account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="text"
                                    placeholder="Ram Bahadur"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="email"
                                    placeholder="ram.bahadur@example.com"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <div className='flex items-end gap-1'>
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type={show ? "text" : "password"}
                                        placeholder="••••••••"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Button onClick={() => { setShow(!show) }} type="button" size="icon" variant='outline'>
                            {
                                show ? <EyeClosed /> : <Eye />
                            }
                        </Button>

                    </div>


                    <div className="relative">

                        <Controller
                            name="confirmPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="••••••••"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <div className='absolute right-2 bottom-2' onClick={() => { setShowConfirm(!showConfirm) }}>
                            {
                                showConfirm ? <EyeClosed size={18} /> : <Eye size={18} />
                            }
                        </div>

                    </div>

                </CardContent>
                <CardFooter className="block">
                    <Button type="submit" className="w-full">Register</Button>

                    <div className="mt-2 text-center">
                        Already have an account? 
                        <a className="text-blue-500 underline" href="/login">Login</a>
                    </div>
                </CardFooter>
            </Card>

        </form>
    )
}

export default Register