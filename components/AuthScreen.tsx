'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';

interface AuthScreenProps {
  onLogin: () => void;
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
   const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // 🔐 Sign in
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }else {
      // 🆕 Sign up
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }
        }
      });
      if (error) throw error;

      // Mark just signed up (optional)
      sessionStorage.setItem('justSignedUp', 'true');
    }

      onLogin(); // ✅ move to profile setup
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold gradient-text mb-2">Code-Saathi</h1>
          <p className="text-gray-300">Find your dream dev team</p>
          <p className="text-gray-400 text-sm mt-2">Swipe. Match. Win.</p>
        </div>

        <Card className="glass-effect border-gray-600">
          <CardHeader>
            <CardTitle className="text-center text-white">
              {isLogin ? 'Log in / Register' : 'Create Account'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-800 border-gray-600 text-white placeholder-gray-400"
                  required
                />
              )}
              
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-gray-600 text-white placeholder-gray-400"
                required
              />
              
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800 border-gray-600 text-white placeholder-gray-400"
                required
              />
               {error && <p className="text-red-500 text-sm">{error}</p>}
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-200"
              disabled={loading}
             >
                 

                 {loading
                  ? isLogin
                    ? 'Logging in...'
                    : 'Signing up...'
                  : isLogin
                  ? 'Log In'
                  : 'Sign Up'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() =>{ setIsLogin(!isLogin);
                   setError(null);
                }}
                className="text-cyan-400 hover:text-cyan-300 text-sm"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}