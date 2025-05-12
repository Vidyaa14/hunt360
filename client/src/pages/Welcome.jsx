import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Welcome() {
    return (
        <div>
            <Navbar />
            <section
                id="home"
                className="min-h-screen flex items-center relative before:content-[''] before:absolute before:inset-0 before:bg-[url('/assets/world-map.png')] before:bg-cover before:bg-center before:opacity-20 before:[animation:bg-pan_30s_linear_infinite] bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900 pt-20"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in z-10">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                        Empower Your Insights with Hunt360
                    </h1>
                    <p className="text-xl md:text-2xl mb-10 text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        The leading platform for real-time data aggregation, advanced analytics, and actionable insights from online communities.
                    </p>
                    <div className="flex justify-center space-x-6">
                        <Link
                            to="#features"
                            className="inline-block bg-blue-600 text-white px-8 py-3.5 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                        >
                            Explore Features
                        </Link>
                        <Link
                            to="#contact"
                            className="inline-block bg-transparent border-2 border-blue-600 text-blue-600 px-8 py-3.5 rounded-lg font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
                        >
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-20 text-gray-900 tracking-tight">
                        Why Hunt360 Stands Out
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="bg-gray-50 p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in">
                            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Real-Time Data Collection</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Seamlessly gather and process data from diverse online forums, ensuring timely and relevant insights.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in">
                            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Sophisticated Analytics</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Utilize state-of-the-art algorithms to analyze and categorize data, driving informed strategic decisions.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in">
                            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Intuitive Visualization</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Navigate complex datasets effortlessly with our sleek, user-friendly dashboard designed for clarity.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-32 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-20 text-gray-900 tracking-tight">
                        About Hunt360
                    </h2>
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2 animate-fade-in">
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Hunt360 is a cutting-edge platform designed to aggregate, process, and analyze data from online forums and communities. Our mission is to empower businesses and individuals with actionable insights through innovative data collection and analytics technologies, enabling smarter decision-making.
                            </p>
                        </div>
                        <div className="md:w-1/2 animate-fade-in">
                            <div className="bg-blue-600 text-white p-10 rounded-2xl shadow-xl">
                                <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
                                <p className="leading-relaxed">
                                    To transform how data shapes decisions, delivering accessible, impactful insights for organizations and individuals alike.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-20 text-gray-900 tracking-tight">
                        Connect With Us
                    </h2>
                    <div className="max-w-lg mx-auto bg-gray-50 p-8 rounded-2xl shadow-lg">
                        <div className="space-y-6">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                            />
                            <textarea
                                placeholder="Your Message"
                                rows="6"
                                className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                            ></textarea>
                            <button
                                className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                            >
                                Send Message
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-200 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div>
                            <div className="flex items-center space-x-3 mb-6">
                                <img
                                    src="/logo.png"
                                    alt="Hunt360 Logo"
                                    className="h-10 w-auto"
                                />
                                <span className="text-2xl font-bold text-white">Hunt360</span>
                            </div>
                            <p className="text-gray-400 leading-relaxed">
                                Empowering smarter decisions with real-time data insights from online communities.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/" className="text-gray-400 hover:text-blue-400 transition-all duration-200">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#features" className="text-gray-400 hover:text-blue-400 transition-all duration-200">
                                        Features
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#about" className="text-gray-400 hover:text-blue-400 transition-all duration-200">
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link to="#contact" className="text-gray-400 hover:text-blue-400 transition-all duration-200">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-6">Support</h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href="/faq" className="text-gray-400 hover:text-blue-400 transition-all duration-200">
                                        FAQ
                                    </a>
                                </li>
                                <li>
                                    <a href="/privacy" className="text-gray-400 hover:text-blue-400 transition-all duration-200">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="/terms" className="text-gray-400 hover:text-blue-400 transition-all duration-200">
                                        Terms of Service
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-6">Contact Us</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Email: <a href="mailto:support@hunt360.com" className="hover:text-blue-400 transition-all duration-200">support@hunt360.com</a>
                            </p>
                            <p className="text-gray-400 leading-relaxed mt-2">
                                Phone: <a href="tel:+1234567890" className="hover:text-blue-400 transition-all duration-200">+1 (234) 567-890</a>
                            </p>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-gray-800 pt-8 text-center">
                        <p className="text-gray-400">
                            © {new Date().getFullYear()} Hunt360. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}