import InputError from '@/Components/InputError'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { CashSession, PageProps, Paginated } from '@/types'
import { Head, Link, useForm } from '@inertiajs/react'
import { toast } from 'sonner'

interface CashSessionPageProps extends PageProps {
    activeSession: CashSession | null
    sessions: Paginated<CashSession>
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value)

const formatDateTime = (value: string | null | undefined) =>
    value
        ? new Date(value).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : '-'

export default function Index({ activeSession, sessions }: CashSessionPageProps) {
    const openForm = useForm({
        opening_balance: 0,
        notes: '',
    })

    const closeForm = useForm({
        closing_balance: 0,
        cash_sales_total: 0,
        notes: '',
    })

    const submitOpen = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        openForm.post(route('cash-sessions.store'), {
            onSuccess: () => {
                toast.success('Cash session started')
                openForm.reset()
            },
            onError: () => toast.error('Failed to open cash session'),
        })
    }

    const submitClose = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!activeSession) return

        closeForm.post(route('cash-sessions.close', activeSession.id), {
            onSuccess: () => {
                toast.success('Cash session closed')
                closeForm.reset()
            },
            onError: () => toast.error('Failed to close cash session'),
        })
    }

    return (
        <Authenticated>
            <Head title='Cash Sessions' />
            <div className='mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8'>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-2xl font-semibold'>Cash Drawer Management</CardTitle>
                        <CardDescription>
                            Track cashier shifts, opening balances, and daily reconciliation.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {activeSession ? (
                            <div className='space-y-6'>
                                <div className='rounded-lg border bg-muted/40 p-4'>
                                    <h3 className='text-lg font-semibold'>Active Session</h3>
                                    <div className='mt-2 grid gap-1 text-sm text-muted-foreground'>
                                        <span>Opened at: {formatDateTime(activeSession.opened_at)}</span>
                                        <span>Opening balance: {formatCurrency(activeSession.opening_balance)}</span>
                                        <span>Expected balance so far: {formatCurrency(activeSession.expected_balance)}</span>
                                    </div>
                                </div>

                                <form className='grid gap-4 md:grid-cols-3' onSubmit={submitClose}>
                                    <div className='space-y-2'>
                                        <Label htmlFor='cash_sales_total'>Recorded Sales</Label>
                                        <Input
                                            id='cash_sales_total'
                                            type='number'
                                            min={0}
                                            value={closeForm.data.cash_sales_total}
                                            onChange={(event) => closeForm.setData('cash_sales_total', Number(event.target.value))}
                                        />
                                        <InputError message={closeForm.errors.cash_sales_total} />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='closing_balance'>Closing Balance</Label>
                                        <Input
                                            id='closing_balance'
                                            type='number'
                                            min={0}
                                            value={closeForm.data.closing_balance}
                                            onChange={(event) => closeForm.setData('closing_balance', Number(event.target.value))}
                                        />
                                        <InputError message={closeForm.errors.closing_balance} />
                                    </div>
                                    <div className='space-y-2 md:col-span-1'>
                                        <Label htmlFor='closing-notes'>Notes</Label>
                                        <Input
                                            id='closing-notes'
                                            value={closeForm.data.notes}
                                            onChange={(event) => closeForm.setData('notes', event.target.value)}
                                            placeholder='Optional notes'
                                        />
                                        <InputError message={closeForm.errors.notes} />
                                    </div>
                                    <div className='md:col-span-3 flex justify-end gap-2'>
                                        <Button type='submit' disabled={closeForm.processing}>
                                            Close Session
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <form className='grid gap-4 md:grid-cols-3' onSubmit={submitOpen}>
                                <div className='space-y-2'>
                                    <Label htmlFor='opening_balance'>Opening Balance</Label>
                                    <Input
                                        id='opening_balance'
                                        type='number'
                                        min={0}
                                        value={openForm.data.opening_balance}
                                        onChange={(event) => openForm.setData('opening_balance', Number(event.target.value))}
                                    />
                                    <InputError message={openForm.errors.opening_balance} />
                                </div>
                                <div className='space-y-2 md:col-span-2'>
                                    <Label htmlFor='notes'>Notes</Label>
                                    <Input
                                        id='notes'
                                        value={openForm.data.notes}
                                        onChange={(event) => openForm.setData('notes', event.target.value)}
                                        placeholder='Optional notes'
                                    />
                                    <InputError message={openForm.errors.notes} />
                                </div>
                                <div className='md:col-span-3 flex justify-end gap-2'>
                                    <Button type='submit' disabled={openForm.processing}>
                                        Start Session
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className='text-xl font-semibold'>Session History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='overflow-x-auto rounded-lg border'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Opened</TableHead>
                                        <TableHead>Closed</TableHead>
                                        <TableHead>Opening</TableHead>
                                        <TableHead>Closing</TableHead>
                                        <TableHead>Difference</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sessions.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className='py-6 text-center text-sm text-muted-foreground'>
                                                No session history yet.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        sessions.data.map((session) => (
                                            <TableRow key={session.id}>
                                                <TableCell>{formatDateTime(session.opened_at)}</TableCell>
                                                <TableCell>{formatDateTime(session.closed_at ?? null)}</TableCell>
                                                <TableCell>{formatCurrency(session.opening_balance)}</TableCell>
                                                <TableCell>{formatCurrency(session.closing_balance)}</TableCell>
                                                <TableCell className={session.difference >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                                                    {formatCurrency(session.difference)}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                                                        session.status === 'OPEN' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                                    }`}>
                                                        {session.status}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className='mt-4 flex justify-end gap-2 text-sm'>
                            {(sessions.links as any[] | undefined)?.map((link, index) => (
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
