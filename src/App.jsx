import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import { LazyMotion, domAnimation } from "framer-motion";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import { OpportunitiesProvider } from "./contexts/OpportunityContext";
import ScrollToTop from "./components/ScrollToTop";
import PublicLayout from "./components/layouts/PublicLayout";
import RoleGuard from "./routes/RoleGuard";
import NoAccessFallback from "./components/ui/NoAccessFallback";
import PublicRoute from "./routes/PublicRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import AuthCallback from "./routes/AuthCallback";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Páginas
import Home from "./pages/Home";
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Opportunities = lazy(() => import("./pages/opportunities/Opportunities"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const TermsPage = lazy(() => import("./pages/Terms"));
const PrivacyPage = lazy(() => import("./pages/Privacy"));
const AdminPanel = lazy(() => import("./pages/admin/AdminPanel"));
const OpportunityDetail = lazy(
  () => import("./components/opportunities/OpportunityDetail"),
);
const Profile = lazy(() => import("./pages/Profile"));
const JoinUs = lazy(() => import("./pages/JoinUs"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Fallback global mientras se carga un chunk de ruta
const PageLoader = () => (
  <LoadingSpinner fullScreen={true} message="Cargando aplicación..." />
);

function App() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen flex flex-col">
        <Analytics />
        <AuthProvider>
          {/* <RoleProvider> */}
          <ThemeProvider>
            <Router>
              <ScrollToTop />
              <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/*  RUTAS PÚBLICAS */}
                    <Route element={<PublicLayout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/nosotros" element={<About />} />
                      <Route path="/proyectos" element={<Projects />} />
                      <Route path="/unete" element={<JoinUs />} />
                      <Route
                        element={
                          <OpportunitiesProvider>
                            <Outlet />
                          </OpportunitiesProvider>
                        }
                      >
                        <Route path="/edutracker" element={<Opportunities />} />
                        <Route
                          path="/edutracker/oportunidad/:idOrSlug"
                          element={<OpportunityDetail />}
                        />
                      </Route>
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

                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>

                <Toaster position="bottom-right" />
              </Router>
            </ThemeProvider>
          {/* </RoleProvider> */}
        </AuthProvider>
      </div>
    </LazyMotion>
  );
}

export default App;
