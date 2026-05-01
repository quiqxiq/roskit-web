import {
  Activity,
  BarChart2,
  Bell,
  Bug,
  Construction,
  FileText,
  FileX,
  HelpCircle,
  LayoutDashboard,
  ListTodo,
  Lock,
  MessagesSquare,
  Monitor,
  Package,
  Palette,
  Server,
  ServerOff,
  Settings,
  ShieldCheck,
  Ticket,
  UserCog,
  UserX,
  Users,
  Wifi,
  Wrench,
} from 'lucide-react'
import { ClerkLogo } from '@/assets/clerk-logo'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'admin',
    email: 'admin@mikhmon.local',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'MIKHMON',
      logo: Wifi,
      plan: 'MikroTik Hotspot Monitor',
    },
    {
      name: 'Router-01',
      logo: Server,
      plan: '192.168.88.1 — Online',
    },
    {
      name: 'Warnet-02',
      logo: Monitor,
      plan: '10.0.0.1 — Online',
    },
  ],
  navGroups: [
    {
      title: 'Main',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Hotspot',
          icon: Wifi,
          badge: '38',
          items: [
            { title: 'Users', url: '/hotspot/users' },
            { title: 'Profiles', url: '/hotspot/profiles' },
            { title: 'Active', url: '/hotspot/active' },
            { title: 'Hosts', url: '/hotspot/hosts' },
          ],
        },
        {
          title: 'Voucher',
          icon: Ticket,
          items: [
            { title: 'Generate', url: '/voucher/generate' },
            { title: 'Print Queue', url: '/voucher/print' },
          ],
        },
      ],
    },
    {
      title: 'Monitor',
      items: [
        {
          title: 'Traffic',
          url: '/traffic',
          icon: Activity,
        },
        {
          title: 'Log',
          url: '/log',
          icon: FileText,
        },
        {
          title: 'Report',
          icon: BarChart2,
          items: [
            { title: 'Daily', url: '/report/daily' },
            { title: 'Monthly', url: '/report/monthly' },
          ],
        },
      ],
    },
    {
      title: 'Demo',
      items: [
        {
          title: 'Tasks',
          url: '/tasks',
          icon: ListTodo,
        },
        {
          title: 'Apps',
          url: '/apps',
          icon: Package,
        },
        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: MessagesSquare,
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
        {
          title: 'Secured by Clerk',
          icon: ClerkLogo,
          items: [
            { title: 'Sign In', url: '/clerk/sign-in' },
            { title: 'Sign Up', url: '/clerk/sign-up' },
            { title: 'User Management', url: '/clerk/user-management' },
          ],
        },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: ShieldCheck,
          items: [
            { title: 'Sign In', url: '/sign-in' },
            { title: 'Sign In (2 Col)', url: '/sign-in-2' },
            { title: 'Sign Up', url: '/sign-up' },
            { title: 'Forgot Password', url: '/forgot-password' },
            { title: 'OTP', url: '/otp' },
          ],
        },
        {
          title: 'Errors',
          icon: Bug,
          items: [
            {
              title: 'Unauthorized',
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'Forbidden',
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: 'Not Found',
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: 'Internal Server Error',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
