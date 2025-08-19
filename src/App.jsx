import React, { useState } from 'react';
import './App.css'; 
const App = () => {
  const [plaintext, setPlaintext] = useState('');
  const [key, setKey] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [error, setError] = useState('');

  
  const performRC4 = (key, text) => {
   
    let s = Array.from(Array(256).keys());
    let j = 0;

    for (let i = 0; i < 256; i++) {
      j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
      [s[i], s[j]] = [s[j], s[i]];
    }
    let i = 0;
    j = 0;
    let result = [];

    for (let charIndex = 0; charIndex < text.length; charIndex++) {
      i = (i + 1) % 256;
      j = (j + s[i]) % 256;
      [s[i], s[j]] = [s[j], s[i]];
      
      const keystreamByte = s[(s[i] + s[j]) % 256];
      
      const resultCode = text.charCodeAt(charIndex) ^ keystreamByte;
      result.push(resultCode);
    }
    
    return result;
  };

  const handleEncrypt = () => {
    if (!plaintext || !key) {
      setError('⚠️ Please provide both plaintext and a key.');
      return;
    }
    setError('');
    setDecryptedText(''); 
    const encryptedCharCodes = performRC4(key, plaintext);
    
    const binaryCiphertext = encryptedCharCodes
      .map(code => code.toString(2).padStart(8, '0'))
      .join(' '); 
      
    setCiphertext(binaryCiphertext);
  };

  const handleDecrypt = () => {
    if (!ciphertext || !key) {
      setError('⚠️ Please provide the binary ciphertext and a key.');
      return;
    }
    setError('');

    try {
      const encryptedCharCodes = ciphertext
        .split(' ')
        .filter(bin => bin) 
        .map(bin => {
          if (!/^[01]{1,8}$/.test(bin)) throw new Error("Invalid binary value.");
          return parseInt(bin, 2)
        });
      const intermediateText = String.fromCharCode(...encryptedCharCodes);
      const decryptedCharCodes = performRC4(key, intermediateText);
      const finalDecryptedText = String.fromCharCode(...decryptedCharCodes);
      setDecryptedText(finalDecryptedText);

    } catch (e) {
      setError('Decryption failed. Ensure the ciphertext is a valid binary string with values separated by spaces.');
    }
  };

  return (
    <div className="container">
      <h1>RC4 Cipher </h1>
      <p>Encrypts text into a binary string and decrypts it back.</p>

      <div className="form-group">
        <label>Plaintext</label>
        <textarea 
          placeholder='Enter the text to encrypt' 
          value={plaintext}
          onChange={(e) => setPlaintext(e.target.value)} 
        />
      </div>

      <div className="form-group">
        <label>Secret Key</label>
        <input 
          type="text" 
          placeholder='Enter the secret key' 
          value={key}
          onChange={(e) => setKey(e.target.value)} 
        />
      </div>
      
      <div className="buttons">
        <button onClick={handleEncrypt}>Encrypt</button>
        <button onClick={handleDecrypt}>Decrypt</button>
      </div>
      
      {error && <p className="error">{error}</p>}
      
      <div className="form-group">
        <label>Ciphertext (Binary)</label>
        <textarea 
          readOnly 
          value={ciphertext}
          placeholder="Encrypted binary output..."
          onChange={(e) => setCiphertext(e.target.value)}
        />
      </div>
      
      <div className="result">
        <h2>Decrypted Text:</h2>
        <p className="decrypted-text">{decryptedText || "..."}</p>
      </div>
    </div>
  );
};

export default App;