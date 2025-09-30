import * as React from 'react'
import { Book, Command, LucideLayoutDashboard, SquareTerminal, Users } from 'lucide-react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import { usePage } from '@inertiajs/react'

export function AppSidebar() {
    const { url } = usePage()

    const data = {
        navMain: [
            {
                title: 'Dashboard',
                url: '/dashboard',
                icon: LucideLayoutDashboard,
                isActive: url === '/dashboard',
            },
            {
                title: 'Manage',
                url: '#',
                icon: SquareTerminal,
                isActive: ['/category', '/product', '/partner', '/inventory/adjustments', '/transaction'].some((prefix) => url.startsWith(prefix)),
                items: [
                    {
                        title: 'Product Category',
                        url: '/category',
                        isActive: url.startsWith('/category'),
                    },
                    {
                        title: 'Products',
                        url: '/product',
                        isActive: url.startsWith('/product'),
                    },
                    {
                        title: 'Partners',
                        url: '/partner',
                        isActive: url.startsWith('/partner'),
                    },
                    {
                        title: 'Inventory Adjustments',
                        url: '/inventory/adjustments',
                        isActive: url.startsWith('/inventory/adjustments'),
                    },
                    {
                        title: 'Transactions',
                        url: '/transaction',
                        isActive: url.startsWith('/transaction'),
                    },
                ],
            },
            {
                title: 'Cashier',
                url: '/cash-sessions',
                icon: Users,
                isActive: url.startsWith('/cash-sessions'),
            },
            {
                title: 'Reports',
                url: '#',
                icon: Book,
                items: [
                    {
                        title: 'Sales Report',
                        url: '/sales-report',
                        isActive: url.startsWith('/sales-report') && !url.includes('chart'),
                    },
                    {
                        title: 'Sales Chart',
                        url: '/sales-report-chart',
                        isActive: url.startsWith('/sales-report-chart'),
                    },
                    {
                        title: 'Purchases Report',
                        url: '/purchases-report',
                        isActive: url.startsWith('/purchases-report'),
                    },
                    {
                        title: 'Profit Report',
                        url: '/profit-report',
                        isActive: url.startsWith('/profit-report'),
                    },
                    {
                        title: 'Inventory Report',
                        url: '/inventory-report',
                        isActive: url.startsWith('/inventory-report'),
                    },
                ],
            },
        ],
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size='lg' asChild>
                            <a href='#'>
                                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                                    <Command className='size-4' />
                                </div>
                                <div className='grid flex-1 text-left text-sm leading-tight'>
                                    <span className='truncate font-semibold'>Laravel POS</span>
                                    <span className='truncate text-xs'>Admin Panel</span>
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
