import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Product } from "@/types"
import { router } from "@inertiajs/react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "id",
        header: "No",
        cell: ({ row }) => row.index + 1
    },
    {
        accessorKey: "product_code",
        header: "Kode Produk",
    },

    {
        accessorKey: "name",
        header: "Nama Produk",
    },

    {
        accessorKey: "price",
        header: "Harga Produk",
        cell:({row}) => {
            const price = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("id-ID",{
                style:"currency",
                currency:"IDR",
            }).format(price);

            return formatted
        },
    },

    {
        accessorKey: "selling_price",
        header: "Harga Jual Produk",
        cell:({row}) => {
            const selling_price = parseFloat(row.getValue("selling_price"))
            const formatted = new Intl.NumberFormat("id-ID",{
                style:"currency",
                currency:"IDR",
            }).format(selling_price);

            return formatted
        },
    },

    {
        accessorKey: "stock",
        header: "Stok",
    },

    {
        accessorKey: "min_stock",
        header: "Min Stock",
    },

    {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => {
            const isActive = Boolean(row.getValue('is_active'))
            return (
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
                    {isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
    },

    {
        accessorKey: "category",
        header: "Kategori Produk",
        cell:({row}) => row.original.category.name
    },

    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const product = row.original
            const [isDialogOpen, setIsDialogOpen] = useState(false)

            const onDelete = (id: number) => {
                router.delete(route('product.destroy', id), {
                    onSuccess: () => {
                        toast.success("Produk berhasil dihapus")
                    },
                    onError: () => {
                        toast.error("Produk gagal dihapus")
                    }
                })
                setIsDialogOpen(false)
            }

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => { router.visit(route('product.edit', product.id)) }}
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => { router.visit(route('product.show', product.id)) }}
                            >
                                Detail
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                setTimeout(() => setIsDialogOpen(true),100)
                            }}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Hapus produk {product.name}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Apakah anda yakin ingin menghapus produk ini ? tindakan ini
                                    tidak dapat dibatalkan.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(product.id)}>
                                    Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </>
            )
        }
    },
]
