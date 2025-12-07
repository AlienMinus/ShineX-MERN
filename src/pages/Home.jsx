import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Home(){
  const [q, setQ] = useState('');
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{ fetchProducts(); }, []);

  async function fetchProducts(params = {}) {
    const res = await axios.get(`${process.env.VITE_API_URL}/api/products`, { params });
    setProducts(res.data.items || []);
  }

  const onSearch = async (e) => {
    e.preventDefault();
    await axios.post(`${process.env.VITE_API_URL}/api/history/search`, { query: q }, { headers: authHeader() }).catch(()=>{});
    fetchProducts({ q });
  };

  function authHeader() {
    const t = localStorage.getItem('token');
    return t ? { Authorization: `Bearer ${t}` } : {};
  }

  return (
    <div>
      <form onSubmit={onSearch}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products"/>
        <button type="submit">Search</button>
      </form>
      <div>
        {products.map(p => (
          <div key={p._id} onClick={()=>navigate(`/product/${p._id}`)}>
            <h3>{p.title}</h3>
            <p>{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}