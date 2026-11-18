const DigitalVibesCalculations = {
  calculateGlobal(rawAnswers) {
    const answers = Array.isArray(rawAnswers) ? rawAnswers : [];
    const validAnswers = answers.filter((answer) => Number.isInteger(answer) && answer >= 0 && answer <= 4);
    if (validAnswers.length !== answers.length) {
      throw new TypeError("Every global assessment answer must be an integer from 0 to 4.");
    }
    const sum = validAnswers.reduce((total, answer) => total + answer, 0);
    return {
      points: sum,
      maximum: 72,
      percentage: (sum / 72) * 100
    };
  },
  calculateDimension(dimensionId, answersByDimension) {
    const answers = Array.isArray(answersByDimension?.[dimensionId])
      ? answersByDimension[dimensionId]
      : [];
    if (answers.length !== 3) {
      throw new RangeError(`${dimensionId} must contain exactly 3 assessment answers.`);
    }
    if (!answers.every((answer) => Number.isInteger(answer) && answer >= 0 && answer <= 4)) {
      throw new TypeError("Every dimension answer must be an integer from 0 to 4.");
    }
    const sum = answers.reduce((total, answer) => total + answer, 0);
    return {
      id: dimensionId,
      points: sum,
      maximum: 12,
      percentage: (sum / 12) * 100
    };
  },
  getGlobalBand(percentage) {
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
      throw new RangeError("Global percentage must be between 0 and 100.");
    }
    if (percentage <= 20) return "initial";
    if (percentage <= 40) return "development";
    if (percentage <= 60) return "consolidation";
    if (percentage <= 80) return "advanced";
    return "optimized";
  }
};

