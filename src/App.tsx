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
    { icon: <Briefcase size={24} />, text: 'Ejecutiva bilingüe (inglés/español) con más de 20 años de experiencia en desarrollo de negocios, gestión estratégica de proyectos y análisis de información clave para la toma de decisiones de alta dirección.' },
    { icon: <Settings size={24} />, text: 'Mi trayectoria combina habilidades avanzadas en planeación y gestión administrativa con una visión estratégica orientada a la transformación digital. Integro tecnologías emergentes - incluida la inteligencia artificial- para modernizar procesos, fortalecer la gestión empresarial y optimizar la toma de decisiones, impulsando la eficiencia operativa y la identificación de oportunidades estratégicas.' },
    { icon: <Bot size={24} />, text: 'Actualmente participo en equipos interdisciplinarios que aplican inteligencia artificial en entornos empresariales, desarrollando soluciones innovadoras con impacto tangible en la organización.' },
    { icon: <Handshake size={24} />, text: 'Cuento con amplia experiencia generando relaciones comerciales estratégicas entre organizaciones privadas y públicas, mediante propuestas alineadas con objetivos corporativos. Me distingo por mi capacidad para identificar necesidades del cliente, gestionar ventas de forma estructurada y construir vínculos institucionales sólidos. Tengo una orientación constante a resultados y un firme compromiso con el cumplimiento de metas organizacionales.' },
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
    { icon: <Brain size={24} />, iconColor: '#8B5CF6', title: 'LEARNING HEROES', period: '2024-2025', description: ['Programa Intensivo de Transformación Digital', 'Especialización en IA Aplicada enfocada en implementación y optimización de procesos.'] },
    { icon: <BookOpen size={24} />, iconColor: '#8B5CF6', title: 'Diplomado en Marketing Digital', period: '2022', description: 'ITAM' },
    { icon: <Landmark size={24} />, iconColor: '#3B82F6', title: 'ITESM', period: '2002-2004', description: 'MBA' },
    { icon: <Landmark size={24} />, iconColor: '#3B82F6', title: 'ITESM', period: '1991-1995', description: 'Licenciatura en Mercadotecnia (Mención Honorífica)' },
  ],
  otherStudies: [
    'Diploma en Gestión Estratégica de las Finanzas Públicas; ITESM; 2016-2017.',
    'Diploma en Mercadotecnia Competitiva; WTC; 1997-1998.',
    'Diploma en Finanzas; ITESM; 1994 - 1995.',
  ],
  languages: [
    { language: 'Español', proficiency: 'Lengua nativa' },
    { language: 'Inglés', proficiency: 'Fluido' },
  ],
  contact: {
    email: 'areliaguilarln@gmail.com
// ================== CARDS (continuación) ==================
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
      <h3 className="text-lg font-bold text-[#4a688b] dark:text-slate-100">
        {title}
      </h3>
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
          <div className="mr-4 text-amber-600 mt-1 flex-shrink-0">
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">
              {label}
            </p>
            <p className="text-lg font-bold text-[#4a688b] dark:text-slate-100 break-words">
              {value}
            </p>
          </div>
        </div>
        {isLink && (
          <ArrowRight size={24} className="text-[#4a688b] dark:text-slate-100" />
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

  // Tema claro/oscuro (sin parpadeo)
  const getInitialDark = () => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    } catch {
      return false;
    }
  };
  const [isDark, setIsDark] = useState<boolean>(getInitialDark());

  useLayoutEffect(() => {
    const saved = (() => {
      try {
        return localStorage.getItem('theme');
      } catch {
        return null;
      }
    })();
    const initialDark = saved
      ? saved === 'dark'
      : window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;
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

  // Señalar sección activa en el menú
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && setActiveSection(e.target.id)
        ),
      { threshold: 0.3, rootMargin: '-20px 0px -50% 0px' }
    );
    Object.values(sectionRefs.current).forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Evita doble clic concurrente y permite descargar N veces
  const isDownloadingRef = useRef(false);

  // --- DESCARGA PDF (mejorada para no cortar y cubrir todo el CV) ---
  const handleDownloadPDF = async () => {
    const root = wrapperRef.current;
    if (!root || isDownloadingRef.current) return;
    isDownloadingRef.current = true;

    // Extiende la barra azul fija en desktop durante la captura
    if (window.matchMedia('(min-width: 1024px)').matches) {
      document.body.classList.add('capture-pdf');
    }

    // Asegura tope al inicio
    window.scrollTo(0, 0);

    // Sentinela final para asegurar que se capture el último pixel (Contacto)
    const sentinel = document.createElement('div');
    sentinel.className = 'cv-break';
    sentinel.style.width = '1px';
    sentinel.style.height = '1px';
    root.appendChild(sentinel);

    // 1) Expandir colapsables
    const collapsibles = Array.from(
      root.querySelectorAll<HTMLElement>('[data-collapsible-content="true"]')
    );
    const prevHeights = collapsibles.map((el) => el.style.maxHeight);
    collapsibles.forEach((el) => {
      el.style.maxHeight = `${el.scrollHeight}px`;
    });

    await new Promise((r) => setTimeout(r, 250));

    // 2) Captura
    const totalWidth = Math.max(
      root.scrollWidth,
      root.offsetWidth,
      root.clientWidth
    );
    const totalHeight = Math.max(
      root.scrollHeight,
      root.offsetHeight,
      root.clientHeight,
      document.documentElement.scrollHeight
    );
    const bg =
      getComputedStyle(root).backgroundColor || (isDark ? '#0b1220' : '#ffffff');

    const canvas = await html2canvas(root, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: bg,
      windowWidth: totalWidth,
      windowHeight: totalHeight,
      width: totalWidth,
      height: totalHeight,
      scrollX: 0,
      scrollY: 0,
    });

    // 3) Paginado "inteligente"
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pxToPdf = imgWidth / canvas.width;
    const pdfToPx = 1 / pxToPdf;
    const domPageHeight = pageHeight * pdfToPx - 8; // colchón contra redondeos

    // Anclajes seguros para los cortes
    const rootRect = root.getBoundingClientRect();
    const anchorNodes = Array.from(
      root.querySelectorAll<HTMLElement>('.cv-section, .cv-break')
    );
    const rawTops = anchorNodes.map((n) =>
      Math.max(
        0,
        Math.round(n.getBoundingClientRect().top - rootRect.top + window.scrollY)
      )
    );
    rawTops.push(0, canvas.height);
    const safeTops = Array.from(new Set(rawTops)).sort((a, b) => a - b);

    const starts: number[] = [0];
    const margin = 24;
    const minAdvance = 96;

    while (true) {
      const last = starts[starts.length - 1];
      const limit = last + domPageHeight - margin;
      if (limit >= canvas.height) break;

      const lastPossibleStart = Math.max(0, canvas.height - domPageHeight);

      // Preferir el ancla anterior al límite
      const candidates = safeTops.filter(
        (v) => v > last + minAdvance && v <= limit
      );
      let next =
        candidates.length > 0 ? candidates[candidates.length - 1] : undefined;

      if (next === undefined) {
        next = safeTops.find((v) => v >= limit);
      }
      if (next === undefined) next = lastPossibleStart;
      else if (next > lastPossibleStart) next = lastPossibleStart;

      if (next <= last + minAdvance)
        next = Math.min(last + domPageHeight, lastPossibleStart);
      if (next <= last) break;

      starts.push(Math.round(next));
    }

    const lastStart = starts[starts.length - 1];
    if (lastStart + domPageHeight < canvas.height) {
      starts.push(Math.max(0, Math.round(canvas.height - domPageHeight)));
    }

    const uniqStarts = Array.from(new Set(starts)).sort((a, b) => a - b);
    uniqStarts.forEach((startPx, idx) => {
      if (idx > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, -startPx * pxToPdf, imgWidth, imgHeight);
    });

    // 4) Guardar (multi-uso)
    const filename = 'CV_Areli_Aguilar.pdf';
    const ua = navigator.userAgent || '';
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (/\bMacintosh\b/.test(ua) && 'ontouchend' in document);

    try {
      if (isIOS) {
        const dataUrl = pdf.output('dataurlstring');
        window.open(dataUrl, '_blank');
      } else {
        pdf.save(filename);
      }
    } catch {
      try {
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      } catch {
        try {
          window.open(pdf.output('dataurlstring'), '_blank');
        } catch {}
      }
    }

    // 5) Restaurar
    collapsibles.forEach((el, i) => {
      el.style.maxHeight = prevHeights[i];
    });
    document.body.classList.remove('capture-pdf');
    sentinel.remove();
    isDownloadingRef.current = false;
  };

  return (
    <div
      ref={wrapperRef}
      id="cv-container"
      className="min-h-screen bg-gray-50 dark:bg-[#0b1220] font-sans antialiased text-gray-800 dark:text-gray-100"
    >
      <style>{`
      .typing-cursor{display:inline-block;animation:blink-caret .75s step-end infinite;opacity:1}
      @keyframes blink-caret{from,to{opacity:0}50%{opacity:1}}

      /* Carrusel */
      @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      .marquee-container{display:flex;height:100%;width:max-content;animation:marquee 30s linear infinite;will-change:transform}
      .marquee-container.paused{animation-play-state:paused}
      .marquee-item{flex-shrink:0;display:flex;align-items:center;white-space:nowrap;padding:0 1.75rem;font-family:'Inter',sans-serif;font-size:1.1rem;font-weight:400;color:#4a688b}
      @media (max-width:1023px){.marquee-item{font-size:.95rem;padding:0 1rem}}
      .marquee-item .icon{color:#d97706;margin-right:.5rem;display:inline-block;vertical-align:middle}

      /* Chips Competencias */
      .skill-chip{background-color:#e5e7eb;color:#374151;border:1px solid #d1d5db}
      .dark .skill-chip{background-color:#334155;color:#f8fafc;border-color:#475569}
      .dark .competencia-btn{color:#fff!important;background-color:rgba(255,255,255,.08)}
      .dark .competencia-btn:hover{background-color:rgba(255,255,255,.16)}
      .tooltip-content{background-color:#a8c0d9;color:#0f172a;border:1px solid #93a8c3}
      .dark .tooltip-content{background-color:#475569;color:#fff;border:1px solid #94A3B8}

      /* Columna azul fija para la captura de PDF en desktop */
      @media (min-width:1024px){
        .capture-pdf .app-nav::after{
          content:"";position:fixed;left:0;top:0;width:20rem;height:20000px;background:#1e2a38;z-index:-1
        }
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

      {/* Carrusel + título móvil */}
      <div className="pt-16 lg:pt-0 lg:ml-80">
        <MarqueeCarousel />
        <div className="px-4 pt-2 block lg:hidden">
          <TypingEffect text="CURRICULUM VITAE" />
        </div>
      </div>

      <main className="lg:ml-80 p-6 lg:p-8">
        {/* Perfil */}
        <Section
          ref={(el) => (sectionRefs.current.perfil = el)}
          id="perfil"
          title="Perfil Profesional"
        >
          {portfolioData.profile.map((item, index) => (
            <ProfileCard key={index} icon={item.icon} text={item.text} />
          ))}
        </Section>

        {/* Habilidades */}
        <Section
          ref={(el) => (sectionRefs.current.habilidades = el)}
          id="habilidades"
          title="Habilidades Destacadas"
        >
          <div className="space-y-6">
            <SkillsCard
              title="Experiencia Ejecutiva"
              icon={<Briefcase size={24} />}
              iconColor="#d97706"
            >
              <p className="text-gray-700 dark:text-gray-200">
                Más de 15 años de experiencia realizando gestiones administrativas
                clave a nivel ejecutivo para la alta dirección.
              </p>
            </SkillsCard>

            <SkillsCard
              title="Habilidades de Gestión Gerencial"
              icon={<LayoutDashboard size={24} />}
              iconColor="#d97706"
            >
              <div className="grid md:grid-cols-2 gap-4">
                {portfolioData.skills.management.map((skill, i) => (
                  <div
                    key={i}
                    className="flex items-start text-gray-700 dark:text-gray-200"
                  >
                    <CheckCircle
                      size={16}
                      className="text-[#4a688b] dark:text-[#93c5fd] mr-2 flex-shrink-0 mt-1"
                    />
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
                {Object.entries(portfolioData.skills.tooltips).map(
                  ([label, tooltip], idx) => (
                    <div key={idx} className="relative group">
                      <span className="skill-chip competencia-btn px-3 py-1 rounded-full text-sm cursor-help group-hover:shadow-md transition">
                        {label}
                        <Info
                          size={12}
                          className="inline-block ml-1 opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                      </span>
                      <div className="tooltip-content absolute z-10 hidden group-hover:block font-medium text-xs p-3 shadow-xl rounded-md w-64 top-full mt-1 left-1/2 -translate-x-1/2">
                        {tooltip}
                      </div>
                    </div>
                  )
                )}
              </div>
            </SkillsCard>

            <SkillsCard
              title="Enfoque de Colaboración"
              icon={<HeartHandshake size={24} />}
              iconColor="#d97706"
            >
              <p className="text-gray-700 dark:text-gray-200">
                Habilidades destacadas para generar confianza, facilitar la cooperación y
                fomentar un ambiente de alto rendimiento.
              </p>
            </SkillsCard>
          </div>
        </Section>

        {/* Experiencia */}
        <Section
          ref={(el) => (sectionRefs.current.experiencia = el)}
          id="experiencia"
          title="Experiencia Profesional"
        >
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
        <Section
          ref={(el) => (sectionRefs.current.proyectos = el)}
          id="proyectos"
          title="Proyectos de Innovación y Transformación Digital"
        >
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
        <Section
          ref={(el) => (sectionRefs.current.educacion = el)}
          id="educacion"
          title="Educación Académica"
        >
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
        <Section
          ref={(el) => (sectionRefs.current.idiomas = el)}
          id="idiomas"
          title="Idiomas"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {portfolioData.languages.map((lang, index) => (
              <LanguageCard
                key={index}
                language={lang.language}
                proficiency={lang.proficiency}
              />
            ))}
          </div>
        </Section>

        {/* Contacto */}
        <Section
          ref={(el) => (sectionRefs.current.contacto = el)}
          id="contacto"
          title="Contacto"
        >
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

