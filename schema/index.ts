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
    label: z.string().min(1, "billboard label is required"),
    image_url: z.string().min(1, "billboard image url is required"),
})

export const categorySchema = z.object({
    name: z.string().min(1, "category name is required"),
    billboard_id: z.string().min(1, "billboard is required"),
})