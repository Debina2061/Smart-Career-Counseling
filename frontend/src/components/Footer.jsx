import React from "react";

function Footeer() {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 md:px-12 py-12 md:py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">Smart Career</h3>
            <p className="text-sm text-gray-400">Empowering students with AI-powered career guidance.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white cursor-pointer transition">About Us</span></li>
              <li><span className="hover:text-white cursor-pointer transition">Careers</span></li>
              <li><span className="hover:text-white cursor-pointer transition">Blog</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white cursor-pointer transition">Privacy</span></li>
              <li><span className="hover:text-white cursor-pointer transition">Terms of Service</span></li>
              <li><span className="hover:text-white cursor-pointer transition">Cookie Policy</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/" className="text-gray-400 hover:text-white transition">Instagram</a>
              <a href="https://www.linkedin.com/" className="text-gray-400 hover:text-white transition">LinkedIn</a>
              <a href="https://github.com/" className="text-gray-400 hover:text-white transition">GitHub</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© 2024 Smart Career. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footeer;
