import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { PageProps, Product, TransactionItem, TransactionType } from '@/types'
import { Head, useForm } from '@inertiajs/react'
import React, { useState } from 'react'
import ProductSelection from './components/product-selection'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Sale from './components/sale'

interface CreateTransactionProps extends PageProps {
    products: Product[]
}

export default function Create({ auth, products }: CreateTransactionProps) {

    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [paymentAmount, setPaymentAmount] = useState<number>(0)

    const { data, setData, post, errors } = useForm({
        selectedProducts: [] as TransactionItem[],
        type: null as TransactionType | null,
        notes: "",
        total_amount: 0,
        user_id: auth.user.id
    })

    const handleProductSelect = (product: Product) => {
        if (data.selectedProducts.some((item) => item.productId === product.id)) {
            toast.error("Product already added")
            return
        }
        setData("selectedProducts", [
            ...data.selectedProducts,
            {
                productId: product.id,
                product,
                quantity: 1,
                selling_price: product.selling_price
            }
        ])
    }

    const handleQuantityChange = (index: number, increment: boolean) => {
        const updatedProducts = [...data.selectedProducts]
        const item = updatedProducts[index]

        if (!item) return
        const newQuantity = increment ? item.quantity + 1 : item.quantity - 1

        if (newQuantity < 1) {
            handleRemoveProduct(index)
            return
        }

        if (newQuantity < 1 || (data.type === "SALE" && newQuantity > item.product.stock)) {
            toast.error("Invalid quantity")
            return
        }
        updatedProducts[index] = { ...item, quantity: newQuantity }
        setData("selectedProducts", updatedProducts)
    }

    const handleRemoveProduct = (index: number) => {
        setData("selectedProducts", data.selectedProducts.filter((_, i) => i !== index))
    }

    const calculateItemTotal = (item: TransactionItem) => data.type === "SALE" ?
        item.quantity * item.selling_price : item.quantity * item.product.price

    const calculateTotal = () => {
        return data.selectedProducts.reduce(
            (sum, item) => sum + calculateItemTotal(item), 0
        );
    }

    return (
        <Authenticated>
            <Head title='Transaction' />

            <div className='container py-6 px-4 sm:px-6 md:px-8'>
                <div className='flex justify-end items-center flex-wrap gap-4'>
                    <Select
                        onValueChange={(value: TransactionType) => setData('type', value)}
                    >
                        <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder="Select type transaction" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Select Type Transaction</SelectLabel>
                                <SelectItem value='SALE'>Sale</SelectItem>
                                <SelectItem value='PURCHASE'>Purchase</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {/* button add product */}
                    {data.type && (
                        <Button onClick={() => setIsProductModalOpen(true)}>Add Product</Button>
                    )}
                </div>

                {/* Sale Component */}
                {data.type === 'SALE' && (
                    <Sale
                        selectedProducts={data.selectedProducts}
                        onQuantityChange={handleQuantityChange}
                        onRemoveProduct={handleRemoveProduct}
                        calculateItemTotal={calculateItemTotal}
                    />
                )}

                {/* Purchase Component */}
                {data.type === 'PURCHASE' && (<div>Purchase component</div>)}

                <div className='space-y-4 rounded-lg border p-4 mt-6'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg font-medium'>
                        <span>Total Amount</span>
                        <span>
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            }).format(calculateTotal())}
                        </span>
                    </div>
                </div>

            </div>

            {/* Select Product */}
            {data.type && (
                <ProductSelection
                    isOpen={isProductModalOpen}
                    onClose={() => setIsProductModalOpen(false)}
                    onSelect={handleProductSelect}
                    transactionType={data.type}
                    products={products}
                />
            )}
        </Authenticated>
    )
}
