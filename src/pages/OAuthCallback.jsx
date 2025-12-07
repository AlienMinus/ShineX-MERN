import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function OAuthCallback(){
  const loc = useLocation();
  useEffect(()=> {
    const params = new URLSearchParams(loc.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.location.href = '/';
    } else {
      // handle error
    }
  }, [loc]);
  return <div>Signing in...</div>;
}