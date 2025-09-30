import InputError from '@/Components/InputError'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import type { PageProps, Paginated, Product, StockAdjustment } from '@/types'
import { Head, Link, useForm } from '@inertiajs/react'
import { toast } from 'sonner'

interface AdjustmentPageProps extends PageProps {
    adjustments: Paginated<StockAdjustment>
    products: Array<Pick<Product, 'id' | 'name' | 'product_code' | 'stock'>>
}

interface AdjustmentForm {
    product_id: number | string
    quantity_change: number
    reason: string
    notes: string
}

const formatDateTime = (value: string) =>
    new Date(value).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

export default function Adjustments({ adjustments, products }: AdjustmentPageProps) {
    const { data, setData, post, processing, errors, reset } = useForm<AdjustmentForm>({
        product_id: products[0]?.id ?? '',
        quantity_change: 1,
        reason: '',
        notes: '',
    })

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        post(route('inventory.adjustments.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Stock adjusted successfully')
                reset()
            },
            onError: () => toast.error('Failed to adjust stock'),
        })
    }

    return (
        <Authenticated>
            <Head title='Inventory Adjustments' />
            <div className='mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-2xl font-semibold'>Adjust Stock</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!products.length ? (
                            <p className='text-sm text-muted-foreground'>Add products before recording inventory adjustments.</p>
                        ) : (
                            <form className='grid gap-4 md:grid-cols-2' onSubmit={handleSubmit}>
                            <div className='space-y-2'>
                                <Label htmlFor='product_id'>Product</Label>
                                <Select
                                    value={String(data.product_id)}
                                    onValueChange={(value) => setData('product_id', Number(value))}
                                >
                                    <SelectTrigger id='product_id'>
                                        <SelectValue placeholder='Select product' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((product) => (
                                            <SelectItem key={product.id} value={String(product.id)}>
                                                {product.product_code} — {product.name} (Stock: {product.stock})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.product_id} />
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='quantity_change'>Quantity Change</Label>
                                <Input
                                    id='quantity_change'
                                    type='number'
                                    value={data.quantity_change}
                                    onChange={(event) => setData('quantity_change', Number(event.target.value))}
                                    placeholder='Use negative number to reduce stock'
                                />
                                <InputError message={errors.quantity_change} />
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='reason'>Reason</Label>
                                <Input
                                    id='reason'
                                    value={data.reason}
                                    onChange={(event) => setData('reason', event.target.value)}
                                    placeholder='Damaged, audit, etc.'
                                />
                                <InputError message={errors.reason} />
                            </div>

                            <div className='space-y-2 md:col-span-2'>
                                <Label htmlFor='notes'>Notes</Label>
                                <Textarea
                                    id='notes'
                                    value={data.notes}
                                    onChange={(event) => setData('notes', event.target.value)}
                                    rows={3}
                                />
                                <InputError message={errors.notes} />
                            </div>

                            <div className='md:col-span-2 flex justify-end gap-3'>
                                <Button type='submit' disabled={processing || !products.length}>Submit Adjustment</Button>
                            </div>
                        </form>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className='text-xl font-semibold'>Recent Adjustments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='overflow-x-auto rounded-lg border'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Notes</TableHead>
                                        <TableHead>User</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {adjustments.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className='py-6 text-center text-sm text-muted-foreground'>
                                                No adjustment history.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        adjustments.data.map((adjustment) => (
                                            <TableRow key={adjustment.id}>
                                                <TableCell>{formatDateTime(adjustment.created_at)}</TableCell>
                                                <TableCell>
                                                    <div className='font-medium text-gray-800'>{adjustment.product.name}</div>
                                                    <div className='text-xs text-gray-500'>#{adjustment.product.product_code}</div>
                                                </TableCell>
                                                <TableCell className={adjustment.quantity_change >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                                                    {adjustment.quantity_change > 0 ? '+' : ''}{adjustment.quantity_change}
                                                </TableCell>
                                                <TableCell>{adjustment.reason ?? '-'}</TableCell>
                                                <TableCell>{adjustment.notes ?? '-'}</TableCell>
                                                <TableCell>{adjustment.user.name}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className='mt-4 flex justify-end gap-2 text-sm'>
                            {(adjustments.links as any[] | undefined)?.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size='sm'
                                    disabled={!link.url}
                                    asChild
                                >
                                    <Link href={link.url ?? '#'} preserveScroll>
                                        {/* eslint-disable-next-line react/no-danger */}
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Authenticated>
    )
}
