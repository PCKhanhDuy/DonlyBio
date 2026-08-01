import { NavLink } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <span className="text-xl font-bold text-white">MyBrand</span>
            <p className="mt-3 text-sm leading-relaxed max-w-sm">
              Building modern web experiences with the latest technologies. Fast, beautiful, and accessible.
            </p>
            <div className="flex gap-4 mt-5">
              {['Twitter', 'GitHub', 'LinkedIn'].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Pages</h3>
            <ul className="space-y-2">
              <li><NavLink to="/" className="text-sm hover:text-white transition-colors">Home</NavLink></li>
              <li><NavLink to="/contact" className="text-sm hover:text-white transition-colors">Contact</NavLink></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>hello@mybrand.com</li>
              <li>+84 123 456 789</li>
              <li>Ho Chi Minh City, Vietnam</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <p>© {new Date().getFullYear()} MyBrand. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
