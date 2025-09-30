import { Card, CardContent } from '@/components/ui/card'
import type { Transaction } from '@/types'
import { Head } from '@inertiajs/react'

interface DetailProps {
    transaction: Transaction
}

const currencyFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
})

export default function Detail({ transaction }: DetailProps) {
    const transactionDate = transaction.transaction_date
        ? new Date(transaction.transaction_date)
        : transaction.created_at
            ? new Date(transaction.created_at)
            : null

    return (
        <>
            <Head title='Transaction Detail' />
            <Card className='mx-auto mt-6 w-full max-w-lg border bg-white font-sans shadow-sm'>
                <CardContent className='space-y-4 p-6'>
                    <div className='text-center'>
                        <p className='text-sm font-semibold'>Laravel Inertia P.O.S</p>
                        <p className='text-xs text-muted-foreground'>Transaction receipt</p>
                    </div>

                    <div className='grid gap-1 text-xs uppercase tracking-wide text-gray-600'>
                        <div className='flex justify-between'>
                            <span>Transaction No.</span>
                            <span className='font-semibold text-gray-800'>{transaction.no_transaction ?? '-'}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Type</span>
                            <span className='font-semibold text-gray-800'>{transaction.type}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Status</span>
                            <span className='font-semibold text-gray-800'>{transaction.status}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Date</span>
                            <span className='font-semibold text-gray-800'>
                                {transactionDate
                                    ? transactionDate.toLocaleString('id-ID', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })
                                    : '-'}
                            </span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Partner</span>
                            <span className='font-semibold text-gray-800'>
                                {transaction.partner?.name ?? 'Walk-in'}
                            </span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Cashier</span>
                            <span className='font-semibold text-gray-800'>{transaction.user.name}</span>
                        </div>
                    </div>

                    <div className='border-t pt-3'>
                        <div className='mb-2 flex items-center justify-between text-[11px] font-semibold uppercase text-gray-500'>
                            <span className='w-2/5 text-left'>Product</span>
                            <span className='w-1/5 text-right'>Qty</span>
                            <span className='w-1/5 text-right'>Price</span>
                            <span className='w-1/5 text-right'>Total</span>
                        </div>
                        <div className='space-y-1 text-xs text-gray-700'>
                            {transaction.items.map((item) => {
                                const lineTotal = (item.line_total ?? (item.quantity * item.selling_price))
                                return (
                                    <div key={item.id ?? `${item.productId}-${item.product.name}`}
                                        className='flex items-center justify-between'>
                                        <span className='w-2/5 text-left'>{item.product.name}</span>
                                        <span className='w-1/5 text-right'>{item.quantity}</span>
                                        <span className='w-1/5 text-right'>{currencyFormatter.format(item.selling_price)}</span>
                                        <span className='w-1/5 text-right font-semibold'>{currencyFormatter.format(lineTotal)}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className='space-y-1 border-t pt-3 text-xs text-gray-700'>
                        <div className='flex justify-between'>
                            <span>Subtotal</span>
                            <span>{currencyFormatter.format(transaction.items.reduce((sum, item) => sum + (item.line_total ?? item.quantity * item.selling_price), 0))}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Discount</span>
                            <span>{currencyFormatter.format(transaction.discount_amount ?? 0)}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Tax</span>
                            <span>{currencyFormatter.format(transaction.tax_amount ?? 0)}</span>
                        </div>
                        <div className='flex justify-between font-semibold uppercase'>
                            <span>Total</span>
                            <span>{currencyFormatter.format(transaction.total_amount)}</span>
                        </div>
                        {transaction.type === 'SALE' && (
                            <>
                                <div className='flex justify-between'>
                                    <span>Paid</span>
                                    <span>{currencyFormatter.format(transaction.payment_amount ?? 0)}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Change</span>
                                    <span>{currencyFormatter.format(transaction.change_amount ?? 0)}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Payment Method</span>
                                    <span>{transaction.payment_method ?? '-'}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {transaction.notes && (
                        <div className='border-t pt-3 text-xs text-gray-600'>
                            <p className='font-semibold uppercase text-gray-500'>Notes</p>
                            <p>{transaction.notes}</p>
                        </div>
                    )}

                    <div className='pt-4 text-center text-xs text-gray-500'>
                        <p>Thanks for your business!</p>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
