import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WalletCardProps {
  title: string;
  balance: string | number;
  description: string;
  icon: LucideIcon;
  type: "reward" | "income" | "komarce";
  details?: Array<{
    label: string;
    value: string | number;
  }>;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "secondary" | "outline";
  }>;
  loading?: boolean;
}

export default function WalletCard({
  title,
  balance,
  description,
  icon: Icon,
  type,
  details,
  actions,
  loading = false,
}: WalletCardProps) {
  const typeColors = {
    reward: "bg-komarce-purple bg-opacity-20 text-komarce-purple",
    income: "bg-komarce-emerald bg-opacity-20 text-komarce-emerald", 
    komarce: "bg-komarce-amber bg-opacity-20 text-komarce-amber",
  };

  const balanceColors = {
    reward: "text-komarce-purple",
    income: "text-komarce-emerald",
    komarce: "text-komarce-amber",
  };

  if (loading) {
    return (
      <Card className={`wallet-card ${type}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`wallet-card ${type}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-800">{title}</CardTitle>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[type]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className={`text-3xl font-bold mb-2 ${balanceColors[type]}`}>
          {balance}
        </p>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        
        {details && (
          <div className="space-y-2 mb-4">
            {details.map((detail, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{detail.label}</span>
                <span className="font-medium">{detail.value}</span>
              </div>
            ))}
          </div>
        )}
        
        {actions && (
          <div className="space-y-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant || "default"}
                className="w-full"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
