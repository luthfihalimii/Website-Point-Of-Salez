import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { PageProps, Product, TransactionItem, TransactionType } from '@/types'
import { Head, useForm } from '@inertiajs/react'
import React, { useState } from 'react'
import ProductSelection from './components/product-selection'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Sale from './components/sale'
import Purchase from './components/purchase'
import { Input } from '@/components/ui/input'

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

    /** Fungsi untuk menambahkan produk ke dalam daftar transaksi */
    const handleProductSelect = (product: Product) => {
        /** Cek apakah produk sudah ada dalam daftar selectedProducts */
        if (data.selectedProducts.some((item) => item.productId === product.id)) {
            toast.error("Product already added")
            return
        }

        /** Menambahkan produk ke dalam state selectedProducts */
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

    /** Fungsi untuk mengubah jumlah produk dalam transaksi */
    const handleQuantityChange = (index: number, increment: boolean) => {
        const updatedProducts = [...data.selectedProducts] // Salin array selectedProducts
        const item = updatedProducts[index] // Ambil item berdasarkan index

        if (!item) return // Jika item tidak ditemukan, keluar dari fungsi

        /** Hitung jumlah baru berdasarkan operasi increment atau decrement */
        const newQuantity = increment ? item.quantity + 1 : item.quantity - 1

        /** Jika jumlah menjadi kurang dari 1, hapus produk dari daftar */
        if (newQuantity < 1) {
            handleRemoveProduct(index)
            return
        }

        /**
         * Jika jumlah tidak valid (kurang dari 1 atau lebih besar dari stok untuk SALE), tampilkan error
         */
        if (newQuantity < 1 || (data.type === "SALE" && newQuantity > item.product.stock)) {
            toast.error("Invalid quantity")
            return
        }

        /**  Perbarui jumlah produk dalam state */
        updatedProducts[index] = { ...item, quantity: newQuantity }
        setData("selectedProducts", updatedProducts)
    }

    /** Fungsi untuk menghapus produk dari daftar transaksi */
    const handleRemoveProduct = (index: number) => {
        setData("selectedProducts", data.selectedProducts.filter((_, i) => i !== index))
    }

    /** Fungsi untuk menghitung total harga per item */
    const calculateItemTotal = (item: TransactionItem) => data.type === "SALE"
    ? item.quantity * item.selling_price // Jika transaksi SALE, gunakan harga jual
    : item.quantity * item.product.price // Jika transaksi PURCHASE, gunakan harga beli

    /** Fungsi untuk menghitung total seluruh transaksi */
    const calculateTotal = () => {
        return data.selectedProducts.reduce(
            (sum, item) => sum + calculateItemTotal(item), 0
        );
    }

    /** Fungsi untuk menghitung kembalian pembayaran */
    const calculateChange = () => {
        const total = calculateTotal() //  Hitung total transaksi
        data.total_amount = total // Simpan total ke dalam state
        return Math.max(paymentAmount - total, 0) // Hitung kembalian, jika ada
    }

    const handleSubmit = () => {
        if (!data.type || data.selectedProducts.length === 0) {
            toast.error('Please complete the form')
            return;
        }

        if (data.type === "SALE" && !paymentAmount) {
            toast.error('Input payment')
            return;
        }

        post(route('transaction.store'),{
            onSuccess:() => toast.success('Transaction saved'),
            onError:() => toast.error('Transaction failed')
        })
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
                {data.type === 'PURCHASE' && (
                    <Purchase
                        selectedProducts={data.selectedProducts}
                        onQuantityChange={handleQuantityChange}
                        onRemoveProduct={handleRemoveProduct}
                        calculateItemTotal={calculateItemTotal}
                    />
                )}

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

                    <div className='space-y-2'>
                        <label htmlFor="" className='text-sm font-medium'>
                            Payment Amount
                        </label>
                        <Input
                            type='number'
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                            className='text-right'
                            disabled={data.type === "PURCHASE"}
                        />
                    </div>

                    <div className='gris grid-cols-1 sm:grid-cols-2 gap-4 text-lg font-medium'>
                        <span>Change:</span>
                        <span className={paymentAmount < calculateTotal() ? "text-red-500" : "text-green-500"}>
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR"
                            }).format(calculateChange())}
                        </span>
                    </div>
                </div>

                {data.type && (
                    <div className='flex justify-end flex-wrap gap-2 mt-6'>
                        <Button variant={"outline"}>Cancel</Button>
                        <Button onClick={handleSubmit}>Save transaction</Button>
                    </div>
                )}
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
