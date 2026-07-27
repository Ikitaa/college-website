import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";

import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";

// ================= PUBLIC PAGES =================

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import CoursesPage from "./pages/CoursesPage";
import ContactPage from "./pages/ContactPage";
import NoticesPage from "./pages/NoticesPage";
import GalleryPagee from "./pages/GalleryPage";
import FacultyPagee from "./pages/FacultyPagee";
import FacultyDetailsPage from "./pages/FacultyDetailsPage";
import AdmissionPage from "./pages/AdmissionPage";
import DashboardCoursesPage from "./pages/DashboardCoursesPage";
import DashboardNoticesPage from "./pages/DashboardNoticesPage";
import GalleryDetailPage from "./pages/GalleryDetailPage";
import CourseDetailPage from "./pages/CourseDetailPage";

// ================= USER PAGES =================

import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";

// ================= ADMIN PAGES =================

import AdminOverview from "./pages/admin/AdminOverview";
import UserPage from "./pages/admin/UserPage";
import AdmissionsPage from "./pages/admin/AdmissionPage";
import AdminNoticesPage from "./pages/admin/NoticesPage";
import AdminCoursesPage from "./pages/admin/CoursesPage";
import GalleryPage from "./pages/admin/GalleryPage";
import MessagesPage from "./pages/admin/MessagesPage";
import SettingsPage from "./pages/admin/SettingsPage";
import FacultyPage from "./pages/admin/FacultyPage";
import DepartmentsPage from "./pages/admin/DepartmentsPage";

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Toaster
            position="top-center"
            toastOptions={{ duration: 4000 }}
          />

          <Routes>

            {/* ================= PUBLIC WEBSITE ================= */}

            <Route element={<MainLayout />}>

              <Route path="/" element={<HomePage />} />

              <Route path="/login" element={<LoginPage />} />

              <Route path="/register" element={<RegisterPage />} />

              <Route path="/about" element={<AboutPage />} />

              <Route path="/courses" element={<CoursesPage />} />

              <Route path="/contact" element={<ContactPage />} />

              <Route path="/notices" element={<NoticesPage />} />

              <Route path="/gallery" element={<GalleryPagee />} />

              <Route path="/admission" element={<AdmissionPage />} />

              <Route path="/faculty" element={<FacultyPagee />} />
              <Route path="/courses/:id" element={<CourseDetailPage/>} />
              <Route path="/gallery/:id" element={<GalleryDetailPage />} />
              <Route
                path="/faculty/:id"
                element={<FacultyDetailsPage />}
              />

            </Route>

            {/* ================= USER DASHBOARD ================= */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["student", "teacher"]}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
  path="/dashboard/courses"
  element={
    <ProtectedRoute allowedRoles={["student", "teacher"]}>
      <DashboardCoursesPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard/notices"
  element={
    <ProtectedRoute allowedRoles={["student", "teacher"]}>
      <DashboardNoticesPage />
    </ProtectedRoute>
  }
/>

            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["student", "teacher"]}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
  path="/gallery/:id"
  element={<GalleryDetailPage />}
/>
<Route
  path="/courses/:id"
  element={<CourseDetailPage />}
/>

            {/* ================= ADMIN DASHBOARD ================= */}

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >

              <Route index element={<AdminOverview />} />

              <Route
                path="users"
                element={<UserPage />}
              />

              <Route
                path="admissions"
                element={<AdmissionsPage />}
              />

              <Route
                path="notices"
                element={<AdminNoticesPage />}
              />

              <Route
                path="courses"
                element={<AdminCoursesPage />}
              />

              <Route
                path="faculty"
                element={<FacultyPage />}
              />

              <Route
                path="gallery"
                element={<GalleryPage />}
              />

              <Route
                path="messages"
                element={<MessagesPage />}
              />

              <Route
                path="settings"
                element={<SettingsPage />}
              />

              <Route
                path="departments"
                element={<DepartmentsPage />}
              />

            </Route>

          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;