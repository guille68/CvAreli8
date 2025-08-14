import React from 'react';
import { Menu, X, User, Award, Briefcase, GraduationCap, Globe } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const navigationItems = [
  { id: 'perfil', label: 'Perfil Profesional', icon: User },
  { id: 'habilidades', label: 'Habilidades', icon: Award },
  { id: 'experiencia', label: 'Experiencia', icon: Briefcase },
  { id: 'educacion', label: 'Educación', icon: GraduationCap },
  { id: 'idiomas', label: 'Idiomas', icon: Globe },
];

export default function Navigation({ activeSection, onNavigate, isMobileMenuOpen, toggleMobileMenu }: NavigationProps) {
  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-teal-600 to-green-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Navigation */}
      <nav className={`
        fixed left-0 top-0 h-full w-80 bg-gradient-to-br from-teal-600 via-green-600 to-emerald-700 text-white 
        transform transition-transform duration-300 ease-in-out z-40 shadow-2xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="p-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">
              CV Interactivo
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-yellow-300 to-amber-300 mx-auto mt-4 rounded-full"></div>
          </div>

          <ul className="space-y-2">
            {navigationItems.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  onClick={() => onNavigate(id)}
                  className={`
                    w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 text-left
                    hover:bg-white/10 hover:shadow-lg hover:transform hover:translate-x-2
                    ${activeSection === id 
                      ? 'bg-white/20 shadow-lg transform translate-x-2 border-l-4 border-amber-300' 
                      : 'border-l-4 border-transparent'
                    }
                  `}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className="font-medium">{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-1/2 right-0 w-1 h-32 bg-gradient-to-b from-yellow-300 to-amber-300 rounded-l-full opacity-30"></div>
      </nav>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
}