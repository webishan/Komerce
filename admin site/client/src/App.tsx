import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/layout/AdminLayout";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Merchants from "@/pages/merchants";
import Customers from "@/pages/customers";
import Analytics from "@/pages/analytics";
import Rewards from "@/pages/rewards";
import SystemSettings from "@/pages/settings";
import CoFounders from "@/pages/co-founders";
import Staff from "@/pages/staff";
import CustomerCare from "@/pages/customer-care";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [language, setLanguage] = useState<string>("en");
  const [selectedCountry, setSelectedCountry] = useState<string>("global");

  // Show landing page for unauthenticated users
  if (isLoading || !isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={Landing} />
      </Switch>
    );
  }

  // Authenticated routes with admin layout
  return (
    <AdminLayout
      language={language}
      onLanguageChange={setLanguage}
      selectedCountry={selectedCountry}
      onCountryChange={setSelectedCountry}
    >
      <Switch>
        <Route path="/">
          <Dashboard language={language} selectedCountry={selectedCountry} />
        </Route>
        <Route path="/merchants">
          <Merchants language={language} selectedCountry={selectedCountry} />
        </Route>
        <Route path="/merchants/:type">
          <Merchants language={language} selectedCountry={selectedCountry} />
        </Route>
        <Route path="/customers">
          <Customers language={language} selectedCountry={selectedCountry} />
        </Route>
        <Route path="/rewards">
          <Rewards language={language} selectedCountry={selectedCountry} />
        </Route>
        <Route path="/analytics">
          <Analytics language={language} selectedCountry={selectedCountry} />
        </Route>
        <Route path="/settings">
          <SystemSettings language={language} selectedCountry={selectedCountry} />
        </Route>
        <Route path="/co-founders">
          <CoFounders language={language} selectedCountry={selectedCountry} />
        </Route>
        <Route path="/staff">
          <Staff language={language} selectedCountry={selectedCountry} />
        </Route>
        <Route path="/customer-care">
          <CustomerCare language={language} selectedCountry={selectedCountry} />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
