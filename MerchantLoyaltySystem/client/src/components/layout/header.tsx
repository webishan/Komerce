import { Bell } from "lucide-react";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { merchant } = useAuth();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Merchant Dashboard</h2>
          <p className="text-gray-600">
            Welcome back, <span className="font-semibold">{merchant?.firstName} {merchant?.lastName}</span>
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="text-gray-500 w-6 h-6 cursor-pointer hover:text-komarce-purple transition-colors" />
            <div className="notification-dot">
              <span className="text-white text-xs">3</span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-komarce-purple to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {merchant?.firstName?.charAt(0) || "M"}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-gray-800 font-medium text-sm">
                    {merchant?.firstName} {merchant?.lastName}
                  </p>
                  <p className="text-gray-500 text-xs">
                    ID: {merchant?.referralId}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Security</DropdownMenuItem>
              <DropdownMenuItem>Help & Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
