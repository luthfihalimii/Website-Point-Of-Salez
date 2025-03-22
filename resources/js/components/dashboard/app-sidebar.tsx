import * as React from "react"
import {
    Book,
    BookOpen,
    Bot,
    Command,
    Frame,
    LifeBuoy,
    LucideLayoutDashboard,
    Map,
    PieChart,
    Send,
    Settings2,
    SquareTerminal,
} from "lucide-react"


import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { usePage } from "@inertiajs/react"

export function AppSidebar() {

    const { url } = usePage()
    const data = {
        navMain: [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: LucideLayoutDashboard,
                isActive: url === "/dashboard"
            },
            {
                title: "Manage",
                url: "#",
                icon: SquareTerminal,
                isActive: url.startsWith("/category") || url.startsWith("/product"),
                items: [
                    {
                        title: "Product Category",
                        url: "/category",
                        isActive: url === "/category"
                    },
                    {
                        title: "Product",
                        url: "/product",
                        isActive: url === "/product"
                    },
                    {
                        title: "transaction",
                        url: "/transaction",
                        isActive: url === "/transaction"
                    },

                ]
            },
            {
                title: "Report",
                url: "#",
                icon: Book,
                //isActive: url.startsWith("/category") || url.startsWith("/product"),
                items: [
                    {
                        title: "Sales Report",
                        url: "/sales-report",
                        isActive: url === "/sales-report"
                    },
                    {
                        title: "Purchases Report",
                        url: "/purchases-report",
                        isActive: url === "/purchases-report"
                    },
                ]
            }
        ]
    }
    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Command className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">Acme Inc</span>
                                    <span className="truncate text-xs">Enterprise</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
