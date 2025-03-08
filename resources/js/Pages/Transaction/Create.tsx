import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { PageProps, Product, TransactionItem, TransactionType } from '@/types'
import { Head, useForm } from '@inertiajs/react'
import React, { useState } from 'react'
import ProductSelection from './components/product-selection'
import { Button } from '@/components/ui/button'

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
    } as any)

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
                {data.type === 'SALE' && (<div>Sale component</div>)}

                {/* Purchase Component */}
                {data.type === 'PURCHASE' && (<div>Purchase component</div>)}
            </div>

            {/* Select Product */}
            {data.type && (
                <ProductSelection
                    isOpen={isProductModalOpen}
                    onClose={() => setIsProductModalOpen(false)}
                    onSelect={() => { }}
                    transactionType={data.type}
                    products={products}
                />
            )}
        </Authenticated>
    )
}
