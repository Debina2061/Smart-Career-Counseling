// import AboutImage from '../assets/about-image.png';
import Stock from '../assets/stock1.png';
import Footer from "../components/Footer";
import { FaRobot, FaSearch, FaChartLine, FaComments, FaCheckCircle, FaLightbulb, FaUpload, FaUserPlus } from "react-icons/fa";
import { FaInstagram, FaFacebook, FaGithub } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Header from '../components/Header';

function LandingPage() {
  return (
    <div className="">
      <Header />

      {/* HERO */}
      <section className="bg-white pt-8 pb-20 md:pt-12 md:pb-32">
        <div className="px-4 sm:px-6 md:px-8 lg:px-16 x:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-20 items-center">
            {/* Left */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <span className="inline-block mb-4 px-4 py-1 text-xs md:text-sm rounded-full bg-blue-50 text-blue-600 font-medium">
                AI-Powered Career Guidance
              </span>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight md:leading-snug mt-4 mb-6 text-gray-900">
                AI-Powered Smart Career
                <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 via-purple-500 to-indigo-600">
                  Counseling Platform
                </span>
              </h1>

              <p className="text-gray-600 max-w-xl mx-auto lg:mx-0 mb-8 text-sm md:text-base leading-relaxed">
                Resume scanning, career recommendation & AI guidance tailored for students and fresh graduates.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-8">
                <Link to={'/getstarted'} className="px-7 py-3 rounded-full text-white font-semibold bg-linear-to-r from-purple-600 to-indigo-600 hover:shadow-lg transition w-full sm:w-auto text-center">
                  Get Started
                </Link>
                <Link to={'/features'} className="px-7 py-3 rounded-full text-gray-700 font-medium bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow transition w-full sm:w-auto text-center">
                  Explore Features
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <span>ATS Resume Scanner</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <span>AI Career Chatbot</span>
                </div>
              </div>
            </div>

            {/* Right - Hero Illustration Card */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="relative w-full max-w-md lg:max-w-lg">
                {/* Gradient background container */}
                <div className="rounded-3xl bg-linear-to-br from-purple-100 to-indigo-100 p-8 shadow-2xl">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                    <img src={Stock} alt="Career Guidance" className="w-full h-64 md:h-72 object-cover" />
                  </div>
                </div>

                {/* Card Overlay - Stats */}
                <div className="absolute -bottom-8 left-4 right-4 md:left-6 md:right-6 bg-white rounded-2xl p-5 shadow-xl border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">Career Match</p>
                      <p className="text-2xl font-bold text-gray-900">94%</p>
                    </div>
                    <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Top Pick</span>
                  </div>

                  <div className="mb-4 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-xs text-gray-600 mb-2 font-medium">
                      <span>Skills Analyzed</span>
                      <span className="text-purple-600 font-semibold">12/15</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-linear-to-r from-purple-600 to-indigo-600 rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-700 font-medium pt-2">
                    <FaRobot className="text-purple-600 text-sm" />
                    <span>AI-powered insights ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 py-16 md:py-24 bg-slate-50">
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-gray-900">Powerful Features</h2>
          <p className="text-gray-600 text-base md:text-lg">Everything you need to build a successful career path</p>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-linear-to-br from-blue-50 to-blue-100 p-8 shadow-sm hover:shadow-md transition">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-blue-600 mb-5 shadow-sm"> 
              <FaSearch className="text-2xl" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">ATS Resume Scanner</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Scan your resume against ATS systems and get instant feedback on optimization</p>
          </div>

          <div className="rounded-2xl bg-linear-to-br from-pink-50 to-pink-100 p-8 shadow-sm hover:shadow-md transition">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-pink-600 mb-5 shadow-sm"> 
              <FaChartLine className="text-2xl" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Career Recommendation</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Get personalized career paths based on your skills, interests, and market trends</p>
          </div>

          <div className="rounded-2xl bg-linear-to-br from-indigo-50 to-indigo-100 p-8 shadow-sm hover:shadow-md transition">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-indigo-600 mb-5 shadow-sm"> 
              <FaLightbulb className="text-2xl" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">Skill Gap Analysis</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Identify skill gaps and get recommendations for courses and learning paths</p>
          </div>

          <div className="rounded-2xl bg-linear-to-br from-purple-50 to-purple-100 p-8 shadow-sm hover:shadow-md transition">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-purple-600 mb-5 shadow-sm"> 
              <FaComments className="text-2xl" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">AI Career Chatbot</h3>
            <p className="text-sm text-gray-600 leading-relaxed">24/7 AI assistant to answer career questions and provide guidance</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 py-16 md:py-24 bg-white">
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl font-black mb-3 text-gray-900">How It Works</h2>
          <p className="text-gray-600 text-base md:text-lg">Your journey to career success in 4 simple steps</p>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition">
            <div className="w-16 h-16 mx-auto bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-5">
              <FaUserPlus className="text-2xl" />
            </div>
            <h4 className="font-bold text-lg mb-3 text-gray-900">Sign Up</h4>
            <p className="text-sm text-gray-600 leading-relaxed">Create your account and set up your profile</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition">
            <div className="w-16 h-16 mx-auto bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 mb-5">
              <FaUpload className="text-2xl" />
            </div>
            <h4 className="font-bold text-lg mb-3 text-gray-900">Upload Resume</h4>
            <p className="text-sm text-gray-600 leading-relaxed">Upload your resume for AI analysis</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition">
            <div className="w-16 h-16 mx-auto bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-5">
              <FaRobot className="text-2xl" />
            </div>
            <h4 className="font-bold text-lg mb-3 text-gray-900">AI Analysis</h4>
            <p className="text-sm text-gray-600 leading-relaxed">Get instant AI-powered career insights</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition">
            <div className="w-16 h-16 mx-auto bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-5">
              <FaLightbulb className="text-2xl" />
            </div>
            <h4 className="font-bold text-lg mb-3 text-gray-900">Start Growing</h4>
            <p className="text-sm text-gray-600 leading-relaxed">Follow personalized career recommendations</p>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 py-12 md:py-16">
        <div className="bg-linear-to-r from-sky-500 via-purple-500 to-purple-600 rounded-3xl text-white p-10 sm:p-12 md:p-16 text-center shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-3">Ready to Transform Your Career?</h3>
          <p className="mb-8 text-sky-100 text-lg max-w-2xl mx-auto">Join thousands of students who have found their dream career path</p>
          <Link to={'/getstarted'} className="inline-block px-8 py-4 rounded-full bg-white text-purple-600 font-bold hover:shadow-lg transition text-lg">Get Started Free</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
