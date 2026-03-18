'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (pathname !== '/login') {
        router.push('/login');
      }
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand">
        <div className="animate-pulse flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-brand-blue rounded-full"></div>
          <div className="w-2 h-2 bg-brand-blue rounded-full animation-delay-200"></div>
          <div className="w-2 h-2 bg-brand-blue rounded-full animation-delay-400"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
