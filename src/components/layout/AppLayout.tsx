/**
 * App Layout
 *
 * Main application layout with sidebar navigation and content area
 */

import { FC, ReactNode } from 'react';
import SyllabusNavigator from './SyllabusNavigator';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar Navigation */}
      <SyllabusNavigator />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
