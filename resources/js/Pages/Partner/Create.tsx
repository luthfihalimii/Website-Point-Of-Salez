import InputError from '@/Components/InputError'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { PageProps } from '@/types'
import { Head, useForm } from '@inertiajs/react'
import { toast } from 'sonner'

type PartnerForm = {
    type: 'CUSTOMER' | 'SUPPLIER'
    name: string
    contact_person: string
    phone: string
    email: string
    address: string
    tax_number: string
    notes: string
    is_active: boolean
}

export default function Create(props: PageProps) {
    const { data, setData, post, processing, errors } = useForm<PartnerForm>({
        type: 'CUSTOMER',
        name: '',
        contact_person: '',
        phone: '',
        email: '',
        address: '',
        tax_number: '',
        notes: '',
        is_active: true,
    })

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        post(route('partner.store'), {
            onSuccess: () => toast.success('Partner created'),
            onError: () => toast.error('Unable to create partner'),
        })
    }

    return (
        <Authenticated>
            <Head title='Add Partner' />
            <div className='mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8'>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-2xl font-semibold'>Add New Partner</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className='space-y-6' onSubmit={handleSubmit}>
                            <div className='grid gap-4 md:grid-cols-2'>
                                <div className='space-y-2'>
                                    <Label htmlFor='type'>Partner Type</Label>
                                    <Select value={data.type} onValueChange={(value) => setData('type', value as PartnerForm['type'])}>
                                        <SelectTrigger id='type'>
                                            <SelectValue placeholder='Select type' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='CUSTOMER'>Customer</SelectItem>
                                            <SelectItem value='SUPPLIER'>Supplier</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.type} />
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='name'>Business Name</Label>
                                    <Input
                                        id='name'
                                        value={data.name}
                                        onChange={(event) => setData('name', event.target.value)}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='contact_person'>Contact Person</Label>
                                    <Input
                                        id='contact_person'
                                        value={data.contact_person}
                                        onChange={(event) => setData('contact_person', event.target.value)}
                                    />
                                    <InputError message={errors.contact_person} />
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='phone'>Phone</Label>
                                    <Input
                                        id='phone'
                                        value={data.phone}
                                        onChange={(event) => setData('phone', event.target.value)}
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='email'>Email</Label>
                                    <Input
                                        id='email'
                                        type='email'
                                        value={data.email}
                                        onChange={(event) => setData('email', event.target.value)}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='tax_number'>Tax Number</Label>
                                    <Input
                                        id='tax_number'
                                        value={data.tax_number}
                                        onChange={(event) => setData('tax_number', event.target.value)}
                                    />
                                    <InputError message={errors.tax_number} />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='address'>Address</Label>
                                <Textarea
                                    id='address'
                                    value={data.address}
                                    onChange={(event) => setData('address', event.target.value)}
                                    rows={3}
                                />
                                <InputError message={errors.address} />
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='notes'>Notes</Label>
                                <Textarea
                                    id='notes'
                                    value={data.notes}
                                    onChange={(event) => setData('notes', event.target.value)}
                                    rows={3}
                                />
                                <InputError message={errors.notes} />
                            </div>

                            <div className='space-y-1'>
                                <div className='flex items-center gap-2'>
                                    <input
                                        id='is_active'
                                        type='checkbox'
                                        checked={data.is_active}
                                        onChange={(event) => setData('is_active', event.target.checked)}
                                        className='size-4 rounded border-gray-300 text-primary focus:ring-primary'
                                    />
                                    <Label htmlFor='is_active'>Active partner</Label>
                                </div>
                                <InputError message={errors.is_active} />
                            </div>

                            <div className='flex justify-end gap-3'>
                                <Button type='submit' disabled={processing}>
                                    Save Partner
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Authenticated>
    )
}
