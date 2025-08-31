'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}