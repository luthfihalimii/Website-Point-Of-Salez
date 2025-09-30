import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import ProductSelection from './components/product-selection'
import Purchase from './components/purchase'
import Sale from './components/sale'
import type { PageProps, Partner, Product, TransactionItem, TransactionType } from '@/types'
import { Head, useForm } from '@inertiajs/react'
import { useState } from 'react'
import { toast } from 'sonner'

type PaymentMethod = 'CASH' | 'TRANSFER' | 'QRIS' | 'CREDIT'

interface CreateTransactionProps extends PageProps {
    products: Product[]
    partners: {
        customers: Partner[]
        suppliers: Partner[]
    }
}

interface ExtendedTransactionItem extends TransactionItem {
    price?: number
    discount_amount?: number
    tax_amount?: number
}

const paymentOptions: { label: string; value: PaymentMethod }[] = [
    { label: 'Cash', value: 'CASH' },
    { label: 'Transfer', value: 'TRANSFER' },
    { label: 'QRIS', value: 'QRIS' },
    { label: 'Credit', value: 'CREDIT' },
]

const currencyFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
})

export default function Create({ auth, products, partners }: CreateTransactionProps) {
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)

    const form = useForm({
        selectedProducts: [] as ExtendedTransactionItem[],
        type: null as TransactionType | null,
        partner_id: null as number | null,
        notes: '',
        discount_amount: 0,
        tax_amount: 0,
        total_amount: 0,
        payment_method: 'CASH' as PaymentMethod,
        payment_amount: 0,
        change_amount: 0,
        user_id: auth.user.id,
    })

    const { data, setData, post, processing, errors, transform, reset } = form

    const handleTypeChange = (value: TransactionType) => {
        setData('type', value)
        setData('selectedProducts', [])
        setData('partner_id', null)
        setData('payment_method', value === 'SALE' ? 'CASH' : 'TRANSFER')
        setData('payment_amount', 0)
        setData('change_amount', 0)
        setData('discount_amount', 0)
        setData('tax_amount', 0)
        toast(`Transaction type switched to ${value}`)
    }

    const handleProductSelect = (product: Product) => {
        if (data.selectedProducts.some((item) => item.productId === product.id)) {
            toast.error('Product already added')
            return
        }

        const newItem: ExtendedTransactionItem = {
            productId: product.id,
            product,
            quantity: 1,
            selling_price: product.selling_price,
            price: product.price,
            discount_amount: 0,
            tax_amount: 0,
        }

        setData('selectedProducts', [...data.selectedProducts, newItem])
    }

    const updateItem = (index: number, key: keyof ExtendedTransactionItem, value: number) => {
        const updated = [...data.selectedProducts]
        const item = updated[index]
        if (!item) return

        const sanitized = Number.isFinite(value) ? value : 0
        updated[index] = {
            ...item,
            [key]: Math.max(sanitized, 0),
        }

        setData('selectedProducts', updated)
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

        if (data.type === 'SALE') {
            const stock = item.product.stock
            if (newQuantity > stock) {
                toast.error('Quantity exceeds available stock')
                return
            }
        }

        updatedProducts[index] = { ...item, quantity: newQuantity }
        setData('selectedProducts', updatedProducts)
    }

    const handleRemoveProduct = (index: number) => {
        setData('selectedProducts', data.selectedProducts.filter((_, i) => i !== index))
    }

    const calculateItemTotal = (item: ExtendedTransactionItem) => {
        const basePrice = data.type === 'SALE'
            ? item.selling_price
            : item.price ?? item.product.price

        const quantity = item.quantity
        const discount = item.discount_amount ?? 0
        const tax = item.tax_amount ?? 0

        const total = quantity * basePrice - discount + tax
        return Number.isFinite(total) ? Math.max(total, 0) : 0
    }

    const calculateTotals = () => {
        const subtotal = data.selectedProducts.reduce((sum, item) => sum + calculateItemTotal(item), 0)
        const globalDiscount = Number(data.discount_amount) || 0
        const globalTax = Number(data.tax_amount) || 0

        const grandTotal = Math.max(subtotal - globalDiscount + globalTax, 0)
        return { subtotal, grandTotal }
    }

    const calculateChange = (grandTotal: number) => {
        if (data.type !== 'SALE') {
            return 0
        }

        return Math.max((Number(data.payment_amount) || 0) - grandTotal, 0)
    }

    const handleSubmit = () => {
        if (!data.type || data.selectedProducts.length === 0) {
            toast.error('Please complete the transaction form')
            return
        }

        const { grandTotal } = calculateTotals()

        if (data.type === 'SALE' && (Number(data.payment_amount) || 0) < grandTotal) {
            toast.error('Payment amount is insufficient')
            return
        }

        transform((formData) => {
            const totals = calculateTotals()
            const change = calculateChange(totals.grandTotal)

            return {
                ...formData,
                total_amount: totals.grandTotal,
                change_amount: change,
                payment_amount: formData.type === 'SALE' ? formData.payment_amount : 0,
                payment_method: formData.type === 'SALE' ? formData.payment_method : null,
                discount_amount: Number(formData.discount_amount) || 0,
                tax_amount: Number(formData.tax_amount) || 0,
                selectedProducts: formData.selectedProducts.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    selling_price: formData.type === 'SALE'
                        ? item.selling_price
                        : (item.price ?? item.product.price),
                    cost_price: formData.type === 'SALE'
                        ? (item.price ?? item.product.price)
                        : (item.price ?? item.product.price),
                    discount_amount: item.discount_amount ?? 0,
                    tax_amount: item.tax_amount ?? 0,
                })),
            }
        })

        post(route('transaction.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Transaction saved successfully')
                reset()
                setIsProductModalOpen(false)
            },
            onError: () => toast.error('Failed to save transaction'),
        })
    }

    const { subtotal, grandTotal } = calculateTotals()
    const changeAmount = calculateChange(grandTotal)

    const partnerOptions = data.type === 'SALE' ? partners.customers : partners.suppliers

    return (
        <Authenticated>
            <Head title='Transaction' />

            <div className='container px-4 py-6 sm:px-6 md:px-8'>
                <Card className='mb-6'>
                    <CardHeader>
                        <CardTitle>Transaction Information</CardTitle>
                    </CardHeader>
                    <CardContent className='grid gap-4 md:grid-cols-2'>
                        <div className='space-y-2'>
                            <Label htmlFor='transaction-type'>Transaction Type</Label>
                            <Select
                                value={data.type ?? undefined}
                                onValueChange={(value: TransactionType) => handleTypeChange(value)}
                            >
                                <SelectTrigger id='transaction-type'>
                                    <SelectValue placeholder='Select transaction type' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Type</SelectLabel>
                                        <SelectItem value='SALE'>Sale</SelectItem>
                                        <SelectItem value='PURCHASE'>Purchase</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.type && <p className='text-sm text-red-500'>{errors.type}</p>}
                        </div>

                        {data.type && (
                            <div className='space-y-2'>
                                <Label htmlFor='partner'>
                                    {data.type === 'SALE' ? 'Customer (optional)' : 'Supplier'}
                                </Label>
                                <Select
                                    value={data.partner_id ? String(data.partner_id) : undefined}
                                    onValueChange={(value) => setData('partner_id', value ? Number(value) : null)}
                                >
                                    <SelectTrigger id='partner'>
                                        <SelectValue placeholder={data.type === 'SALE' ? 'Walk-in customer' : 'Select supplier'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {data.type === 'SALE' && (
                                            <SelectItem value=''>Walk-in customer</SelectItem>
                                        )}
                                        {partnerOptions.map((partner) => (
                                            <SelectItem key={partner.id} value={String(partner.id)}>
                                                {partner.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.partner_id && <p className='text-sm text-red-500'>{errors.partner_id}</p>}
                            </div>
                        )}

                        <div className='space-y-2 md:col-span-2'>
                            <Label htmlFor='notes'>Notes</Label>
                            <Textarea
                                id='notes'
                                value={data.notes}
                                onChange={(event) => setData('notes', event.target.value)}
                                placeholder='Additional notes (optional)'
                            />
                        </div>
                    </CardContent>
                </Card>

                {data.type && (
                    <div className='flex flex-wrap items-center justify-end gap-3'>
                        <Button onClick={() => setIsProductModalOpen(true)}>Add Product</Button>
                    </div>
                )}

                {data.type === 'SALE' && (
                    <Sale
                        selectedProducts={data.selectedProducts}
                        onQuantityChange={handleQuantityChange}
                        onRemoveProduct={handleRemoveProduct}
                        onUpdateItem={(index, key, value) => updateItem(index, key, value)}
                        calculateItemTotal={calculateItemTotal}
                    />
                )}

                {data.type === 'PURCHASE' && (
                    <Purchase
                        selectedProducts={data.selectedProducts}
                        onQuantityChange={handleQuantityChange}
                        onRemoveProduct={handleRemoveProduct}
                        onUpdateItem={(index, key, value) => updateItem(index, key, value)}
                        calculateItemTotal={calculateItemTotal}
                    />
                )}

                <Card className='mt-6'>
                    <CardHeader>
                        <CardTitle>Payment Summary</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                            <div className='space-y-2'>
                                <Label htmlFor='subtotal'>Subtotal</Label>
                                <Input id='subtotal' value={currencyFormatter.format(subtotal)} readOnly className='text-right font-semibold' />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='discount'>Global Discount</Label>
                                <Input
                                    id='discount'
                                    type='number'
                                    min={0}
                                    value={data.discount_amount}
                                    onChange={(event) => setData('discount_amount', Number(event.target.value) || 0)}
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='tax'>Global Tax</Label>
                                <Input
                                    id='tax'
                                    type='number'
                                    min={0}
                                    value={data.tax_amount}
                                    onChange={(event) => setData('tax_amount', Number(event.target.value) || 0)}
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='grand-total'>Grand Total</Label>
                                <Input id='grand-total' value={currencyFormatter.format(grandTotal)} readOnly className='text-right font-bold' />
                            </div>
                        </div>

                        {data.type === 'SALE' && (
                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                                <div className='space-y-2'>
                                    <Label htmlFor='payment-method'>Payment Method</Label>
                                    <Select
                                        value={data.payment_method}
                                        onValueChange={(value: PaymentMethod) => setData('payment_method', value)}
                                    >
                                        <SelectTrigger id='payment-method'>
                                            <SelectValue placeholder='Method' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {paymentOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='payment-amount'>Payment Amount</Label>
                                    <Input
                                        id='payment-amount'
                                        type='number'
                                        min={0}
                                        value={data.payment_amount}
                                        onChange={(event) => setData('payment_amount', Number(event.target.value) || 0)}
                                        className='text-right'
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor='change-amount'>Change</Label>
                                    <Input
                                        id='change-amount'
                                        value={currencyFormatter.format(changeAmount)}
                                        readOnly
                                        className={`text-right font-semibold ${changeAmount > 0 ? 'text-green-600' : 'text-muted-foreground'}`}
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {data.type && (
                    <div className='mt-6 flex flex-wrap justify-end gap-2'>
                        <Button variant='outline' type='button' onClick={() => reset()}>
                            Clear
                        </Button>
                        <Button onClick={handleSubmit} disabled={processing}>
                            Save transaction
                        </Button>
                    </div>
                )}
            </div>

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
