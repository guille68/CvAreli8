// ================== APP ==================
const App = () => {
  const [activeSection, setActiveSection] = useState('perfil');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Tema claro/oscuro
  const getInitialDark = () => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch { return false; }
  };
  const [isDark, setIsDark] = useState<boolean>(getInitialDark());
  useLayoutEffect(() => {
    const saved = (() => { try { return localStorage.getItem('theme'); } catch { return null; } })();
    const initialDark = saved ? saved === 'dark' : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', initialDark);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch {}
  }, [isDark]);
  const toggleDark = () => setIsDark(d => !d);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleNavigate = (sectionId: string) => {
    const el = sectionRefs.current[sectionId];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id)),
      { threshold: 0.3, rootMargin: '-20px 0px -50% 0px' }
    );
    Object.values(sectionRefs.current).forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // --- DESCARGA PDF ---
  const handleDownloadPDF = async () => {
    const root = wrapperRef.current;
    if (!root) return;

    if (window.matchMedia('(min-width: 1024px)').matches) {
      document.body.classList.add('capture-pdf');
    }

    window.scrollTo(0, 0);

    // Expandir colapsables
    const collapsibles = Array.from(root.querySelectorAll<HTMLElement>('[data-collapsible-content="true"]'));
    const prevHeights = collapsibles.map((el) => el.style.maxHeight);
    collapsibles.forEach((el) => { el.style.maxHeight = `${el.scrollHeight}px`; });

    await new Promise((r) => setTimeout(r, 250));

    const totalWidth  = Math.max(root.scrollWidth,  root.offsetWidth,  root.clientWidth);
    const totalHeight = Math.max(root.scrollHeight, root.offsetHeight, root.clientHeight);

    const bg = getComputedStyle(root).backgroundColor || (isDark ? '#0b1220' : '#ffffff');
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

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Paginado por cortes "seguros"
    const pxToPdf = imgWidth / canvas.width;
    const pdfToPx = 1 / pxToPdf;
    const domPageHeight = pageHeight * pdfToPx;

    const rootRect = root.getBoundingClientRect();
    const anchorNodes = Array.from(root.querySelectorAll<HTMLElement>('.cv-section, .cv-break'));
    const rawTops = anchorNodes.map(n =>
      Math.max(0, Math.round(n.getBoundingClientRect().top - rootRect.top + window.scrollY))
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
      let next = safeTops.find(v => v >= limit);

      if (next === undefined) next = lastPossibleStart;
      else if (next > lastPossibleStart) next = lastPossibleStart;

      if (next <= last + minAdvance) next = Math.min(last + domPageHeight, lastPossibleStart);
      if (next <= last) break;

      starts.push(Math.round(next));
    }

    const lastStart = starts[starts.length - 1];
    if (lastStart + domPageHeight < canvas.height) {
      starts.push(Math.max(0, Math.round(canvas.height - domPageHeight)));
    }

    const uniqStarts = Array.from(new Set(starts)).sort((a, b) => a - b);
    const imgW = imgWidth, imgH = imgHeight;

    uniqStarts.forEach((startPx, idx) => {
      if (idx > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, -startPx * pxToPdf, imgW, imgH);
    });

    // ======= Guardado robusto =======
    const filename = 'CV_Areli_Aguilar.pdf';
    const ua = navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (/\bMacintosh\b/.test(ua) && 'ontouchend' in document);

    try {
      if (isIOS) {
        // iOS: abrir en pestaña (no respeta download)
        const dataUrl = pdf.output('dataurlstring');
        window.open(dataUrl, '_blank');
      } else {
        // Escritorio (Chrome/Edge/Firefox/Safari macOS): Blob + <a download>
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
    } catch {
      // Fallbacks
      try { pdf.save(filename); }
      catch {
        try { window.open(pdf.output('dataurlstring'), '_blank'); } catch {}
      }
    }

    // Restaurar colapsables y limpieza
    collapsibles.forEach((el, i) => { el.style.maxHeight = prevHeights[i]; });
    document.body.classList.remove('capture-pdf');
  };

  return (
    <div ref={wrapperRef} id="cv-container" className="min-h-screen bg-gray-50 dark:bg-[#0b1220] font-sans antialiased text-gray-800 dark:text-gray-100">
      <style>{`
      .typing-cursor{display:inline-block;animation:blink-caret .75s step-end infinite;opacity:1}
      @keyframes blink-caret{from,to{opacity:0}50%{opacity:1}}

      @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      .marquee-container{display:flex;height:100%;width:max-content;animation:marquee 60s linear infinite;will-change:transform}
      .marquee-container.paused{animation-play-state:paused}
      .marquee-item{flex-shrink:0;display:flex;align-items:center;white-space:nowrap;padding:0 1.75rem;font-family:'Inter',sans-serif;font-size:1.1rem;font-weight:400;color:#4a688b}
      @media (max-width:1023px){.marquee-item{font-size:.95rem;padding:0 1rem}}
      .marquee-item .icon{color:#d97706;margin-right:.5rem;display:inline-block;vertical-align:middle}

      .skill-chip{background-color:#e5e7eb;color:#374151;border:1px solid #d1d5db}
      .dark .skill-chip{background-color:#334155;color:#f8fafc;border-color:#475569}
      .dark .competencia-btn{color:#fff!important;background-color:rgba(255,255,255,.08)}
      .dark .competencia-btn:hover{background-color:rgba(255,255,255,.16)}
      .tooltip-content{background-color:#a8c0d9;color:#0f172a;border:1px solid #93a8c3}
      .dark .tooltip-content{background-color:#475569;color:#fff;border:1px solid #94A3B8}

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
        <Section ref={(el) => (sectionRefs.current.perfil = el)} id="perfil" title="Perfil Profesional">
          {portfolioData.profile.map((item, index) => (
            <ProfileCard key={index} icon={item.icon} text={item.text} />
          ))}
        </Section>

        <Section ref={(el) => (sectionRefs.current.habilidades = el)} id="habilidades" title="Habilidades Destacadas">
          <div className="space-y-6">
            <SkillsCard title="Experiencia Ejecutiva" icon={<Briefcase size={24} />} iconColor="#d97706">
              <p className="text-gray-700 dark:text-gray-200">Más de 15 años de experiencia realizando gestiones administrativas clave a nivel ejecutivo para la alta dirección.</p>
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
              <p className="text-gray-700 dark:text-gray-200 mb-4">- Desliza el cursor sobre cada competencia para conocer más detalles.</p>
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
              <p className="text-gray-700 dark:text-gray-200">Habilidades destacadas para generar confianza, facilitar la cooperación y fomentar un ambiente de alto rendimiento.</p>
            </SkillsCard>
          </div>
        </Section>

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

        <Section ref={(el) => (sectionRefs.current.proyectos = el)} id="proyectos" title="Proyectos de Innovación y Transformación Digital">
          {portfolioData.projects.map((project, index) => (
            <CollapsibleExperience key={index} date={project.date} title={project.title} description={project.description} icon={project.icon} />
          ))}
        </Section>

        <Section ref={(el) => (sectionRefs.current.educacion = el)} id="educacion" title="Educación Académica">
          {portfolioData.education.map((edu, index) => (
            <EducationCard key={index} icon={edu.icon} iconColor={(edu as any).iconColor} title={edu.title} period={edu.period} description={edu.description} />
          ))}
          <OtherStudies items={portfolioData.otherStudies} />
        </Section>

        <Section ref={(el) => (sectionRefs.current.idiomas = el)} id="idiomas" title="Idiomas">
          <div className="flex flex-col md:flex-row gap-4">
            {portfolioData.languages.map((lang, index) => (
              <LanguageCard key={index} language={lang.language} proficiency={lang.proficiency} />
            ))}
          </div>
        </Section>

        <Section ref={(el) => (sectionRefs.current.contacto = el)} id="contacto" title="Contacto">
          <div className="grid md:grid-cols-2 gap-4">
            <ContactCard icon={<Mail size={24} />} label="Correo Electrónico" value={portfolioData.contact.email} href={`mailto:${portfolioData.contact.email}`} />
            <ContactCard icon={<Linkedin size={24} />} label="LinkedIn" value="Perfil de LinkedIn" href={portfolioData.contact.linkedin} />
            <ContactCard icon={<Phone size={24} />} label="Teléfono" value={portfolioData.contact.phone} href={`tel:${portfolioData.contact.phone.replace(/\s+/g, '')}`} />
          </div>
        </Section>
      </main>
    </div>
  );
};

export default App;
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
        <div className="relative w-full flex items-center lg:block lg:py-8">
          <div className="flex items-center lg:flex-col lg:items-center lg:text-center pr-32 lg:pr-0">
            <User size={32} className="text-amber-600 mr-3 lg:mb-4" />
            <div className="flex flex-col">
              <div className="hidden lg:block w-[240px] overflow-hidden">
                <TypingEffect text="CURRICULUM VITAE" />
              </div>
              <h1 className="static-name font-bold font-sans text-gray-50 text-xs sm:text-xl lg:text-2xl leading-tight">
                <span className="block">ARELI</span>
                <span className="block">AGUILAR</span>
                <span className="block">DELGADO</span>
              </h1>

              {/* Desktop: botones */}
              <div className="mt-3 hidden lg:flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={toggleDark}
                  className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition focus:outline-none"
                  aria-label="Alternar modo"
                  title={isDark ? 'Modo claro' : 'Modo oscuro'}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <div className="relative group">
                  <button
                    type="button"
                    onClick={onDownloadPDF}
                    className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition focus:outline-none"
                    aria-label="Descargar CV"
                    title="Descargar CV"
                  >
                    <Download size={18} />
                  </button>
                  <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-1 opacity-0 group-hover:opacity-100 transition bg-white/90 text-[#1e2a38] dark:bg-slate-700 dark:text-white text-xs font-medium px-2 py-1 rounded shadow">
                    Descargar CV
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* MÓVIL: pegado a la derecha */}
          <div className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleDark}
              className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition focus:outline-none"
              aria-label="Alternar modo"
              title={isDark ? 'Modo claro' : 'Modo oscuro'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              type="button"
              onClick={onDownloadPDF}
              className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition focus:outline-none"
              aria-label="Descargar CV"
              title="Descargar CV"
            >
              <Download size={18} />
            </button>
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="text-gray-200 hover:text-gray-400 focus:outline-none"
              aria-label="Abrir menú"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className="hidden lg:block w-3/4 mx-auto my-4 border-t border-gray-700" />

        <div className={`fixed inset-x-0 top-16 bg-[#1e2a38] lg:static lg:block lg:h-auto lg:mt-8 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col lg:space-y-2 p-4 lg:p-0">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => { e.preventDefault(); onNavigate(section.id); }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${activeSection === section.id ? 'bg-[#4a688b] text-white shadow-lg' : 'hover:bg-gray-800'}`}
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
const Section = forwardRef(({ id, title, children }: { id: string; title: string; children: ReactNode }, ref: any) => {
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
});

// ================== ITEM COLAPSABLE ==================
const CollapsibleExperience = ({ date, title, company, location, description, icon }: {
  date: string; title: string; company?: string; location?: string; description: string[]; icon: ReactNode;
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
        type="button"
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
        <svg className={`w-6 h-6 transform transition-transform duration-300 text-[#4a688b] dark:text-slate-100 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div ref={contentRef} data-collapsible-content="true" className="overflow-hidden transition-[max-height] duration-500 ease-in-out" style={{ maxHeight: '0px' }}>
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

const EducationCard = ({ icon, iconColor, title, period, description }: {
  icon: ReactNode; iconColor: string; title: string; period: string; description: string | string[];
}) => (
  <div className="cv-break bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 sm:p-6 mb-4 border border-gray-200 dark:border-slate-700">
    <div className="flex items-start">
      <div className="mr-4 flex-shrink-0" style={{ color: iconColor }}>{icon}</div>
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

const SkillsCard = ({ title, icon, iconColor, children }: { title: string; icon: ReactNode; iconColor: string; children: ReactNode; }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 sm:p-6 mb-4 border border-gray-200 dark:border-slate-700">
    <div className="flex items-center mb-4">
      <div className="mr-4 flex-shrink-0" style={{ color: iconColor }}>{icon}</div>
      <h3 className="text-lg font-bold text-[#4a688b] dark:text-slate-100">{title}</h3>
    </div>
    {children}
  </div>
);

const ContactCard = ({ icon, label, value, href }: { icon: ReactNode; label: string; value: string; href?: string; }) => {
  const isLink = !!href;
  const inner = (
    <div className={`cv-break bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 sm:p-6 mb-4 border border-gray-200 dark:border-slate-700 transition-all duration-300 ${isLink ? 'bg-gray-100/60 dark:bg-slate-700/40' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="mr-4 text-amber-600 mt-1 flex-shrink-0">{icon}</div>
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">{label}</p>
            <p className="text-lg font-bold text-[#4a688b] dark:text-slate-100 break-words">{value}</p>
          </div>
        </div>
        {isLink && <ArrowRight size={24} className="text-[#4a688b] dark:text-slate-100" />}
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
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch { return false; }
  };
  const [isDark, setIsDark] = useState<boolean>(getInitialDark());
  useLayoutEffect(() => {
    const saved = (() => { try { return localStorage.getItem('theme'); } catch { return null; } })();
    const initialDark = saved ? saved === 'dark' : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', initialDark);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch {}
  }, [isDark]);
  const toggleDark = () => setIsDark(d => !d);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const handleNavigate = (sectionId: string) => {
    const el = sectionRefs.current[sectionId];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsMobileMenuOpen(false);
  };

  // Activo en menú
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id)),
      { threshold: 0.3, rootMargin: '-20px 0px -50% 0px' }
    );
    Object.values(sectionRefs.current).forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // --- DESCARGA PDF ---
  const handleDownloadPDF = async () => {
    const root = wrapperRef.current;
    if (!root) return;

    if (window.matchMedia('(min-width: 1024px)').matches) {
      document.body.classList.add('capture-pdf');
    }

    window.scrollTo(0, 0);

    // 1) Expandir colapsables
    const collapsibles = Array.from(root.querySelectorAll<HTMLElement>('[data-collapsible-content="true"]'));
    const prevHeights = collapsibles.map((el) => el.style.maxHeight);
    collapsibles.forEach((el) => { el.style.maxHeight = `${el.scrollHeight}px`; });

    await new Promise((r) => setTimeout(r, 250));

    // 2) Captura
    const totalWidth  = Math.max(root.scrollWidth,  root.offsetWidth,  root.clientWidth);
    const totalHeight = Math.max(root.scrollHeight, root.offsetHeight, root.clientHeight);
    const bg = getComputedStyle(root).backgroundColor || (isDark ? '#0b1220' : '#ffffff');

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

    // 3) Paginado seguro
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pxToPdf = imgWidth / canvas.width;
    const pdfToPx = 1 / pxToPdf;
    const domPageHeight = pageHeight * pdfToPx;

    const rootRect = root.getBoundingClientRect();
    const anchorNodes = Array.from(root.querySelectorAll<HTMLElement>('.cv-section, .cv-break'));
    const rawTops = anchorNodes.map(n => Math.max(0, Math.round(n.getBoundingClientRect().top - rootRect.top + window.scrollY)));
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
      let next = safeTops.find(v => v >= limit);

      if (next === undefined) next = lastPossibleStart;
      else if (next > lastPossibleStart) next = lastPossibleStart;

      if (next <= last + minAdvance) next = Math.min(last + domPageHeight, lastPossibleStart);
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

    // 4) Guardar (Chrome vuelve a pdf.save; iOS abre pestaña)
    const filename = 'CV_Areli_Aguilar.pdf';
    const ua = navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (/\bMacintosh\b/.test(ua) && 'ontouchend' in document);

    try {
      if (isIOS) {
        // iOS: abrir para que el usuario guarde/comparta
        const dataUrl = pdf.output('dataurlstring');
        window.open(dataUrl, '_blank');
      } else {
        // Escritorio (incl. Chrome): método nativo y más estable
        pdf.save(filename);
      }
    } catch {
      // Fallback 1: Blob + <a download>
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
        // Fallback 2: abrir data URL
        try { window.open(pdf.output('dataurlstring'), '_blank'); } catch {}
      }
    }

    // 5) Restaurar
    collapsibles.forEach((el, i) => { el.style.maxHeight = prevHeights[i]; });
    document.body.classList.remove('capture-pdf');
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

      @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      .marquee-container{display:flex;height:100%;width:max-content;animation:marquee 60s linear infinite;will-change:transform}
      .marquee-container.paused{animation-play-state:paused}
      .marquee-item{flex-shrink:0;display:flex;align-items:center;white-space:nowrap;padding:0 1.75rem;font-family:'Inter',sans-serif;font-size:1.1rem;font-weight:400;color:#4a688b}
      @media (max-width:1023px){.marquee-item{font-size:.95rem;padding:0 1rem}}
      .marquee-item .icon{color:#d97706;margin-right:.5rem;display:inline-block;vertical-align:middle}

      .skill-chip{background-color:#e5e7eb;color:#374151;border:1px solid #d1d5db}
      .dark .skill-chip{background-color:#334155;color:#f8fafc;border-color:#475569}
      .dark .competencia-btn{color:#fff!important;background-color:rgba(255,255,255,.08)}
      .dark .competencia-btn:hover{background-color:rgba(255,255,255,.16)}
      .tooltip-content{background-color:#a8c0d9;color:#0f172a;border:1px solid #93a8c3}
      .dark .tooltip-content{background-color:#475569;color:#fff;border:1px solid #94A3B8}

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
        <Section ref={(el) => (sectionRefs.current.perfil = el)} id="perfil" title="Perfil Profesional">
          {portfolioData.profile.map((item, index) => (
            <ProfileCard key={index} icon={item.icon} text={item.text} />
          ))}
        </Section>

        <Section ref={(el) => (sectionRefs.current.habilidades = el)} id="habilidades" title="Habilidades Destacadas">
          <div className="space-y-6">
            <SkillsCard title="Experiencia Ejecutiva" icon={<Briefcase size={24} />} iconColor="#d97706">
              <p className="text-gray-700 dark:text-gray-200">Más de 15 años de experiencia realizando gestiones administrativas clave a nivel ejecutivo para la alta dirección.</p>
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
              <p className="text-gray-700 dark:text-gray-200 mb-4">- Desliza el cursor sobre cada competencia para conocer más detalles.</p>
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
              <p className="text-gray-700 dark:text-gray-200">Habilidades destacadas para generar confianza, facilitar la cooperación y fomentar un ambiente de alto rendimiento.</p>
            </SkillsCard>
          </div>
        </Section>

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

        <Section ref={(el) => (sectionRefs.current.proyectos = el)} id="proyectos" title="Proyectos de Innovación y Transformación Digital">
          {portfolioData.projects.map((project, index) => (
            <CollapsibleExperience key={index} date={project.date} title={project.title} description={project.description} icon={project.icon} />
          ))}
        </Section>

        <Section ref={(el) => (sectionRefs.current.educacion = el)} id="educacion" title="Educación Académica">
          {portfolioData.education.map((edu, index) => (
            <EducationCard key={index} icon={edu.icon} iconColor={(edu as any).iconColor} title={edu.title} period={edu.period} description={edu.description} />
          ))}
          <OtherStudies items={portfolioData.otherStudies} />
        </Section>

        <Section ref={(el) => (sectionRefs.current.idiomas = el)} id="idiomas" title="Idiomas">
          <div className="flex flex-col md:flex-row gap-4">
            {portfolioData.languages.map((lang, index) => (
              <LanguageCard key={index} language={lang.language} proficiency={lang.proficiency} />
            ))}
          </div>
        </Section>

        <Section ref={(el) => (sectionRefs.current.contacto = el)} id="contacto" title="Contacto">
          <div className="grid md:grid-cols-2 gap-4">
            <ContactCard icon={<Mail size={24} />} label="Correo Electrónico" value={portfolioData.contact.email} href={`mailto:${portfolioData.contact.email}`} />
            <ContactCard icon={<Linkedin size={24} />} label="LinkedIn" value="Perfil de LinkedIn" href={portfolioData.contact.linkedin} />
            <ContactCard icon={<Phone size={24} />} label="Teléfono" value={portfolioData.contact.phone} href={`tel:${portfolioData.contact.phone.replace(/\s+/g, '')}`} />
          </div>
        </Section>
      </main>
    </div>
  );
};

export default App;
