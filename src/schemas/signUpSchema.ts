import {z} from "zod"

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 characters")