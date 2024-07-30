import {z} from "zod"

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 characters")
    .max(20, "Username should not be more than 20 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Should not contain any special character")

export const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email"}),
    password: z.string().min(8, {message: "Minimum 8 character is needed"})
})