import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Product, Transaction } from "@/types"
import { router } from "@inertiajs/react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "created_at",
        header: () => {
            return (
                <Button variant={"ghost"}>
                    Date
                    <ArrowUpDown className="ml-2 size-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue('created_at'))
            return date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }
    },

    {
        accessorKey: "type",
        header: () => {
            return (
                <Button variant={"ghost"}>
                    Type
                    <ArrowUpDown className="ml-2 size-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const type = row.getValue("type") as string
            return (
                <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${type} === 'PURCHASE` ? 'bg-green-500' : 'bg-red-50'} />
                    <span className={type === 'PURCHASE' ? 'text-green-600' : 'text-red-600'}>
                        {type === 'PURCHASE' ? 'Purchase' : 'Sale'}
                    </span>
                </div>
            )
        }
    },

    {
        accessorKey: "total_amount",
        header: ({ column }) => {
            return (
                <Button variant={"ghost"} onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Total
                    <ArrowUpDown className="ml-2 size-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("total_amount"))
            const formatted = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
            }).format(amount);

            return formatted
        },
    },

    {
        accessorKey: "items",
        header: "Items",
        cell: ({ row }) => {
            const items = row.original.items
            const itemsList = items.map(item => `${item.product.name} (${item.quantity})`).join(", ")

            return (
                <div className="max-w-[300px] truncate" title={itemsList}>
                    {itemsList}
                </div>
            )
        },
    },

    {
        accessorKey: "notes",
        header: "Notes",
        cell: ({ row }) => {
            const notes = row.getValue("notes") as string
            return notes || "-"
        },
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
                                setTimeout(() => setIsDialogOpen(true), 100)
                            }}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>

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
                    </AlertDialog> */}

                </>
            )
        }
    },
]
