import InputError from '@/Components/InputError'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { cn } from '@/lib/utils'
import { Head, useForm } from '@inertiajs/react'
import React from 'react'
import { toast } from 'sonner'

export default function Create() {

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: ""
    })

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        post(route('category.store'), {
            onSuccess: () => {
                toast.success("Kategori berhasil ditambahkan")
            },
            onError: () => {
                toast.error("Gagal menambahkan kategori")
            }
        })
    }

    return (
        <Authenticated>
            <Head title='Create Category' />

            <div className='py-3'>
                <div className='mx-auto max-w-lg sm:px-6 lg:px-8'>
                    <Card>
                        <CardHeader>Tambah Kategori</CardHeader>
                        <CardContent>

                            <form onSubmit={onSubmit}>
                                <div className='flex flex-col gap-5'>
                                    <div className='grid gap-2'>
                                        <Label>Nama Kategori</Label>
                                        <Input
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            type='text'
                                            className={cn(errors.name ? "border-red-600 border-1" : "", "input-base-class")}
                                            disabled={processing}
                                        />
                                        <InputError message={errors.name}/>
                                    </div>

                                    {/* Textarea  */}
                                    <div className='gap-y-2'>
                                        <Button type='submit'>Submit</Button>
                                    </div>
                                </div>
                            </form>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </Authenticated>
    )
}
