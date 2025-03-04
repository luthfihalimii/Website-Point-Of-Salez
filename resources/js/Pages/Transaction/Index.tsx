import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Transaction } from '@/types'
import { Head } from '@inertiajs/react'
import React from 'react'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'

interface TransactionIndexProps {
    transaction: Transaction[]
}

export default function Index({ transaction }: TransactionIndexProps) {
    return (
        <Authenticated>
            <Head title='Transaction' />
            <div className='mx-4'>
                <DataTable columns={columns} data={transaction} />
            </div>
        </Authenticated>
    )
}
