import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { usePermission } from '@/hooks/user-permissions';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
	const page = usePage();
	const { can } = usePermission();
	return (
		<SidebarGroup className="px-2 py-0">
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					const permission = item.permission ?? '';
					const href = item.href ?? '';
					if (!can(permission)) return null;
					return (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild isActive={page.url.startsWith(href)} tooltip={{ children: item.title }}>
								<Link href={href} prefetch>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
