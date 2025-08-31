'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ThreeJSLogo from '@/components/ThreeJSLogo';
import AuthScreen from '@/components/AuthScreen';
import ProfileSetup from '@/components/ProfileSetup';
import SwipeInterface from '@/components/SwipeInterface';
import MatchesScreen from '@/components/MatchesScreen';
import ChatScreen from '@/components/ChatScreen';

type AppState = 'loading' | 'post-loading'  | 'auth-loading' | 'auth' | 'profile-setup' | 'swipe' | 'matches' | 'chat';

interface Profile {
  id: number;
  name: string;
  bio: string;
  skills: string[];
  experience: string;
  goals: string[];
  matchPercentage: number;
  image: string;
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>('loading');
   const [session, setSession] = useState<any>(null);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [currentChatProfile, setCurrentChatProfile] = useState<Profile | null>(null);

useEffect(() => {
  const checkState = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;

    setSession(session);

    if (!session) {
      setAppState('auth');
      return;
    }

    const userId = session.user.id;

    // 🔍 Check if profile exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

   
const justSignedUp = sessionStorage.getItem('justSignedUp') === 'true';
sessionStorage.removeItem('justSignedUp');

if (justSignedUp || !profile) {
  setAppState('profile-setup');
} else {
  setAppState('swipe');
}}

  if (appState === 'auth-loading') {
     checkState();
    // let the ThreeJS intro finish
    return;
  } 

 
}, [appState]);




  const handleLoadComplete = () => {
    setAppState('auth-loading');
  };

  const handleLogin = async () => {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData?.session;

  if (!session) {
    setAppState('auth');
    return;
  }

  const userId = session.user.id;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

 const justSignedUp = sessionStorage.getItem('justSignedUp') === 'true';
  sessionStorage.removeItem('justSignedUp');

  if (justSignedUp || !profile) {
    setAppState('profile-setup'); // go to profile setup ONLY after signup
  } else {
    setAppState('swipe'); // existing user with profile
  }
};


  const handleProfileComplete = () => {
    setAppState('swipe');
  };

  const handleMatch = (profile: Profile) => {
    setMatches(prev => [...prev, profile]);
    // Show match notification or animation here
  };

  const handleOpenMatches = () => {
    setAppState('matches');
  };

  const handleStartChat = (profile: Profile) => {
    setCurrentChatProfile(profile);
    setAppState('chat');
  };

  const handleBackToSwipe = () => {
    setAppState('swipe');
  };

  const handleBackToMatches = () => {
    setAppState('matches');
    setCurrentChatProfile(null);
  };

  const handleOpenProfile = () => {
    // Could open profile editing screen
    console.log('Open profile');
  };

const handleLogout = async () => {
  await supabase.auth.signOut();
  setAppState('auth');
};

  switch (appState) {
    case 'loading':
      return <ThreeJSLogo onLoadComplete={handleLoadComplete} />;
    
    case 'auth':
      return <AuthScreen onLogin={handleLogin} />;
    
    case 'profile-setup':
      return (
        <ProfileSetup 
          onComplete={handleProfileComplete} 
          onBack={() => setAppState('auth')} 
        />
      );
    
    case 'swipe':
      return (
        <SwipeInterface 
          onMatch={handleMatch} 
          onOpenMatches={handleOpenMatches}
          onOpenProfile={handleOpenProfile}
           onLogout={handleLogout}
        />
      );
    
    case 'matches':
      return (
        <MatchesScreen 
          matches={matches} 
          onBack={handleBackToSwipe}
          onStartChat={handleStartChat}
        />
      );
    
    case 'chat':
      return currentChatProfile ? (
        <ChatScreen 
          profile={currentChatProfile}
          onBack={handleBackToMatches}
        />
      ) : null;
    
    default:
      return <div>Unknown state</div>;
  }
}