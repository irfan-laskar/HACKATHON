import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FeedbackFloatingButton } from '../components/FeedbackFloatingButton';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5EFE1] dark:bg-[#220306] text-[#220306] dark:text-[#F5EFE1] transition-colors duration-200 relative">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FeedbackFloatingButton />
    </div>
  );
};

