import React from 'react';

function App() {
  return (
    <div style={{ 
      backgroundColor: '#0F172A', 
      color: '#F8FAFC', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '800', letterSpacing: '-0.05em' }}>
        DevSync AI
      </h1>
      <p style={{ color: '#94A3B8', fontSize: '1.1rem' }}>
        Frontend Client Environment Successfully Initialized.
      </p>
    </div>
  );
}

export default App;