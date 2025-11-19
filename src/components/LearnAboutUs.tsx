import React from 'react';
import { Play, CheckCircle, ArrowRight } from 'lucide-react';

interface LearnAboutUsProps {
  onNavigate: (section: 'home' | 'quote' | 'learn' | 'careers') => void;
}

export default function LearnAboutUs({ onNavigate }: LearnAboutUsProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative text-white py-24 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-900 overflow-hidden">
        <img
          src="/mainphotos/1.jpg"
          alt="Learn about building a career in insurance"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-teal-900/70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Join Our Team
          </h1>
          <div className="w-24 h-1.5 bg-teal-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto mb-10 leading-relaxed">
            Build a rewarding career helping families secure their financial future with life insurance.
          </p>
          <button
            onClick={() => onNavigate('careers')}
            className="bg-teal-500 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-teal-600 transition-all shadow-2xl hover:shadow-teal-500/50 inline-flex items-center group"
          >
            Apply Here
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-teal-500">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/3A-tpIBYT2E"
                    title="Get to Know Symmetry Financial Group (2024)"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8">
                  Step 1: Training & Development
                </h2>
                <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                  We provide comprehensive training to help you become a successful insurance agent, including product knowledge, sales techniques, and client relationship management.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start bg-teal-50 p-6 rounded-2xl border-2 border-teal-100">
                    <CheckCircle className="h-7 w-7 text-teal-600 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Licensing Support</h3>
                      <p className="text-slate-600">We help you obtain your insurance license and provide ongoing support throughout the process.</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-teal-50 p-6 rounded-2xl border-2 border-teal-100">
                    <CheckCircle className="h-7 w-7 text-teal-600 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Product Training</h3>
                      <p className="text-slate-600">Comprehensive training on all insurance products and how to match them to client needs.</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-teal-50 p-6 rounded-2xl border-2 border-teal-100">
                    <CheckCircle className="h-7 w-7 text-teal-600 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Sales Techniques</h3>
                      <p className="text-slate-600">Learn proven sales strategies and communication skills to build trust with potential clients.</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-teal-50 p-6 rounded-2xl border-2 border-teal-100">
                    <CheckCircle className="h-7 w-7 text-teal-600 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Mentorship Program</h3>
                      <p className="text-slate-600">Work with experienced agents who will guide you through your first year and beyond.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8">
                  Step 2: Building Your Career
                </h2>
                <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                  Once trained, you'll have access to our lead generation system, competitive commission structure, and ongoing support to build a successful career.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-md">
                    <CheckCircle className="h-7 w-7 text-teal-600 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Lead Generation</h3>
                      <p className="text-slate-600">Access to qualified leads and marketing support to help you build your client base.</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-md">
                    <CheckCircle className="h-7 w-7 text-teal-600 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Competitive Commissions</h3>
                      <p className="text-slate-600">Earn competitive commissions with bonus opportunities and residual income potential.</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-md">
                    <CheckCircle className="h-7 w-7 text-teal-600 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Flexible Schedule</h3>
                      <p className="text-slate-600">Work independently with flexible hours and the ability to build your own schedule.</p>
                    </div>
                  </div>

                  <div className="flex items-start bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-md">
                    <CheckCircle className="h-7 w-7 text-teal-600 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Career Growth</h3>
                      <p className="text-slate-600">Opportunities for advancement, team building, and leadership development.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-teal-500">
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/i165-nuH3HA"
                    title="True Ownership & Equity | Symmetry Financial Group"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Your Responsibilities
            </h2>
            <div className="w-24 h-1.5 bg-teal-500 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              What you'll be doing as part of our team
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl shadow-2xl p-10 border-2 border-teal-100">
              <h3 className="text-3xl font-extrabold text-slate-900 mb-8">Job Description</h3>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                      <p className="text-slate-700 font-medium">Schedule appointments with clients</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                      <p className="text-slate-700 font-medium">Help clients apply for coverage</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                      <p className="text-slate-700 font-medium">See application through approval</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                      <p className="text-slate-700 font-medium">Attend weekly training calls</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                      <p className="text-slate-700 font-medium">Must have a phone and computer to do this job</p>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-teal-200 pt-8">
                  <div className="prose prose-lg max-w-none text-slate-700 space-y-5 leading-relaxed">
                    <p>
                      <strong className="text-slate-900">The Reyes Agency</strong> is looking for individuals interested in working remotely as sales representatives. We are hiring coachable individuals comfortable with a 100% commission based income selling Life and Health Insurance.
                    </p>

                    <p>
                      As this is a commission based income, there is no cap on your earnings. We use data driven systems and cutting edge lead generation that gets you connected with interested clients quickly.
                    </p>

                    <p>
                      The candidate we are looking for is disciplined, honest, confident, and passionate about helping people achieve their financial goals. Occasional travel for work for in-person conferences. If you are not currently licensed but have a desire to learn this business, we will help guide you in that process.
                    </p>

                    <p className="mb-0">
                      This is a Life and Health insurance brokerage position. <strong className="text-slate-900">No cold calling.</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Understanding Our Commission Structure
            </h2>
            <div className="w-24 h-1.5 bg-teal-500 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Transparent communication about our unique compensation model
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-10 mb-10 border-2 border-amber-200">
              <div className="prose prose-lg max-w-none text-slate-700 space-y-5 leading-relaxed">
                <p>
                  As part of our commitment to transparency and open communication, we want to provide you with a clear understanding of our unique compensation structure.
                </p>

                <p>
                  At <strong className="text-slate-900">The Reyes Agency</strong>, we operate on a 100% commission-based model. This means that your earnings are directly tied to your individual performance and the value you bring to the company. We believe in rewarding hard work, dedication, and success, and our commission structure is designed to reflect that.
                </p>

                <p className="mb-0">
                  To ensure you have a comprehensive understanding of how this model works and the potential for financial growth, <strong className="text-slate-900">Please Apply Below</strong>. During this session, we will discuss:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="space-y-5">
                <div className="flex items-start bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-md">
                  <CheckCircle className="h-6 w-6 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-slate-700 font-medium">The intricacies of our commission structure</p>
                </div>
                <div className="flex items-start bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-md">
                  <CheckCircle className="h-6 w-6 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-slate-700 font-medium">Examples illustrating how commissions are calculated</p>
                </div>
                <div className="flex items-start bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-md">
                  <CheckCircle className="h-6 w-6 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-slate-700 font-medium">Opportunities for additional incentives or bonuses based on performance</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-start bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-md">
                  <CheckCircle className="h-6 w-6 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-slate-700 font-medium">Strategies for success and maximizing your earning potential</p>
                </div>
                <div className="flex items-start bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-md">
                  <CheckCircle className="h-6 w-6 text-teal-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-slate-700 font-medium">A Q&A session to address any questions or concerns you may have</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-10 border-2 border-slate-200 shadow-xl">
              <div className="prose prose-lg max-w-none text-slate-700 space-y-5 leading-relaxed">
                <p>
                  We understand that a commission-based model may be different from what you've experienced in the past, and we are here to support you every step of the way. Our goal is to provide you with the tools, training, and resources needed for success in this rewarding environment.
                </p>

                <p className="mb-0">
                  Please apply below, and feel free to reach out beforehand if you have any immediate questions. We look forward to working together to achieve mutual success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-28 text-white bg-gradient-to-r from-slate-900 via-slate-800 to-teal-900 overflow-hidden">
        <img
          src="/mainphotos/2.jpg"
          alt="Ready to start your insurance career"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-teal-900/80"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
            Ready to Start Your Career?
          </h2>
          <p className="text-xl mb-10 text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Join our team of successful insurance agents and start building a rewarding career helping families protect their future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('careers')}
              className="bg-teal-500 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-teal-600 transition-all shadow-2xl hover:shadow-teal-500/50"
            >
              Apply Here
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="border-3 border-white/30 backdrop-blur-sm bg-white/10 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-white/20 transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-20 border-t-4 border-teal-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">The Reyes Agency</h3>
              <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
                Your trusted partner for comprehensive life insurance coverage. We help families secure their financial future with personalized solutions.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => onNavigate('home')}
                    className="text-slate-400 hover:text-teal-400 transition-colors font-medium"
                  >
                    Home
                  </button>
                </li>
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
                    onClick={() => onNavigate('careers')}
                    className="text-slate-400 hover:text-teal-400 transition-colors font-medium"
                  >
                    Apply Here
                  </button>
                </li>
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
