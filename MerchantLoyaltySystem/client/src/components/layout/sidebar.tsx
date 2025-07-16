import { Link, useLocation } from "wouter";
import { Crown, ChartLine, Gift, Coins, Users, Wallet, BellRing, Trophy, UserCircle, Star } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: ChartLine },
  { name: "Loyalty Points", href: "/loyalty-points", icon: Gift },
  { name: "Cashback", href: "/cashback", icon: Coins },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Wallets", href: "/wallets", icon: Wallet },
  { name: "Marketing Tools", href: "/marketing", icon: BellRing },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Profile", href: "/profile", icon: UserCircle },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { merchant } = useAuth();

  return (
    <div className="w-64 hero-gradient shadow-2xl">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <Crown className="text-komarce-purple w-6 h-6" />
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">KOMARCE</h1>
            <p className="text-blue-100 text-sm">Merchant Portal</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <a className={cn(
                  "sidebar-item flex items-center space-x-3 p-3 rounded-lg transition-all",
                  isActive 
                    ? "bg-white bg-opacity-20 text-white" 
                    : "text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-10"
                )}>
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </a>
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-8 p-4 bg-white bg-opacity-10 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-komarce-amber rounded-full flex items-center justify-center">
              <Star className="text-white w-4 h-4" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">{merchant?.rank || "Star Merchant"}</p>
              <p className="text-blue-100 text-xs">Current Rank</p>
            </div>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div className="bg-komarce-amber h-2 rounded-full" style={{ width: "75%" }} />
          </div>
          <p className="text-blue-100 text-xs mt-2">75% to next rank</p>
        </div>
      </div>
    </div>
  );
}
