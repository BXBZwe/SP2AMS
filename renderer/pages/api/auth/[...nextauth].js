require('dotenv').config();
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

console.log('JWT_SECRET:', process.env.JWT_SECRET);

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                name: { label: "Name", type: "text", placeholder: "Manager Name" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log('Authorizing:', credentials);

                const manager = await prisma.manager.findUnique({
                    where: { name: credentials.name },
                });
                console.log('Manager found:', manager);


                if (!manager) {
                    console.log('No manager found with the name:', credentials.name);
                    throw new Error('No manager found with the name provided');
                }

                if (credentials.password !== manager.password_hash) {
                    console.log('Incorrect password for manager:', credentials.name);
                    throw new Error('Incorrect password');
                }

                console.log('Authorization successful for manager:', manager);
                return { id: manager.manager_id, name: manager.name, email: manager.email };
            }
        }),
    ],
    session: {
        jwt: true,
        maxAge: 5 * 60,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        encryption: true,
        maxAge: 5 * 60,
    },

    callbacks: {
        async redirect({ url, baseUrl }) {
            return baseUrl + '/home';
        },
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.name = token.name;
            }
            return session;
        },
    }


});
