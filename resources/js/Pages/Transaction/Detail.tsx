import { Card, CardContent } from '@/components/ui/card';
import { Transaction } from '@/types'
import { Head } from '@inertiajs/react';
import React from 'react'

interface DetailProps {
    transaction: Transaction
}

export default function Detail({ transaction }: DetailProps) {

    console.log("Result props transaction", transaction);

    return (
        <React.Fragment>
            <Head title='Detail Transaction' />
            <Card className='w-full border-dashed max-w-md mx-auto bg-white font-mono
            dark:text-gray-800 mt-4'>
                <CardContent className='p-4 space-y-4'>
                    <div className='text-center mb-2'>
                        <p className='text-sm'>Laravel Inertia P.O.S</p>
                    </div>

                    <div className='mb-2'>
                        <div className='flex justify-between text-xs'>
                            <p>Transaction</p>
                            <p>{transaction.type}</p>
                        </div>

                        <div className='flex justify-between text-xs'>
                            <p>Date Transaction</p>
                            <p>
                                {(() => {
                                    const date = new Date(transaction.created_at || "");
                                    return date.toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: 'short',
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })
                                })()}
                            </p>
                        </div>
                    </div>

                    <div className='mb-2'>
                        <div className='flex justify-between text-xs'>
                            <div className='w-2/5 text-left'>Product</div>
                            <div className='w-2/5 text-left'>Qty</div>
                            <div className='w-2/5 text-left'>Price</div>
                            <div className='w-2/5 text-right'>Total</div>
                        </div>
                        {transaction.items.map((item) => (
                            <div key={item.id} className='flex justify-between text-xs'>
                                <div className='w-2/5 text-left'>{item.product.name}</div>
                                <div className='w-2/5 text-left'>{item.quantity}</div>
                                <div className='w-2/5 text-left'>{item.selling_price}</div>
                                <div className='w-2/5 text-right'>
                                    {item.quantity * item.selling_price}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='mb-2'>
                        <div className='flex justify-between text-xs'>
                            <p>Amount</p>
                            <p>
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                }).format(transaction.total_amount)}
                            </p>
                        </div>

                        <div className='flex justify-between text-xs'>
                            <p>Tax</p>
                            <p>Free tax</p>
                        </div>
                        <div className='flex justify-between font-bold text-xs'>
                            <p>Total</p>
                            <p>
                                {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                }).format(transaction.total_amount)}
                            </p>
                        </div>
                    </div>

                    <div className='mb-2'>
                        <div className='flex justify-between text-xs'>
                            <p>Cashier</p>
                            <p>{transaction.user.name}</p>
                        </div>
                    </div>

                    <div className='text-center mt-4 text-xs'>
                        <p>Thanks...</p>
                    </div>
                </CardContent>
            </Card>
        </React.Fragment>
    )
}
