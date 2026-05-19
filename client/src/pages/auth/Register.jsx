import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      return toast.error('Please fill in all required registration fields.');
    }

    if (formData.password.length < 6) {
      return toast.error('Password security profile must exceed 5 characters.');
    }

    // Call global Zustand account creation transaction script
    const outcome = await register(formData.fullName, formData.email, formData.password);

    if (outcome.success) {
      toast.success('Organization administrator account cluster successfully initialized!');
      navigate('/');
    } else {
      toast.error(outcome.message);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-1">Create organization</h3>
      <p className="text-xs text-slate-400 mb-6">Initialize your sovereign team cluster environment</p>

      <form onSubmit={handleFormSubmission} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
            Full Account Name
          </label>
          <input 
            type="text" 
            name="fullName"
            placeholder="Lead Engineer Name" 
            required
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors" 
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
            Corporate Email
          </label>
          <input 
            type="email" 
            name="email"
            placeholder="engineer@company.com" 
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors" 
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
            Account Password
          </label>
          <input 
            type="password" 
            name="password"
            placeholder="Minimum 6 characters" 
            required
            value={formData.password}
            onChange={handleInputChange}
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors" 
          />
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 disabled:bg-indigo-800/50 disabled:text-slate-400 text-sm font-semibold text-white rounded-xl transition-all duration-150 shadow-lg shadow-indigo-600/10 mt-2 cursor-pointer flex justify-center items-center"
        >
          {isLoading ? 'Creating Core Account...' : 'Register Engine'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-800/60 text-center">
        <p className="text-xs text-slate-400">
          Already verified?{' '}
          <Link to="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign inside active session
          </Link>
        </p>
      </div>
    </div>
  );
}