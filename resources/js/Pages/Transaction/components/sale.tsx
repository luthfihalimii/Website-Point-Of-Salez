import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { TransactionItem } from '@/types'
import { Minus, Plus, Trash2 } from 'lucide-react'

interface SaleProps {
    selectedProducts: TransactionItem[]
    onQuantityChange: (index: number, increment: boolean) => void
    onRemoveProduct: (index: number) => void
    onUpdateItem: (index: number, key: 'selling_price' | 'discount_amount' | 'tax_amount', value: number) => void
    calculateItemTotal: (item: TransactionItem) => number
}

export default function Sale({ selectedProducts, onQuantityChange, onRemoveProduct, onUpdateItem, calculateItemTotal }: SaleProps) {
    return (
        <div>
            <h2 className='mb-4 text-xl font-bold'>Sale details</h2>
            <div className='overflow-x-auto rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Unit Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Item Discount</TableHead>
                            <TableHead>Item Tax</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {selectedProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className='text-center'>
                                    No products added yet
                                </TableCell>
                            </TableRow>
                        ) : (
                            selectedProducts.map((item, index) => (
                                <TableRow key={item.productId}>
                                    <TableCell className='font-medium'>{item.product.name}</TableCell>
                                    <TableCell className='max-w-[140px]'>
                                        <Input
                                            type='number'
                                            inputMode='decimal'
                                            min={0}
                                            value={item.selling_price}
                                            onChange={(event) => onUpdateItem(index, 'selling_price', Number(event.target.value) || 0)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex items-center gap-2'>
                                            <Button
                                                variant='outline'
                                                size='icon'
                                                className='size-8'
                                                onClick={() => onQuantityChange(index, false)}
                                            >
                                                <Minus className='size-4' />
                                            </Button>
                                            <span className='w-12 text-center'>{item.quantity}</span>
                                            <Button
                                                variant='outline'
                                                size='icon'
                                                className='size-8'
                                                onClick={() => onQuantityChange(index, true)}
                                            >
                                                <Plus className='size-4' />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell className='max-w-[120px]'>
                                        <Input
                                            type='number'
                                            inputMode='decimal'
                                            min={0}
                                            value={item.discount_amount ?? 0}
                                            onChange={(event) => onUpdateItem(index, 'discount_amount', Number(event.target.value) || 0)}
                                        />
                                    </TableCell>
                                    <TableCell className='max-w-[120px]'>
                                        <Input
                                            type='number'
                                            inputMode='decimal'
                                            min={0}
                                            value={item.tax_amount ?? 0}
                                            onChange={(event) => onUpdateItem(index, 'tax_amount', Number(event.target.value) || 0)}
                                        />
                                    </TableCell>
                                    <TableCell className='whitespace-nowrap'>
                                        {new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                        }).format(calculateItemTotal(item))}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant='outline'
                                            size='icon'
                                            className='size-8'
                                            onClick={() => onRemoveProduct(index)}
                                        >
                                            <Trash2 className='size-4' />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
