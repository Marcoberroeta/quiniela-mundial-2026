import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import ProfileSetupModal from './ProfileSetupModal';
import { base44 } from '@/api/base44Client';

export default function AppShell() {
  const [user, setUser] = useState(null);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => {
      if (u) {
        setUser(u);
        // Show modal if missing name or phone
        if (!u.full_name || !u.telefono) {
          setShowSetup(true);
        }
      }
    }).catch(() => {});
  }, []);

  const handleComplete = async () => {
    const updated = await base44.auth.me();
    setUser(updated);
    setShowSetup(false);
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <main className="pb-20 max-w-lg mx-auto">
        <Outlet />
      </main>
      <BottomNav />
      {showSetup && (
        <ProfileSetupModal user={user} onComplete={handleComplete} />
      )}
    </div>
  );
}