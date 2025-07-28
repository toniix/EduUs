import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import News from "./pages/News";
import Dashboard from "./pages/opportunities/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/admin/AdminPanel";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { OpportunityProvider } from "./contexts/OpportunityContext";
import OpportunityDetail from "./components/opportunities/OpportunityDetail";
import ScrollToTop from "./components/ScrollToTop";
import PublicLayout from "./components/layouts/PublicLayout";
import AdminLayout from "./components/layouts/AdminLayout";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthProvider>
        <OpportunityProvider>
          <Router>
            <ScrollToTop />
            {/* <HeaderWrapper /> */}
            <main className="flex-grow">
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
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/edutracker" element={<Dashboard />} />
                </Route>

                {/* 🔒 RUTAS PRIVADAS */}
                {/* <Route
                  path="/edutracker"
                  element={
                    <ProtectedRoute>
                      <AdminLayout>
                        <Dashboard />
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                /> */}

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout>
                        <AdminPanel />
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            {/* <Footer /> */}
            {/* <FooterWrapper /> */}

            <Toaster position="top-right" />
          </Router>
        </OpportunityProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
