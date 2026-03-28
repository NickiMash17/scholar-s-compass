import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { StudyProvider } from "@/context/StudyContext";
import { CloudSyncProvider } from "@/components/CloudSyncProvider";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Diagnostic from "./pages/Diagnostic";
import GeneratePlan from "./pages/GeneratePlan";
import StudyPlan from "./pages/StudyPlan";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ProgressDashboard from "./pages/ProgressDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <StudyProvider>
            <CloudSyncProvider />
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/diagnostic" element={<Diagnostic />} />
              <Route path="/generate" element={<GeneratePlan />} />
              <Route path="/plan" element={<StudyPlan />} />
              <Route path="/dashboard" element={<StudyPlan />} />
              <Route path="/profile" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </StudyProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
