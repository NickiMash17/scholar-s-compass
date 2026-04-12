import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/context/AuthContext";
import { StudyProvider } from "@/context/StudyContext";
import { CloudSyncProvider } from "@/components/CloudSyncProvider";
import { PageTransition } from "@/components/PageTransition";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Diagnostic from "./pages/Diagnostic";
import GeneratePlan from "./pages/GeneratePlan";
import StudyPlan from "./pages/StudyPlan";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ProgressDashboard from "./pages/ProgressDashboard";
import MobileBottomNav from "./components/MobileBottomNav";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/diagnostic" element={<PageTransition><Diagnostic /></PageTransition>} />
        <Route path="/generate" element={<PageTransition><GeneratePlan /></PageTransition>} />
        <Route path="/plan" element={<PageTransition><StudyPlan /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><StudyPlan /></PageTransition>} />
        <Route path="/progress" element={<PageTransition><ProgressDashboard /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <StudyProvider>
            <CloudSyncProvider />
            <Toaster />
            <Sonner />
            <AnimatedRoutes />
            <MobileBottomNav />
          </StudyProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
