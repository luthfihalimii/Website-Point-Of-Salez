import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Product } from '@/types'
import { Head } from '@inertiajs/react'
import React from 'react'

interface DetailProductProps {
    product: Product
}

export default function Detail({ product }: DetailProductProps) {

    return (
        <Authenticated>
            <Head title={product.name} />
            <div className='container mx-auto px-4'>
                <div className='grid gap-8 md:grid-cols-2'>

                    <div className='space-y-4'>
                        <Card className='border-0 shadow-none'>
                            <CardContent className='p-0'>
                                <img
                                    src={product.image}
                                    alt='product-img'
                                    className='rounded-lg object-cover aspect-square'
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className='space-y-6'>
                        <div>
                            <h1 className='text-3xl font-bold'>{product.name}</h1>
                            <div className='flex justify-between gap-2'>
                                <p className='text-2xl font-semibold mt-2'>
                                    <span>Harga</span>
                                    <p>Rp {product.price.toLocaleString("id-ID")}</p>
                                </p>
                                <p className='text-2xl font-semibold mt-2'>
                                    <span>Harga Jual</span>
                                    <p>Rp {product.selling_price.toLocaleString("id-ID")}</p>
                                </p>
                            </div>

                            <div className='flex items-center gap-2 mt-2'>
                                <span className='text-sm text-muted-foreground'>
                                    Stok :
                                </span>
                                <span className='text-sm font-medium'>
                                    {product.stock}
                                </span>
                            </div>
                        </div>

                        <Separator />

                        <div className='space-y-4'>
                            <h2 className='text-xl font-semibold'>
                                Deskripsi
                            </h2>
                            <p className='text-muted-foreground leading-relaxed'>
                                {product.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    )
}
