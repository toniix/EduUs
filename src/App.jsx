import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import News from "./pages/News";
import Opportunities from "./pages/opportunities/Opportunities";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/admin/AdminPanel";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import { OpportunityProvider } from "./contexts/OpportunityContext";
import OpportunityDetail from "./components/opportunities/OpportunityDetail";
import ScrollToTop from "./components/ScrollToTop";
import PublicLayout from "./components/layouts/PublicLayout";
import PrivateLayout from "./components/layouts/PrivateLayout";
import Profile from "./pages/Profile";
import RoleGuard from "./components/admin/RoleGuard";
import { RoleProvider } from "./contexts/RoleContext";
import NoAccessFallback from "./components/ui/NoAccessFallback";
import PublicRoute from "./routes/PublicRoute";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthProvider>
        <RoleProvider>
          <OpportunityProvider>
            <Router>
              <ScrollToTop />
              {/* <HeaderWrapper /> */}
              {/* <main className="flex-grow"> */}
              <Routes>
                {/* 🌐 RUTAS PÚBLICAS */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/news" element={<News />} />
                  <Route
                    path="/edutracker/opportunity/:id"
                    element={<OpportunityDetail />}
                  />
                  <Route path="/edutracker" element={<Opportunities />} />

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
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <RoleGuard
                        requiredRoles={["admin", "editor"]}
                        fallback={<NoAccessFallback />}
                      >
                        <PrivateLayout>
                          <AdminPanel />
                        </PrivateLayout>
                      </RoleGuard>
                    </ProtectedRoute>
                  }
                />
              </Routes>
              {/* </main> */}

              <Toaster position="top-right" />
            </Router>
          </OpportunityProvider>
        </RoleProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
