import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Category, Product } from '@/types'
import { Head } from '@inertiajs/react'
import React from 'react'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'

interface ProductIndexProps {
    products: Product[]
}

export default function Index({ products }: ProductIndexProps) {
    return (
        <Authenticated>
            <Head title='List Produk' />
            <div className='mx-4'>
                <DataTable columns={columns} data={products} />
            </div>
        </Authenticated>
    )
}
