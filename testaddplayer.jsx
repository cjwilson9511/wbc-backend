import React, { useState } from 'react';

export default function TestAddPlayer() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [result, setResult] = useState(null);

  const handleAddPlayer = async () => {
    setResult('Loading...');
    try {
      const response = await fetch('http://localhost:3000/add-player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, display_name: displayName }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(`Success! New player id: ${data.user.id}`);
      } else {
        setResult(`Error: ${data.error || JSON.stringify(data)}`);
      }
    } catch (error) {
      setResult(`Fetch error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: 400, margin: '1rem auto', background: '#eee', borderRadius: 8 }}>
      <h3>Test Add Player API</h3>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }}
      />
      <input
        type="text"
        placeholder="Display Name"
        value={displayName}
        onChange={e => setDisplayName(e.target.value)}
        style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8 }}
      />
      <button onClick={handleAddPlayer} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Add Player
      </button>
      {result && <p style={{ marginTop: 10 }}>{result}</p>}
    </div>
  );
}
