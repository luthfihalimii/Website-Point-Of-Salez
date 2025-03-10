import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TransactionItem } from '@/types'
import { Minus, Plus, Trash2 } from 'lucide-react'
import React from 'react'

interface SaleProps {
    selectedProducts: TransactionItem[]
    onQuantityChange: (index: number, increment: boolean) => void
    onRemoveProduct: (index: number) => void
    calculateItemTotal: (item: TransactionItem) => number
}

export default function Sale({ selectedProducts, onQuantityChange, onRemoveProduct, calculateItemTotal }: SaleProps) {

    return (
        <div>
            <h2 className='text-xl font-bold mb-4'>
                Sale details
            </h2>
            <div className='rounded-md border overflow-x-auto'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {selectedProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className='text-center'>
                                    No Products added yet
                                </TableCell>
                            </TableRow>
                        ) : (
                            selectedProducts.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.product.name}</TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(item.selling_price)}
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex items-center gap-2'>
                                            <Button
                                                variant={"outline"}
                                                size={"icon"}
                                                className='size-8'
                                                onClick={() => onQuantityChange(index, false)}
                                            >
                                                <Minus className='size-4' />
                                            </Button>
                                            <span className='w-12 text-center'>
                                                {item.quantity}
                                            </span>
                                            <Button
                                                variant={"outline"}
                                                size={"icon"}
                                                className='size-8'
                                                onClick={() => onQuantityChange(index, true)}
                                            >
                                                <Plus className='size-4' />
                                            </Button>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(calculateItemTotal(item))}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant={"outline"}
                                            size={"icon"}
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