const DigitalVibesRecommendations = {
  library: [
    // MESES 1–3: Fundamentos y mitigación de riesgos críticos
    {
      id: "security-mfa",
      dimension: "security",
      questionIds: ["S1"],
      activate: (answers) => (answers.S1 ?? 4) <= 1,
      priority: "risk",
      prerequisite: null,
      effort: "low",
      quarter: 1,
      title: {
        es: "Activar MFA y gestión de contraseñas seguras",
        en: "Activate MFA and secure password management"
      },
      result: "Protección inmediata de cuentas y accesos críticos",
      kpi: "100% cuentas críticas con MFA"
    },
    {
      id: "security-backup",
      dimension: "security",
      questionIds: ["S2"],
      activate: (answers) => (answers.S2 ?? 4) <= 1,
      priority: "risk",
      prerequisite: null,
      effort: "low",
      quarter: 1,
      title: {
        es: "Establecer y probar copias de seguridad",
        en: "Establish and test data backups"
      },
      result: "Información crítica respaldada y con prueba de recuperación",
      kpi: "Prueba de restauración verificada"
    },
    {
      id: "security-training",
      dimension: "security",
      questionIds: ["S3"],
      activate: (answers) => (answers.S3 ?? 4) <= 1,
      priority: "risk",
      prerequisite: null,
      effort: "medium",
      quarter: 1,
      title: {
        es: "Protocolo básico de respuesta y concienciación en ciberseguridad",
        en: "Basic incident protocol and cybersecurity awareness"
      },
      result: "Equipo capacitado para identificar amenazas y saber cómo actuar",
      kpi: "Guía de incidentes comunicada al equipo"
    },
    {
      id: "discover-positioning",
      dimension: "foundations",
      questionIds: ["D1"],
      activate: (answers) => (answers.D1 ?? 4) <= 1,
      priority: "fundamental",
      prerequisite: null,
      effort: "medium",
      quarter: 1,
      title: {
        es: "Definir con claridad la propuesta de valor digital",
        en: "Clearly define your digital value proposition"
      },
      result: "Propuesta de valor y público objetivo nítidos y comunicables",
      kpi: "Posicionamiento y cliente ideal aprobados"
    },
    {
      id: "discover-infrastructure",
      dimension: "foundations",
      questionIds: ["D2"],
      activate: (answers) => (answers.D2 ?? 4) <= 1,
      priority: "fundamental",
      prerequisite: null,
      effort: "medium",
      quarter: 1,
      title: {
        es: "Actualizar e integrar la infraestructura digital básica",
        en: "Update and integrate core digital infrastructure"
      },
      result: "Web, analítica y canales operativos y conectados",
      kpi: "Herramientas esenciales enlazadas sin fricción"
    },
    {
      id: "discover-measurement",
      dimension: "foundations",
      questionIds: ["D3"],
      activate: (answers) => (answers.D3 ?? 4) <= 1,
      priority: "fundamental",
      prerequisite: null,
      effort: "medium",
      quarter: 1,
      title: {
        es: "Implantar medición básica para decisiones de negocio",
        en: "Implement basic measurement for business decisions"
      },
      result: "Cuadro de mando esencial con métricas fiables",
      kpi: "Revisión mensual de indicadores clave"
    },
    {
      id: "connect-journey-critical",
      dimension: "conversion",
      questionIds: ["C3"],
      activate: (answers) => (answers.C3 ?? 4) <= 1,
      priority: "fundamental",
      prerequisite: "discover-infrastructure",
      effort: "medium",
      quarter: 1,
      title: {
        es: "Eliminar puntos de fricción en contacto y contratación",
        en: "Remove friction points in contact and checkout"
      },
      result: "Canales de contacto y compra accesibles y directos",
      kpi: "Tasa de conversión inicial y formularios operativos"
    },
    {
      id: "connect-follow-up-critical",
      dimension: "conversion",
      questionIds: ["C4"],
      activate: (answers) => (answers.C4 ?? 4) <= 1,
      priority: "fundamental",
      prerequisite: null,
      effort: "low",
      quarter: 1,
      title: {
        es: "Estructurar el seguimiento y registro de contactos",
        en: "Structure lead follow-up and tracking"
      },
      result: "Asignación rápida y registro sistemático de cada oportunidad",
      kpi: "Tiempo de respuesta inicial a nuevos prospectos"
    },

    // MESES 4–6: Activación sistemática (adquisición, contenidos y procesos)
    {
      id: "amplify-acquisition",
      dimension: "demand",
      questionIds: ["A2"],
      activate: (answers) => (answers.A2 ?? 4) <= 2,
      priority: "growth",
      prerequisite: "discover-positioning",
      effort: "medium",
      quarter: 2,
      title: {
        es: "Estructurar un sistema de captación en canales clave",
        en: "Build a structured acquisition system on key channels"
      },
      result: "Flujo organizado de oportunidades por búsquedas, redes o pauta",
      kpi: "Prospectos calificados generados por canal"
    },
    {
      id: "amplify-content",
      dimension: "demand",
      questionIds: ["A1"],
      activate: (answers) => (answers.A1 ?? 4) <= 2,
      priority: "growth",
      prerequisite: "discover-positioning",
      effort: "medium",
      quarter: 2,
      title: {
        es: "Organizar un calendario de contenidos útil y regular",
        en: "Organize a regular and useful content calendar"
      },
      result: "Presencia constante orientada a educar y resolver dudas",
      kpi: "Publicaciones programadas y engagement de audiencia"
    },
    {
      id: "amplify-attribution",
      dimension: "demand",
      questionIds: ["A3"],
      activate: (answers) => (answers.A3 ?? 4) <= 2,
      priority: "growth",
      prerequisite: "discover-measurement",
      effort: "medium",
      quarter: 2,
      title: {
        es: "Conectar campañas con oportunidades de venta reales",
        en: "Connect campaigns with real sales opportunities"
      },
      result: "Claridad sobre qué canales y piezas aportan valor comercial",
      kpi: "Coste por oportunidad y retorno por canal"
    },
    {
      id: "connect-journey-regular",
      dimension: "conversion",
      questionIds: ["C3"],
      activate: (answers) => (answers.C3 ?? 4) === 2,
      priority: "growth",
      prerequisite: null,
      effort: "medium",
      quarter: 2,
      title: {
        es: "Simplificar pasos en el proceso comercial digital",
        en: "Simplify steps in the digital commercial flow"
      },
      result: "Menos pasos intermedios para solicitar información o contratar",
      kpi: "Reducción de abandonos en formularios o checkout"
    },
    {
      id: "connect-follow-up-regular",
      dimension: "conversion",
      questionIds: ["C4"],
      activate: (answers) => (answers.C4 ?? 4) === 2,
      priority: "growth",
      prerequisite: null,
      effort: "low",
      quarter: 2,
      title: {
        es: "Estandarizar tiempos y etapas del pipeline comercial",
        en: "Standardize pipeline stages and follow-up response times"
      },
      result: "Seguimiento ágil con avisos y control de avance en CRM",
      kpi: "Tasa de contacto efectivo sobre prospectos recibidos"
    },
    {
      id: "automation-processes",
      dimension: "automation",
      questionIds: ["I1"],
      activate: (answers) => (answers.I1 ?? 4) <= 1,
      priority: "growth",
      prerequisite: "discover-measurement",
      effort: "medium",
      quarter: 2,
      title: {
        es: "Mapear y priorizar tareas repetitivas automatizables",
        en: "Map and prioritize repetitive automatable tasks"
      },
      result: "Matriz de procesos candidatos evaluados por impacto y viabilidad",
      kpi: "Procesos clave seleccionados para automatización"
    },
    {
      id: "evolve-feedback-init",
      dimension: "loyalty",
      questionIds: ["E2"],
      activate: (answers) => (answers.E2 ?? 4) <= 1,
      priority: "growth",
      prerequisite: null,
      effort: "low",
      quarter: 2,
      title: {
        es: "Habilitar canales para recoger feedback y testimonios",
        en: "Set up channels to gather feedback and testimonials"
      },
      result: "Encuestas breves y reseñas activadas sistemáticamente",
      kpi: "Respuestas y testimonios obtenidos al mes"
    },

    // MESES 7–9: Optimización, experimentación y posventa
    {
      id: "connect-optimization",
      dimension: "conversion",
      questionIds: ["C5"],
      activate: (answers) => (answers.C5 ?? 4) <= 2,
      priority: "growth",
      prerequisite: "discover-measurement",
      effort: "medium",
      quarter: 3,
      title: {
        es: "Establecer pruebas y mejoras periódicas en conversión",
        en: "Establish periodic tests and improvements in conversion"
      },
      result: "Ajustes progresivos de textos, diseño y llamadas a la acción",
      kpi: "Experimentos mensuales y tasa de mejora"
    },
    {
      id: "evolve-retention",
      dimension: "loyalty",
      questionIds: ["E1"],
      activate: (answers) => (answers.E1 ?? 4) <= 2,
      priority: "growth",
      prerequisite: null,
      effort: "medium",
      quarter: 3,
      title: {
        es: "Diseñar un recorrido estructurado de relación posventa",
        en: "Design a structured post-sale relationship journey"
      },
      result: "Momentos definidos de contacto tras la entrega o servicio",
      kpi: "Tasa de recompra o renovación de contratos"
    },
    {
      id: "evolve-feedback-analysis",
      dimension: "loyalty",
      questionIds: ["E2"],
      activate: (answers) => (answers.E2 ?? 4) === 2,
      priority: "growth",
      prerequisite: null,
      effort: "low",
      quarter: 3,
      title: {
        es: "Organizar el análisis periódico de opiniones de clientes",
        en: "Organize regular analysis of customer feedback"
      },
      result: "Respuestas directas y mejoras de servicio basadas en datos",
      kpi: "Índice de satisfacción e incidencias resueltas"
    },
    {
      id: "evolve-referrals",
      dimension: "loyalty",
      questionIds: ["E3"],
      activate: (answers) => (answers.E3 ?? 4) <= 2,
      priority: "growth",
      prerequisite: null,
      effort: "medium",
      quarter: 3,
      title: {
        es: "Diseñar un programa estructurado de recomendaciones y reactivación",
        en: "Design a referral and reactivation program"
      },
      result: "Incentivos y campañas para multiplicar el valor de clientes actuales",
      kpi: "Ventas o reuniones originadas por recomendación"
    },
    {
      id: "automation-ai-pilot",
      dimension: "automation",
      questionIds: ["I2"],
      activate: (answers) => (answers.I2 ?? 4) <= 2,
      priority: "growth",
      prerequisite: "automation-processes",
      effort: "medium",
      quarter: 3,
      title: {
        es: "Implementar herramientas de IA en casos seguros y supervisados",
        en: "Implement AI tools in secure and supervised cases"
      },
      result: "Flujos de IA aplicados a redacción, síntesis o soporte asistido",
      kpi: "Horas de equipo ahorradas bajo revisión humana"
    },
    {
      id: "security-mid-mfa",
      dimension: "security",
      questionIds: ["S1"],
      activate: (answers) => (answers.S1 ?? 4) === 2,
      priority: "optimization",
      prerequisite: null,
      effort: "low",
      quarter: 3,
      title: {
        es: "Extender MFA y control granular a todos los colaboradores",
        en: "Extend MFA and granular access to all team members"
      },
      result: "Cobertura completa de accesos corporativos y privilegios",
      kpi: "Auditoría de accesos al 100%"
    },
    {
      id: "security-mid-backup",
      dimension: "security",
      questionIds: ["S2"],
      activate: (answers) => (answers.S2 ?? 4) === 2,
      priority: "optimization",
      prerequisite: null,
      effort: "low",
      quarter: 3,
      title: {
        es: "Formalizar calendario y protocolos de restauración de backups",
        en: "Formalize backup schedule and restoration protocols"
      },
      result: "Rutina programada de copias con simulación periódica",
      kpi: "Frecuencia de backups y tiempo estimado de recuperación"
    },

    // MESES 10–12: Consolidación, escalado y auditoría continua
    {
      id: "automation-quality",
      dimension: "automation",
      questionIds: ["I3"],
      activate: (answers) => (answers.I3 ?? 4) <= 2,
      priority: "optimization",
      prerequisite: "automation-ai-pilot",
      effort: "medium",
      quarter: 4,
      title: {
        es: "Establecer controles de calidad y confianza para automatización e IA",
        en: "Establish quality and trust controls for automation and AI"
      },
      result: "Criterios claros de verificación humana y salvaguardas éticas",
      kpi: "Auditoría de fiabilidad y consistencia de salidas"
    },
    {
      id: "security-team-training",
      dimension: "security",
      questionIds: ["S3"],
      activate: (answers) => (answers.S3 ?? 4) === 2,
      priority: "optimization",
      prerequisite: null,
      effort: "medium",
      quarter: 4,
      title: {
        es: "Reforzar formación continua y simulacros ante incidentes",
        en: "Reinforce continuous training and incident drills"
      },
      result: "Cultura de ciberseguridad consolidada en toda la organización",
      kpi: "Participación en simulacros y reducción de riesgos"
    },
    {
      id: "discover-differentiation",
      dimension: "foundations",
      questionIds: ["D1", "D2", "D3"],
      activate: (answers) => (answers.D1 ?? 0) >= 3 && (answers.D3 ?? 0) >= 3,
      priority: "optimization",
      prerequisite: null,
      effort: "medium",
      quarter: 4,
      title: {
        es: "Profundizar en experimentación y diferenciación de mercado",
        en: "Deepen experimentation and market differentiation"
      },
      result: "Afinar la propuesta de valor con analítica avanzada",
      kpi: "Modelos predictivos y optimización de márgenes"
    }
  ],

  evaluate(calculation, answersById, contextAnswers, isEnglish) {
    const riskAlerts = [];
    const security = calculation.dimensions.find((dimension) => dimension.id === "security");
    const s1 = answersById.S1 ?? 4;
    const s2 = answersById.S2 ?? 4;
    const s3 = answersById.S3 ?? 4;

    const securityBreaches = [];
    if (s1 <= 1) {
      securityBreaches.push(
        isEnglish
          ? "Account protection: unique/strong passwords, MFA and access review."
          : "Alerta de protección de cuentas: contraseñas únicas/robustas, MFA y revisión de accesos."
      );
    }
    if (s2 <= 1) {
      securityBreaches.push(
        isEnglish
          ? "Continuity alert: establish reliable backups and test restoration."
          : "Alerta de continuidad: establecer copias adecuadas y probar restauración."
      );
    }
    if (s3 <= 1) {
      securityBreaches.push(
        isEnglish
          ? "Preparation alert: simple training and incident response procedure."
          : "Alerta de preparación: formación y procedimiento básico para comunicar y responder."
      );
    }

    if (securityBreaches.length > 0) {
      const isCriticalGeneral = security && security.percentage < 25;
      const title = isEnglish
        ? (isCriticalGeneral ? "Essential digital protection controls (<25% security)" : "Essential protection alerts")
        : (isCriticalGeneral ? "Controles esenciales de protección digital (Seguridad < 25 %)" : "Alertas esenciales de protección digital");

      const generalPreamble = isCriticalGeneral
        ? (isEnglish
            ? "Your essential digital protection controls need attention. We detected areas where exposure should be reduced to ensure business recovery capability. "
            : "Tus controles básicos de protección digital necesitan atención. Hemos detectado aspectos que conviene reforzar para reducir la exposición del negocio y mejorar su capacidad de recuperación. ")
        : "";

      const explanation = generalPreamble + (isEnglish
        ? `Identified priorities: ${securityBreaches.join(" ")}`
        : `Prioridades detectadas: ${securityBreaches.join(" ")}`);

      riskAlerts.push({
        id: "security-essential-controls",
        severity: "essential",
        title,
        explanation,
        subtitles: securityBreaches,
        evidence: ["security"]
      });
    }

    const selectedActions = this.library
      .filter((action) => action.activate(answersById))
      .map((action) => ({
        ...action,
        evidence: action.questionIds.map((questionId) => ({ questionId, answer: answersById[questionId] }))
      }))
      .sort((a, b) => {
        const priorityOrder = { risk: 0, fundamental: 1, growth: 2, optimization: 3 };
        return (priorityOrder[a.priority] - priorityOrder[b.priority]) || (a.quarter - b.quarter);
      });

    const roadmap = [1, 2, 3, 4].map((quarter) => ({
      quarter,
      actions: selectedActions.filter((action) => action.quarter === quarter)
    }));

    return {
      riskAlerts,
      selectedActions,
      roadmap,
      traceability: {
        answers: answersById,
        context: contextAnswers,
        rules: selectedActions.map((action) => ({
          actionId: action.id,
          triggeredBy: action.evidence,
          priority: action.priority,
          prerequisite: action.prerequisite
        }))
      }
    };
  }
};

if (typeof globalThis !== "undefined") {
  globalThis.DigitalVibesCalculations = DigitalVibesCalculations;
  globalThis.DigitalVibesRecommendations = DigitalVibesRecommendations;
}

