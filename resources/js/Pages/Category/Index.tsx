import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Category } from '@/types'
import { Head } from '@inertiajs/react'
import React from 'react'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'

interface CategoryIndexProps {
    category: Category[]
}

export default function Index({ category }: CategoryIndexProps) {
    return (
        <Authenticated>
            <Head title='List Kategori Produk' />
            <div className='mx-4'>
                <DataTable columns={columns} data={category} />
            </div>
        </Authenticated>
    )
}
