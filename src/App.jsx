import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Opportunities from "./pages/opportunities/Opportunities";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import AdminPanel from "./pages/admin/AdminPanel";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import { OpportunitiesProvider } from "./contexts/OpportunityContext";
import OpportunityDetail from "./components/opportunities/OpportunityDetail";
import ScrollToTop from "./components/ScrollToTop";
import PublicLayout from "./components/layouts/PublicLayout";
import Profile from "./pages/Profile";
import RoleGuard from "./components/admin/RoleGuard";
import NoAccessFallback from "./components/ui/NoAccessFallback";
import PublicRoute from "./routes/PublicRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import NotFound from "./routes/NotFound";
import AuthCallback from "./routes/AuthCallback";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Analytics />
      <AuthProvider>
        {/* <RoleProvider> */}
        <OpportunitiesProvider>
          <ThemeProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                {/*  RUTAS PÚBLICAS */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/nosotros" element={<About />} />
                  <Route path="/proyectos" element={<Projects />} />
                  <Route
                    path="/edutracker/oportunidad/:id"
                    element={<OpportunityDetail />}
                  />
                  <Route path="/edutracker" element={<Opportunities />} />
                  <Route path="/terminos" element={<TermsPage />} />
                  <Route path="/privacidad" element={<PrivacyPage />} />

                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <Register />
                      </PublicRoute>
                    }
                  />
                </Route>

                {/* 🔒 RUTAS PRIVADAS */}
                <Route
                  path="/perfil"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/adminpanel"
                  element={
                    <ProtectedRoute>
                      <RoleGuard
                        requiredRoles={["admin", "editor"]}
                        fallback={<NoAccessFallback />}
                      >
                        <AdminPanel />
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
              </Routes>

              <Toaster position="bottom-right" />
            </Router>
          </ThemeProvider>
        </OpportunitiesProvider>
        {/* </RoleProvider> */}
      </AuthProvider>
    </div>
  );
}

export default App;
