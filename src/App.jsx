import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import News from "./pages/News";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/admin/AdminPanel";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { OpportunityProvider } from "./contexts/OpportunityContext";
import OpportunityDetail from "./pages/dashboard/OpportunityDetail";
import ScrollToTop from "./components/ScrollToTop";
import FooterWrapper from "./layouts/FooterWrapper";
import HeaderWrapper from "./layouts/HeaderWrapper";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthProvider>
        <OpportunityProvider>
          <Router>
            <ScrollToTop />
            <HeaderWrapper />
            <main className="flex-grow">
              <Routes>
                <Route
                  path="/edutracker/opportunity/:id"
                  element={<OpportunityDetail />}
                />
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/news" element={<News />} />
                <Route
                  path="/edutracker"
                  element={
                    // <ProtectedRoute>
                    <Dashboard />
                    // </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            {/* <Footer /> */}
            <FooterWrapper />

            <Toaster position="top-right" />
          </Router>
        </OpportunityProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
