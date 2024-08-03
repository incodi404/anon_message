import { dbConnection } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { json } from "stream/consumers";
import otpGenerator from "otp-generator"

export async function POST(req: Request) {
    await dbConnection()

    try {
        const { username, email, password } = await req.json()
        const existingVerifiedUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingVerifiedUsername) {
            return Response.json({
                success: false,
                message: "Username is already exists"
            }, { status: 400 })
        }

        const existingUserByEmail = await UserModel.findOne({ email })
        const otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: true,
            upperCaseAlphabets: true
        })

        if (!otp || otp.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "OTP generation failed"
                }, { status: 500 }
            )
        }

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User is already exist with this email"
                    }, { status: 400 }
                )
            } else {
                const expiryDate = new Date()
                expiryDate.setHours(expiryDate.getHours() + 1)

                existingUserByEmail.verifyCode = otp
                existingUserByEmail.verifyCodeExpiry = expiryDate

                await existingUserByEmail.save()
            }
        } else {
            const hasedPassword = bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const createdUser = await UserModel.create({
                username,
                email,
                password: hasedPassword,
                verifyCode: otp,
                isVerified: false,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true
            })

            if(!createdUser) {
                return Response.json(
                    {
                        success: false,
                        message: "Failed to register user"
                    }, { status: 500 }
                )
            }
        }

        //sent verification email
        const sendEmail = await sendVerificationEmail(
            email, username, otp
        )

        if (!sendEmail.success) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to send verification email"
                }, { status: 500 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "User registered. Please verify your email."
            }, { status: 200 }
        )

    } catch (error) {
        console.error("Error registering user")
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}