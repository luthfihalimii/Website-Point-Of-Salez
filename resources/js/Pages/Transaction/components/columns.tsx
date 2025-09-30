import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { Transaction } from '@/types'
import { router } from '@inertiajs/react'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value)

const statusColor: Record<Transaction['status'], string> = {
    COMPLETED: 'bg-emerald-100 text-emerald-700',
    CANCELED: 'bg-red-100 text-red-700',
    RETURNED: 'bg-amber-100 text-amber-700',
}

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: 'transaction_date',
        header: ({ column }) => (
            <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Date
                <ArrowUpDown className='ml-2 size-4' />
            </Button>
        ),
        cell: ({ row }) => {
            const date = row.getValue<string>('transaction_date')
            if (!date) return '-'

            return new Date(date).toLocaleString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })
        },
    },
    {
        accessorKey: 'no_transaction',
        header: 'Transaction No.',
        cell: ({ row }) => row.getValue('no_transaction') ?? '-',
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
            const type = row.getValue<string>('type')
            const isSale = type === 'SALE'
            return (
                <div className='flex items-center gap-2'>
                    <span className={`h-2 w-2 rounded-full ${isSale ? 'bg-emerald-500' : 'bg-sky-500'}`} />
                    <span className={isSale ? 'text-emerald-700' : 'text-sky-700'}>
                        {isSale ? 'Sale' : 'Purchase'}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue<Transaction['status']>('status')
            const color = statusColor[status]
            return (
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${color}`}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                </span>
            )
        },
    },
    {
        accessorKey: 'partner.name',
        header: 'Partner',
        cell: ({ row }) => {
            const partner = row.original.partner
            return partner ? partner.name : 'Walk-in'
        },
    },
    {
        accessorKey: 'total_amount',
        header: ({ column }) => (
            <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Total
                <ArrowUpDown className='ml-2 size-4' />
            </Button>
        ),
        cell: ({ row }) => formatCurrency(Number(row.getValue('total_amount')) || 0),
    },
    {
        accessorKey: 'payment_method',
        header: 'Payment',
        cell: ({ row }) => row.getValue('payment_method') ?? '-',
    },
    {
        accessorKey: 'items',
        header: 'Items',
        cell: ({ row }) => {
            const items = row.original.items ?? []
            const itemsList = items.map((item) => `${item.product.name} (${item.quantity})`).join(', ')

            return (
                <div className='max-w-xs truncate text-sm' title={itemsList}>
                    {itemsList || '-'}
                </div>
            )
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const transaction = row.original

            const handleCancel = () => {
                router.post(route('transaction.cancel', transaction.id), undefined, {
                    onSuccess: () => toast.success('Transaction canceled'),
                    onError: () => toast.error('Failed to cancel transaction'),
                    preserveScroll: true,
                })
            }

            const handleReturn = () => {
                router.post(route('transaction.return', transaction.id), undefined, {
                    onSuccess: () => toast.success('Transaction marked as returned'),
                    onError: () => toast.error('Failed to mark return'),
                    preserveScroll: true,
                })
            }

            const canManage = transaction.status === 'COMPLETED'

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                            <span className='sr-only'>Open menu</span>
                            <MoreHorizontal className='h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.visit(route('transaction.show', transaction.id))}>
                            View Detail
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleCancel}
                            disabled={!canManage}
                        >
                            Cancel
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleReturn}
                            disabled={!canManage}
                        >
                            Mark as Returned
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
