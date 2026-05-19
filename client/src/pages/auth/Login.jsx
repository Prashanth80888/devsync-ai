import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function Login() {

  const navigate = useNavigate();

  const { login, isLoading } = useAuthStore();

  // Controlled input form fields state tracking layout matrix
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Handle Input Changes
  const handleInputChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle Form Submission
  const handleFormSubmission = async (e) => {

    e.preventDefault();

    // Basic Validation
    if (!formData.email || !formData.password) {

      return toast.error(
        'Please enter both your email and password.'
      );
    }

    // Execute Login
    const outcome = await login(
      formData.email,
      formData.password
    );

    // Success
    if (outcome.success) {

      toast.success(
        'Session verified successfully! Welcome back.'
      );

      // Redirect User To Home Dashboard
      navigate('/');

    } else {

      // Failure
      toast.error(outcome.message);
    }
  };

  return (
    <div>

      <h3 className="text-xl font-bold text-white mb-1">
        Welcome back
      </h3>

      <p className="text-xs text-slate-400 mb-6">
        Enter your account credentials to access your workspaces
      </p>

      <form
        onSubmit={handleFormSubmission}
        className="space-y-4"
      >

        {/* Email Input */}
        <div>

          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            placeholder="name@company.com"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />

        </div>

        {/* Password Input */}
        <div>

          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
            Account Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={handleInputChange}
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />

        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 disabled:bg-indigo-800/50 disabled:text-slate-400 text-sm font-semibold text-white rounded-xl transition-all duration-150 shadow-lg shadow-indigo-600/10 mt-2 cursor-pointer flex justify-center items-center"
        >

          {isLoading
            ? 'Verifying Credentials...'
            : 'Sign In'}

        </button>

      </form>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-slate-800/60 text-center">

        <p className="text-xs text-slate-400">

          New to the platform?{' '}

          <Link
            to="/auth/register"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Create an organization account
          </Link>

        </p>

      </div>

    </div>
  );
}