import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import { dbConnection } from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "abc@example.com" },
                password: { label: "Password", type: "password", placeholder: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnection()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })

                    if (!user) {
                        throw new Error('No user found')
                    }

                    if (!user.isVerified) {
                        throw new Error('Please verify first')
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if (isPasswordCorrect) {
                        return user
                    }
                    else {
                        throw new Error('Password is incorrect')
                    }
                } catch (error: any) {
                    throw new error
                }
            }
        })
    ],
    //user that is returned by the provider
    callbacks: {
        async session({ session, token }) {
            if(token) {
                session.user._id = token?._id?.toString()
                session.user.isVerified = token?.isVerified
                session.user.isAcceptingMessages = token?.isAcceptingMessages
                session.user.username = token?.username?.toString()
            }
            return session
        },
        async jwt({ token, user }) {
            if(user) {
                token._id = user?._id?.toString()
                token.isVerified = user?.isVerified
                token.isAcceptingMessages = user?.isAcceptingMessages
                token.username = user?.username?.toString()
            }
            return token
        }
    },
    pages: {
        signIn: 'sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET
}