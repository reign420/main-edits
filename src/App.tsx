import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import { Analytics } from "@vercel/analytics/next"
import HomePage from './components/HomePage';
import LearnAboutUs from './components/LearnAboutUs';
import ClientForm from './components/ClientForm';
import JobApplicationForm from './components/JobApplicationForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [currentSection, setCurrentSection] = useState<'home' | 'quote' | 'learn' | 'careers' | 'admin'>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate or reuse a session-scoped UUID to dedupe visit logs
  const getSessionId = () => {
    try {
      const existing = sessionStorage.getItem('visit_session_id');
      if (existing) return existing;
      const newId = (crypto && 'randomUUID' in crypto) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem('visit_session_id', newId);
      return newId;
    } catch {
      return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
  };

  const markPathLogged = (path: string) => {
    try {
      const key = 'visit_logged_paths';
      const raw = sessionStorage.getItem(key);
      const set = new Set<string>(raw ? JSON.parse(raw) : []);
      set.add(path);
      sessionStorage.setItem(key, JSON.stringify(Array.from(set)));
    } catch {}
  };

  const hasPathBeenLogged = (path: string) => {
    try {
      const raw = sessionStorage.getItem('visit_logged_paths');
      const arr: string[] = raw ? JSON.parse(raw) : [];
      return arr.includes(path);
    } catch {
      return false;
    }
  };

  const logVisit = async (path: string) => {
    // Dedupe per session per path
    if (hasPathBeenLogged(path)) return;
    const sessionId = getSessionId();
    const referrer = document.referrer || null;
    const userAgent = navigator.userAgent || null;
    try {
      await supabase.from('website_visits').insert({
        path,
        referrer,
        user_agent: userAgent,
        session_id: sessionId
      });
      markPathLogged(path);
    } catch (e) {
      // Swallow errors; analytics should not break UX
      console.warn('Visit log failed', e);
    }
  };

  // Initialize Taboola Pixel - runs once on app mount
  useEffect(() => {
    // Initialize Taboola array
    (window as any)._tfa = (window as any)._tfa || [];
    (window as any)._tfa.push({notify: 'event', name: 'page_view', id: 1952824});
    
    // Check if script is already loaded
    if (!document.getElementById('tb_tfa_script')) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.id = 'tb_tfa_script';
      script.src = 'https://cdn.taboola.com/libtrc/unip/1952824/tfa.js';
      script.async = true;
      
      // Add onload handler for debugging
      script.onload = () => {
        console.log('Taboola pixel script loaded successfully');
      };
      
      script.onerror = () => {
        console.error('Failed to load Taboola pixel script');
      };
      
      // Insert script into document
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        // Fallback: append to head if no script tags exist
        document.head.appendChild(script);
      }
      
      console.log('Taboola pixel initialized');
    }
  }, []); // Empty array ensures this runs only once

  useEffect(() => {
    // Function to handle route changes
    const handleRouteChange = () => {
      const path = window.location.pathname;
      console.log('Handling route change, current path:', path);
      
      if (path === '/admin') {
        console.log('Setting section to admin');
        setCurrentSection('admin');
      } else if (path === '/quote') {
        setCurrentSection('quote');
      } else if (path === '/learn') {
        setCurrentSection('learn');
      } else if (path === '/careers') {
        setCurrentSection('careers');
      } else {
        setCurrentSection('home');
      }
      // Log visit for the resolved path
      logVisit(path);
      
      // Trigger Taboola page_view event for route changes
      if ((window as any)._tfa) {
        (window as any)._tfa.push({notify: 'event', name: 'page_view', id: 1952824});
        console.log('Taboola page_view event fired for:', path);
      }
    };

    // Initial route handling
    handleRouteChange();

    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Session check result:', !!session);
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, !!session);
      setIsAuthenticated(!!session);
    });

    // Listen for browser back/forward navigation
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentSection('admin');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentSection('home');
  };

  const handleNavigate = (section: 'home' | 'quote' | 'learn' | 'careers' | 'admin') => {
    setCurrentSection(section);
    // Update URL without page reload
    const path = section === 'home' ? '/' : `/${section}`;
    window.history.pushState({}, '', path);
    // Log visit on programmatic navigation
    logVisit(path);
    
    // Trigger Taboola page_view event for route changes
    if ((window as any)._tfa) {
      (window as any)._tfa.push({notify: 'event', name: 'page_view', id: 1952824});
      console.log('Taboola page_view event fired for:', path);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
          <p className="text-sm text-slate-500 mt-2">Current path: {window.location.pathname}</p>
        </div>
      </div>
    );
  }

  // Show admin dashboard if authenticated and on admin section
  if (currentSection === 'admin' && isAuthenticated) {
    console.log('Rendering AdminDashboard');
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // Show admin login if on admin section but not authenticated
  if (currentSection === 'admin' && !isAuthenticated) {
    console.log('Rendering AdminLogin');
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onNavigate={handleNavigate} currentSection={currentSection} />

      {currentSection === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentSection === 'quote' && <ClientForm />}
      {currentSection === 'learn' && <LearnAboutUs onNavigate={handleNavigate} />}
      {currentSection === 'careers' && <JobApplicationForm />}
    </div>
  );
}

export default App;
