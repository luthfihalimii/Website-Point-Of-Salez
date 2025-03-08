export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface Category {
    id:number;
    name:string;
    slug:string;
    description?:string;
}

export interface Product {
    id:number;
    product_code:string;
    name:string;
    slug:string;
    description:string;
    image?:string;
    price:number;
    selling_price:number;
    stock:number;
    category_id:number;
    category:Category
}

export type TransactionType = 'SALE' | 'PURCHASE'

export interface TransactionItem {
    id?:number
    transactionId?:number
    productId:number
    quantity:number
    selling_price:number
    product:Product
    createdAt?:Date
}

export interface Transaction {
    date:ReactNode
    id:number
    no_transaction?:string
    type:TransactionType
    transaction_date?:string
    notes?:string | null
    items:TransactionItem[]
    total_amount:number
    created_at?:Date
    updated_at?:Date
    user:User
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
