import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { PageProps, Partner } from '@/types'
import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import { toast } from 'sonner'

interface PartnerIndexProps extends PageProps {
    partners: Partner[]
}

export default function Index({ partners }: PartnerIndexProps) {
    const [loadingId, setLoadingId] = useState<number | null>(null)

    const handleDelete = (id: number) => {
        setLoadingId(id)
        router.delete(route('partner.destroy', id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Partner deleted'),
            onError: () => toast.error('Failed to delete partner'),
            onFinish: () => setLoadingId(null),
        })
    }

    return (
        <Authenticated>
            <Head title='Partners' />
            <div className='mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8'>
                <Card>
                    <CardHeader className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
                        <CardTitle className='text-2xl font-semibold'>Business Partners</CardTitle>
                        <Button asChild>
                            <Link href={route('partner.create')}>Add Partner</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className='overflow-x-auto rounded-lg border'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='w-12'>#</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className='w-32 text-right'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {partners.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className='py-6 text-center text-sm text-muted-foreground'>
                                                No partner data yet.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        partners.map((partner, index) => (
                                            <TableRow key={partner.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell className='font-medium'>{partner.type === 'SUPPLIER' ? 'Supplier' : 'Customer'}</TableCell>
                                                <TableCell>
                                                    <div className='font-semibold text-gray-800'>{partner.name}</div>
                                                    <div className='text-xs text-gray-500'>{partner.email ?? '-'}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className='text-sm'>{partner.phone ?? '-'}</div>
                                                    {partner.contact_person && (
                                                        <div className='text-xs text-gray-500'>Attn: {partner.contact_person}</div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                                                        partner.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'
                                                    }`}>
                                                        {partner.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className='flex justify-end gap-2'>
                                                    <Button variant='outline' size='sm' asChild>
                                                        <Link href={route('partner.edit', partner.id)}>Edit</Link>
                                                    </Button>
                                                    <Button
                                                        variant='destructive'
                                                        size='sm'
                                                        onClick={() => handleDelete(partner.id)}
                                                        disabled={loadingId === partner.id}
                                                    >
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Authenticated>
    )
}
