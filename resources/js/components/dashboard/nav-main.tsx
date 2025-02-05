import { ChevronRight, type LucideIcon } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { usePage } from "@inertiajs/react"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
            isActive?: boolean
        }[]
    }[]
}) {

    const { url } = usePage()
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isParentActive = item.isActive || item.items?.some((subItem) => url.startsWith(subItem.url))

                    return (
                        <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip={item.title} data-active={isParentActive}>
                                    <a href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                                {item.items?.length ? (
                                    <>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuAction className="data-[state=open]:rotate-90">
                                                <ChevronRight />
                                                <span className="sr-only">Toggle</span>
                                            </SidebarMenuAction>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items.map((subItem) => {
                                                    const isSubItemActive = url.startsWith(subItem.url)
                                                    return (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild data-active={isSubItemActive}>
                                                                <a href={subItem.url}>
                                                                    <span>{subItem.title}</span>
                                                                </a>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    )
                                                })}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </>
                                ) : null}
                            </SidebarMenuItem>
                        </Collapsible>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
