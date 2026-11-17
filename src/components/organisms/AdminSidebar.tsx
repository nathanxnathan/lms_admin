import { Link } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Users,
  Package,
  Boxes,
  ClipboardList,
  BarChart3,
  Settings,
  Wind,
  ShieldCheck,
  ShoppingCart,
  Newspaper,
  Stethoscope,
  CalendarCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type NavItem = {
  label: string
  to: string
  icon: React.ReactElement
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: <LayoutDashboard className="size-4" />,
  },
  {
    label: 'Courses',
    to: '/course',
    icon: <ClipboardList className="size-4" />,
  },
  {
    label: 'Customers',
    to: '/customers',
    icon: <Users className="size-4" />,
  },
  {
    label: 'Rentals',
    to: '/rentals',
    icon: <ClipboardList className="size-4" />,
  },
  {
    label: 'Products',
    to: '/products',
    icon: <Package className="size-4" />,
  },
  {
    label: 'Orders',
    to: '/orders',
    icon: <ShoppingCart className="size-4" />,
  },
  {
    label: 'Resources',
    to: '/resources',
    icon: <Newspaper className="size-4" />,
  },
  {
    label: 'Doctors',
    to: '/doctors',
    icon: <Stethoscope className="size-4" />,
  },
  {
    label: 'Appointments',
    to: '/appointments',
    icon: <CalendarCheck className="size-4" />,
  },
  {
    label: 'Inventory',
    to: '/inventory',
    icon: <Boxes className="size-4" />,
  },
  // {
  //   label: 'Equipment',
  //   to: '/equipment',
  //   icon: <PackageSearch className="size-4" />,
  // },
  {
    label: 'Reports',
    to: '/reports',
    icon: <BarChart3 className="size-4" />,
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: <Settings className="size-4" />,
  },
  {
    label: 'Admins',
    to: '/admins',
    icon: <ShieldCheck className="size-4" />,
  },
] satisfies NavItem[]

type AdminSidebarProps = {
  className?: string
}

export const AdminSidebar = ({
  className,
}: AdminSidebarProps): React.ReactElement => {
  return (
    <aside
      className={cn(
        'flex h-full w-60 shrink-0 flex-col border-r border-(--line) bg-(--sea-ink)',
        className,
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-white/10">
        <div className="flex size-8 items-center justify-center rounded-lg bg-(--lagoon)">
          <Wind className="size-4 text-white" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold text-white">LMS Admin </span>
          <span className="text-[0.65rem] text-white/50 uppercase tracking-widest">
            Admin
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
              'text-white/55! transition-colors hover:bg-white/8 hover:text-white/90 data-[status=active]:text-white!',
              '[&.active]:bg-white/12 [&.active]:text-white',
              '[&.active]:before:absolute [&.active]:before:left-0 [&.active]:before:top-1.5 [&.active]:before:bottom-1.5',
              '[&.active]:before:w-0.75 [&.active]:before:rounded-full [&.active]:before:bg-(--lagoon)',
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <p className="px-3 text-[0.65rem] text-white/30 uppercase tracking-widest">
          RMBC Services
        </p>
      </div>
    </aside>
  )
}
