import React, { useState, useContext } from 'react';
import { FlightContext } from '../context/FlightContext';

export default function Auth() {
  const { loginUser, registerUser } = useContext(FlightContext);
  
  // [CO3: Component Model Dynamic Runtime Data] Local view toggles and field values
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // [CO5: Validation Pipelines & Controlled Forms] Form validation step
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents manual full-page browser reloads
    if (!email || !password) return alert("Please fill in all fields.");

    if (isLoginView) {
      loginUser(email, password);
    } else {
      const success = registerUser(email, password);
      if (success) setIsLoginView(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-black px-4">
      {/* [CO5: Accessibility Engineering - Keyboard Flow & Focus Targets] */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">🛫 SkyTrack Live</h2>
          <p className="text-sm text-gray-500 mt-1">
            {isLoginView ? "Sign in to monitor your flights" : "Create an account to get real-time alerts"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase">Email Address</label>
            {/* [CO3: Controlled vs Uncontrolled Elements] React intercepts user typing via absolute state mapping */}
            <input
              type="email"
              className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase">Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition duration-200"
          >
            {isLoginView ? "Log In" : "Register Now"}
          </button>
        </form>

        <div className="text-center text-sm">
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-blue-600 font-medium hover:underline focus:outline-none"
          >
            {isLoginView ? "Don't have an account? Register" : "Already have an account? Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}