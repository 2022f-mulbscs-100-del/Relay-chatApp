import { z } from "zod";

export const  LoginDataSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
});


export type UserDataType = z.infer<typeof LoginDataSchema>;

export const SignUpDataSchema = LoginDataSchema.extend({
    username: z.string().min(3)
});

export type SignUpDataType = z.infer<typeof SignUpDataSchema>;