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

export const sizeSchema = z.object({
    name: z.string().min(1, "size name is required"),
    value: z.string().min(1, "size value is required"),
})

export const colorSchema = z.object({
    name: z.string().min(1, "color name is required"),
    value: z.string().min(4).regex(/^#/, { message: "value must be a valid hex code" }),
})

export const productSchema = z.object({
    name: z.string().min(1, "Product name is required"), 
    description: z.string().min(1, "Product description is required"), 
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1, "price is required"),
    category_id: z.string().min(1, "category id is required"), 
    color_id: z.string().min(1, "color id is required"), 
    size_id: z.string().min(1, "size id is required"), 
    is_featured: z.boolean().default(false).optional(),
    is_archived: z.boolean().default(false).optional(),
  });