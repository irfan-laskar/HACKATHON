import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { MainLayout } from './layouts/MainLayout';

// Core 9 Scaletrix Restaurant Growth Pages
import { Home } from './pages/Home';
import { Problems } from './pages/Problems';
import { Solutions } from './pages/Solutions';
import { ProblemFinder } from './pages/ProblemFinder';
import { BusinessTools } from './pages/BusinessTools';
import { GrowthPlanner } from './pages/GrowthPlanner';
import { Dashboard } from './pages/Dashboard';
import { LearningHub } from './pages/LearningHub';
import { AboutContact } from './pages/AboutContact';
import { FeedbackPage } from './pages/Feedback';

// Complementary Community & Academy Pages
import { KnowledgeHub } from './pages/KnowledgeHub';
import { ArticleDetail } from './pages/ArticleDetail';
import { VideoPlatform } from './pages/VideoPlatform';
import { VideoWatch } from './pages/VideoWatch';
import { StartupAcademy } from './pages/StartupAcademy';
import { BrandingPhotography } from './pages/BrandingPhotography';
import { LegalCompliance } from './pages/LegalCompliance';
import { InfluencerCollab } from './pages/InfluencerCollab';
import { BlogList } from './pages/BlogList';
import { BlogCreate } from './pages/BlogCreate';
import { CreatorDashboard } from './pages/CreatorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { SearchPage } from './pages/SearchPage';
import { ProfilePage } from './pages/ProfilePage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                {/* 9 Core Scaletrix Restaurant Growth Pages */}
                <Route index element={<Home />} />
                <Route path="problems" element={<Problems />} />
                <Route path="solutions" element={<Solutions />} />
                <Route path="problem-finder" element={<ProblemFinder />} />
                <Route path="tools" element={<BusinessTools />} />
                <Route path="growth-planner" element={<GrowthPlanner />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="learning-hub" element={<LearningHub />} />
                <Route path="about" element={<AboutContact />} />
                <Route path="feedback" element={<FeedbackPage />} />

                {/* Additional Merged Features & Resources */}
                <Route path="knowledge-hub" element={<KnowledgeHub />} />
                <Route path="articles/:slug" element={<ArticleDetail />} />
                <Route path="videos" element={<VideoPlatform />} />
                <Route path="videos/:slug" element={<VideoWatch />} />
                <Route path="startup-academy" element={<StartupAcademy />} />
                <Route path="branding-photography" element={<BrandingPhotography />} />
                <Route path="legal-compliance" element={<LegalCompliance />} />
                <Route path="influencer-collab" element={<InfluencerCollab />} />
                <Route path="blog" element={<BlogList />} />
                <Route path="blog/create" element={<BlogCreate />} />
                <Route path="creator/dashboard" element={<CreatorDashboard />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
            <Analytics />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
