import React from 'react';
import { Shield, Users, Award, CheckCircle, Star, ArrowRight, Sparkles, User, Phone, Mail, Linkedin, Facebook, Quote } from 'lucide-react';

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
                src="/mainphotos/MutualofOmaha.png"
                alt="Mutual of Omaha"
                className="max-h-20 w-auto object-contain"
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
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

      <section className="py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              What Our Clients Say
            </h2>
            <div className="w-24 h-1.5 bg-teal-500 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Real stories from families we've helped protect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-slate-200 hover:shadow-2xl transition-all">
              <div className="flex items-center mb-6">
                <div className="flex">
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                </div>
              </div>
              <Quote className="h-10 w-10 text-teal-500 mb-4 opacity-50" />
              <p className="text-slate-700 mb-6 leading-relaxed">
                Working with The Reyes Agency was seamless. They helped me find the perfect coverage for my family at a rate I could afford. Highly recommend!
              </p>
              <div className="flex items-center">
                <div className="bg-teal-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Sarah Johnson</p>
                  <p className="text-sm text-slate-500">Cleveland, OH</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-slate-200 hover:shadow-2xl transition-all">
              <div className="flex items-center mb-6">
                <div className="flex">
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                </div>
              </div>
              <Quote className="h-10 w-10 text-teal-500 mb-4 opacity-50" />
              <p className="text-slate-700 mb-6 leading-relaxed">
                Professional, knowledgeable, and genuinely cared about finding the best policy for us. The process was quick and easy. Thank you!
              </p>
              <div className="flex items-center">
                <div className="bg-teal-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Michael Chen</p>
                  <p className="text-sm text-slate-500">Columbus, OH</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-slate-200 hover:shadow-2xl transition-all">
              <div className="flex items-center mb-6">
                <div className="flex">
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                </div>
              </div>
              <Quote className="h-10 w-10 text-teal-500 mb-4 opacity-50" />
              <p className="text-slate-700 mb-6 leading-relaxed">
                After shopping around, The Reyes Agency gave us the best rates and service. They explained everything clearly and made the whole process stress-free.
              </p>
              <div className="flex items-center">
                <div className="bg-teal-100 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Lisa Rodriguez</p>
                  <p className="text-sm text-slate-500">Cincinnati, OH</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="relative">
                <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-1">
                  <div className="bg-slate-900 rounded-3xl overflow-hidden">
                    <img
                      src="/mainphotos/image.jpeg"
                      alt="Johnathan Reyes"
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        img.style.display = 'none';
                        const parent = img.parentElement?.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl w-full aspect-square flex items-center justify-center"><div class="text-white"><User class="h-32 w-32 mx-auto mb-4 opacity-50" /><p class="text-center text-xl font-bold">Your Photo Here</p></div></div>';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="inline-block bg-teal-100 rounded-full px-4 py-2 mb-6">
                <span className="text-teal-700 text-sm font-bold">Meet Your Agent</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">
                Johnathan Reyes
              </h2>
              <p className="text-xl text-teal-600 font-semibold mb-6">Founder, The Reyes Agency</p>
              <div className="w-24 h-1.5 bg-teal-500 rounded-full mb-8"></div>

              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                Hi, I'm Johnathan Reyes, and I'm dedicated to helping families like yours find the life insurance coverage they need to protect their loved ones and secure their financial future.
              </p>

              <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                With years of experience in the insurance industry, I understand that every family's needs are unique. That's why I take the time to listen, understand your situation, and find the best coverage options that fit your budget and goals.
              </p>

              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 mb-8 border-2 border-teal-100">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Credentials & Certifications</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-teal-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">Licensed Life & Health Insurance Agent</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-teal-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">NIPR #: 19616584</span>
                  </li>                  
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-teal-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">Certified with Symmetry Financial Group</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-teal-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">5+ Years Industry Experience</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-teal-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 font-medium">Hundreds of Families Protected</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleQuoteClick}
                  className="inline-flex items-center justify-center bg-teal-500 text-white px-6 py-4 rounded-xl font-bold hover:bg-teal-600 transition-all shadow-lg group"
                >
                  Get Free Quote
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="tel:+13073091686"
                  className="inline-flex items-center justify-center bg-slate-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call Me
                </a>
                <a
                  href="mailto:info@thereyesagency.com"
                  className="inline-flex items-center justify-center border-2 border-slate-300 text-slate-900 px-6 py-4 rounded-xl font-bold hover:bg-slate-100 transition-all"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Email Me
                </a>
              </div>

              <div className="flex items-center gap-4 mt-6">
                <a
                  href="https://www.linkedin.com/in/johnathan-reyes-395637394/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61581504694175"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-md"
                  aria-label="Facebook Page"
                >
                  <Facebook className="h-6 w-6" />
                </a>
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
                <li>
                  <a href="tel:+13073091686" className="font-medium hover:text-teal-400 transition-colors flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    (307) 309-1686
                  </a>
                </li>
                <li>
                  <a href="mailto:info@thereyesagency.com" className="font-medium hover:text-teal-400 transition-colors flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    info@thereyesagency.com
                  </a>
                </li>
                <li className="font-medium">Sheffield Lake, OH 44054</li>
              </ul>
              <div className="flex items-center gap-3 mt-6">
                <a
                  href="https://www.linkedin.com/in/johnathan-reyes-395637394/e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-slate-800 text-slate-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61581504694175"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-slate-800 text-slate-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
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
