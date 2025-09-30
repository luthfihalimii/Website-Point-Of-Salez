import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import type { PageProps, Product, StockAdjustment } from '@/types'
import { Head } from '@inertiajs/react'
import { format } from 'date-fns'

interface MovementRow {
    id: number
    name: string
    stock_in: number
    stock_out: number
}

interface InventoryReportProps extends PageProps {
    movement: MovementRow[]
    adjustments: StockAdjustment[]
    lowStockProducts: Array<Pick<Product, 'id' | 'name' | 'stock' | 'min_stock'>>
    filters: {
        from: string
        to: string
    }
}

export default function InventoryReport({ movement, adjustments, lowStockProducts, filters }: InventoryReportProps) {
    return (
        <Authenticated>
            <Head title='Inventory Report' />
            <div className='space-y-6 px-4 py-6 sm:px-6 lg:px-8'>
                <header>
                    <h1 className='text-2xl font-semibold'>Inventory Activity</h1>
                    <p className='text-sm text-muted-foreground'>Period: {filters.from} — {filters.to}</p>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle className='text-lg font-semibold'>Stock Movement</CardTitle>
                    </CardHeader>
                    <CardContent className='overflow-x-auto'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className='text-right'>Stock In</TableHead>
                                    <TableHead className='text-right'>Stock Out</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {movement.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className='py-6 text-center text-sm text-muted-foreground'>
                                            No stock movement recorded during this period.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    movement.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell className='font-medium text-gray-800'>{row.name}</TableCell>
                                            <TableCell className='text-right text-emerald-600'>{row.stock_in}</TableCell>
                                            <TableCell className='text-right text-red-600'>{row.stock_out}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className='grid gap-4 md:grid-cols-2'>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-lg font-semibold'>Recent Adjustments</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-3 max-h-[320px] overflow-y-auto pr-2'>
                            {adjustments.length === 0 ? (
                                <p className='text-sm text-muted-foreground'>No manual adjustments logged.</p>
                            ) : (
                                adjustments.map((adjustment) => (
                                    <div key={adjustment.id} className='rounded-md border p-3'>
                                        <div className='flex items-center justify-between text-sm font-semibold text-gray-800'>
                                            <span>{adjustment.product.name}</span>
                                            <span className={adjustment.quantity_change >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                                                {adjustment.quantity_change > 0 ? '+' : ''}{adjustment.quantity_change}
                                            </span>
                                        </div>
                                        <div className='mt-1 text-xs text-muted-foreground'>
                                            {format(new Date(adjustment.created_at), 'dd MMM y HH:mm')} — by {adjustment.user.name}
                                        </div>
                                        {(adjustment.reason || adjustment.notes) && (
                                            <p className='mt-2 text-sm text-gray-700'>
                                                {adjustment.reason && <span className='font-medium'>Reason:</span>} {adjustment.reason ?? ''}
                                                {adjustment.reason && adjustment.notes && ' — '}
                                                {adjustment.notes}
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className='text-lg font-semibold'>Low Stock Alerts</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-2'>
                            {lowStockProducts.length === 0 ? (
                                <p className='text-sm text-muted-foreground'>All products are above minimum stock levels.</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product</TableHead>
                                            <TableHead className='text-right'>Stock</TableHead>
                                            <TableHead className='text-right'>Min</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lowStockProducts.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell className='text-right text-red-600'>{product.stock}</TableCell>
                                                <TableCell className='text-right'>{product.min_stock}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Authenticated>
    )
}
