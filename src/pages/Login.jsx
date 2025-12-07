import React, { useState } from 'react';
import axios from 'axios';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function login(e) {
    e.preventDefault();
    const res = await axios.post(`${process.env.VITE_API_URL}/api/auth/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    window.location.href = '/';
  }

  function googleLogin() {
    window.location.href = `${process.env.VITE_API_URL}/api/auth/google`;
  }

  return (
    <div>
      <form onSubmit={login}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" />
        <button type="submit">Login</button>
      </form>
      <button onClick={googleLogin}>Login with Google</button>
    </div>
  );
}