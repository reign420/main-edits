import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Briefcase, Upload, CheckCircle } from 'lucide-react';

// Declare fbq for TypeScript
declare global {
  interface Window {
    fbq: (action: string, event: string, data?: any) => void;
  }
}

export default function JobApplicationForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    is_licensed: false
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let resumeFilePath = '';

      // Upload resume if provided
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${Date.now()}_${formData.full_name.replace(/\s+/g, '_')}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, resumeFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw new Error('Failed to upload resume: ' + uploadError.message);
        }
        
        resumeFilePath = fileName;
      }

      const { error: insertError } = await supabase
        .from('job_applicants')
        .insert([{
          ...formData,
          resume_file_path: resumeFilePath
        }]);

      if (insertError) throw insertError;

      // Track Meta Pixel conversion for successful job application submission
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Lead', {
          content_name: 'Job Application Form Submission',
          content_category: 'Job Application',
          value: 0,
          currency: 'USD'
        });
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center border-2 border-teal-100">
          <div className="bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="h-10 w-10 text-teal-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Application Received!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Thank you for your interest in joining our team. We'll review your application and contact you within 3-5 business days if we'd like to move forward.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                full_name: '',
                phone_number: '',
                email: '',
                is_licensed: false
              });
              setResumeFile(null);
            }}
            className="bg-teal-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-teal-600 transition-all shadow-lg"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-4 rounded-2xl shadow-lg">
              <Briefcase className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">Join Our Team</h1>
          <div className="w-24 h-1.5 bg-teal-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Build a rewarding career helping families protect their future
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-slate-100">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Career Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-8 rounded-2xl border-2 border-teal-100">
                <h3 className="font-bold text-slate-900 mb-3 text-lg">Licensed Agents</h3>
                <p className="text-slate-600 font-medium">
                  Experienced professionals with Life & Health Insurance licenses
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl border-2 border-emerald-100">
                <h3 className="font-bold text-slate-900 mb-3 text-lg">New to Insurance</h3>
                <p className="text-slate-600 font-medium">
                  We provide comprehensive training and licensing support
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mb-8">
              <p className="text-red-800 font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-4 text-lg">
                Resume Upload (Optional)
              </label>
              <div 
                onClick={handleUploadClick}
                className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-teal-400 transition-colors bg-slate-50 cursor-pointer"
              >
                <Upload className="h-14 w-14 text-slate-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-slate-600 font-medium">
                    {resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-sm text-slate-500 font-medium">PDF, DOC, DOCX up to 10MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-200">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_licensed"
                  name="is_licensed"
                  checked={formData.is_licensed}
                  onChange={handleChange}
                  className="h-5 w-5 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="is_licensed" className="text-sm font-bold text-slate-700">
                  I am currently licensed in Life & Health Insurance
                </label>
              </div>
              <p className="text-sm text-slate-600 mt-3 ml-8 font-medium">
                Don't have a license? No problem! We provide comprehensive training and licensing support.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-500 text-white py-5 px-10 rounded-2xl font-bold text-xl hover:bg-teal-600 focus:ring-4 focus:ring-teal-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </form>

          <div className="mt-10 p-8 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl border-2 border-teal-100">
            <h3 className="font-extrabold text-slate-900 mb-4 text-xl">What We Offer</h3>
            <ul className="text-slate-700 font-medium space-y-2">
              <li>• Competitive commission structure with performance bonuses</li>
              <li>• Comprehensive training program</li>
              <li>• Flexible schedule and remote work options</li>
              <li>• Health and life insurance benefits</li>
              <li>• Ongoing professional development</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}