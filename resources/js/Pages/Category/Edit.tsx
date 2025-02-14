import InputError from '@/Components/InputError'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { cn } from '@/lib/utils'
import { Category } from '@/types'
import { Head, useForm } from '@inertiajs/react'
import React from 'react'
import { toast } from 'sonner'

export default function Edit({category}:{category:Category}) {

    const { data, setData, post, processing, errors } = useForm({
        name: category.name|| "",
        description: category.description || "",
        _method:"PUT"
    })

    const onUpdate = (e: React.FormEvent) => {
        e.preventDefault()

        post(route('category.update',category.id), {
            onSuccess: () => {
                toast.success("Kategori berhasil diupdate")
            },
            onError: () => {
                toast.error("Gagal update kategori")
            }
        })
    }

    return (
        <Authenticated>
            <Head title='Update Category' />

            <div className='py-3'>
                <div className='mx-auto max-w-lg sm:px-6 lg:px-8'>
                    <Card>
                        <CardHeader>Update Kategori</CardHeader>
                        <CardContent>

                            <form onSubmit={onUpdate}>
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
