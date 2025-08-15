import { useState, useEffect, useLayoutEffect, useRef, forwardRef, ReactNode } from 'react';
import {
  User, Briefcase, GraduationCap, Globe, Zap, Brain, Landmark, FileText, HardHat, Users,
  BarChart, Gem, Lightbulb, Info, Settings, Bot, Handshake, BookOpen, Flag, LayoutDashboard,
  CheckCircle, HeartHandshake, Phone, Mail, Linkedin, ArrowRight, Sun, Moon, Download
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// ================== DATA ==================
const portfolioData = {
  profile: [
    {
      icon: <Briefcase size={24} />,
      text:
        'Ejecutiva bilingüe (inglés/español) con más de 20 años de experiencia en desarrollo de negocios, gestión estratégica de proyectos y análisis de información clave para la toma de decisiones de alta dirección.',
    },
    {
      icon: <Settings size={24} />,
      text:
        'Mi trayectoria combina habilidades avanzadas en planeación y gestión administrativa con una visión estratégica orientada a la transformación digital. Integro tecnologías emergentes - incluida la inteligencia artificial- para modernizar procesos, fortalecer la gestión empresarial y optimizar la toma de decisiones, impulsando la eficiencia operativa y la identificación de oportunidades estratégicas.',
    },
    {
      icon: <Bot size={24} />,
      text:
        'Actualmente participo en equipos interdisciplinarios que aplican inteligencia artificial en entornos empresariales, desarrollando soluciones innovadoras con impacto tangible en la organización.',
    },
    {
      icon: <Handshake size={24} />,
      text:
        'Cuento con amplia experiencia generando relaciones comerciales estratégicas entre organizaciones privadas y públicas, mediante propuestas alineadas con objetivos corporativos. Me distingo por mi capacidad para identificar necesidades del cliente, gestionar ventas de forma estructurada y construir vínculos institucionales sólidos. Tengo una orientación constante a resultados y un firme compromiso con el cumplimiento de metas organizacionales.',
    },
  ],
  skills: {
    tooltips: {
      'MS Office': 'Word, Excel, Outlook, Power Point - Nivel Avanzado',
      'Motores de búsqueda': 'Búsqueda avanzada y análisis de información',
      'Correo electrónico': 'Habilidad clave para alinear relaciones, procesos y objetivos',
      'Soluciones inteligentes': 'Implementación de Inteligencia Artificial para optimización de procesos',
      'Tecnologías emergentes': 'Adaptación e integración de nuevas tecnologías en procesos de negocio',
      'Gestión empresarial': 'Visión integral del negocio para la optimización de recursos',
      'Análisis Estratégico': 'Evaluación de datos para la toma de decisiones de alto nivel',
    },
    management: [
      'Altamente organizada y autónoma',
      'Precisión y confidencialidad de la información',
      'Respuesta eficaz a cambios de prioridades',
      'Habilidad destacada en negociación',
      'Fuertes habilidades analíticas y de resolución de problemas',
      'Atención al detalle',
      'Gestión múltiple de tareas y personas',
      'Capacidad de adaptación y aprendizaje independiente',
      'Habilidades interpersonales y de comunicación',
      'Filosofía orientada al trabajo en equipo',
    ],
  },
  experience: [
    {
      date: 'Febrero 2024 - Actualidad',
      title: 'Colaboración Actual en Proyectos Empresariales con Inteligencia Artificial',
      company: 'Rol transversal | Transformación digital y estrategia con tecnologías emergentes',
      description: [
        'Participación activa en equipos multidisciplinarios dedicados al desarrollo de soluciones empresariales mediante el uso estratégico de inteligencia artificial.',
        'Diseño, conceptualización y aplicación de iniciativas de transformación digital con impacto directo en la eficiencia operativa, la gestión de información y la toma de decisiones.',
        'Colaboración en la implementación de herramientas tecnológicas emergentes para modernizar procesos clave y fortalecer el desempeño organizacional.',
        'Aportación de perspectiva estratégica, visión de negocio y experiencia ejecutiva al diseño de soluciones inteligentes adaptadas a necesidades reales del entorno empresarial.',
      ],
      icon: <Zap size={24} />,
    },
    {
      date: 'Abril 2020 - Enero 2022',
      title: 'Jefatura de Promoción y Gestión',
      company: 'Aeropuertos y Servicios Auxiliares (Organización Gubernamental)',
      location: 'Dirección Técnica y Consultoría',
      description: [
        'Encargada de estructurar y gestionar información confidencial de siete áreas con el propósito de optimizar la toma de decisiones.',
        'Colaboré en la gestión y coordinación de comités, como obras públicas, transparencia, ética, licitaciones, adquisiciones y operaciones.',
        'Propuse y lideré la ejecución de una alianza estratégica con diversos "stakeholders" buscando generar ahorros significativos para la construcción y mantenimiento de infraestructuras aeroportuarias (20%).',
        'Coordiné negociaciones entre distintos departamentos, tanto internos como externos.',
        'Elaboré informes internos para el seguimiento y cumplimiento de los objetivos de la dirección.',
        'Implementé procedimientos para la clasificación de información confidencial.',
      ],
      icon: <Landmark size={24} />,
    },
    {
      date: 'Mayo 2018 - Abril 2020',
      title: 'Consultor de Proyectos',
      company: '',
      description: [
        'Colaboré en el desarrollo de la estrategia comercial para el mercado de telefonía celular prepagada de la empresa AT&T.',
        'Identifiqué oportunidades de negocio para proyectos de infraestructura y fungí como enlace entre el gobierno y las empresas de construcción.',
        'Consolidé y gestioné el arrendamiento de cuatro propiedades residenciales, lo cual incluyó la búsqueda de posibles clientes, la promoción a través de sitios web especializados y redes sociales, la negociación, así como la revisión de evaluaciones legales y contratos con firmas de abogados.',
      ],
      icon: <FileText size={24} />,
    },
    {
      date: 'Marzo 2014 - Mayo 2018',
      title: 'Gerente - Ventas a Gobierno e Infraestructura',
      company: 'Cementos Mexicanos - CEMEX',
      description: [
        'Mantuve y actualicé bases de datos cruciales para proyectos potenciales y clientes.',
        'Desarrollé el papel clave como intermediario principal entre el sector gubernamental y la empresa.',
        'Establecí sólidas redes institucionales para identificar valiosas oportunidades comerciales.',
        'Pronostiqué oportunidades de negocio, gestioné clientes potenciales y cerré exitosamente proyectos.',
        'Encargada de la prospección, desarrollo e implementación de proyectos de infraestructura en colaboración con el gobierno.',
        'Brindé apoyo y coordiné diversas áreas, desempeñando funciones administrativas y de gestión de proyectos (ventas, cartera, legal, calidad, planta, supervisión de obra, licitaciones, entre otros).',
        'Logré el exitoso cierre de un proyecto para pavimentar 25 calles en el centro de la Ciudad de México, en la Zona Rosa (USD $35M).',
        'Responsable de la generación de informes para la alta dirección.',
      ],
      icon: <HardHat size={24} />,
    },
    {
      date: 'Mayo 2004 - Marzo 2014',
      title: 'Especialista Senior en Información y Enlace - Relaciones Institucionales',
      company: 'Cementos Mexicanos - CEMEX',
      description: [
        'Al tratarse de un área nueva, desempeñé un papel fundamental en la estructuración e implementación de procesos administrativos alineados con las políticas de la empresa.',
        'Supervisé indicadores clave para facilitar la planificación estratégica, diseñar estrategias comerciales y apoyar la toma de decisiones.',
        'Encargada de la gestión integral y consolidación de información.',
        'Brindé respaldo a procesos operativos y administrativos, incluyendo la elaboración y seguimiento de presupuestos, generación de informes mensuales de resultados, preparación de presentaciones institucionales, coordinación de entregas, seguimiento de pedidos, entre otros.',
        'Participé activamente en el análisis para seleccionar proyectos y empresas a atender en esta área, en conformidad con las políticas de la empresa.',
        'Contribuí a la organización de información crucial para un proyecto de pavimentación en una de las avenidas más importantes de la Ciudad de México (USD $105M).',
      ],
      icon: <Users size={24} />,
    },
    {
      date: 'Junio 1999 - Mayo 2004',
      title: 'Jefatura de Soporte Operativo - Ventas Institucionales',
      company: 'Cementos Mexicanos - CEMEX',
      description: [
        'Encargada de centralizar la información de ventas a nivel nacional para clientes del sector de construcción y transformadores.',
        'Participé activamente en el análisis de términos comerciales aplicables a cada cliente del ámbito de construcción y transformación.',
        'Responsable de implementar estrategias administrativas y brindar respaldo a las tareas operativas.',
        'Coordiné el establecimiento de controles e indicadores fundamentales para empresas del sector de construcción.',
        'Contribuí al éxito en la recuperación del 40% de la cartera incobrable.',
        'Encargada de liderar la implementación de un sistema ERP (Planificación de Recursos Empresariales) a nivel nacional para el segmento institucional.',
        'Gestioné eficazmente la estrategia de precios mediante cotizaciones y negociaciones internas específicas, tales como establecer precios por volumen, gestionar entregas, tipos de productos, entre otros.',
      ],
      icon: <BarChart size={24} />,
    },
  ],
  projects: [
    {
      title: 'AI STARS LEAGUE',
      date: 'Diciembre 2024 - Junio 2025',
      description: [
        'Participación activa en una competencia internacional de alto rendimiento en inteligencia artificial aplicada.',
        'Integré equipos multidisciplinarios para resolver desafíos reales mediante tecnologías de IA, combinando pensamiento estratégico, innovación y visión de negocio.',
        'Diseñé y presenté soluciones con impacto empresarial, aplicando habilidades avanzadas en automatización, análisis de datos, generación de contenido con IA y desarrollo de herramientas inteligentes.',
        'Colaboré en proyectos enfocados en transformación digital, visualización de datos y mejora de procesos organizacionales.',
        'Fui evaluada por un panel de expertos internacionales en IA, innovación y consultoría estratégica.',
        'La experiencia fortaleció mis competencias para integrar inteligencia artificial en contextos reales, potenciar la resolución creativa de problemas y acelerar la implementación de soluciones tecnológicas.',
        'Participé en sesiones de capacitación técnica especializada y actividades de networking internacional con líderes y profesionales de alto nivel del ecosistema tecnológico global.',
      ],
      icon: <Brain size={24} />,
    },
  ],
  education: [
    {
      icon: <Brain size={24} />,
      iconColor: '#8B5CF6',
      title: 'LEARNING HEROES',
      period: '2024-2025',
      description: [
        'Programa Intensivo de Transformación Digital',
        'Especialización en Inteligencia Artificial Aplicada enfocada en implementación de soluciones inteligentes, optimización de procesos empresariales y aplicación práctica de tecnologías emergentes en entornos corporativos.',
      ],
    },
    {
      icon: <BookOpen size={24} />,
      iconColor: '#8B5CF6',
      title: 'Diplomado en Marketing Digital',
      period: '2022',
      description: 'ITAM',
    },
    {
      icon: <Landmark size={24} />,
      iconColor: '#3B82F6',
      title: 'ITESM',
      period: '2002-2004',
      description: 'Master en Administración de Negocios (MBA)',
    },
    {
      icon: <Landmark size={24} />,
      iconColor: '#3B82F6',
      title: 'ITESM',
      period: '1991-1995',
      description: 'Licenciatura en Mercadotecnia (Mención Honorífica)',
    },
  ],
  otherStudies: [
    'Diploma en Gestión Estratégica de las Finanzas Públicas; ITESM; 2016-2017.',
    'Diploma en Mercadotecnia Competitiva; World Trade Center, Business Center; 1997-1998.',
    'Diploma en Finanzas; ITESM; 1994 - 1995.',
  ],
  languages: [
    { language: 'Español', proficiency: 'Lengua nativa' },
    { language: 'Inglés', proficiency: 'Fluido' },
  ],
  contact: {
    email: 'areliaguilarln@gmail.com',
    phone: '55 4341 3490',
    linkedin: 'https://www.linkedin.com/in/areli-aguilar/',
    cvUrl: '#',
  },
};

// ================== CARRUSEL ==================
const MarqueeCarousel = () => {
  const [isHovering, setIsHovering] = useState(false);
  const phrases = [
    { text: 'Estrategia Empresarial', icon: <Landmark size={24} /> },
    { text: 'Orientación a Resultados', icon: <BarChart size={24} /> },
    { text: 'Pensamiento Crítico y Sistémico', icon: <Brain size={24} /> },
    { text: 'IA y Tecnología en Evolución', icon: <Zap size={24} /> },
    { text: 'Gestión de Proyectos', icon: <LayoutDashboard size={24} /> },
    { text: 'Análisis para la Toma de Decisiones', icon: <Gem size={24} /> },
  ];

  return (
    <div
      className="bg-transparent overflow-hidden h-12 w-full mt-6 marquee-container-wrapper flex items-center"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={`marquee-container ${isHovering ? 'paused' : ''}`}>
        {phrases.map((item, index) => (
          <div key={`g1-${index}`} className="marquee-item">
            <span className="icon">{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
        {phrases.map((item, index) => (
          <div key={`g2-${index}`} className="marquee-item">
            <span className="icon">{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ================== TIPEO ==================
const TypingEffect = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(100);

  useEffect(() => {
    const tick = () => {
      if (!isDeleting) {
        if (displayedText.length < text.length) {
          setDisplayedText(text.substring(0, displayedText.length + 1));
          setSpeed(100);
        } else {
          setSpeed(2000);
          setIsDeleting(true);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(text.substring(0, displayedText.length - 1));
          setSpeed(50);
        } else {
          setSpeed(500);
          setIsDeleting(false);
        }
      }
    };
    const t = setTimeout(tick, speed);
    return () => clearTimeout(t);
  }, [displayedText, isDeleting, speed, text]);

  return (
    <h2 className="text-xl font-bold font-sans tracking-wider mb-2 text-[#4a688b]">
      {displayedText}
      <span className="typing-cursor">|</span>
    </h2>
  );
};
// ================== NAV ==================
const Navigation = ({
  activeSection,
  onNavigate,
  isMobileMenuOpen,
  toggleMobileMenu,
  isDark,
  toggleDark,
  onDownloadPDF,
}: {
  activeSection: string;
  onNavigate: (id: string) => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  isDark: boolean;
  toggleDark: () => void;
  onDownloadPDF: () => void;
}) => {
  const sections = [
    { id: 'perfil', title: 'Perfil Profesional', icon: <User size={20} /> },
    { id: 'habilidades', title: 'Habilidades Destacadas', icon: <Gem size={20} /> },
    { id: 'experiencia', title: 'Experiencia Profesional', icon: <Briefcase size={20} /> },
    { id: 'proyectos', title: 'Proyectos de Innovación y Transformación Digital', icon: <Lightbulb size={20} /> },
    { id: 'educacion', title: 'Educación Académica', icon: <GraduationCap size={20} /> },
    { id: 'idiomas', title: 'Idiomas', icon: <Globe size={20} /> },
    { id: 'contacto', title: 'Contacto', icon: <Handshake size={20} /> },
  ];

  return (
    <nav className="app-nav fixed lg:left-0 top-0 w-full lg:w-80 h-16 lg:h-screen bg-[#1e2a38] text-gray-200 shadow-2xl z-50">
      <div className="container mx-auto px-4 lg:px-0 h-full flex items-center justify-between lg:block">
        <div className="lg:py-8 flex items-center lg:justify-center">
          <div className="flex-shrink-0 flex items-center lg:flex-col lg:text-center">
            <User size={32} className="text-amber-600 mr-3 lg:mb-4" />
            <div className="flex flex-col items-center">
              {/* Tipeo solo en desktop */}
              <div className="hidden lg:block">
                <TypingEffect text="CURRICULUM VITAE" />
              </div>
              {/* Nombre estático (móvil más pequeño) */}
              <h1 className="static-name font-bold font-sans text-gray-50 text-xs sm:text-xl lg:text-2xl leading-tight text-center">
                <span className="block">ARELI</span>
                <span className="block">AGUILAR</span>
                <span className="block">DELGADO</span>
              </h1>

              {/* Botones: Modo y PDF */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={toggleDark}
                  className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition"
                  aria-label="Alternar modo"
                  title={isDark ? 'Modo claro' : 'Modo oscuro'}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Botón con texto: Descargar CV */}
                <button
                  onClick={onDownloadPDF}
                  className="px-3 h-9 rounded-full border border-white/30 flex items-center gap-2 hover:bg-white/10 transition text-gray-100"
                  aria-label="Descargar CV"
                  title="Descargar CV"
                >
                  <Download size={16} />
                  <span className="text-sm font-medium">Descargar CV</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-3/4 mx-auto my-4 border-t border-gray-700" />

        <div className="lg:hidden">
          <button onClick={toggleMobileMenu} className="text-gray-200 hover:text-gray-400 focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div
          className={`fixed inset-x-0 top-16 bg-[#1e2a38] lg:static lg:block lg:h-auto lg:mt-8 ${
            isMobileMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <ul className="flex flex-col lg:space-y-2 p-4 lg:p-0">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(section.id);
                  }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    activeSection === section.id ? 'bg-[#4a688b] text-white shadow-lg' : 'hover:bg-gray-800'
                  }`}
                >
                  {section.icon}
                  <span className="font-semibold">{section.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

// ================== SECCIÓN GENÉRICA ==================
const Section = forwardRef(
  (
    { id, title, children }: { id: string; title: string; children: ReactNode },
    ref: any
  ) => {
    const isExpandableSection = id === 'experiencia' || id === 'proyectos';
    return (
      <section
        id={id}
        ref={ref}
        className="cv-section bg-white dark:bg-slate-900/60 p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl mb-12 transform hover:scale-[1.01] transition-transform duration-300"
      >
        <div className="flex items-center gap-4 mb-6 border-b pb-4 border-amber-600">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#4a688b] dark:text-[#93c5fd] font-sans">{title}</h2>
          {isExpandableSection && (
            <div className="flex items-center text-gray-500 dark:text-gray-300 ml-2">
              <Info size={16} className="mr-1" />
              <p className="text-sm font-medium">Presiona cada contenedor para desplegar información</p>
            </div>
          )}
        </div>
        {children}
      </section>
    );
  }
);

// ================== ITEM COLAPSABLE ==================
const CollapsibleExperience = ({
  date,
  title,
  company,
  location,
  description,
  icon,
}: {
  date: string;
  title: string;
  company?: string;
  location?: string;
  description: string[];
  icon: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen ? `${contentRef.current.scrollHeight}px` : '0px';
    }
  }, [isOpen]);

  return (
    <div className="cv-break bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden mb-4 border border-gray-200 dark:border-slate-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 sm:p-6 text-left transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-slate-700/40 focus:outline-none"
      >
        <div className="flex items-start">
          <div className="mr-4 text-amber-600 flex-shrink-0">{icon}</div>
          <div>
            <h3 className="text-lg font-bold text-[#4a688b] dark:text-slate-100">{title}</h3>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{date}</p>
            {company && <p className="text-sm text-gray-500 italic dark:text-gray-300">{company}</p>}
            {location && <p className="text-sm text-gray-500 dark:text-gray-300">{location}</p>}
          </div>
        </div>
        <svg
          className={`w-6 h-6 transform transition-transform duration-300 text-[#4a688b] dark:text-slate-100 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* atributo para el PDF */}
      <div
        ref={contentRef}
        data-collapsible-content="true"
        className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
        style={{ maxHeight: '0px' }}
      >
        <div className="px-6 pb-6 pt-2 border-t border-gray-200 dark:border-slate-700">
          <ul className="list-none space-y-2">
            {description.map((item, index) => (
              <li key={index} className="cv-break flex items-start text-gray-700 dark:text-gray-200">
                <span className="text-amber-600 mr-2 flex-shrink-0">&rarr;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// ================== CARDS ==================
const ProfileCard = ({ icon, text }: { icon: ReactNode; text: string }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 sm:p-6 mb-4 border border-gray-200 dark:border-slate-700">
    <div className="flex items-start">
      <div className="mr-4 text-[#4a688b] dark:text-[#93c5fd] mt-1 flex-shrink-0">{icon}</div>
      <p className="text-gray-800 dark:text-gray-100 text-base sm:text-lg leading-relaxed">{text}</p>
    </div>
  </div>
);

const EducationCard = ({
  icon,
  iconColor,
  title,
  period,
  description,
}: {
  icon: ReactNode;
  iconColor: string;
  title: string;
  period: string;
  description: string | string[];
}) => (
  <div className="cv-break bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 sm:p-6 mb-4 border border-gray-200 dark:border-slate-700">
    <div className="flex items-start">
      <div className="mr-4 flex-shrink-0" style={{ color: iconColor }}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-[#4a688b] dark:text-slate-100">{title}</h3>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{period}</p>
        {Array.isArray(description) ? (
          <ul className="list-none space-y-2">
            {description.map((item, index) => (
              <li key={index} className="cv-break flex items-start text-gray-700 dark:text-gray-200">
                <span className="text-amber-600 mr-2 flex-shrink-0">&rarr;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700 dark:text-gray-200">{description}</p>
        )}
      </div>
    </div>
  </div>
);

const OtherStudies = ({ items }: { items: string[] }) => (
  <div className="cv-break bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 sm:p-6 mb-4 border border-gray-200 dark:border-slate-700">
    <h3 className="text-lg font-bold text-[#4a688b] dark:text-slate-100 mb-2">Otros estudios:</h3>
    <ul className="list-none space-y-2">
      {items.map((item, index) => (
        <li key={index} className="cv-break flex items-start text-gray-700 dark:text-gray-200">
          <BookOpen className="mr-2 flex-shrink-0 text-amber-600" size={20} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const LanguageCard = ({ language, proficiency }: { language: string; proficiency: string }) => (
  <div className="cv-break bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 dark:border-slate-700 flex-1 min-w-[150px] transition-all duration-300 hover:shadow-lg">
    <div className="flex items-center">
      <Flag className="w-6 h-6 mr-4 flex-shrink-0 text-amber-600" />
      <div>
        <h3 className="text-lg font-bold text-[#4a688b] dark:text-slate-100">{language}</h3>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{proficiency}</p>
      </div>
    </div>
  </div>
);

const SkillsCard = ({
  title,
  icon,
  iconColor,
  children,
}: {
  title: string;
  icon: ReactNode;
  iconColor: string;
  children: ReactNode;
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 sm:p-6 mb-4 border border-gray-200 dark:border-slate-700">
    <div className="flex items-center mb-4">
      <div className="mr-4 flex-shrink-0" style={{ color: iconColor }}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[#4a688b] dark:text-slate-100">{title}</h3>
    </div>
    {children}
  </div>
);

const ContactCard = ({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) => {
  const isLink = !!href;
  const inner = (
    <div
      className={`cv-break bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 sm:p-6 mb-4 border border-gray-200 dark:border-slate-700 transition-all duration-300 ${
        isLink ? 'bg-gray-100/60 dark:bg-slate-700/40' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="mr-4 text-amber-600 mt-1 flex-shrink-0">{icon}</div>
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">{label}</p>
            <p className="text-lg font-bold text-[#4a688b] dark:text-slate-100 break-words">{value}</p>
          </div>
        </div>
        {isLink && (
          <div className="transition-opacity duration-300">
            <ArrowRight size={24} className="text-[#4a688b] dark:text-slate-100" />
          </div>
        )}
      </div>
    </div>
  );

  return isLink ? (
    <a href={href} className="block" target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <div className="block cursor-default">{inner}</div>
  );
};
// ================== APP ==================
const App = () => {
  const [activeSection, setActiveSection] = useState('perfil');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Tema claro/oscuro estable (persistente)
  const getInitialDark = () => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  };
  const [isDark, setIsDark] = useState<boolean>(getInitialDark());

  // Aplicar 'dark' antes del primer pintado (evita parpadeo)
  useLayoutEffect(() => {
    const saved = (() => {
      try { return localStorage.getItem('theme'); } catch { return null; }
    })();
    const initialDark =
      saved ? saved === 'dark'
            : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', initialDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch {}
  }, [isDark]);
  const toggleDark = () => setIsDark((d) => !d);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleNavigate = (sectionId: string) => {
    const el = sectionRefs.current[sectionId];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsMobileMenuOpen(false);
  };

  // Intersecciones para resaltar sección activa
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id)),
      { threshold: 0.3, rootMargin: '-20px 0px -50% 0px' }
    );
    Object.values(sectionRefs.current).forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // PDF: no cortar dentro de tarjetas/ítems y barra azul hasta el final
  const handleDownloadPDF = async () => {
    const root = wrapperRef.current;
    if (!root) return;

    document.body.classList.add('capture-pdf');

    // Forzar barra azul a cubrir TODO: posición absoluta + gran altura
    const navEl = root.querySelector('.app-nav') as HTMLElement | null;
    const prevNav = navEl
      ? {
          position: navEl.style.position,
          height: navEl.style.height,
          top: navEl.style.top,
          left: navEl.style.left,
          zIndex: navEl.style.zIndex,
        }
      : null;

    const docH = Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0,
      root.scrollHeight
    );
    if (navEl) {
      navEl.style.position = 'absolute';
      navEl.style.top = '0';
      navEl.style.left = '0';
      navEl.style.height = `${docH + 5000}px`; // buffer generoso
      navEl.style.zIndex = '0';
    }

    // Expandir colapsables
    window.scrollTo(0, 0);
    const collapsibles = Array.from(
      root.querySelectorAll<HTMLElement>('[data-collapsible-content="true"]')
    );
    const prevHeights = collapsibles.map((el) => el.style.maxHeight);
    collapsibles.forEach((el) => { el.style.maxHeight = `${el.scrollHeight}px`; });

    await new Promise((r) => setTimeout(r, 250));

    // Captura
    const bg = getComputedStyle(root).backgroundColor || (isDark ? '#0b1220' : '#ffffff');
    const canvas = await html2canvas(root, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: bg,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
      scrollX: 0,
      scrollY: -window.scrollY,
    });

    // PDF base
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Conversión DOMpx <-> PDFpt
    const pxToPdf = imgWidth / canvas.width;
    const pdfToPx = 1 / pxToPdf;
    const domPageHeight = pageHeight * pdfToPx;

    // Anclas seguras (secciones + tarjetas/ítems)
    const rootRect = root.getBoundingClientRect();
    const safeNodes = Array.from(root.querySelectorAll<HTMLElement>('.cv-section, .cv-break'));
    const safeTopsSet = new Set<number>([0, canvas.height]);
    safeNodes.forEach((n) => {
      const r = n.getBoundingClientRect();
      const topAbs = r.top - rootRect.top + window.scrollY;
      safeTopsSet.add(Math.max(0, Math.round(topAbs)));
    });
    const safeTops = Array.from(safeTopsSet).sort((a, b) => a - b);

    // Paginación por "final de página" (end-aligned)
    const pageEndsPx: number[] = [];
    let currentEnd = domPageHeight; // primera página aprox. una hoja
    const margin = 24;
    const minAdvance = 120;

    while (currentEnd < canvas.height + 1) {
      const limit = currentEnd - margin;
      // Tomar el mayor "safeTop" <= limit
      const candidates = safeTops.filter(v => v <= limit && v >= (pageEndsPx[pageEndsPx.length - 1] || 0) + minAdvance);
      const endPx = candidates.length ? candidates[candidates.length - 1] : Math.max(0, Math.round(limit));
      pageEndsPx.push(endPx);

      if (endPx >= canvas.height) break; // llegamos al final
      currentEnd = endPx + domPageHeight;
    }

    // Pintar páginas usando los "finales" calculados
    pageEndsPx.forEach((endPx, idx) => {
      const startPx = Math.max(0, Math.round(endPx - domPageHeight)); // región [start, end]
      if (idx > 0) pdf.addPage();
      const yPdf = -startPx * pxToPdf;
      pdf.addImage(imgData, 'PNG', 0, yPdf, imgWidth, imgHeight);
    });

    pdf.save('CV_Areli_Aguilar.pdf');

    // Restaurar
    collapsibles.forEach((el, i) => { el.style.maxHeight = prevHeights[i]; });
    if (navEl && prevNav) {
      navEl.style.position = prevNav.position;
      navEl.style.height = prevNav.height;
      navEl.style.top = prevNav.top;
      navEl.style.left = prevNav.left;
      navEl.style.zIndex = prevNav.zIndex;
    }
    document.body.classList.remove('capture-pdf');
  };

  return (
    <div
      ref={wrapperRef}
      id="cv-container"
      className="min-h-screen bg-gray-50 dark:bg-[#0b1220] font-sans antialiased text-gray-800 dark:text-gray-100"
    >
      <style>{`
      /* Cursor del tipeo */
      .typing-cursor { display:inline-block; animation: blink-caret 0.75s step-end infinite; opacity:1; }
      @keyframes blink-caret { from,to{opacity:0;} 50%{opacity:1;} }

      /* Carrusel (loop continuo sin huecos, tipografía más sutil) */
      @keyframes marquee {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }
      .marquee-container {
        display: flex;
        height: 100%;
        width: max-content;
        animation: marquee 60s linear infinite; /* para acelerar reduce p.ej. a 48s */
        will-change: transform;
      }
      .marquee-container.paused { animation-play-state: paused; }

      .marquee-item {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        white-space: nowrap;
        padding: 0 1.75rem;
        font-family: 'Inter', sans-serif;
        font-size: 1.1rem;
        font-weight: 400;
        color: #4a688b;
      }
      @media (max-width: 1023px) {
        .marquee-item { font-size: 0.95rem; padding: 0 1rem; }
      }
      .marquee-item .icon { color:#d97706; margin-right:.5rem; display:inline-block; vertical-align:middle; }

      /* Chips base */
      .skill-chip{ background-color:#e5e7eb; color:#374151; border:1px solid #d1d5db; }
      .dark .skill-chip{ background-color:#334155; color:#f8fafc; border-color:#475569; }

      /* Contraste extra en oscuro para chips marcados como competencia-btn */
      .competencia-btn { }
      .dark .competencia-btn { color: #fff !important; background-color: rgba(255,255,255,0.08); }
      .dark .competencia-btn:hover { background-color: rgba(255,255,255,0.16); }

      /* Tooltip en modo claro — fondo azul suave y texto legible */
      .tooltip-content {
        background-color: #a8c0d9; /* azul suave original */
        color: #0f172a;            /* contraste alto */
        border: 1px solid #93a8c3; /* borde sutil */
      }
      /* Tooltip en modo oscuro — Opción 3 (gris azulado) */
      .dark .tooltip-content {
        background-color: #475569;  /* slate-600 */
        color: #ffffff;
        border: 1px solid #94A3B8;  /* slate-400 */
      }
      `}</style>

      <Navigation
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isDark={isDark}
        toggleDark={toggleDark}
        onDownloadPDF={handleDownloadPDF}
      />

      {/* Carrusel superior y "CURRICULUM VITAE" en móvil */}
      <div className="pt-16 lg:pt-0 lg:ml-80">
        <MarqueeCarousel />
        <div className="px-4 pt-2 block lg:hidden">
          <TypingEffect text="CURRICULUM VITAE" />
        </div>
      </div>

      <main className="lg:ml-80 p-6 lg:p-8">
        {/* Perfil */}
        <Section ref={(el) => (sectionRefs.current.perfil = el)} id="perfil" title="Perfil Profesional">
          {portfolioData.profile.map((item, index) => (
            <ProfileCard key={index} icon={item.icon} text={item.text} />
          ))}
        </Section>

        {/* Habilidades */}
        <Section ref={(el) => (sectionRefs.current.habilidades = el)} id="habilidades" title="Habilidades Destacadas">
          <div className="space-y-6">
            <SkillsCard title="Experiencia Ejecutiva" icon={<Briefcase size={24} />} iconColor="#d97706">
              <p className="text-gray-700 dark:text-gray-200">
                Más de 15 años de experiencia realizando gestiones administrativas clave a nivel ejecutivo para la alta dirección.
              </p>
            </SkillsCard>

            <SkillsCard title="Habilidades de Gestión Gerencial" icon={<LayoutDashboard size={24} />} iconColor="#d97706">
              <div className="grid md:grid-cols-2 gap-4">
                {portfolioData.skills.management.map((skill, i) => (
                  <div key={i} className="flex items-start text-gray-700 dark:text-gray-200">
                    <CheckCircle size={16} className="text-[#4a688b] dark:text-[#93c5fd] mr-2 flex-shrink-0 mt-1" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </SkillsCard>

            <SkillsCard title="Competencias" icon={<Gem size={24} />} iconColor="#d97706">
              <p className="text-gray-700 dark:text-gray-200 mb-4">
                - Desliza el cursor sobre cada competencia para conocer más detalles.
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(portfolioData.skills.tooltips).map(([label, tooltip], idx) => (
                  <div key={idx} className="relative group">
                    <span className="skill-chip competencia-btn px-3 py-1 rounded-full text-sm cursor-help group-hover:shadow-md transition">
                      {label}
                      <Info size={12} className="inline-block ml-1 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </span>
                    <div className="tooltip-content absolute z-10 hidden group-hover:block font-medium text-xs p-3 shadow-xl rounded-md w-64 top-full mt-1 left-1/2 -translate-x-1/2">
                      {tooltip}
                    </div>
                  </div>
                ))}
              </div>
            </SkillsCard>

            <SkillsCard title="Enfoque de Colaboración" icon={<HeartHandshake size={24} />} iconColor="#d97706">
              <p className="text-gray-700 dark:text-gray-200">
                Habilidades destacadas para generar confianza, facilitar la cooperación y fomentar un ambiente de alto rendimiento.
              </p>
            </SkillsCard>
          </div>
        </Section>

        {/* Experiencia */}
        <Section ref={(el) => (sectionRefs.current.experiencia = el)} id="experiencia" title="Experiencia Profesional">
          {portfolioData.experience.map((exp, index) => (
            <CollapsibleExperience
              key={index}
              date={exp.date}
              title={exp.title}
              company={exp.company}
              location={(exp as any).location}
              description={exp.description}
              icon={exp.icon}
            />
          ))}
        </Section>

        {/* Proyectos */}
        <Section ref={(el) => (sectionRefs.current.proyectos = el)} id="proyectos" title="Proyectos de Innovación y Transformación Digital">
          {portfolioData.projects.map((project, index) => (
            <CollapsibleExperience
              key={index}
              date={project.date}
              title={project.title}
              description={project.description}
              icon={project.icon}
            />
          ))}
        </Section>

        {/* Educación */}
        <Section ref={(el) => (sectionRefs.current.educacion = el)} id="educacion" title="Educación Académica">
          {portfolioData.education.map((edu, index) => (
            <EducationCard
              key={index}
              icon={edu.icon}
              iconColor={(edu as any).iconColor}
              title={edu.title}
              period={edu.period}
              description={edu.description}
            />
          ))}
          <OtherStudies items={portfolioData.otherStudies} />
        </Section>

        {/* Idiomas */}
        <Section ref={(el) => (sectionRefs.current.idiomas = el)} id="idiomas" title="Idiomas">
          <div className="flex flex-col md:flex-row gap-4">
            {portfolioData.languages.map((lang, index) => (
              <LanguageCard key={index} language={lang.language} proficiency={lang.proficiency} />
            ))}
          </div>
        </Section>

        {/* Contacto */}
        <Section ref={(el) => (sectionRefs.current.contacto = el)} id="contacto" title="Contacto">
          <div className="grid md:grid-cols-2 gap-4">
            <ContactCard
              icon={<Mail size={24} />}
              label="Correo Electrónico"
              value={portfolioData.contact.email}
              href={`mailto:${portfolioData.contact.email}`}
            />
            <ContactCard
              icon={<Linkedin size={24} />}
              label="LinkedIn"
              value="Perfil de LinkedIn"
              href={portfolioData.contact.linkedin}
            />
            <ContactCard
              icon={<Phone size={24} />}
              label="Teléfono"
              value={portfolioData.contact.phone}
              href={`tel:${portfolioData.contact.phone.replace(/\s+/g, '')}`}
            />
          </div>
        </Section>
      </main>
    </div>
  );
};

export default App;
