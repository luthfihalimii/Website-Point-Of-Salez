import InputError from '@/Components/InputError'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import Authenticated from '@/Layouts/AuthenticatedLayout'
import { cn } from '@/lib/utils'
import { Category } from '@/types'
import { Head, useForm } from '@inertiajs/react'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface CreateProductProps {
    category: Category[]
}

export default function Create({ category }: CreateProductProps) {

    const { data, setData, post, processing, errors } = useForm({
        product_code: "",
        name: "",
        slug: "",
        description: "",
        image: null as File | null,
        stock: "",
        min_stock: "0",
        price: "",
        selling_price: "",
        is_active: true,
        category_id: 0
    })

    /** useState dibawah untuk menyimpan kode produk yang akan dibuat
     * dan preview gambar produk yang akan diupload
     */
    const [productCode, setProductCode] = useState<string>("")
    const [preview, setPreview] = useState<string | null>(null)

    /** Kode berikut untuk menghandle perubahan kategori produk yang dipilih
     */
    const handleCategoryChange = async (categoryId: string) => {
        /**
         * Mengubah category_id menjadi tipe number
         */
        const numericCategoryId = parseInt(categoryId)
        setData("category_id", numericCategoryId)

        /**
         * Fetch data terakhir dari nomor produk berdasarkan kategori produk yang dipilih
         * dan mengubah kode produk berdasarkan kategori produk yang dipilih
         */
        try {
            const response = await fetch(`/products/last-number/${categoryId}`)
            const result = await response.json()

            /**
             * Mengambil data kategori produk yang dipilih berdasarkan id kategori produk
             * dan membuat kode produk berdasarkan nama kategori produk yang dipilih dan tanggal hari ini
             * serta menambahkan nomor produk terakhir yang didapatkan dari server sebagai suffix
             * dan mengubah kode produk yang akan dibuat ke dalam state productCode dan data product_code
             * yang akan dikirimkan ke server saat submit form produk baru dibuat
             */
            const selectedCategoryData = category.find((cat) => cat.id === numericCategoryId)
            if (selectedCategoryData) {
                const prefix = selectedCategoryData.name.slice(0, 3).toLowerCase()
                const today = new Date().toLocaleDateString("id-ID").replace(/\//g, "")
                const newCode = `${prefix}-${today}-${String(result.last_number + 1).padStart(2, "0")}`

                setProductCode(newCode)
                setData("product_code", newCode)
            }
        } catch (error) {
            console.error("Error fetching last product number");
        }
    }

    /** Kode berikut untuk menghandle perubahan gambar produk yang akan diupload
     */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        /**
         * Mengambil file gambar yang dipilih oleh user dan menyimpannya ke dalam state image
         * serta menampilkan preview gambar produk yang akan diupload ke dalam state preview
         * untuk ditampilkan ke user sebelum mengupload gambar produk ke server saat submit
         * form produk baru dibuat oleh user
         */
        const files = e.target.files
        if (files && files[0]) {
            setData("image", files[0])
            setPreview(URL.createObjectURL(files[0]))
        }
    }

    /** Kode berikut untuk menghandle submit form produk baru yang dibuat oleh user
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post(route('product.store'), {
            onSuccess: () => {
                toast.success("Produk berhasil ditambahkan")
            },
            onError: () => {
                toast.error("Produk gagal ditambahkan")
            }
        })
    }

    return (
        <Authenticated>
            <Head title='Tambah Produk' />
            <div className="flex justify-center items-center my-4">
                <Card className="max-w-5xl w-full">
                    <CardHeader>
                        <p className='font-serif font-extrabold'>
                            <small>*Pilih kategori produk untuk membuat kode produk</small> <br />
                            <small>*Upload file gambar produk jika diperlukan</small>
                        </p>
                    </CardHeader>
                    <Separator />
                    <CardContent>
                        <div className="py-6">
                            <div className="mx-auto sm:px-6 lg:px-8">
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                                        <div className="grid gap-2">
                                            <Label>Kategori Produk</Label>
                                            <Select
                                                name='category_id'
                                                onValueChange={handleCategoryChange}
                                                disabled={processing}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih Kategori Produk" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {category.map((item) => (
                                                        <SelectItem
                                                            key={item.id}
                                                            value={item.id.toString()}
                                                        >
                                                            {item.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.category_id} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Kode Produk</Label>
                                            <Input
                                                value={productCode}
                                                name="product_code"
                                                readOnly
                                                className={cn(errors.product_code ? 'border border-red-500' : '')}
                                            />
                                            <InputError message={errors.product_code} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Nama Produk</Label>
                                            <Input
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                disabled={processing}
                                                onChange={(e) => setData("name", e.target.value)}
                                                className={cn(errors.name ? 'border border-red-500' : '')}
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Harga Produk</Label>
                                            <Input
                                                type="number"
                                                name="price"
                                                value={data.price}
                                                disabled={processing}
                                                onChange={(e) => setData("price", e.target.value)}
                                                className={cn(errors.price ? 'border border-red-500' : '')}
                                            />
                                            <InputError message={errors.price} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Harga Jual Produk</Label>
                                            <Input
                                                type="number"
                                                name="selling_price"
                                                disabled={processing}
                                                value={data.selling_price}
                                                onChange={(e) => setData("selling_price", e.target.value)}
                                                className={cn(errors.selling_price ? 'border border-red-500' : '')}
                                            />
                                            <InputError message={errors.selling_price} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Stok Produk</Label>
                                            <Input
                                                type='number'
                                                name='stock'
                                                value={data.stock}
                                                disabled={processing}
                                                onChange={(e) => setData('stock', e.target.value)}
                                                className={cn(errors.stock ? 'border border-red-500' : '')}
                                            />
                                            <InputError message={errors.stock} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Minimum Stock</Label>
                                            <Input
                                                type="number"
                                                name="min_stock"
                                                value={data.min_stock}
                                                disabled={processing}
                                                onChange={(e) => setData("min_stock", e.target.value)}
                                                className={cn(errors.min_stock ? 'border border-red-500' : '')}
                                            />
                                            <InputError message={errors.min_stock} />
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    id="is_active"
                                                    type="checkbox"
                                                    checked={data.is_active}
                                                    disabled={processing}
                                                    onChange={(e) => setData("is_active", e.target.checked)}
                                                    className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <Label htmlFor="is_active">Product is active</Label>
                                            </div>
                                            <InputError message={errors.is_active} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Upload File</Label>
                                            <Input
                                                type="file"
                                                name="image"
                                                disabled={processing}
                                                onChange={handleImageChange}
                                                className={cn(errors.image ? 'border border-red-500' : '')}
                                            />
                                            <InputError message={errors.image} />
                                        </div>
                                        <div className='grid gap-2'>
                                            {preview && (
                                                <img
                                                    src={preview}

                                                    alt="preview"
                                                    className='mt-2 w-fit h-48 object-cover rounded-lg'
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className='grid gap-2'>
                                        <Label>Deskripsi Produk</Label>
                                        <Textarea
                                            name='description'
                                            value={data.description}
                                            disabled={processing}
                                            onChange={(e) => setData("description", e.target.value)}
                                            className={cn(errors.description ? 'border border-red-500' : '')}
                                        />
                                        <InputError message={errors.description} />
                                    </div>


                                    <Button type="submit" disabled={processing}>
                                        Submit
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Authenticated>
    )
}
