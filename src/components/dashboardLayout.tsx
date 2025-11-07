"use client"

import { memo, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Users, 
  MessageCircle, 
  CircleUser, 
  Settings, 
  UserCog, 
  Menu,
  HeartIcon,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { LogoutButton } from "./auth/logout-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { name: "Dashboard", href: "/account/dashboard", icon: Home },
  { name: "Chat", href: "/account/chats", icon: MessageCircle },
  { name: "Profile", href: "/account/profile", icon: CircleUser },
  { name: "Settings", href: "/account/settings", icon: Settings },
  { name: "Users", href: "/account/users", icon: Users },
  { name: "Onboarding", href: "/account/onboarding", icon: UserCog },
];

function DashboardUserLayout() {
  const pathname = usePathname();

  // Mock user data - replace with actual user context
  const userLevel = { level: 5, xp: 250, requiredXp: 300 };
  const superLikes = 3;

  // Memoize navigation items for bottom nav (first 4 items)
  const bottomNavItems = useMemo(() => {
    return navItems.slice(0, 4).map((item) => {
      const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-all duration-200 rounded-xl min-w-0 flex-1",
            isActive 
              ? "text-pink-500 bg-pink-50 dark:bg-pink-500/10 font-medium scale-105" 
              : "text-muted-foreground hover:text-foreground hover:bg-accent hover:scale-105"
          )}
          aria-current={isActive ? "page" : undefined}
        >
          <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-pink-500")} />
          <span className="truncate">{item.name}</span>
        </Link>
      );
    });
  }, [pathname]);

  // Remaining nav items for dropdown
  const dropdownNavItems = useMemo(() => {
    return navItems.slice(4).map((item) => {
      const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
      return (
        <DropdownMenuItem key={item.href} asChild>
          <Link
            href={item.href}
            className={cn(
              "flex items-center gap-2 w-full cursor-pointer",
              isActive && "bg-accent text-accent-foreground font-medium"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
          </Link>
        </DropdownMenuItem>
      );
    });
  }, [pathname]);

  // Desktop sidebar nav items
  const sidebarNavItems = useMemo(() => {
    return navItems.map((item) => {
      const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 rounded-xl group relative overflow-hidden",
            isActive 
              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-md shadow-pink-500/20" 
              : "text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm font-medium"
          )}
          aria-current={isActive ? "page" : undefined}
        >
          {isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-rose-400 opacity-0 group-hover:opacity-20 transition-opacity" />
          )}
          <item.icon className={cn(
            "h-5 w-5 shrink-0 transition-all duration-200 relative z-10",
            isActive ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-pink-500 group-hover:scale-110"
          )} />
          <span className="relative z-10">{item.name}</span>
        </Link>
      );
    });
  }, [pathname]);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 lg:bg-gradient-to-b lg:from-white lg:to-gray-50/50 lg:dark:from-gray-900 lg:dark:to-gray-900/95 lg:backdrop-blur-sm lg:border-r lg:border-gray-200/80 lg:dark:border-gray-800/80 lg:shadow-sm">
        {/* Desktop Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200/80 dark:border-gray-800/80">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 p-2.5 rounded-xl shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/40 transition-all duration-300 group-hover:scale-105">
              <HeartIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text text-transparent">
              Mayalu
            </span>
          </Link>
        </div>
        
        {/* User Info Card */}
        <div className="mx-4 my-5">
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-2xl p-4 border border-pink-100 dark:border-pink-900/30 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 w-12 ring-2 ring-pink-200 dark:ring-pink-800">
                <AvatarImage src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600" />
                <AvatarFallback className="bg-gradient-to-br from-pink-400 to-rose-400 text-white">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-gray-900 dark:text-gray-100">John Doe</p>
                <p className="text-xs text-pink-600 dark:text-pink-400 font-medium">Premium Member</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/80 dark:bg-gray-800/80 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800 font-semibold">
                <Zap className="h-3 w-3 mr-1" />
                Level {userLevel.level}
              </Badge>
              <Badge variant="secondary" className="bg-white/80 dark:bg-gray-800/80 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 font-semibold">
                <Zap className="h-3 w-3 mr-1 text-blue-500" />
                {superLikes} Super
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          {sidebarNavItems}
        </nav>
        
        {/* Desktop Footer Actions */}
        <div className="p-4 border-t border-gray-200/80 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/50 space-y-2">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
            <ModeToggle />
          </div>
          <LogoutButton />
        </div>
      </aside>
      
      {/* Mobile/Tablet Top Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 p-2 rounded-xl shadow-md shadow-pink-500/20 group-hover:shadow-pink-500/40 transition-all duration-300 group-hover:scale-105">
              <HeartIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text text-transparent">
              Mayalu
            </span>
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 px-2.5 py-1.5 rounded-lg border border-pink-200 dark:border-pink-900/30">
              <Badge variant="secondary" className="text-xs font-semibold bg-white/80 dark:bg-gray-800/80 border-0">
                Lv.{userLevel.level}
              </Badge>
              <div className="flex items-center gap-1 px-1.5">
                <Zap className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{superLikes}</span>
              </div>
            </div>
            <Avatar className="h-9 w-9 ring-2 ring-pink-200 dark:ring-pink-800">
              <AvatarImage src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600" />
              <AvatarFallback className="bg-gradient-to-br from-pink-400 to-rose-400 text-white text-xs">JD</AvatarFallback>
            </Avatar>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Bottom Navigation for Mobile/Tablet */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/98 dark:bg-gray-900/98 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-lg safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2.5">
          {/* Main nav items */}
          {bottomNavItems}
          
          {/* More menu dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs h-auto min-w-0 flex-1 transition-all duration-200 rounded-xl hover:bg-accent hover:scale-105"
              >
                <Menu className="h-5 w-5" />
                <span className="truncate">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mb-2 shadow-xl">
              {dropdownNavItems}
              <DropdownMenuItem asChild>
                <div className="flex items-center gap-2 w-full cursor-pointer">
                  <LogoutButton />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </>
  );
}

export default memo(DashboardUserLayout);