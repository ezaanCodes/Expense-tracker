import React from 'react'
import * as z from "zod";

const RegisterSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email({message: "Invalid email address"}),
    firstName: z.string({required_error: "Name is required"}),
    password:z
        .string({required_error: "Name is required"})
        .min(1, "Password is required")
});

const SignUp = () => {


    return (
        <div >
            <h1 className='text-black'>SignUpkajsndkjasndkjasnd</h1>
        </div>
    )
}

export default SignUp