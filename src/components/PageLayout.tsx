'use client';

import { Sidebar } from "./Sidebar";
import { LoadingScreen } from "./LoadingScreen";
import LoginPage from "./auth/LoginPage";

interface PageLayoutProps {
  children: React.ReactNode;
  loading?: boolean;
  isAuthenticated?: boolean;
}

export function PageLayout({ children, loading, isAuthenticated }: PageLayoutProps) {
  const renderContent = () => {
    if (loading) {
      return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-3rem)] flex items-center justify-center">
          <LoadingScreen />
        </div>
      );
    }

    if (isAuthenticated === false) {
      return <LoginPage />;
    }

    return children;
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        {renderContent()}
      </main>
    </div>
  );
} 