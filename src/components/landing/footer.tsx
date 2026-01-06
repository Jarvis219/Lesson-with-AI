import {
  Facebook,
  Instagram,
  Languages,
  Linkedin,
  Twitter,
} from "lucide-react";
import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6 text-white">
              <div className="bg-blue-600 p-1.5 rounded text-white">
                <Languages size={20} />
              </div>
              <span className="text-xl font-bold">LinguaFlow</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering the world to communicate. Join the fastest growing
              community of English learners and expert teachers.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Browse Courses
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Find a Teacher
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  AI Tools
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Connect</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors">
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-800 rounded-full hover:bg-blue-400 transition-colors">
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-800 rounded-full hover:bg-pink-600 transition-colors">
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-800 rounded-full hover:bg-blue-700 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} LinguaFlow Inc. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
