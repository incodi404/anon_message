import { resend } from "@/lib/resend"
import { EmailTemplate } from "../../emails/verificationEmails"
import { ApiResponse } from "@/types/ApiRespponse"

export async function sendVerificationEmail(
    email: string,
    username: string,
    otp: string
): Promise<ApiResponse> {
    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Verification Code of Anonmess',
        react: EmailTemplate({ firstName: username, otp }),
    });

    if (error) {
        return {success: false, message: "Failed to send verification email"}
    }

    return {success: true, message: "Email has been sent successfully"}
}