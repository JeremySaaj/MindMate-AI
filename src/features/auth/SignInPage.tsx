/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Sign In Page implementation
// Fulfills requirements SI-01 to SI-08 fully, enabling simulated credentials and role authentication.

import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
import { UserRole } from '../../core/types';

interface SignInPageProps {
  onNavigate: (path: string) => void;
  onRoleChange: (role: UserRole) => void;
}

export function SignInPage({ onNavigate, onRoleChange }: SignInPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Auxiliary views: 'login' | 'signup' | 'forgot'
  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Pre-seed fill helpers to delight users/testers
  const handleSelectMock = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setEmail(selectedRole === 'student' ? 'student@mindmate.edu' : selectedRole === 'teacher' ? 'teacher@mindmate.edu' : 'admin@mindmate.edu');
    setPassword('demo1234');
    setErrorMsg('');
  };

  const isFormValid = email.length > 0 && password.length > 0 && role !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }
    if (!role) {
      setErrorMsg('Please select your role (Student or Teacher).');
      return;
    }

    // Simulate login matches
    const isValidDemo = password.length >= 4;
    if (isValidDemo) {
      onRoleChange(role as UserRole);
      if (role === 'student') {
        onNavigate('/student/courses');
      } else if (role === 'teacher') {
        onNavigate('/teacher/dashboard');
      } else {
        onNavigate('/example');
      }
    } else {
      setErrorMsg('Invalid password. Demo mode requires at least 4 characters.');
    }
  };

  if (authView === 'signup') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-red-650 items-center justify-center text-white font-bold mb-4 shadow-md shadow-red-100">
            <Lucide.GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Classroom Account</h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">Register as a Student or Teacher on Mind Mate.</p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10 space-y-6">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">I want to register as:</label>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-3 px-4 border rounded-xl font-bold flex flex-col items-center gap-1.5 transition-all text-xs ${
                    role === 'student'
                      ? 'border-red-600 bg-red-50 text-red-700 shadow-3xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Lucide.User className="w-5 h-5 text-red-600" />
                  Student Member
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`py-3 px-4 border rounded-xl font-bold flex flex-col items-center gap-1.5 transition-all text-xs ${
                    role === 'teacher'
                      ? 'border-red-600 bg-red-50 text-red-700 shadow-3xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Lucide.GraduationCap className="w-5 h-5 text-black" />
                  Teacher Instructor
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">FullName Address</label>
                <input
                  type="text"
                  placeholder="e.g. Alex"
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl shadow-3xs placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Lecturer / Student Email</label>
                <input
                  type="email"
                  placeholder="name@university.edu"
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl shadow-3xs placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl shadow-3xs placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                />
              </div>
            </div>

            <button
              onClick={() => setAuthView('login')}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-hidden transition-all shadow-red-100"
            >
              Register & Sign In
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthView('login')}
                className="text-xs font-bold text-red-600 hover:text-red-700"
              >
                Already have an account? Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (authView === 'forgot') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-red-600 items-center justify-center text-white font-bold mb-4 shadow-md shadow-red-100">
            <Lucide.Key className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reset Password</h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">Retrieve access instructions for your classroom account.</p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10 space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Account login email</label>
              <input
                type="email"
                placeholder="name@university.edu"
                className="mt-1 block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl shadow-3xs placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
              />
            </div>

            <button
              onClick={() => {
                alert('Mock password reset code has been sent. Returning to credentials sign in...');
                setAuthView('login');
              }}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-hidden transition-all shadow-red-100"
            >
              Verify & Send Email
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthView('login')}
                className="text-xs font-bold text-red-600 hover:text-red-700"
              >
                Nevermind, go back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-red-650 items-center justify-center text-white font-bold mb-4 shadow-md shadow-red-100 cursor-pointer" onClick={() => onNavigate('/')}>
          <Lucide.GraduationCap className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight" id="si-logo">Mind Mate LMS</h2>
        <p className="mt-2 text-sm text-slate-500 font-semibold" id="si-subtitle">Sign in to continue.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-4 sm:px-10 border border-slate-200/80 shadow-md rounded-2xl space-y-6">
          
          {/* Quick Demo Assist Banner */}
          <div className="bg-red-50/50 rounded-xl p-3.5 border border-red-100/50 space-y-2">
            <span className="text-[10px] uppercase font-bold text-red-655 tracking-wider block mb-1">
              Select a Quick-login role:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectMock('student')}
                className="bg-white hover:bg-red-50 border border-red-100 rounded-lg py-1.5 text-xs font-bold text-red-700 shadow-3xs transition-all flex flex-col items-center"
              >
                <Lucide.User className="w-4 h-4 text-red-500 mb-0.5" />
                Student
              </button>
              <button
                type="button"
                onClick={() => handleSelectMock('teacher')}
                className="bg-white hover:bg-red-50 border border-red-100 rounded-lg py-1.5 text-xs font-bold text-red-700 shadow-3xs transition-all flex flex-col items-center"
              >
                <Lucide.GraduationCap className="w-4 h-4 text-black mb-0.5" />
                Teacher
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Field: Role Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Verify your role</label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value as UserRole);
                  setErrorMsg('');
                }}
                className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl shadow-3xs focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                id="role-select"
              >
                <option value="">-- Choose Account Role --</option>
                <option value="student">Student Account</option>
                <option value="teacher">Teacher Instructor Account</option>
              </select>
            </div>

            {/* Email field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Email Address (Registered)</label>
              <div className="mt-1 relative rounded-md shadow-3xs">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEmail(val);
                    setErrorMsg('');
                    if (val.toLowerCase().includes('student')) {
                      setRole('student');
                    } else if (val.toLowerCase().includes('teacher')) {
                      setRole('teacher');
                    } else if (val.toLowerCase().includes('admin')) {
                      setRole('admin');
                    }
                  }}
                  placeholder="your-email@edu.me"
                  className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                  id="email-input"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Access Key Password</label>
              <div className="mt-1 relative rounded-md shadow-3xs">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="••••••••"
                  className="block w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium"
                  id="password-input"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs py-2 px-3.5 rounded-lg font-bold flex items-center gap-1.5" id="login-error">
                <Lucide.AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Prominent "Sign in" button below the fields */}
            <button
              type="submit"
              className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-xs text-sm font-bold text-white transition-all bg-red-650 hover:bg-black cursor-pointer shadow-md shadow-red-150"
              id="signin-submit"
            >
              Sign in
            </button>

            {/* Secondary actions */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setAuthView('forgot')}
                className="text-xs font-bold text-red-600 hover:text-red-700"
                id="forgot-password"
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={() => setAuthView('signup')}
                className="text-xs font-bold text-red-600 hover:text-red-700"
                id="signup-link"
              >
                No account? Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
