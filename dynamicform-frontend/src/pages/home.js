import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Zap, 
  Shield, 
  BarChart3,
  Star,
  Menu,
  X,
  FileText,
  Smartphone,
  Globe,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Create forms in minutes with our intuitive drag-and-drop builder"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share forms with your team and collaborate in real-time"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get detailed insights and analytics on your form responses"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security"
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description: "Forms look great and work perfectly on all devices"
    },
    {
      icon: Globe,
      title: "Share Anywhere",
      description: "Embed forms on websites or share via direct links"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      company: "TechCorp",
      content: "DynamicForm has revolutionized how we collect customer feedback. The analytics are incredible!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face&auto=format"
    },
    {
      name: "Michael Chen",
      role: "HR Director",
      company: "StartupXYZ",
      content: "The best form builder we've used. Easy to create, beautiful designs, and excellent support.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face&auto=format"
    },
    {
      name: "Emily Davis",
      role: "Event Coordinator",
      company: "EventPro",
      content: "Managing event registrations has never been easier. The real-time analytics help us plan better.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face&auto=format"
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users" },
    { number: "2M+", label: "Forms Created" },
    { number: "15M+", label: "Responses Collected" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm fixed w-full top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">DynamicForm</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">
                  Features
                </a>
                <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">
                  Testimonials
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">
                  Pricing
                </a>
                <a href="#contact" className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors">
                  Contact
                </a>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-indigo-600 px-4 py-2 text-sm font-medium transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105">
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-indigo-600 p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-indigo-600">Features</a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-600 hover:text-indigo-600">Testimonials</a>
              <a href="#pricing" className="block px-3 py-2 text-gray-600 hover:text-indigo-600">Pricing</a>
              <a href="#contact" className="block px-3 py-2 text-gray-600 hover:text-indigo-600">Contact</a>
              <Link to="/login" className="block px-3 py-2 text-gray-600 hover:text-indigo-600">Login</Link>
              <Link to="/register" className="block px-3 py-2 bg-indigo-600 text-white rounded-lg m-2">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Build and Share Forms
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block">
                Effortlessly
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Create dynamic forms, share them with your team, and collect responses seamlessly. 
              The most intuitive form builder for modern teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/login" 
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-indigo-500 hover:text-indigo-600 transition-all"
              >
                Login
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-indigo-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Create Amazing Forms
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features that make form building simple and response collection effortless
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 group">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say about DynamicForm
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that works best for you
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">$0<span className="text-lg text-gray-600">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />Up to 3 forms</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />100 responses/month</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />Basic templates</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />Email support</li>
              </ul>
              <Link to="/register" className="w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors block text-center">
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-2xl shadow-xl text-white relative">
              <div className="absolute top-4 right-4 bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <div className="text-4xl font-bold mb-6">$29<span className="text-lg opacity-80">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-3" />Unlimited forms</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-3" />10,000 responses/month</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-3" />Advanced analytics</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-3" />Team collaboration</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-3" />Priority support</li>
              </ul>
              <Link to="/register" className="w-full bg-white text-indigo-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors block text-center">
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">$99<span className="text-lg text-gray-600">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />Everything in Pro</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />Unlimited responses</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />Custom branding</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />API access</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3" />24/7 phone support</li>
              </ul>
              <Link to="/register" className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors block text-center">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Form Building Experience?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of teams already using DynamicForm to collect better data faster.
          </p>
          <Link 
            to="/register" 
            className="bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
          >
            Start Building Forms Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      
    </div>
  );
};

export default Home;