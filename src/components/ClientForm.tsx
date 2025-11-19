import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Heart, DollarSign, CheckCircle } from 'lucide-react';

// Declare fbq and _tfa for TypeScript
declare global {
  interface Window {
    fbq: (action: string, event: string, data?: any) => void;
    _tfa: Array<any>;
  }
}

export default function ClientForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    gender: '',
    height: '',
    weight: '',
    smoking_status: '',
    medical_issues: '',
    medications: '',
    birthdate: '',
    age: '',
    occupation: '',
    marital_status: '',
    spouse_name: '',
    spouse_email: '',
    spouse_phone: '',
    spouse_gender: '',
    spouse_height: '',
    spouse_weight: '',
    spouse_smoking_status: '',
    spouse_medical_issues: '',
    spouse_medications: '',
    spouse_birthdate: '',
    spouse_age: '',
    spouse_occupation: '',
    desired_coverage_amount: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate spouse fields when married
      if (formData.marital_status === 'married') {
        const spouseRequiredFields = [
          'spouse_name',
          'spouse_email',
          'spouse_phone',
          'spouse_gender',
          'spouse_height',
          'spouse_weight',
          'spouse_smoking_status',
          'spouse_occupation'
        ] as const;

        const missing = spouseRequiredFields.filter((key) => !String((formData as any)[key]).trim());
        const spouseAgeProvided = String(formData.spouse_age || '').trim().length > 0;
        const spouseDobProvided = String(formData.spouse_birthdate || '').trim().length > 0;
        if (missing.length > 0 || (!spouseAgeProvided && !spouseDobProvided)) {
          setError('Please complete all spouse fields, and provide either a spouse birthdate or age.');
          setIsSubmitting(false);
          return;
        }
      }

      const clientData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        gender: formData.gender as 'male' | 'female' | 'other',
        height: formData.height,
        weight: formData.weight,
        smoking_status: formData.smoking_status as 'never' | 'former' | 'current',
        medical_issues: formData.medical_issues,
        medications: formData.medications,
        birthdate: formData.birthdate ? formData.birthdate : null,
        age: formData.birthdate ? null : parseInt(formData.age),
        occupation: formData.occupation,
        marital_status: formData.marital_status as 'single' | 'married' | 'divorced' | 'widowed',
        desired_coverage_amount: parseInt(formData.desired_coverage_amount),
        ...(formData.marital_status === 'married' && {
          spouse_name: formData.spouse_name,
          spouse_email: formData.spouse_email,
          spouse_phone: formData.spouse_phone,
          spouse_gender: formData.spouse_gender as 'male' | 'female' | 'other',
          spouse_height: formData.spouse_height,
          spouse_weight: formData.spouse_weight,
          spouse_smoking_status: formData.spouse_smoking_status as 'never' | 'former' | 'current',
          spouse_medical_issues: formData.spouse_medical_issues,
          spouse_medications: formData.spouse_medications,
          spouse_birthdate: formData.spouse_birthdate ? formData.spouse_birthdate : null,
          spouse_age: formData.spouse_birthdate ? null : (formData.spouse_age ? parseInt(formData.spouse_age) : null),
          spouse_occupation: formData.spouse_occupation
        })
      };

      const { error: insertError } = await supabase
        .from('clients')
        .insert([clientData]);

      if (insertError) throw insertError;

      // Track Meta Pixel conversion for successful form submission
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Lead', {
          content_name: 'Insurance Quote Form Submission',
          content_category: 'Insurance Quote Request',
          value: formData.desired_coverage_amount ? parseInt(formData.desired_coverage_amount) : 0,
          currency: 'USD'
        });
      }

      // Track Taboola conversion for successful form submission
      if (typeof window !== 'undefined' && window._tfa) {
        window._tfa.push({
          notify: 'event',
          name: 'lead',
          id: 1952824
        });
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const computeAge = (isoDate: string) => {
    if (!isoDate) return '';
    const today = new Date();
    const dob = new Date(isoDate);
    let years = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      years--;
    }
    return years.toString();
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center border-2 border-teal-100">
          <div className="bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="h-10 w-10 text-teal-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Thank You!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Your information has been submitted successfully. One of our licensed agents will contact you within 24 hours to discuss your life insurance needs.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: '', email: '', phone: '', address: '', city: '', state: '', zip_code: '',
                gender: '', height: '', weight: '', smoking_status: '', medical_issues: '',
                medications: '', birthdate: '', age: '', occupation: '', marital_status: '', spouse_name: '',
                spouse_email: '', spouse_phone: '', spouse_gender: '', spouse_height: '',
                spouse_weight: '', spouse_smoking_status: '', spouse_medical_issues: '',
                spouse_medications: '', spouse_birthdate: '', spouse_age: '', spouse_occupation: '', desired_coverage_amount: ''
              });
            }}
            className="bg-teal-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-teal-600 transition-all shadow-lg"
          >
            Submit Another Quote
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">Get Your Free Quote</h1>
          <div className="w-24 h-1.5 bg-teal-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">Protect your family's future with comprehensive coverage up to $1,000,000</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-slate-100">

          {/* Personal Information */}
          <div className="mb-10">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl p-2.5 mr-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Birthdate</label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({ ...prev, birthdate: value, age: computeAge(value) }));
                  }}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">We use this to calculate age.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age {formData.birthdate ? '' : '*'}</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="18"
                  max="85"
                  required={!formData.birthdate}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status *</label>
                <select
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                >
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height *</label>
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="e.g., 5'10&quot;"
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight *</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g., 180 lbs"
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupation *</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Health Information */}
          <div className="mb-10">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl p-2.5 mr-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">Health Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Smoking Status *</label>
                <select
                  name="smoking_status"
                  value={formData.smoking_status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                >
                  <option value="">Select Status</option>
                  <option value="never">Never Smoked</option>
                  <option value="former">Former Smoker</option>
                  <option value="current">Current Smoker</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Issues</label>
                <textarea
                  name="medical_issues"
                  value={formData.medical_issues}
                  onChange={handleChange}
                  rows={3}
                  placeholder="List any current or past medical conditions..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                <textarea
                  name="medications"
                  value={formData.medications}
                  onChange={handleChange}
                  rows={3}
                  placeholder="List any medications you're currently taking..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Spouse Information (if married) */}
          {formData.marital_status === 'married' && (
            <div className="mb-10">
              <div className="flex items-center mb-8">
                <h2 className="text-3xl font-extrabold text-slate-900">Spouse Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Full Name *</label>
                  <input
                    type="text"
                    name="spouse_name"
                    value={formData.spouse_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Email *</label>
                  <input
                    type="email"
                    name="spouse_email"
                    value={formData.spouse_email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Phone *</label>
                  <input
                    type="tel"
                    name="spouse_phone"
                    value={formData.spouse_phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Gender *</label>
                  <select
                    name="spouse_gender"
                    value={formData.spouse_gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Birthdate</label>
                  <input
                    type="date"
                    name="spouse_birthdate"
                    value={formData.spouse_birthdate}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({ ...prev, spouse_birthdate: value, spouse_age: computeAge(value) }));
                    }}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">We use this to calculate age.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Age {formData.spouse_birthdate ? '' : '*'}</label>
                  <input
                    type="number"
                    name="spouse_age"
                    value={formData.spouse_age}
                    onChange={handleChange}
                    min="18"
                    max="85"
                    required={!formData.spouse_birthdate}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Occupation *</label>
                  <input
                    type="text"
                    name="spouse_occupation"
                    value={formData.spouse_occupation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Height *</label>
                  <input
                    type="text"
                    name="spouse_height"
                    value={formData.spouse_height}
                    onChange={handleChange}
                    placeholder="e.g., 5'6&quot;"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Weight</label>
                  <input
                    type="text"
                    name="spouse_weight"
                    value={formData.spouse_weight}
                    onChange={handleChange}
                    placeholder="e.g., 140 lbs"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Smoking Status *</label>
                  <select
                    name="spouse_smoking_status"
                    value={formData.spouse_smoking_status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  >
                    <option value="">Select Status</option>
                    <option value="never">Never Smoked</option>
                    <option value="former">Former Smoker</option>
                    <option value="current">Current Smoker</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Medical Issues</label>
                  <textarea
                    name="spouse_medical_issues"
                    value={formData.spouse_medical_issues}
                    onChange={handleChange}
                    rows={2}
                    placeholder="List any medical conditions..."
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Current Medications</label>
                  <textarea
                    name="spouse_medications"
                    value={formData.spouse_medications}
                    onChange={handleChange}
                    rows={2}
                    placeholder="List any medications..."
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Coverage Information */}
          <div className="mb-10">
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl p-2.5 mr-4">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">Coverage Information</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desired Coverage Amount *</label>
              <select
                name="desired_coverage_amount"
                value={formData.desired_coverage_amount}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all max-w-md"
              >
                <option value="">Select Coverage Amount</option>
                <option value="50000">$50,000</option>
                <option value="100000">$100,000</option>
                <option value="250000">$250,000</option>
                <option value="500000">$500,000</option>
                <option value="750000">$750,000</option>
                <option value="1000000">$1,000,000</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mb-8">
              <p className="text-red-800 font-semibold">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-500 text-white py-5 px-10 rounded-2xl font-bold text-xl hover:bg-teal-600 focus:ring-4 focus:ring-teal-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? 'Submitting...' : 'Get My Free Quote'}
          </button>
        </form>
      </div>
    </div>
  );
}
