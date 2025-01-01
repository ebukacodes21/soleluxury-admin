import * as z from 'zod';

export const createStoreSchema = z.object({
    name: z.string().min(1, "store name is required")
})

export const loginSchema = z.object({
    email: z.string().email("must be a valid email"),
    password: z.string().min(8, "minimum of 8 characters")
})

export const settingSchema = z.object({
    name: z.string().min(1, "store name is required")
})

export const billboardSchema = z.object({
    label: z.string().min(1, "minimum of 8 characters"),
    imageUrl: z.string().min(1, "minimum of 8 characters"),
})