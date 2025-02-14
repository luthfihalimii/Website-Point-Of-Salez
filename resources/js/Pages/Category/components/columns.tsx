import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Category } from "@/types"
import { router } from "@inertiajs/react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"

export const columns: ColumnDef<Category>[] = [
    {
        accessorKey: "id",
        header: "No",
        cell: ({ row }) => row.index + 1
    },
    {
        accessorKey: "name",
        header: "Kategori",
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const category = row.original
            const [isDialogOpen, setIsDialogOpen] = useState(false)

            const onDelete = () => {
                //
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
                                onClick={() =>
                                {router.visit(route('category.edit',category.id))}}
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Komponen ALert Dialog */}
                </>
            )
        }
    },
]
