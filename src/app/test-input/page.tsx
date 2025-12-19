"use client";

import { useState } from "react";

export default function TestInputPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [text, setText] = useState("");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Input Test Page</h1>
        
        <div className="space-y-6 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Test 1: Basic HTML Input</h2>
          
          <div>
            <label className="block mb-2">Email (no classes):</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
              style={{ color: 'black', padding: '8px', width: '100%' }}
            />
            <p className="text-sm text-gray-400 mt-1">Value: {email}</p>
          </div>

          <div>
            <label className="block mb-2">Password (no classes):</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ color: 'black', padding: '8px', width: '100%' }}
            />
            <p className="text-sm text-gray-400 mt-1">Value: {password}</p>
          </div>

          <div>
            <label className="block mb-2">Text (no classes):</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type something..."
              style={{ color: 'black', padding: '8px', width: '100%' }}
            />
            <p className="text-sm text-gray-400 mt-1">Value: {text}</p>
          </div>
        </div>

        <div className="space-y-6 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Test 2: With form-input Class</h2>
          
          <div>
            <label className="block mb-2">Password (with form-input):</label>
            <input
              type="password"
              className="form-input w-full px-4 py-3"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Test 3: Debugging Info</h2>
          
          <div className="space-y-2 text-sm">
            <p>Email length: {email.length}</p>
            <p>Password length: {password.length}</p>
            <p>Text length: {text.length}</p>
          </div>

          <button
            onClick={() => {
              console.log('Current values:', { email, password, text });
              alert(`Email: ${email}\nPassword: ${password}\nText: ${text}`);
            }}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            Show Values
          </button>
        </div>

        <div className="space-y-4 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Try typing in each input field</li>
            <li>Check if the value updates below each field</li>
            <li>Open browser console (F12) and check for errors</li>
            <li>Click "Show Values" button to see current state</li>
            <li>If password field doesn't work, try the other fields</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

