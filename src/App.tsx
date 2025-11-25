import { useEffect, useState } from 'react';
import client from './api/client';
import './App.css'

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    client.get('/')
      .then(response => setMessage(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Página en Desarrollo</h1>
        <p>¡Disculpa las molestias! Estamos trabajando para mejorar tu experiencia.</p>
        <p>Vuelve pronto.</p>
        {message && <p>Backend says: {message}</p>}
      </div>
    </>
  )
}

export default App
