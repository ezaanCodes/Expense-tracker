/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod";
import useStore from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { SocialAuth } from '../../components/social-auth';
import { Separator } from '../../components/separator';
import Input from '../../components/ui/input';
import { Button } from '../../components/ui/button';

const RegisterSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email address" }),
    firstName: z.string({ required_error: "Name is required" }),
    password: z
        .string({ required_error: "Name is required" })
        .min(1, "Password is required")
});

const SignUp = () => {
    const { user } = useStore((state) => state)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(RegisterSchema)
    })
    const navigate = useNavigate();
    const [loading, setLoading] = useState();
    useEffect(() => {
        user && navigate("/")
    }, [user])

    const onSubmit = async (data) => {
        console.log(data)
    }

    return (
        <div className='flex items-center justify-center w-full min-h-screen py-10 '>
            <Card className="w-[400px] bg-white dark:bg-black/20 shadow-md overflow-hidden">
                <div className='p-6 md:p-8'>
                    <CardHeader className="py-0">
                        <CardTitle className="mb-8 text-center dark:text-white">
                            Create Account
                        </CardTitle>

                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onsubmit)} className='space-y-4 ' >
                            <div className='mb-8 space-y-6'>

                                <SocialAuth isLoading={loading} setLoading={setLoading} />
                                <Separator />
                                <Input
                                    disabled={loading}
                                    id="firstName"
                                    label="Name"
                                    name="firstName"
                                    type="text"
                                    placeholder="Jon doe"
                                    // error={errors?.firstName.message}
                                    {...register("firstName")}
                                    className='text-sm border dark:border-gray-800 
                                    dark:bg-transparent dark: placeholder:text-gray-700 
                                    dark:text-gray-400 dark:outline-none'
                                />
                                <Input
                                    disabled={loading}
                                    id="firstName"
                                    label="Email"
                                    name="firstName"
                                    type="text"
                                    placeholder="youremail@gmai.com"
                                    // error={errors?.firstName.message}
                                    {...register("firstName")}
                                    className='text-sm border dark:border-gray-800 
                                    dark:bg-transparent dark: placeholder:text-gray-700 
                                    dark:text-gray-400 dark:outline-none'
                                />
                                <Input
                                    disabled={loading}
                                    id="Full Name"
                                    label="Password"
                                    name="firstName"
                                    type="password"
                                    placeholder="********"
                                    // error={errors?.firstName.message}
                                    {...register("firstName")}
                                    className='text-sm border dark:border-gray-800 
                                    dark:bg-transparent dark: placeholder:text-gray-700 
                                    dark:text-gray-400 dark:outline-none'
                                />

                            </div>
                            <Button
                                className="w-full bg-violet-800 "
                            >
                                Create an Account
                            </Button>

                        </form>
                    </CardContent>

                </div>

            </Card>
        </div>
    )
}

export default SignUp