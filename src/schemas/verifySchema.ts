import {z} from "zod"

export const verifySchema = z.string().length(6, {message: "Should be 6 digits"})