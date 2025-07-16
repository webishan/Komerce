import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-green-500/5">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-green-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            KOMARCE Admin
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Unified Loyalty Platform Management
          </p>
          <p className="text-gray-500 text-sm font-bengali mt-1">
            ইউনিফাইড লয়্যালটি প্ল্যাটফর্ম ব্যবস্থাপনা
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-600">
            <p>Access the comprehensive admin dashboard for:</p>
            <ul className="mt-2 space-y-1">
              <li>• Multi-vendor marketplace management</li>
              <li>• Customer loyalty & rewards system</li>
              <li>• Multi-country operations</li>
              <li>• Analytics & reporting</li>
            </ul>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
          >
            Sign In to Dashboard
          </Button>

          <div className="text-center text-xs text-gray-500">
            <p>Secure authentication via Replit</p>
            <p className="font-bengali">রেপলিট এর মাধ্যমে নিরাপদ প্রমাণীকরণ</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
