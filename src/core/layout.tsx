/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Shared UI Shell / Layout
// Renders dynamic responsive sidebars and headers based on active user role and registry NavItems.

import React, { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';
import { getNavItemsForRole, NavItem } from './registry';
import { DEFAULT_USERS } from './mockDb';
import { User, UserRole } from './types';
import MascotWidget from '../components/mascot/MascotWidget';

// Simple Lucide Icon Component to dynamically render registry icon shapes safely
export function DynamicIcon({ name, className = "w-5 h-5", ...props }: { name: string; className?: string; [key: string]: any }) {
  const IconComponent = (Lucide as any)[name];
  if (!IconComponent) {
    return <Lucide.HelpCircle className={className} {...props} />;
  }
  return <IconComponent className={className} {...props} />;
}

interface ShellProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentView: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export function Shell({
  currentRole,
  onRoleChange,
  currentView,
  onNavigate,
  children
}: ShellProps) {
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_USERS[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const user = DEFAULT_USERS.find(u => u.role === currentRole);
    if (user) {
      setCurrentUser(user);
    }
  }, [currentRole]);

  const navItems = getNavItemsForRole(currentRole);

  const handleSignOut = () => {
    // Go back to sign in
    onNavigate('/signin');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Banner and Navigation bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors md:hidden"
            id="toggle-sidebar"
          >
            <Lucide.Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('/')}>
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold shadow-md shadow-red-100">
              <Lucide.GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-black">Mind Mate</span>
            <span className="bg-red-50 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium hidden sm:inline">LMS</span>
          </div>
        </div>

        {/* Quick Role Switcher for seamless UX testing */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/50">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">Preview Role:</span>
            {(['student', 'teacher'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => {
                  onRoleChange(role);
                  // Dynamic redirect based on switch
                  if (role === 'student') onNavigate('/student/courses');
                  else if (role === 'teacher') onNavigate('/teacher/dashboard');
                }}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  currentRole === role
                    ? 'bg-black text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                id={`switch-to-${role}`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-slate-800">{currentUser.name}</div>
              <div className="text-xs font-medium text-slate-400 capitalize">{currentUser.role} Account</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center font-bold">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              title="Sign Out"
              id="sign-out-btn"
            >
              <Lucide.LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex flex-row">
        {/* Responsive Sidebar */}
        <aside 
          className={`
            bg-white border-r border-slate-200 flex-shrink-0 w-64 flex flex-col justify-between transition-all duration-300 z-40
            ${isSidebarOpen ? 'ml-0' : '-ml-64 md:ml-0'}
            fixed md:sticky top-[61px] h-[calc(100vh-61px)]
          `}
          id="app-sidebar"
        >
          <div className="py-6 px-4 flex-1 overflow-y-auto">
            <nav className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-3 mb-3">Navigation</div>
              {navItems.map((item) => {
                const isActive = currentView === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      onNavigate(item.path);
                      if (window.innerWidth < 768) setIsSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                      ${isActive 
                        ? 'bg-red-50 text-red-600 shadow-xs border-r-4 border-red-600 pl-2' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                    `}
                    id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <DynamicIcon 
                      name={item.icon} 
                      className={`w-5 h-5 transition-transform group-hover:scale-105 ${isActive ? 'text-red-600 font-semibold' : 'text-slate-400 group-hover:text-slate-600'}`} 
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Details */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
            <div className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-2xs">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Sandbox Server</span>
              </div>
              <div className="text-xs font-mono text-slate-500 text-ellipsis overflow-hidden">
                port: 3000 (standard)
              </div>
            </div>
            
            <div className="text-[10px] text-slate-400 text-center font-medium">
              Mind Mate LMS Architecture © 2026
            </div>
          </div>
        </aside>

        {/* Overlay for small screens when sidebar is open */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/10 backdrop-blur-xs z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Primary View Container */}
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 relative min-w-0">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {currentRole === 'student' && <MascotWidget />}

    </div>
  );
}