(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector("[data-theme-toggle]");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const menuButton = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("#primary-navigation");
  const isEnglish = root.lang === "en";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const themeLabels = {
    es: { light: "Cambiar a tema claro", dark: "Cambiar a tema oscuro", menu: "Abrir menú", close: "Cerrar menú" },
    en: { light: "Switch to light theme", dark: "Switch to dark theme", menu: "Open menu", close: "Close menu" }
  };
  const labels = themeLabels[isEnglish ? "en" : "es"];

  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem("digital-vibes-theme");
  } catch (error) {
    console.warn("Theme preference could not be read from local storage.", error);
  }
  const initialTheme = savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : "dark";

  function setTheme(theme) {
    root.dataset.theme = theme;
    themeColor?.setAttribute("content", theme === "light" ? "#ffffff" : "#1d1d1b");
    if (themeButton) {
      const nextThemeLabel = theme === "dark" ? labels.light : labels.dark;
      themeButton.setAttribute("aria-label", nextThemeLabel);
      themeButton.setAttribute("title", nextThemeLabel);
      themeButton.textContent = theme === "dark" ? "☼" : "☾";
    }
  }

  setTheme(initialTheme);
  themeButton?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("digital-vibes-theme", nextTheme);
    } catch (error) {
      console.warn("Theme preference could not be saved to local storage.", error);
    }
  });

  menuButton?.addEventListener("click", () => {
    const isOpen = navigation.dataset.open === "true";
    navigation.dataset.open = String(!isOpen);
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? labels.menu : labels.close);
    menuButton.textContent = isOpen ? "☰" : "×";
  });
  navigation?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.dataset.open = "false";
      menuButton?.setAttribute("aria-expanded", "false");
      if (menuButton) {
        menuButton.setAttribute("aria-label", labels.menu);
        menuButton.textContent = "☰";
      }
    });
  });

  const revealSelectors = [
    ".hero .wrap > *",
    ".assessment-intro > *",
    ".assessment-score-card",
    ".about .txt > *",
    ".about-visual",
    ".pillars article",
    ".services h2",
    ".svc article",
    ".flow-head > *",
    ".stage",
    ".flow .panel",
    ".contact h2",
    ".contact-paths article"
  ];
  const gsapEnabled = Boolean(window.gsap && window.ScrollTrigger && !reducedMotion);
  let revealObserver = null;
  if (gsapEnabled) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    root.classList.add("gsap-ready");
  } else if ("IntersectionObserver" in window && !reducedMotion) {
    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          entry.target.classList.remove("reveal-pending");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
  }

  function observeRevealItems(items) {
    const revealList = Array.from(items);
    if (gsapEnabled) {
      revealList.forEach((item, index) => {
        if (item.dataset.gsapReveal === "true") return;
        item.dataset.gsapReveal = "true";
        window.gsap.fromTo(item, {
          autoAlpha: 0,
          y: 34,
          scale: .985
        }, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: .85,
          delay: (index % 4) * .075,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
            once: true
          }
        });
      });
      return;
    }
    if (revealObserver) {
      revealList.forEach((item, index) => {
        if (item.classList.contains("is-visible")) return;
        item.classList.add("reveal-pending");
        item.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 90}ms`);
        revealObserver.observe(item);
      });
    }
  }

  if (gsapEnabled || revealObserver) {
    observeRevealItems(document.querySelectorAll(revealSelectors.join(",")));
  }
  document.querySelectorAll(".svc article").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
      card.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
    }, { passive: true });
  });
  if (gsapEnabled) {
    const heroTitle = document.querySelector("#hero-title");
    const aboutVisual = document.querySelector(".about-visual");
    if (heroTitle) {
      window.gsap.to(heroTitle, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: .6 }
      });
    }
    if (aboutVisual) {
      window.gsap.to(aboutVisual, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: aboutVisual, start: "top bottom", end: "bottom top", scrub: .8 }
      });
    }
    const energyPath = document.querySelector(".energy-path");
    if (energyPath) {
      energyPath.style.animation = "none";
      window.gsap.to(energyPath, {
        strokeDashoffset: -100,
        duration: 3.2,
        ease: "none",
        repeat: -1
      });
    }
  }

  const scrollProgress = document.querySelector("[data-scroll-progress]");
  let scrollFrame = 0;
  function updateScrollProgress() {
    if (!scrollProgress) return;
    scrollFrame = 0;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
  }
  window.addEventListener("scroll", () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollProgress);
  }, { passive: true });
  window.addEventListener("resize", updateScrollProgress, { passive: true });
  updateScrollProgress();

  const canvas = document.querySelector("#waves");
  const context = canvas?.getContext("2d", { alpha: true });
  if (canvas && context) {
    let width = 0;
    let height = 0;
    let time = 0;
    let pointerX = 0.5;
    let frame = 0;
    let visible = true;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random(),
      y: Math.random(),
      speed: 0.00015 + Math.random() * 0.00025,
      radius: 0.6 + Math.random() * 1.2
    }));

    function resizeCanvas() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      if (reducedMotion) drawFrame();
    }

    function drawFrame() {
      context.clearRect(0, 0, width, height);
      const light = root.dataset.theme === "light";
      const particleColor = light ? "rgba(29,29,27,.32)" : "rgba(244,243,241,.5)";
      for (let index = 0; index < 8; index += 1) {
        const ratio = index / 7;
        const baseline = height * (0.34 + ratio * 0.5);
        const amplitude = 20 + ratio * 34 + (pointerX - 0.5) * 24;
        const frequency = 0.004 + ratio * 0.001;
        const gradient = context.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, `rgba(126,48,225,${0.1 + ratio * 0.25})`);
        gradient.addColorStop(1, `rgba(55,181,182,${0.1 + ratio * 0.25})`);
        context.strokeStyle = gradient;
        context.lineWidth = 1.2;
        context.beginPath();
        for (let x = 0; x <= width; x += 8) {
          const y = baseline + Math.sin(x * frequency + time * (1 + ratio * 0.5) + index)
            * amplitude * Math.sin((x / Math.max(width, 1)) * Math.PI);
          if (x === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
      }
      context.fillStyle = particleColor;
      particles.forEach((particle) => {
        if (!reducedMotion) {
          particle.y -= particle.speed;
          if (particle.y < 0) particle.y = 1;
        }
        context.beginPath();
        context.arc(particle.x * width, particle.y * height, particle.radius, 0, Math.PI * 2);
        context.fill();
      });
      if (!reducedMotion) time += 0.012;
    }

    function animate() {
      if (!visible || document.hidden) {
        frame = 0;
        return;
      }
      drawFrame();
      frame = window.requestAnimationFrame(animate);
    }

    function startAnimation() {
      if (!reducedMotion && visible && !document.hidden && !frame) {
        frame = window.requestAnimationFrame(animate);
      }
    }

    const heroObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      } else {
        startAnimation();
      }
    });
    heroObserver.observe(canvas);
    window.addEventListener("resize", resizeCanvas, { passive: true });
    window.addEventListener("pointermove", (event) => {
      pointerX = event.clientX / window.innerWidth;
    }, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      } else {
        startAnimation();
      }
    });
    resizeCanvas();
    startAnimation();
  }

  const phaseCopy = isEnglish
    ? [
        { name: "DISCOVER", fraction: 0.13, text: "We listen to your brand: who you are, who you speak to, and where energy is being lost today.", items: ["Audit", "Positioning", "Roadmap"] },
        { name: "AMPLIFY", fraction: 0.37, text: "We turn up what performs best: content, community, and paid media with carefully managed budgets.", items: ["Content", "Paid media", "Creative testing"] },
        { name: "CONNECT", fraction: 0.63, text: "We turn attention into relationships through websites, e-commerce, and journeys that lead to conversations and sales.", items: ["Web", "E-commerce", "CRM"] },
        { name: "EVOLVE", fraction: 0.87, text: "We learn from data and put it to work: AI and workflows that improve each cycle without losing the human touch.", items: ["Data", "AI", "Automation"] }
      ]
    : [
        { name: "DISCOVER", fraction: 0.13, text: "Escuchamos la señal de tu marca: quién eres, a quién le hablas y dónde se pierde energía hoy.", items: ["Diagnóstico", "Posicionamiento", "Hoja de ruta"] },
        { name: "AMPLIFY", fraction: 0.37, text: "Subimos el volumen donde más rinde: contenido, comunidad y medios pagos con presupuesto medido.", items: ["Contenido", "Paid Media", "Creatividades"] },
        { name: "CONNECT", fraction: 0.63, text: "Convertimos atención en relación: web, e-commerce y recorridos que llevan a la conversación y a la venta.", items: ["Web", "E-commerce", "CRM"] },
        { name: "EVOLVE", fraction: 0.87, text: "Aprendemos de los datos y los automatizamos: IA y flujos que mejoran cada ciclo sin perder el trato humano.", items: ["Datos", "IA", "Automatización"] }
      ];

  const path = document.querySelector("#path");
  const pulse = document.querySelector("#pulse");
  const nodes = document.querySelector("#nodes");
  const phaseName = document.querySelector("#pName");
  const phaseText = document.querySelector("#pText");
  const phaseList = document.querySelector("#pList");

  if (path && pulse && nodes && phaseName && phaseText && phaseList) {
    const pathLength = path.getTotalLength();
    const svgNamespace = "http://www.w3.org/2000/svg";
    const phaseNodes = [];
    phaseCopy.forEach((phase, index) => {
      const point = path.getPointAtLength(pathLength * phase.fraction);
      const node = document.createElementNS(svgNamespace, "g");
      node.setAttribute("class", "node");
      node.setAttribute("tabindex", "0");
      node.setAttribute("role", "button");
      node.setAttribute("aria-pressed", "false");
      node.setAttribute("aria-label", phase.name);
      const labelOffset = point.y < 190 ? -26 : 36;
      const hit = document.createElementNS(svgNamespace, "circle");
      hit.setAttribute("class", "hit");
      hit.setAttribute("cx", String(point.x));
      hit.setAttribute("cy", String(point.y));
      hit.setAttribute("r", "30");
      const dot = document.createElementNS(svgNamespace, "circle");
      dot.setAttribute("class", "dot");
      dot.setAttribute("cx", String(point.x));
      dot.setAttribute("cy", String(point.y));
      dot.setAttribute("r", "9");
      const text = document.createElementNS(svgNamespace, "text");
      text.setAttribute("x", String(point.x));
      text.setAttribute("y", String(point.y + labelOffset));
      text.textContent = phase.name;
      node.append(hit, dot, text);

      const selectPhase = () => {
        position = phase.fraction;
        pauseUntil = performance.now() + 6000;
        showPhase(index);
      };
      node.addEventListener("click", selectPhase);
      node.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectPhase();
        }
      });
      nodes.append(node);
      phaseNodes.push(node);
    });

    let position = phaseCopy[0].fraction;
    let pauseUntil = 0;
    let currentPhase = -1;
    let previousFrame = 0;
    let flowFrame = 0;

    function showPhase(index) {
      if (index === currentPhase) return;
      currentPhase = index;
      phaseNodes.forEach((node, nodeIndex) => {
        const active = nodeIndex === index;
        node.classList.toggle("on", active);
        node.setAttribute("aria-pressed", String(active));
      });
      phaseName.textContent = phaseCopy[index].name;
      phaseText.textContent = phaseCopy[index].text;
      phaseList.replaceChildren(...phaseCopy[index].items.map((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        return listItem;
      }));
    }

    function nearestPhase() {
      let nearest = 0;
      let distance = Number.POSITIVE_INFINITY;
      phaseCopy.forEach((phase, index) => {
        const nextDistance = Math.abs(((position - phase.fraction + 1.5) % 1) - 0.5);
        if (nextDistance < distance) {
          distance = nextDistance;
          nearest = index;
        }
      });
      return nearest;
    }

    function animateFlow(now) {
      if (document.hidden) {
        flowFrame = 0;
        return;
      }
      const delta = previousFrame ? now - previousFrame : 0;
      previousFrame = now;
      if (now > pauseUntil) position = (position + delta / 22000) % 1;
      const point = path.getPointAtLength(pathLength * position);
      pulse.setAttribute("cx", String(point.x));
      pulse.setAttribute("cy", String(point.y));
      showPhase(nearestPhase());
      flowFrame = window.requestAnimationFrame(animateFlow);
    }

    function startFlow() {
      if (!reducedMotion && !document.hidden && !flowFrame) {
        previousFrame = 0;
        flowFrame = window.requestAnimationFrame(animateFlow);
      }
    }

    showPhase(0);
    if (reducedMotion) {
      const initialPoint = path.getPointAtLength(pathLength * position);
      pulse.setAttribute("cx", String(initialPoint.x));
      pulse.setAttribute("cy", String(initialPoint.y));
    } else {
      startFlow();
    }
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && flowFrame) {
        window.cancelAnimationFrame(flowFrame);
        flowFrame = 0;
      } else {
        startFlow();
      }
    });
  }

  const assessment = document.querySelector("#digital-assessment, #diagnostico");
  if (assessment) {
    const dimensions = [
      {
        id: "foundations",
        name: "Discover",
        questions: [
          "How clear is your digital value proposition and who is it for?",
          "How integrated and up to date is your digital infrastructure (website, analytics, and management tools)?",
          "How often do you use reliable data to make business and marketing decisions?"
        ],
        implications: [
          ["A vague value proposition is limiting focus and may be creating inconsistent communication.", "The core idea exists, but it needs to be clarified and validated.", "The audience and positioning are defined; the next step is to sharpen differentiation."],
          ["The digital infrastructure is missing or disconnected and needs a stronger foundation.", "The infrastructure is partial and should be integrated first.", "The digital foundation works; focus on performance and deeper integration."],
          ["Decision-making lacks enough data, so basic measurement should be established.", "Data is partial or underused; improve tracking and follow-through.", "Measurement is systematic; deepen analysis and experimentation."]
        ]
      },
      {
        id: "demand",
        name: "Amplify",
        questions: [
          "How consistently do you publish useful content for the people you want to reach?",
          "How systematically do you attract prospects through search, social media, or advertising?",
          "How well do you measure which channels and campaigns generate valuable business opportunities?"
        ],
        implications: [
          ["The content presence is irregular or absent and needs a clear cadence.", "Activity is irregular; organize the calendar around defined objectives.", "Content is consistent; optimize formats and measurable results."],
          ["Lead acquisition is improvised or absent; begin by selecting the right channels.", "Channels are active but lack a repeatable system.", "Acquisition is organized; optimize investment and lead quality."],
          ["It is unclear which activities generate opportunities; establish channel measurement.", "Measurement is incomplete; connect campaigns to business outcomes.", "Measurement is useful; improve efficiency and attribution."]
        ]
      },
      {
        id: "conversion",
        name: "Connect",
        questions: [
          "How easy is it for a prospect to contact you, request information, buy, or hire you through your digital channels?",
          "How consistently do you follow up with new contacts and record their progress?",
          "How often do you test and improve your pages, forms, or sales processes?"
        ],
        implications: [
          ["The path has too much friction or unclear routes; simplify how prospects proceed.", "The process works but can be simpler with fewer steps.", "The journey is clear; optimize the experience and conversion."],
          ["New contacts lack consistent follow-up; define a process and ownership.", "Follow-up is irregular; establish records and response times.", "The process is consistent; automate and improve response quality."],
          ["Pages and sales processes are rarely reviewed; identify their main friction points.", "Improvement is occasional; introduce regular testing.", "Optimization is continuous; prioritize measurable experiments."]
        ]
      },
      {
        id: "loyalty",
        name: "Evolve",
        questions: [
          "How consistently do you stay in touch after the first purchase or project?",
          "How do you collect and use customer opinions, reviews, or satisfaction signals?",
          "How well do you encourage repeat purchases, referrals, or long-term relationships?"
        ],
        implications: [
          ["The customer relationship ends after the sale; create a post-purchase plan.", "Contact is occasional; create specific moments after purchase.", "The relationship is active; optimize retention and lifetime value."],
          ["Customer feedback is not collected; enable simple listening channels.", "Feedback is collected without a consistent analysis process.", "Customer listening is active; apply insights to decisions."],
          ["There are no clear continuity actions; identify the strongest opportunities.", "Actions are isolated; design a repeatable retention process.", "Continuity is structured; segment customers and improve long-term value."]
        ]
      },
      {
        id: "automation",
        name: "AI and automation",
        questions: [
          "To what extent have you identified and prioritized repetitive processes that could be improved with digital tools or automation?",
          "How often does your business use AI tools in clear and supervised processes?",
          "How do you verify that AI and automation save time without affecting quality or trust?"
        ],
        implications: [
          ["Repetitive processes are not mapped; start with a practical task inventory.", "Opportunities exist but have not been prioritized by impact or feasibility.", "The automation portfolio is prioritized; continue optimizing it."],
          ["AI is unused or used without clear criteria; identify low-risk use cases.", "AI use is occasional; define processes and human review.", "AI is integrated and supervised; measure productivity and quality."],
          ["The impact of AI and automation is not verified; establish basic controls.", "Review is informal; define quality and trust criteria.", "Impact is controlled; document and continue optimizing."]
        ]
      },
      {
        id: "security",
        name: "Security",
        questions: [
          "How consistently do you use strong passwords and multi-factor authentication on business accounts?",
          "How organized are the measures for protecting and recovering your business information?",
          "How prepared are the people in your business to recognize digital threats and know how to respond to an incident?"
        ],
        implications: [
          ["Essential account controls are insufficient; enable MFA and stronger passwords.", "Protection is partial; extend MFA and access management.", "Controls are deployed; review coverage and privileged access."],
          ["Backups or recovery processes are not reliably verified; establish and test them.", "Protection is partial; formalize backup frequency and restoration tests.", "Recovery is organized; continue reviewing resilience."],
          ["The team is not prepared; provide basic training and an incident protocol.", "Knowledge is uneven; reinforce training and escalation routes.", "Preparation is systematic; keep practices and incident drills current."]
        ]
      }
    ];
    if (!isEnglish) {
      const spanishDimensions = [
        {
          name: "Discover",
          questions: [
            "¿Qué tan clara está la propuesta de valor digital de tu negocio y a quién se dirige?",
            "¿Qué tan integrada y actualizada está la infraestructura digital de tu negocio (web, analítica y herramientas de gestión)?",
            "¿Con qué frecuencia utilizas datos fiables para tomar decisiones de negocio y marketing?"
          ],
          implications: [
            ["La propuesta de valor digital o el público al que te diriges todavía no están suficientemente definidos; esto puede hacer que la comunicación resulte poco diferenciada.", "Existe una propuesta y un público identificados, pero falta concretarlos o comprobar que conectan con las necesidades reales.", "Tu negocio tiene una propuesta de valor y un público definidos; conviene revisar periódicamente que el mensaje siga siendo relevante y diferencial."],
            ["La infraestructura digital presenta carencias o está poco integrada; conviene revisar los sistemas esenciales antes de ampliar herramientas.", "Hay herramientas, pero su integración, actualización o aprovechamiento es parcial.", "La infraestructura está organizada y acompaña la operativa; conviene mantenerla actualizada y revisar su integración."],
            ["Las decisiones parecen depender de información limitada o poco fiable; faltan indicadores básicos para saber qué funciona.", "Se consultan algunos datos, pero no siempre son completos o se incorporan a las decisiones.", "El negocio utiliza datos de forma organizada y puede avanzar hacia análisis y experimentación."]
          ]
        },
        {
          name: "Amplify",
          questions: [
            "¿Qué tan constante es la publicación de contenido útil para las personas a las que quieres llegar?",
            "¿Qué tan sistemáticamente atraes potenciales clientes mediante búsquedas, redes sociales o publicidad?",
            "¿Qué tan bien mides qué canales y campañas generan oportunidades de negocio valiosas?"
          ],
          implications: [
            ["La actividad de contenidos es inexistente o demasiado irregular para construir visibilidad y confianza.", "Hay publicaciones, pero su frecuencia, planificación o conexión con el público es irregular.", "Existe una actividad organizada; la oportunidad está en optimizar formatos, distribución y contribución comercial."],
            ["La captación digital es inexistente o depende de acciones aisladas; conviene identificar canales adecuados antes de ampliar esfuerzos.", "Se utilizan canales, pero falta continuidad o un proceso para convertir actividad en contactos cualificados.", "La captación está organizada; el siguiente paso es mejorar calidad y eficiencia."],
            ["No se identifica con claridad qué canales generan oportunidades valiosas.", "Existe medición, pero no permite comparar de forma consistente canales y resultados.", "Se mide el rendimiento de los canales; puede profundizarse en calidad de oportunidades y retorno."]
          ]
        },
        {
          name: "Connect",
          questions: [
            "¿Qué tan fácil es para un cliente potencial contactar, solicitar información, comprar o contratar a través de tus canales digitales?",
            "¿Con qué constancia haces seguimiento de nuevos contactos y registras su avance?",
            "¿Con qué frecuencia pruebas y mejoras tus páginas, formularios o procesos de venta?"
          ],
          implications: [
            ["El recorrido digital puede presentar barreras para contactar, solicitar información o contratar.", "El cliente puede contactar o contratar, pero hay pasos que podrían simplificarse.", "El recorrido es claro y accesible; conviene seguir observando la experiencia."],
            ["Los contactos pueden quedar sin seguimiento o registro de avance.", "Hay seguimiento, pero depende de acciones manuales o irregulares.", "Existe un proceso organizado; puede mejorarse la trazabilidad sin perder trato personal."],
            ["Las páginas, formularios o procesos apenas se revisan; pueden existir fricciones no detectadas.", "Se hacen mejoras puntuales, pero falta una rutina de comprobación.", "Se revisan y mejoran los procesos; pueden incorporarse pruebas sistemáticas."]
          ]
        },
        {
          name: "Evolve",
          questions: [
            "¿Con qué constancia mantienes el contacto después de la primera compra o proyecto?",
            "¿Cómo recoges y aprovechas las opiniones, reseñas o señales de satisfacción de tus clientes?",
            "¿Qué tan bien impulsas nuevas compras, recomendaciones o relaciones a largo plazo?"
          ],
          implications: [
            ["La relación parece detenerse después de la venta o proyecto.", "Existe contacto posterior, pero no responde a un proceso definido.", "Se mantiene relación después de la compra; puede mejorarse su personalización."],
            ["No se recoge feedback de forma sistemática.", "Se reciben opiniones, pero no siempre se organizan o aprovechan.", "Se escuchan y aprovechan las opiniones; puede analizarse mejor sus patrones."],
            ["No hay acciones claras para fomentar nuevas compras o recomendaciones.", "Existen acciones, pero son puntuales o poco estructuradas.", "Se trabaja la continuidad y recomendación; puede optimizarse la segmentación."]
          ]
        },
        {
          name: "IA y automatización",
          questions: [
            "¿En qué medida has identificado y priorizado procesos repetitivos que podrían optimizarse mediante herramientas digitales o automatización?",
            "¿Con qué frecuencia utiliza tu negocio herramientas de IA en procesos claros y supervisados?",
            "¿Cómo verificas que la IA y la automatización ahorren tiempo sin afectar a la calidad ni a la confianza?"
          ],
          implications: [
            ["No se han identificado tareas repetitivas de forma estructurada; primero observar procesos, no comprar herramientas.", "Se reconocen tareas, pero falta priorizarlas por frecuencia, tiempo, errores e impacto.", "Se identifican y priorizan oportunidades; revisar que cada iniciativa tenga objetivo y beneficio comprobable."],
            ["No se utiliza IA en procesos definidos o su uso es improvisado; no significa que deba incorporarse de inmediato.", "Se usa IA puntualmente, pero faltan procesos, límites y supervisión consistentes.", "Se utiliza IA en procesos definidos y supervisados; ampliar solo donde aporte valor."],
            ["No hay mecanismo claro para comprobar calidad, precisión y confianza de IA/automatizaciones.", "Se revisan algunos resultados, pero los criterios de calidad y supervisión son incompletos.", "Se comprueba impacto y calidad; formalizar indicadores y revisiones."]
          ]
        },
        {
          name: "Seguridad",
          questions: [
            "¿Qué tan constantemente utilizas contraseñas seguras y autenticación multifactor en las cuentas del negocio?",
            "¿Qué tan organizadas están las medidas de protección y recuperación de la información de tu negocio?",
            "¿Qué tan preparadas están las personas que trabajan en tu negocio para reconocer amenazas digitales y saber cómo actuar ante un incidente?"
          ],
          implications: [
            ["Las cuentas pueden estar expuestas por contraseñas débiles/reutilizadas o ausencia de MFA; priorizar contraseñas únicas, MFA y revisión de accesos.", "Hay medidas, pero no cubren todas las cuentas; revisar especialmente correo, web y servicios financieros.", "Las prácticas están implantadas; revisar cobertura y accesos antiguos."],
            ["No hay garantías suficientes de recuperación; establecer copias adecuadas y comprobar restauración.", "Hay copias, pero frecuencia, cobertura o restauración no están verificadas.", "Hay medidas organizadas; probar restauraciones y revisar cobertura crítica."],
            ["Las personas pueden no reconocer amenazas o no saber cómo actuar; hace falta formación y protocolo sencillo.", "Existe sensibilización, pero conocimientos o procedimientos varían.", "Hay prácticas de concienciación y respuesta; actualizarlas y comprobar que se conocen."]
          ]
        }
      ];
      dimensions.forEach((dimension, index) => Object.assign(dimension, spanishDimensions[index]));
    }
    const contextQuestions = isEnglish
      ? [
          { id: "C1", text: "How many people work in your company?", choices: ["1–10", "11–50", "51–250", "More than 250"], optional: true },
          { id: "C2", text: "Which best describes your business model?", choices: ["Product sales", "Services", "Manufacturing/distribution", "E-commerce", "Mixed", "Other"], optional: true }
        ]
      : [
          { id: "C1", text: "¿Cuántas personas trabajan en tu empresa?", choices: ["1–10", "11–50", "51–250", "Más de 250"], optional: true },
          { id: "C2", text: "¿Cuál describe mejor el modelo de negocio?", choices: ["Venta de productos", "Servicios", "Fabricación/distribución", "Ecommerce", "Mixto", "Otro"], optional: true }
        ];
    const evaluativeQuestions = dimensions.flatMap((dimension, dimensionIndex) =>
      dimension.questions.map((text, questionInDimension) => ({
        id: `${dimension.id === "foundations" ? "D" : dimension.id === "demand" ? "A" : dimension.id === "conversion" ? "C" : dimension.id === "loyalty" ? "E" : dimension.id === "automation" ? "I" : "S"}${questionInDimension + (dimension.id === "conversion" ? 3 : 1)}`,
        text,
        dimensionId: dimension.id,
        dimensionIndex,
        questionInDimension,
        optional: false
      }))
    );
    const questions = [...contextQuestions, ...evaluativeQuestions];
    const answerLabels = isEnglish ? [
      "Not in place",
      "Ad hoc or just getting started",
      "Partly in place, but inconsistent",
      "Consistent and clearly managed",
      "Measured and continuously improved"
    ] : [
      "Todavía no está implementado",
      "Se hace de manera puntual o está empezando",
      "Está parcialmente implementado, pero es irregular",
      "Se aplica de forma constante y organizada",
      "Se mide y mejora continuamente"
    ];
    const levels = isEnglish ? [
      { minimum: 80, name: "Optimized", summary: "Your digital ecosystem is a strategic advantage. Focus on sustaining performance and exploring carefully chosen new opportunities." },
      { minimum: 60, name: "Advanced", summary: "You have strong digital capabilities. Connecting the remaining gaps can unlock your next stage of growth." },
      { minimum: 40, name: "Consolidation", summary: "Several useful practices are in place. A more connected, measurable approach can help them work harder together." },
      { minimum: 20, name: "In development", summary: "You are building important digital capabilities. Clear priorities and repeatable processes will help create momentum." },
      { minimum: 0, name: "Initial", summary: "This is an opportunity to establish a stronger digital starting point. A few focused foundations can make the next steps clearer." }
    ] : [
      { minimum: 80, name: "Optimizado", summary: "Tu ecosistema digital es una ventaja estratégica. Enfócate en sostener los resultados y explorar nuevas oportunidades con criterio." },
      { minimum: 60, name: "Avanzado", summary: "Tu negocio cuenta con capacidades digitales sólidas. Conectar las brechas restantes puede impulsar la próxima etapa de crecimiento." },
      { minimum: 40, name: "Consolidación", summary: "Ya tienes prácticas valiosas en marcha. Un enfoque más conectado y medible puede ayudarlas a dar mejores resultados." },
      { minimum: 20, name: "En desarrollo", summary: "Estás construyendo capacidades digitales importantes. Prioridades claras y procesos repetibles te ayudarán a ganar impulso." },
      { minimum: 0, name: "Inicial", summary: "Es una oportunidad para fortalecer tu punto de partida digital. Algunas bases bien elegidas pueden aclarar los próximos pasos." }
    ];
    const copy = isEnglish ? {
      question: (current, total) => `Question ${current} of ${total}`,
      next: "Next question →",
      finish: "Complete the form →",
      previous: "← Previous",
      strongestTitle: "Where you are building momentum",
      buildFromTitle: "A useful place to build from",
      priorityTitle: "Your priority opportunities",
      frontierTitle: "Your next growth frontiers",
      priorityLabel: (number, score) => `Priority ${number} · ${score}%`,
      frontierLabel: (score) => `Growth frontier · ${score}%`,
      strengthFallback: "This is one of your highest-scoring dimensions. Use it as a place to start building and measure your progress.",
      growthOpportunity: (action) => `You are already strong here. Explore this next-level experiment: ${action}`
    } : {
      question: (current, total) => `Pregunta ${current} de ${total}`,
      next: "Siguiente pregunta →",
      finish: "Completar el formulario →",
      previous: "← Anterior",
      strongestTitle: "Dónde estás generando impulso",
      buildFromTitle: "Una base para seguir creciendo",
      priorityTitle: "Oportunidades prioritarias",
      frontierTitle: "Próximas fronteras de crecimiento",
      priorityLabel: (number, score) => `Prioridad ${number} · ${score}%`,
      frontierLabel: (score) => `Oportunidad de crecimiento · ${score}%`,
      strengthFallback: "Esta es una de tus dimensiones mejor puntuadas. Puedes tomarla como punto de partida y medir tus avances.",
      growthOpportunity: (action) => `Ya tienes una buena base en esta dimensión. Como próximo experimento, podrías: ${action}`
    };
    const views = assessment.querySelectorAll("[data-assessment-view]");
    const questionTitle = assessment.querySelector("[data-assessment-question]");
    const options = assessment.querySelector("[data-assessment-options]");
    const dimensionLabel = assessment.querySelector("[data-assessment-dimension]");
    const countLabel = assessment.querySelector("[data-assessment-count]");
    const progress = assessment.querySelector("[data-assessment-progress]");
    const nextButton = assessment.querySelector("[data-assessment-next]");
    const backButtons = assessment.querySelectorAll("[data-assessment-back]");
    const answers = Array(questions.length).fill(null);
    let questionIndex = 0;
    let currentCalculation = null;

    function calculateAssessment() {
      const evaluativeAnswers = evaluativeQuestions.map((question) => {
        const answerIndex = questions.findIndex((item) => item.id === question.id);
        return answers[answerIndex];
      });
      if (evaluativeAnswers.some((answer) => !Number.isInteger(answer) || answer < 0 || answer > 4)) {
        throw new RangeError("All 18 evaluative answers are required.");
      }

      const answersByDimension = Object.fromEntries(dimensions.map((dimension) => [
        dimension.id,
        evaluativeQuestions
          .filter((question) => question.dimensionId === dimension.id)
          .map((question) => answers[questions.findIndex((item) => item.id === question.id)])
      ]));

      const global = DigitalVibesCalculations.calculateGlobal(evaluativeAnswers);
      const dimensionsResult = dimensions.map((dimension) => ({
        ...DigitalVibesCalculations.calculateDimension(dimension.id, answersByDimension),
        name: dimension.name
      }));
      const answersById = Object.fromEntries(evaluativeQuestions.map((question) => {
        const answerIndex = questions.findIndex((item) => item.id === question.id);
        return [question.id, answers[answerIndex]];
      }));
      const contextAnswers = Object.fromEntries(contextQuestions.map((question) => {
        const answerIndex = questions.findIndex((item) => item.id === question.id);
        return [question.id, answers[answerIndex]];
      }));
      const calculation = { global, dimensions: dimensionsResult, answersByDimension };
      const interpretation = DigitalVibesRecommendations.evaluate(calculation, answersById, contextAnswers, isEnglish);
      return { ...calculation, interpretation };
    }

    function renderCalculation() {
      const globalValue = assessment.querySelector("[data-assessment-global]");
      const dimensionList = assessment.querySelector("[data-assessment-dimension-scores]");
      const bandValue = assessment.querySelector("[data-assessment-band]");
      const flowChart = assessment.querySelector("[data-assessment-chart-flow]");
      const transversalChart = assessment.querySelector("[data-assessment-chart-transversal]");
      const chart = assessment.querySelector("[data-assessment-chart]");
      if (!globalValue || !dimensionList || !bandValue || !currentCalculation) return;

      globalValue.textContent = `${Math.round(currentCalculation.global.percentage)}%`;
      const bandNames = isEnglish
        ? { initial: "Initial", development: "In development", consolidation: "In consolidation", advanced: "Advanced", optimized: "Optimized" }
        : { initial: "Inicial", development: "En desarrollo", consolidation: "En consolidación", advanced: "Avanzado", optimized: "Optimizado" };
      const bandKey = DigitalVibesCalculations.getGlobalBand(currentCalculation.global.percentage);
      bandValue.textContent = bandNames[bandKey];
      bandValue.dataset.band = bandKey;
      const bandSummaries = isEnglish
        ? {
            initial: "Most digital practices are not yet implemented. Setting up core foundations will clarify the immediate next steps.",
            development: "You have valuable initial initiatives, though they remain partial or inconsistent. Focused structure will build momentum.",
            consolidation: "Functional digital capabilities are in place with relevant opportunities to connect and optimize.",
            advanced: "Digital operations are largely consolidated. Focus on integrating and scaling across the entire journey.",
            optimized: "Systematic data-driven measurement and continuous improvement drive strategic advantage."
          }
        : {
            initial: "La mayoría de las prácticas aún no está implantada. Establecer las bases esenciales aclarará tus próximos pasos.",
            development: "Hay iniciativas iniciales valiosas, pero son parciales o irregulares. Estructurar procesos dará impulso al negocio.",
            consolidation: "Cuentas con capacidades funcionales en marcha, con brechas relevantes para conectar y optimizar.",
            advanced: "Gestión digital bastante implantada; el foco prioritario es optimizar e integrar todo el recorrido.",
            optimized: "Prácticas sistemáticas de medición y mejora continua que convierten tu ecosistema en una ventaja estratégica."
          };
      const summary = assessment.querySelector("[data-assessment-summary]");
      if (summary) {
        summary.textContent = isEnglish
          ? `Global level: ${bandNames[bandKey]} (${Math.round(currentCalculation.global.percentage)}%). ${bandSummaries[bandKey]}`
          : `Nivel global: ${bandNames[bandKey]} (${Math.round(currentCalculation.global.percentage)}%). ${bandSummaries[bandKey]}`;
      }

      function createBarRow(dimension) {
        const row = document.createElement("div");
        row.className = "assessment-chart-row";
        const label = document.createElement("span");
        label.className = "assessment-chart-label";
        label.textContent = dimension.name;
        const track = document.createElement("div");
        track.className = "assessment-chart-track";
        const fill = document.createElement("span");
        fill.style.width = `${dimension.percentage}%`;
        fill.dataset.score = String(Math.round(dimension.percentage));
        track.append(fill);
        const value = document.createElement("strong");
        value.textContent = `${Math.round(dimension.percentage)}%`;
        row.append(label, track, value);
        return row;
      }

      const flowDimensions = currentCalculation.dimensions.filter((d) =>
        ["foundations", "demand", "conversion", "loyalty"].includes(d.id)
      );
      const transversalDimensions = currentCalculation.dimensions.filter((d) =>
        ["automation", "security"].includes(d.id)
      );

      if (flowChart && transversalChart) {
        flowChart.replaceChildren(...flowDimensions.map(createBarRow));
        transversalChart.replaceChildren(...transversalDimensions.map(createBarRow));
      } else if (chart) {
        chart.replaceChildren(...currentCalculation.dimensions.map(createBarRow));
      }

      dimensionList.replaceChildren(...currentCalculation.dimensions.map((dimension) => {
        const row = document.createElement("div");
        row.className = "assessment-dimension-score";
        const name = document.createElement("strong");
        name.textContent = dimension.name;
        const score = document.createElement("span");
        score.textContent = `${Math.round(dimension.percentage)}%`;
        row.append(name, score);
        return row;
      }));
      renderInterpretation();
    }

    function renderInterpretation() {
      const interpretation = currentCalculation.interpretation;
      const riskContainer = assessment.querySelector("[data-assessment-risk-alerts]");
      const opportunityContainer = assessment.querySelector("[data-assessment-opportunities]");
      const roadmapContainer = assessment.querySelector("[data-assessment-roadmap]");
      const strengthContainer = assessment.querySelector("[data-assessment-strengths]");
      if (!riskContainer || !opportunityContainer || !strengthContainer) return;

      const contextIndex = {
        C1: contextQuestions[0] ? answers[questions.findIndex((item) => item.id === "C1")] : null,
        C2: contextQuestions[1] ? answers[questions.findIndex((item) => item.id === "C2")] : null
      };

      function getQuestionImplication(dimension, questionInDimension, score) {
        const implicationGroup = dimension.implications?.[questionInDimension];
        if (!implicationGroup) return "";
        const groupIndex = score <= 1 ? 0 : score === 2 ? 1 : 2;
        return implicationGroup[groupIndex] || "";
      }

      const contextSize = contextIndex?.C1;
      const contextModel = contextIndex?.C2;
      const isSmallBiz = contextSize === "1–10";
      const isMidOrLargeBiz = contextSize === "51–250" || contextSize === "Más de 250" || contextSize === "More than 250";

      let contextNarrative = "";
      if (contextSize || contextModel) {
        if (isEnglish) {
          const sizeTxt = contextSize ? `team size of ${contextSize}` : "";
          const modelTxt = contextModel ? `a ${contextModel.toLowerCase()} model` : "";
          const joined = [sizeTxt, modelTxt].filter(Boolean).join(" and ");
          contextNarrative = ` Personalized for your ${joined}, prioritizing agile execution aligned with your scale.`;
        } else {
          const sizeTxt = contextSize ? `un equipo de ${contextSize} personas` : "";
          const modelTxt = contextModel ? `un modelo de ${contextModel.toLowerCase()}` : "";
          const joined = [sizeTxt, modelTxt].filter(Boolean).join(" y ");
          contextNarrative = ` Adaptado a la realidad de tu negocio (${joined}), enfocando acciones con alto retorno y acordes a tu capacidad operativa.`;
        }
      }

      function buildDimensionSynthesis(dim, scores) {
        const pct = dim.percentage;
        const [s0, s1, s2] = scores;
        const texts = dim.implications || [];

        // Reglas de combinación específicas:
        // Caso IA/automatización
        if (dim.id === "automation") {
          if (s0 <= 1 && s1 <= 1) {
            return isEnglish
              ? "The primary opportunity is identifying manual repetitive processes and clear use cases; we do not recommend complex tools yet."
              : "La oportunidad principal es identificar procesos repetitivos y casos de uso claros; no se recomienda incorporar herramientas complejas aún.";
          }
          if (s0 >= 3 && s1 <= 1) {
            return isEnglish
              ? "Processes are identified, but AI is not currently utilized; consider conventional automation where it best solves the workload."
              : "Los procesos están identificados, pero no se hace uso relevante de IA; conviene valorar automatización convencional si resuelve mejor el problema.";
          }
          if (s0 <= 1 && s1 >= 3) {
            return isEnglish
              ? "AI is actively used, but process prioritization is lacking; review whether current usage addresses genuine core needs."
              : "Hay uso de IA, pero falta priorizar procesos; conviene revisar si ese uso resuelve necesidades reales del negocio.";
          }
          if (s1 >= 3 && s2 <= 1) {
            return isEnglish
              ? "AI is in use, but supervision, precision, and trust controls must be reinforced before scaling further."
              : "Tu negocio ya utiliza IA, pero necesita reforzar la revisión, privacidad y control de calidad antes de ampliar su uso.";
          }
          if (pct < 40) {
            return isEnglish
              ? "Your business has headroom to leverage technology to save time and reduce manual tasks. The opportunity lies in detecting repetitive tasks and choosing proportionate tools."
              : "Tu negocio todavía tiene margen para identificar dónde la tecnología puede ahorrar tiempo y reducir tareas manuales. La oportunidad no consiste en incorporar herramientas por tendencia, sino en detectar procesos repetitivos y elegir soluciones proporcionadas.";
          }
        }

        // Caso General según intervalos oficiales (0-39%, 40-74%, 75-100%)
        if (pct >= 75) {
          const hasLow = scores.some((sc) => sc <= 1);
          if (hasLow) {
            const lowIdx = scores.findIndex((sc) => sc <= 1);
            const lowImplication = texts[lowIdx]?.[0] || "";
            return isEnglish
              ? `${dim.name} is a consolidated area overall, though a specific gap remains: ${lowImplication.toLowerCase()}`
              : `La relación y escucha de clientes están bien desarrolladas en ${dim.name}, pero existe una brecha concreta que atender: ${lowImplication.charAt(0).toLowerCase() + lowImplication.slice(1)}`;
          }
          return isEnglish
            ? `${dim.name} represents a consolidated capability with consistent, organized practices. Focus on sustaining performance and continuous differentiation.`
            : `${dim.name} representa un área consolidada con procesos organizados y medibles. Conviene mantener la revisión periódica para asegurar diferenciación continua.`;
        } else if (pct >= 40) {
          return isEnglish
            ? `${dim.name} is currently your best developed dimension or in active progress. Functional practices exist, though connecting the remaining irregular areas will solidify the system.`
            : `${dim.name} es actualmente tu dimensión mejor desarrollada o en desarrollo activo. Hay prácticas existentes que funcionan, aunque todavía existen oportunidades para consolidarlas y hacerlas sistemáticas.`;
        } else {
          const breaches = scores
            .map((sc, idx) => ({ sc, text: texts[idx]?.[0] }))
            .filter((item) => item.sc <= 1 && item.text)
            .map((item) => item.text);
          return isEnglish
            ? `Priority improvement area in ${dim.name}: ${breaches.join(" ")}`
            : `Área prioritaria de mejora en ${dim.name}: ${breaches.join(" ")}`;
        }
      }

      // 1. FORTALEZAS: Hasta dos. Criterio oficial:
      // - Dimensión >= 75% si ninguna pregunta es 0-1 (o si tiene 0-1, se muestra como fortaleza con brecha concreta).
      // - Si ninguna llega al 75%, una dimensión entre 40-74% puede ser "área mejor desarrollada", no "fortaleza consolidada".
      const candidateStrengths = [...currentCalculation.dimensions]
        .map((dim) => {
          const scores = currentCalculation.answersByDimension?.[dim.id] ?? [0, 0, 0];
          return { dim, scores, percentage: dim.percentage };
        })
        .sort((a, b) => b.percentage - a.percentage);

      const topStrengths = candidateStrengths
        .filter((c) => c.percentage >= 40)
        .slice(0, 2);

      strengthContainer.replaceChildren(...(topStrengths.length ? topStrengths.map((item) => {
        const article = document.createElement("article");
        article.className = "assessment-rule-card";
        const icon = document.createElement("span");
        icon.className = "assessment-rule-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = "↗";
        const header = document.createElement("div");
        header.className = "assessment-rule-header";
        const isConsolidated = item.percentage >= 75;
        const tag = isConsolidated
          ? (isEnglish ? "Consolidated strength" : "Fortaleza consolidada")
          : (isEnglish ? "Best developed area" : "Área mejor desarrollada");
        const title = document.createElement("strong");
        title.textContent = `${item.dim.name} · ${Math.round(item.percentage)}% (${tag})`;
        header.append(icon, title);
        const text = document.createElement("p");
        text.textContent = buildDimensionSynthesis(item.dim, item.scores) + contextNarrative;
        article.append(header, text);
        return article;
      }) : [(() => {
        const article = document.createElement("article");
        article.className = "assessment-rule-card";
        const text = document.createElement("p");
        text.textContent = isEnglish
          ? "No dimension currently reaches 40%. Focus initially on establishing the core fundamentals across VIBE FLOW and Security."
          : `Actualmente ninguna dimensión alcanza el 40 %. Enfocar los esfuerzos iniciales en asentar las bases esenciales del recorrido VIBE FLOW y la seguridad permitirá generar rápidamente tus primeras fortalezas.${contextNarrative}`;
        article.append(text);
        return article;
      })()]));

      // 2. ALERTAS ESENCIALES (Pág. 5 del brief: agrupadas en una sola tarjeta con subtítulos si hay varias)
      riskContainer.replaceChildren(...(interpretation.riskAlerts.length
        ? interpretation.riskAlerts.map((alert) => {
            const article = document.createElement("article");
            article.className = "assessment-rule-card assessment-risk";
            const icon = document.createElement("span");
            icon.className = "assessment-rule-icon";
            icon.setAttribute("aria-hidden", "true");
            icon.textContent = "!";
            const header = document.createElement("div");
            header.className = "assessment-rule-header";
            const title = document.createElement("strong");
            title.textContent = alert.title;
            header.append(icon, title);
            const text = document.createElement("p");
            text.textContent = alert.explanation;
            article.append(header, text);
            return article;
          })
        : [(() => {
            const article = document.createElement("article");
            article.className = "assessment-rule-card";
            const text = document.createElement("p");
            text.textContent = isEnglish
              ? "No essential security risks detected. Account protection and backups are operating above critical thresholds."
              : "No se identificaron alertas críticas de ciberseguridad. Las medidas de protección esencial operan por encima de los umbrales de riesgo.";
            article.append(text);
            return article;
          })()]
      ));

      // 3. OPORTUNIDADES DE CRECIMIENTO: Hasta tres, agrupadas por dimensión
      // Priorizar preguntas 0-1 y dimensiones < 40%. Agrupar varias brechas de una misma dimensión en una sola tarjeta.
      const lowDimensions = [...currentCalculation.dimensions]
        .map((dim) => {
          const scores = currentCalculation.answersByDimension?.[dim.id] ?? [0, 0, 0];
          const lowScores = scores
            .map((score, index) => ({ score, index }))
            .filter((item) => item.score <= 1);
          const irregularScores = scores
            .map((score, index) => ({ score, index }))
            .filter((item) => item.score === 2);
          return { dim, scores, lowScores, irregularScores, percentage: dim.percentage };
        })
        .filter((item) => item.percentage < 75 || item.lowScores.length > 0)
        .sort((a, b) => {
          // Severidad: primero dimensiones con preguntas críticas (0-1), luego menor porcentaje
          const aCrit = a.lowScores.length;
          const bCrit = b.lowScores.length;
          if (aCrit !== bCrit) return bCrit - aCrit;
          return a.percentage - b.percentage;
        })
        .slice(0, 3);

      opportunityContainer.replaceChildren(...(lowDimensions.length ? lowDimensions.map((item) => {
        const article = document.createElement("article");
        article.className = "assessment-rule-card";
        const icon = document.createElement("span");
        icon.className = "assessment-rule-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = "→";
        const header = document.createElement("div");
        header.className = "assessment-rule-header";
        const title = document.createElement("strong");
        title.textContent = `${item.dim.name} · ${Math.round(item.percentage)}%`;
        header.append(icon, title);
        const text = document.createElement("p");

        const synthesis = buildDimensionSynthesis(item.dim, item.scores);
        text.textContent = synthesis + (isSmallBiz
          ? (isEnglish ? " Recommended approach: prioritize lean direct tools." : " Enfoque recomendado: priorizar herramientas ligeras y directas sin complejidad innecesaria.")
          : isMidOrLargeBiz
          ? (isEnglish ? " Recommended approach: standardize cross-team ownership and SOPs." : " Enfoque recomendado: estandarizar protocolos y responsabilidades compartidas.")
          : "");
        article.append(header, text);
        return article;
      }) : [(() => {
        const article = document.createElement("article");
        article.className = "assessment-rule-card";
        const text = document.createElement("p");
        text.textContent = isEnglish
          ? "No critical gaps were identified across evaluated dimensions. Focus on continuous experimentation and sustaining your leadership."
          : `No se identificaron brechas críticas en las dimensiones evaluadas. El foco recomendado es mantener la disciplina de medición y explorar optimización continua.${contextNarrative}`;
        article.append(text);
        return article;
      })()]));

      const actionTitles = isEnglish ? {
        "security-mfa": "Activate MFA and review critical account access",
        "security-backup": "Establish and test backups",
        "security-training": "Train the team and define incident response",
        "discover-positioning": "Clarify positioning and target audience",
        "discover-infrastructure": "Integrate and update the digital infrastructure",
        "discover-measurement": "Implement basic decision measurement",
        "amplify-content": "Create a repeatable content plan",
        "amplify-acquisition": "Build a structured acquisition channel",
        "amplify-attribution": "Connect campaigns with business results",
        "connect-journey": "Reduce friction in the digital conversion journey",
        "connect-follow-up": "Define lead follow-up and ownership",
        "connect-optimization": "Set up conversion experiments",
        "evolve-retention": "Build a post-purchase retention process",
        "evolve-feedback": "Create a customer feedback loop",
        "evolve-referrals": "Activate repeat purchase and referral actions",
        "automation-processes": "Map and prioritize repetitive processes",
        "automation-ai": "Pilot supervised AI workflows",
        "automation-quality": "Add quality and trust controls"
      } : {
        "security-mfa": "Activar MFA y revisar accesos críticos",
        "security-backup": "Definir y probar copias de seguridad",
        "security-training": "Formar al equipo y definir respuesta ante incidentes",
        "discover-positioning": "Aclarar posicionamiento y audiencia objetivo",
        "discover-infrastructure": "Integrar y actualizar la infraestructura digital",
        "discover-measurement": "Implantar medición básica para decisiones",
        "amplify-content": "Crear un plan de contenidos repetible",
        "amplify-acquisition": "Construir un canal de captación estructurado",
        "amplify-attribution": "Conectar campañas con resultados de negocio",
        "connect-journey": "Reducir fricción en el recorrido de conversión",
        "connect-follow-up": "Definir seguimiento y responsables comerciales",
        "connect-optimization": "Configurar experimentos de conversión",
        "evolve-retention": "Diseñar un proceso de posventa y fidelización",
        "evolve-feedback": "Crear un circuito de opiniones de clientes",
        "evolve-referrals": "Activar nuevas compras y recomendaciones",
        "automation-processes": "Mapear y priorizar procesos repetitivos",
        "automation-ai": "Probar flujos de IA supervisados",
        "automation-quality": "Añadir controles de calidad y confianza"
      };

      if (roadmapContainer) {
        roadmapContainer.replaceChildren(...interpretation.roadmap.map((stage) => {
          const article = document.createElement("article");
          article.className = "assessment-roadmap-stage";
          const title = document.createElement("h4");
          const stageNames = isEnglish
            ? ["Months 1–3 · Fundamentals", "Months 4–6 · Activation", "Months 7–9 · Optimization", "Months 10–12 · Consolidation"]
            : ["Meses 1–3 · Fundamentos", "Meses 4–6 · Activación", "Meses 7–9 · Optimización", "Meses 10–12 · Consolidación"];
          title.textContent = stageNames[stage.quarter - 1] ?? (isEnglish ? `Quarter ${stage.quarter}` : `Trimestre ${stage.quarter}`);
          const list = document.createElement("ul");
          const visibleActions = stage.actions.length
            ? stage.actions
            : [{ id: "review", result: isEnglish ? "Review KPIs and maintain the established plan." : "Revisar KPI y mantener el plan establecido." }];
          list.append(...visibleActions.map((action) => {
            const item = document.createElement("li");
            const actionTitle = action.title
              ? (isEnglish ? action.title.en : action.title.es)
              : (actionTitles[action.id] ?? action.result);
            item.textContent = actionTitle;
            if (action.evidence?.length) {
              item.title = action.evidence.map((evidence) =>
                `${evidence.questionId}: ${evidence.answer}`
              ).join("; ");
            }
            return item;
          }));
          article.append(title, list);
          return article;
        }));
      }
    }

    function showView(name) {
      let activeView;
      views.forEach((view) => {
        view.hidden = view.dataset.assessmentView !== name;
        if (!view.hidden) activeView = view;
      });
      if (activeView) {
        observeRevealItems(activeView.querySelectorAll(
          "h2, h3, .assessment-score-card, .assessment-results-grid > section, .assessment-priorities, .assessment-action-plan, .assessment-cta, .assessment-controls"
        ));
      }
      if (activeView && gsapEnabled) {
        window.gsap.fromTo(activeView, { autoAlpha: 0, y: 22 }, {
          autoAlpha: 1,
          y: 0,
          duration: .55,
          ease: "power2.out",
          clearProps: "transform,opacity,visibility"
        });
      }
      assessment.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    }

    function renderQuestion() {
      const question = questions[questionIndex];
      questionTitle.textContent = question.text;
      questionTitle.tabIndex = -1;
      if (gsapEnabled) {
        window.gsap.fromTo(questionTitle, { autoAlpha: 0, y: 12 }, {
          autoAlpha: 1,
          y: 0,
          duration: .35,
          ease: "power2.out",
          clearProps: "transform,opacity,visibility"
        });
      }
      dimensionLabel.textContent = question.optional
        ? (isEnglish ? "Context · optional" : "Contexto · opcional")
        : dimensions[question.dimensionIndex].name;
      countLabel.textContent = copy.question(questionIndex + 1, questions.length);
      progress.setAttribute("aria-valuenow", String(questionIndex + 1));
      progress.setAttribute("aria-valuetext", copy.question(questionIndex + 1, questions.length));
      progress.querySelector("span").style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
      const choices = question.optional
        ? question.choices.map((label) => ({ label, value: label }))
        : answerLabels.map((label, value) => ({
            label: `${value} · ${label}`,
            value
          }));
      options.replaceChildren(...choices.map(({ label, value }) => {
        const option = document.createElement("label");
        option.className = "assessment-option";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `assessment-answer-${questionIndex}`;
        input.value = String(value);
        input.checked = typeof value === "number"
          ? answers[questionIndex] === value
          : answers[questionIndex] === value;
        input.addEventListener("change", () => {
          answers[questionIndex] = value;
          nextButton.disabled = false;
        });
        const text = document.createElement("span");
        text.textContent = label;
        option.append(input, text);
        return option;
      }));
      observeRevealItems(options.querySelectorAll(".assessment-option"));
      nextButton.disabled = question.optional ? false : answers[questionIndex] === null;
      nextButton.textContent = questionIndex === questions.length - 1
        ? copy.finish
        : copy.next;
      backButtons.forEach((button) => {
        button.disabled = questionIndex === 0;
      });
      assessment.querySelector(".assessment-controls [data-assessment-back]").textContent = copy.previous;
    }

    assessment.querySelector("[data-assessment-start]").addEventListener("click", () => {
      questionIndex = 0;
      showView("quiz");
      renderQuestion();
      questionTitle.focus({ preventScroll: true });
    });
    nextButton.addEventListener("click", () => {
      if (!questions[questionIndex].optional && answers[questionIndex] === null) return;
      if (questionIndex < questions.length - 1) {
        questionIndex += 1;
        renderQuestion();
        questionTitle.focus({ preventScroll: true });
      } else {
        currentCalculation = calculateAssessment();
        renderCalculation();
        showView("complete");
        assessment.querySelector("#assessment-complete-title").focus({ preventScroll: true });
      }
    });
    backButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (questionIndex > 0) {
          questionIndex -= 1;
          renderQuestion();
          questionTitle.focus({ preventScroll: true });
        }
      });
    });
    const mapForm = assessment.querySelector("[data-assessment-map-form]");
    mapForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = assessment.querySelector("[data-assessment-form-status]");
      if (!mapForm.reportValidity()) {
        status.textContent = isEnglish
          ? "Please enter a valid email and accept the map request."
          : "Introduce un email válido y acepta la solicitud del mapa.";
        return;
      }
      if (!currentCalculation) return;
      const formData = new FormData(mapForm);
      const request = {
        email: String(formData.get("email") || ""),
        mapConsent: formData.get("mapConsent") === "on",
        marketingConsent: formData.get("marketingConsent") === "on",
        submittedAt: new Date().toISOString(),
        calculation: currentCalculation
      };
      try {
        sessionStorage.setItem("digital-vibes-map-request", JSON.stringify(request));
      } catch (error) {
        console.warn("The map request could not be kept for this browser session.", error);
      }
      status.textContent = isEnglish
        ? "Request registered for this browser session. The 12-month map can now be prepared."
        : "Solicitud registrada en esta sesión del navegador. Ya puedes preparar el mapa a 12 meses.";
    });
    assessment.querySelector("[data-assessment-restart]").addEventListener("click", () => {
      answers.fill(null);
      questionIndex = 0;
      currentCalculation = null;
      assessment.querySelector("[data-assessment-global]").textContent = "0%";
      assessment.querySelector("[data-assessment-band]").textContent = isEnglish ? "Initial" : "Inicial";
      assessment.querySelector("[data-assessment-chart]").replaceChildren();
      assessment.querySelector("[data-assessment-dimension-scores]").replaceChildren();
      assessment.querySelector("[data-assessment-strengths]").replaceChildren();
      assessment.querySelector("[data-assessment-risk-alerts]").replaceChildren();
      assessment.querySelector("[data-assessment-opportunities]").replaceChildren();
      const rm = assessment.querySelector("[data-assessment-roadmap]");
      if (rm) rm.replaceChildren();
      assessment.querySelector("[data-assessment-map-form]")?.reset();
      assessment.querySelector("[data-assessment-form-status]").textContent = "";
      showView("intro");
    });
  }

  const copyEmailButton = document.querySelector("[data-copy-email]");
  const copyEmailStatus = document.querySelector("[data-copy-email-status]");
  copyEmailButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("hola@digitalvibes.com");
      copyEmailStatus.textContent = isEnglish ? "Email address copied." : "Correo copiado.";
    } catch (error) {
      console.warn("The contact email could not be copied.", error);
      copyEmailStatus.textContent = isEnglish
        ? "Copy hola@digitalvibes.com to contact us."
        : "Copia hola@digitalvibes.com para escribirnos.";
    }
  });
})();
