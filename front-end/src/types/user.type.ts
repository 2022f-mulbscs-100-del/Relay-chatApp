import { z } from "zod";

export interface User  {
    id: string;
    username: string;
    email: string;
    createdAt: string;
    hasMessaged: boolean;
    phone: string;
    title: string;
    about: string;
    location: string;
    tags: string[];
    ImageUrl: string | null;
    emailtwoFactor: boolean;
    totpEnabled:boolean;
    passKeyEnabled:boolean;
    messageAlerts: boolean;
    isSocialLogin: boolean
};


export const UserProfile = z.object({
     phoneNumber: z.string(),
     title: z.string(),
     about: z.string(),
     tags: z.array(z.string())
 })

export type UserProfileType = z.infer<typeof UserProfile>;

