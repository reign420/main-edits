import React from 'react';
import { Shield, Users, Award, CheckCircle, Star, ArrowRight, Sparkles } from 'lucide-react';

interface HomePageProps {
  onNavigate: (section: 'home' | 'quote' | 'learn' | 'careers') => void;
}

declare global {
  interface Window {
    fbq: (action: string, event: string, data?: any) => void;
  }
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const handleQuoteClick = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: 'Get Free Quote Button Click',
        content_category: 'Insurance Quote Request'
      });
    }
    onNavigate('quote');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative text-white bg-gradient-to-r from-slate-900 via-slate-800 to-teal-900 overflow-hidden">
        <img
          src="/mainphotos/maximillian.jpg"
          alt="Family protected with life insurance"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-teal-900/70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36">
          <div className="max-w-4xl">
            <div className="inline-block bg-teal-500/20 backdrop-blur-sm border border-teal-400/30 rounded-full px-4 py-2 mb-6">
              <span className="text-teal-300 text-sm font-semibold flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                Featured in Forbes
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Protect Your<br />
              <span className="text-teal-400">Family's Future</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-slate-200 max-w-2xl leading-relaxed">
              Comprehensive life insurance coverage up to $1,000,000 with competitive rates from the nation's most trusted insurance companies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleQuoteClick}
                className="bg-teal-500 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-teal-600 transition-all shadow-2xl hover:shadow-teal-500/50 flex items-center justify-center group"
              >
                Get Free Quote
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('learn')}
                className="border-3 border-white/30 backdrop-blur-sm bg-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all"
              >
                Learn About Us
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50 border-y-2 border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center flex-wrap gap-3">
            <div className="flex items-center">
              <Star className="h-7 w-7 text-amber-500 fill-amber-500" />
              <Star className="h-7 w-7 text-amber-500 fill-amber-500" />
              <Star className="h-7 w-7 text-amber-500 fill-amber-500" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900">Recognized by Forbes</span>
            <span className="text-lg text-slate-600 font-medium">for exceptional customer service</span>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Why Choose Us
            </h2>
            <div className="w-24 h-1.5 bg-teal-500 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Over 15 years helping thousands of families secure their financial future with expert guidance and personalized service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-10 rounded-3xl border-2 border-teal-100 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl w-20 h-20 flex items-center justify-center mb-6 shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Licensed & Certified</h3>
              <p className="text-slate-600 leading-relaxed">
                Fully licensed insurance professionals with certifications from top industry organizations.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-10 rounded-3xl border-2 border-emerald-100 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl w-20 h-20 flex items-center justify-center mb-6 shadow-lg">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Personalized Service</h3>
              <p className="text-slate-600 leading-relaxed">
                Every client receives personalized attention and customized insurance solutions.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-10 rounded-3xl border-2 border-amber-100 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl w-20 h-20 flex items-center justify-center mb-6 shadow-lg">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Award-Winning</h3>
              <p className="text-slate-600 leading-relaxed">
                Recognized for excellence in customer service and innovative insurance solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Our Trusted Partners
            </h2>
            <div className="w-24 h-1.5 bg-teal-500 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              We partner with America's most reputable insurance companies to bring you the best coverage options.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-6 items-center">
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center h-32">
              <img
                src="/mainphotos/americanamicable.png"
                alt="American Amicable"
                className="max-h-20 w-auto object-contain"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (!img.dataset.fallback) {
                    img.src = '/mainphotos/americanamicable.png';
                    img.dataset.fallback = 'true';
                  }
                }}
              />
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center h-32">
              <img
                src="/mainphotos/americo.png"
                alt="Americo"
                className="max-h-20 w-auto object-contain"
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center h-32">
              <img
                src="/mainphotos/occidental.png"
                alt="Occidental"
                className="max-h-20 w-auto object-contain"
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center h-32">
              <img
                src="/mainphotos/SBLI.jpg"
                alt="SBLI"
                className="max-h-20 w-auto object-contain"
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center h-32">
              <img
                src="/mainphotos/transamerica.png"
                alt="TransAmerica"
                className="max-h-20 w-auto object-contain"
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              What We Offer
            </h2>
            <div className="w-24 h-1.5 bg-teal-500 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Simple, affordable, and stress-free life insurance solutions tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4 p-6 bg-slate-50 rounded-2xl hover:bg-teal-50 transition-all">
              <CheckCircle className="h-7 w-7 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Medical Exam Options</h3>
                <p className="text-slate-600">Get coverage quickly with our simplified underwriting process.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-slate-50 rounded-2xl hover:bg-teal-50 transition-all">
              <CheckCircle className="h-7 w-7 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Competitive Rates</h3>
                <p className="text-slate-600">We shop multiple carriers to find you the best rates available.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-slate-50 rounded-2xl hover:bg-teal-50 transition-all">
              <CheckCircle className="h-7 w-7 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Expert Guidance</h3>
                <p className="text-slate-600">Our licensed agents help you choose the right coverage for your needs.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-slate-50 rounded-2xl hover:bg-teal-50 transition-all">
              <CheckCircle className="h-7 w-7 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Fast Approval</h3>
                <p className="text-slate-600">Get approved in as little as 24 hours with our streamlined process.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-slate-50 rounded-2xl hover:bg-teal-50 transition-all">
              <CheckCircle className="h-7 w-7 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Ongoing Support</h3>
                <p className="text-slate-600">We're here to help you throughout your policy's lifetime.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 bg-slate-50 rounded-2xl hover:bg-teal-50 transition-all">
              <CheckCircle className="h-7 w-7 text-teal-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Flexible Payment Options</h3>
                <p className="text-slate-600">Choose from monthly, quarterly, or annual payment plans.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-28 text-white bg-gradient-to-r from-slate-900 via-slate-800 to-teal-900 overflow-hidden">
        <img
          src="/mainphotos/cottonbro.jpg"
          alt="Life insurance consultation"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-teal-900/80"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-10 text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Get your free life insurance quote today and take the first step toward securing your family's financial future.
          </p>
          <button
            onClick={handleQuoteClick}
            className="bg-teal-500 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-teal-600 transition-all shadow-2xl hover:shadow-teal-500/50 inline-flex items-center group"
          >
            Get Your Free Quote
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-20 border-t-4 border-teal-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-2.5 rounded-xl">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">The Reyes Agency</h3>
                  <p className="text-sm text-teal-400">Securing Your Tomorrow</p>
                </div>
              </div>
              <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
                Your trusted partner for comprehensive life insurance coverage. We help families secure their financial future with personalized solutions.
              </p>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                <span className="text-sm text-slate-400">Featured in Forbes</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Services</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => onNavigate('quote')}
                    className="text-slate-400 hover:text-teal-400 transition-colors font-medium"
                  >
                    Get Quote
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('learn')}
                    className="text-slate-400 hover:text-teal-400 transition-colors font-medium"
                  >
                    Learn About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('careers')}
                    className="text-slate-400 hover:text-teal-400 transition-colors font-medium"
                  >
                    Apply Here
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Contact</h4>
              <ul className="space-y-3 text-slate-400">
                <li className="font-medium">Phone: (307) 309-1686</li>
                <li className="font-medium">Email: info@thereyesagency.com</li>
                <li className="font-medium">Sheffield Lake, OH 44054</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-16 pt-10 text-center text-slate-500">
            <p>&copy; 2025 The Reyes Agency. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
