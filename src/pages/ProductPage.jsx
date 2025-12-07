import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function ProductPage(){
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(()=> {
    async function load(){
      const res = await axios.get(`${process.env.VITE_API_URL}/api/products/${id}`);
      setProduct(res.data);
      // record view (if logged in)
      const token = localStorage.getItem('token');
      if (token) {
        axios.post(`${process.env.VITE_API_URL}/api/history/view`, { productId: id }, { headers: { Authorization: `Bearer ${token}` } }).catch(()=>{});
      }
    }
    load();
  }, [id]);

  if (!product) return <div>Loading...</div>;
  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <strong>{product.price}</strong>
    </div>
  );
}