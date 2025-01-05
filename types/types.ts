export type Store = {
    id: number;
    name: string;
    billboards: BillBoard[]
    categories: Category[]
    sizes: Size[]
    colors: Color[]
    products: Product[]
    created_at: Date
}

export type BillBoard = {
    id: number;
    store_id: number;
    store: Store;
    label: string;
    image_url: string;
    categories: Category[]
    created_at: Date
}

export type Category = {
    id: string;
    store_id: number;
    store: Store;
    billboard_id: number;
    billboard: BillBoard;
    products: Product[]
    name: string;
    value: string;
    created_at: Date
}

export type Size = {
    id: number
    store_id: number;
    store: Store;
    name: string;
    value: string;
    products: Product[]
    created_at: Date
}

export type Color = {
    id: number
    store_id: number;
    store: Store;
    name: string;
    value: string;
    products: Product[]
    created_at: Date
}

export type Product = {
    id: number;
    store_id: number;
    store_name: string;
    category_id: string;
    category_name: string;
    name: string;
    description: string;
    price: number;
    is_featured: boolean;
    is_archived: boolean;
    size_id: string;
    size_value: string;
    color_id: string;
    color_value: string;
    images: Image[]
    created_at: Date
}

export type Image = {
    id: number;
    product_id: number
    product: Product
    url: string;
    created_at: Date
}