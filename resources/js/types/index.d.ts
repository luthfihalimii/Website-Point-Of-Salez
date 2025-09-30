export interface Role {
    id: number;
    name: string;
    slug: 'admin' | 'cashier' | 'manager' | string;
    description?: string;
}

export interface User {
    id: number;
    role_id?: number | null;
    role?: Role | null;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
}

export interface Product {
    id: number;
    product_code: string;
    name: string;
    slug: string;
    description: string;
    image?: string;
    price: number;
    selling_price: number;
    stock: number;
    min_stock: number;
    is_active: boolean;
    category_id: number;
    category?: Category;
}

export type TransactionType = 'SALE' | 'PURCHASE';

export interface Partner {
    id: number;
    type: 'CUSTOMER' | 'SUPPLIER';
    name: string;
    contact_person?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    tax_number?: string | null;
    notes?: string | null;
    is_active: boolean;
}

export interface TransactionItem {
    id?: number;
    transaction_id?: number;
    productId: number;
    quantity: number;
    selling_price: number;
    price?: number;
    discount_amount?: number;
    tax_amount?: number;
    line_total?: number;
    product: Product;
    createdAt?: Date;
}

export interface Transaction {
    id: number;
    no_transaction?: string;
    type: TransactionType;
    status: 'COMPLETED' | 'CANCELED' | 'RETURNED';
    transaction_date?: string;
    notes?: string | null;
    items: TransactionItem[];
    total_amount: number;
    discount_amount?: number;
    tax_amount?: number;
    payment_method?: string | null;
    payment_amount?: number;
    change_amount?: number;
    partner?: Partner | null;
    user: User;
    created_at?: string;
    updated_at?: string;
}

export interface StockAdjustment {
    id: number;
    product: Pick<Product, 'id' | 'name' | 'product_code'>;
    user: Pick<User, 'id' | 'name'>;
    quantity_change: number;
    reason?: string | null;
    notes?: string | null;
    created_at: string;
}

export interface CashSession {
    id: number;
    user_id: number;
    opened_at: string;
    closed_at?: string | null;
    opening_balance: number;
    closing_balance: number;
    expected_balance: number;
    cash_sales_total: number;
    difference: number;
    status: 'OPEN' | 'CLOSED';
    notes?: string | null;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Paginated<T> {
    data: T[];
    links?: PaginationLink[];
    meta?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
