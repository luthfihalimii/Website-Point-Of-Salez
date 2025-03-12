import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Product, TransactionType } from '@/types'
import { useState } from 'react'

interface ProductSelectionProps {
    products: Product[]
    isOpen: boolean
    onClose: () => void
    onSelect: (product: Product) => void
    transactionType: TransactionType
}

export default function ProductSelection({ products, isOpen, onClose, onSelect, transactionType }: ProductSelectionProps) {

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")

    // Membuat daftar kategori unik dari array produk
    const categories = Array.from(  // Mengubah hasil dari Set menjadi array
        new Set( // Menggunakan Set untuk menyimpan nilai unik dari kategori produk
            products.map((p) => p.category.name) // Mengambil hanya nama kategori dari setiap produk
                .filter((name): name is string => name !== undefined && name !== null) // Menyaring nilai yang tidak undefined atau null agar aman
        )
    )

    // Menyaring produk berdasarkan pencarian dan kategori yang dipilih
    const filteredProducts = products.filter((product) => {
        // Memeriksa apakah produk cocok dengan kata kunci pencarian
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||  // Cek apakah nama produk mengandung searchTerm
            product.product_code.toLowerCase().includes(searchTerm.toLowerCase()) // Cek apakah kode produk mengandung searchTerm

        /**
         * Memeriksa apakah kategori produk cocok dengan kategori yang dipilih
         * Jika kategori yang dipilih adalah "all", maka cocok dengan semua kategori
         * Jika tidak, hanya cocok jika kategori produk sama dengan kategori yang dipilih
         */
        const matchesCategory = selectedCategory === "all" || product.category.name === selectedCategory

        // Data Produk akan dimasukkan ke hasil filter jika sesuai dengan pencarian dan kategori
        return matchesSearch && matchesCategory
    })


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogHeader>
                <DialogTitle className="sr-only">Select Product</DialogTitle>
                <DialogDescription className='sr-only'>Select Product</DialogDescription>
            </DialogHeader>
            <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
                <div className='flex gap-4 my-4'>
                    <Input
                        placeholder='Search products...'
                        className='max-w-sm'
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                    >
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                All Categories
                            </SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className='rounded-md border'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Produk</TableHead>
                                <TableHead>Kode Produk</TableHead>
                                <TableHead>Kategori Produk</TableHead>
                                <TableHead>Harga</TableHead>
                                <TableHead>Harga Jual</TableHead>
                                <TableHead>Stok</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className='text-center'>
                                        Produk tidak ditemukan
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.product_code}</TableCell>
                                        <TableCell>{product.category.name || "-"}</TableCell>

                                        <TableCell>
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR"
                                            }).format(product.price)}
                                        </TableCell>

                                        <TableCell>
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR"
                                            }).format(product.selling_price)}
                                        </TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>{transactionType === "SALE" && product.stock <= 0 ? (
                                            <span className='text-red-500'>Out of stock</span>
                                        ) : (
                                            <Button size={"sm"} onClick={() => { onSelect(product); onClose() }}>
                                                Select
                                            </Button>
                                        )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    )
}
