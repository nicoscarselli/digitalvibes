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
        name: "Digital strategy and foundations",
        questions: [
          "How clearly defined is your digital value proposition and target audience?",
          "How connected and consistently maintained are your website, analytics, and core digital tools?",
          "How regularly do you use reliable data to make business and marketing decisions?"
        ],
        strength: "Your digital foundations give your team a clear, dependable platform for growth.",
        opportunity: "Clarify your positioning and connect your core digital tools before scaling activity.",
        action: "Map your customer journey, review your website and analytics setup, and choose a small set of business KPIs."
      },
      {
        id: "demand",
        name: "Visibility and demand generation",
        questions: [
          "How consistently do you publish useful content for the people you want to reach?",
          "How systematically do you attract qualified prospects through search, social, or paid media?",
          "How reliably do you measure which channels and campaigns generate valuable leads?"
        ],
        strength: "Your demand-generation engine is building a consistent path to qualified audiences.",
        opportunity: "Create a focused content and channel plan, then measure lead quality instead of reach alone.",
        action: "Choose one priority audience, define a repeatable content cadence, and track qualified leads by source."
      },
      {
        id: "conversion",
        name: "Conversion and sales",
        questions: [
          "How easy is it for a potential customer to take the next step on your website?",
          "How consistently do you follow up with new leads and track their progress?",
          "How often do you test and improve your landing pages, forms, or sales journey?"
        ],
        strength: "Your conversion journey is turning digital attention into meaningful customer action.",
        opportunity: "Remove friction from key pages and make lead follow-up clear, timely, and measurable.",
        action: "Review your highest-value landing page, reduce its main point of friction, and assign a clear lead follow-up owner."
      },
      {
        id: "loyalty",
        name: "Customer loyalty and growth",
        questions: [
          "How consistently do you stay in touch with customers after their first purchase or project?",
          "How do you collect and act on customer feedback, reviews, or satisfaction signals?",
          "How effectively do you encourage repeat purchases, referrals, or long-term relationships?"
        ],
        strength: "Your customer relationships are creating a strong foundation for repeat business and referrals.",
        opportunity: "Build a simple post-purchase experience and use customer feedback to guide retention.",
        action: "Plan a post-purchase check-in, invite feedback, and identify one useful reason for customers to return."
      },
      {
        id: "automation",
        name: "AI and automation",
        questions: [
          "How clearly have you identified repetitive tasks that could be improved with automation?",
          "How regularly does your team use AI tools within clear, reviewed workflows?",
          "How do you check that automation and AI save time without compromising quality or trust?"
        ],
        strength: "Your team is using AI and automation thoughtfully to create practical operating efficiencies.",
        opportunity: "Start with one repetitive workflow and set clear quality, privacy, and human-review guardrails.",
        action: "Choose a low-risk repetitive task, document its current steps, and test one human-reviewed automation."
      },
      {
        id: "security",
        name: "Security and digital protection",
        questions: [
          "How consistently do you use strong passwords and multi-factor authentication on business accounts?",
          "How clearly do you manage access, backups, and updates across your essential digital tools?",
          "How prepared is your team to recognize suspicious messages and respond to a digital incident?"
        ],
        strength: "Your security practices help protect business continuity and customer trust.",
        opportunity: "Prioritize multi-factor authentication, access reviews, and tested backups for critical accounts.",
        action: "Enable multi-factor authentication on critical accounts, review who has access, and verify a recent backup."
      }
    ];
    if (!isEnglish) {
      const spanishDimensions = [
        {
          name: "Estrategia y fundamentos digitales",
          questions: [
            "¿Qué tan clara está la propuesta de valor digital de tu negocio y a quién se dirige?",
            "¿Qué tan conectados y actualizados están tu sitio web, tus analíticas y tus herramientas digitales principales?",
            "¿Con qué frecuencia usas datos confiables para tomar decisiones de negocio y marketing?"
          ],
          strength: "Tu base digital ofrece una plataforma clara y confiable para impulsar el crecimiento.",
          opportunity: "Aclara tu posicionamiento y conecta tus herramientas digitales principales antes de escalar.",
          action: "Mapea el recorrido de tus clientes, revisa tu sitio y tus analíticas, y define algunos indicadores clave."
        },
        {
          name: "Visibilidad y generación de demanda",
          questions: [
            "¿Con qué constancia publicas contenido útil para las personas a las que quieres llegar?",
            "¿Qué tan sistemáticamente atraes potenciales clientes mediante búsquedas, redes sociales o publicidad?",
            "¿Qué tan bien mides qué canales y campañas generan oportunidades de negocio valiosas?"
          ],
          strength: "Tu estrategia de demanda construye un camino constante hacia audiencias relevantes.",
          opportunity: "Define un plan enfocado de contenidos y canales, y mide la calidad de las oportunidades, no solo el alcance.",
          action: "Elige una audiencia prioritaria, establece una frecuencia de publicación y mide las oportunidades por canal."
        },
        {
          name: "Conversión y ventas",
          questions: [
            "¿Qué tan fácil es para un cliente potencial dar el siguiente paso en tu sitio web?",
            "¿Con qué constancia haces seguimiento de nuevos contactos y registras su avance?",
            "¿Con qué frecuencia pruebas y mejoras tus páginas, formularios o proceso de venta?"
          ],
          strength: "Tu proceso de conversión transforma la atención digital en acciones concretas de tus clientes.",
          opportunity: "Simplifica tus páginas clave y establece un seguimiento de oportunidades claro, oportuno y medible.",
          action: "Revisa tu página más importante, elimina su principal fricción y asigna quién hará el seguimiento."
        },
        {
          name: "Fidelización y crecimiento",
          questions: [
            "¿Con qué constancia mantienes el contacto después de la primera compra o proyecto?",
            "¿Cómo recoges y aprovechas las opiniones, reseñas o señales de satisfacción de tus clientes?",
            "¿Qué tan bien impulsas nuevas compras, recomendaciones o relaciones a largo plazo?"
          ],
          strength: "Tus relaciones con clientes crean una base sólida para nuevas compras y recomendaciones.",
          opportunity: "Diseña una experiencia posterior a la compra y usa las opiniones para mejorar la fidelización.",
          action: "Planifica un contacto después de la compra, pide opiniones e identifica un motivo valioso para volver."
        },
        {
          name: "IA y automatización",
          questions: [
            "¿Qué tan bien identificaste las tareas repetitivas que podrían mejorarse con automatización?",
            "¿Con qué frecuencia usa tu equipo herramientas de IA en procesos claros y supervisados?",
            "¿Cómo verificas que la IA y la automatización ahorren tiempo sin afectar la calidad ni la confianza?"
          ],
          strength: "Tu equipo aplica IA y automatización con criterio para mejorar el trabajo cotidiano.",
          opportunity: "Empieza con un proceso repetitivo e incorpora controles de calidad, privacidad y revisión humana.",
          action: "Elige una tarea repetitiva de bajo riesgo, documenta sus pasos y prueba una automatización supervisada."
        },
        {
          name: "Seguridad y protección digital",
          questions: [
            "¿Con qué constancia usas contraseñas seguras y autenticación multifactor en las cuentas del negocio?",
            "¿Qué tan bien gestionas los accesos, las copias de seguridad y las actualizaciones de tus herramientas?",
            "¿Qué tan preparado está tu equipo para detectar mensajes sospechosos y responder a un incidente digital?"
          ],
          strength: "Tus prácticas de seguridad ayudan a proteger la continuidad del negocio y la confianza de tus clientes.",
          opportunity: "Prioriza la autenticación multifactor, la revisión de accesos y las copias de seguridad verificadas.",
          action: "Activa la autenticación multifactor, revisa los accesos y comprueba que una copia de seguridad reciente funcione."
        }
      ];
      dimensions.forEach((dimension, index) => Object.assign(dimension, spanishDimensions[index]));
    }
    const questions = dimensions.flatMap((dimension, dimensionIndex) =>
      dimension.questions.map((text, questionInDimension) => ({
        text,
        dimensionId: dimension.id,
        dimensionIndex,
        questionInDimension
      }))
    );
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
      finish: "Continue to my results →",
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
      finish: "Ver mis resultados →",
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
      dimensionLabel.textContent = dimensions[question.dimensionIndex].name;
      countLabel.textContent = copy.question(questionIndex + 1, questions.length);
      progress.setAttribute("aria-valuenow", String(questionIndex + 1));
      progress.setAttribute("aria-valuetext", copy.question(questionIndex + 1, questions.length));
      progress.querySelector("span").style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
      options.replaceChildren(...answerLabels.map((label, value) => {
        const option = document.createElement("label");
        option.className = "assessment-option";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `assessment-answer-${questionIndex}`;
        input.value = String(value);
        input.checked = answers[questionIndex] === value;
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
      nextButton.disabled = answers[questionIndex] === null;
      nextButton.textContent = questionIndex === questions.length - 1
        ? copy.finish
        : copy.next;
      backButtons.forEach((button) => {
        button.disabled = questionIndex === 0;
      });
      assessment.querySelector(".assessment-controls [data-assessment-back]").textContent = copy.previous;
    }

    function calculateResults() {
      const scores = dimensions.map((dimension) => {
        const questionIndexes = questions
          .map((question, index) => question.dimensionId === dimension.id ? index : -1)
          .filter((index) => index !== -1);
        const points = questionIndexes.reduce((total, index) => total + answers[index], 0);
        return { ...dimension, points, percentage: Math.round((points / (questionIndexes.length * 4)) * 100) };
      });
      const score = Math.round(
        (answers.reduce((total, answer) => total + answer, 0) / (questions.length * 4)) * 100
      );
      return { scores, score, level: levels.find((level) => score >= level.minimum) };
    }

    function renderResults() {
      const results = calculateResults();
      const sorted = [...results.scores].sort((a, b) => b.percentage - a.percentage);
      assessment.querySelector("[data-assessment-score]").textContent = String(results.score);
      assessment.querySelector("[data-assessment-level]").textContent = results.level.name;
      assessment.querySelector("[data-assessment-summary]").textContent = results.level.summary;

      const breakdown = assessment.querySelector("[data-assessment-breakdown]");
      breakdown.replaceChildren(...results.scores.map((dimension) => {
        const row = document.createElement("div");
        row.className = "assessment-dimension";
        const name = document.createElement("strong");
        name.textContent = dimension.name;
        const score = document.createElement("span");
        score.textContent = `${dimension.percentage}%`;
        const track = document.createElement("div");
        track.className = "assessment-dimension-track";
        track.setAttribute("role", "img");
        track.setAttribute("aria-label", `${dimension.name}: ${dimension.percentage}%`);
        const fill = document.createElement("span");
        fill.style.width = `${dimension.percentage}%`;
        track.append(fill);
        row.append(name, score, track);
        return row;
      }));

      const strengths = assessment.querySelector("[data-assessment-strengths]");
      const strongestDimensions = sorted.filter((dimension) => dimension.percentage >= 60).slice(0, 2);
      const visibleStrengths = strongestDimensions.length ? strongestDimensions : sorted.slice(0, 1);
      assessment.querySelector("#assessment-strengths-title").textContent = strongestDimensions.length
        ? copy.strongestTitle
        : copy.buildFromTitle;
      strengths.replaceChildren(...visibleStrengths.map((dimension) => {
        const item = document.createElement("li");
        const title = document.createElement("strong");
        title.textContent = `${dimension.name} · ${dimension.percentage}%`;
        item.append(title, document.createTextNode(dimension.percentage >= 60
          ? dimension.strength
          : copy.strengthFallback));
        return item;
      }));

      const weakestDimensions = [...results.scores].sort((a, b) => a.percentage - b.percentage);
      const opportunities = weakestDimensions.slice(0, 3).filter((dimension) => dimension.percentage < 70);
      const prioritized = opportunities.length >= 2 ? opportunities : weakestDimensions.slice(0, 2);
      const allDimensionsStrong = results.scores.every((dimension) => dimension.percentage >= 80);
      assessment.querySelector("#assessment-priorities-title").textContent = allDimensionsStrong
        ? copy.frontierTitle
        : copy.priorityTitle;
      assessment.querySelector("[data-assessment-opportunities]").replaceChildren(...prioritized.map((dimension, index) => {
        const article = document.createElement("article");
        article.className = "assessment-opportunity";
        const priority = document.createElement("span");
        priority.textContent = dimension.percentage >= 80
          ? copy.frontierLabel(dimension.percentage)
          : copy.priorityLabel(index + 1, dimension.percentage);
        const title = document.createElement("h4");
        title.textContent = dimension.name;
        const description = document.createElement("p");
        description.textContent = dimension.percentage >= 80
          ? copy.growthOpportunity(dimension.action)
          : dimension.opportunity;
        article.append(priority, title, description);
        return article;
      }));

      const actionPlan = assessment.querySelector("[data-assessment-action-plan]");
      const dimension = (id) => results.scores.find((item) => item.id === id);
      const fundamentals = prioritized[0];
      const demand = dimension("demand");
      const conversion = dimension("conversion");
      const automation = dimension("automation");
      const loyalty = dimension("loyalty");
      const roadmap = isEnglish ? [
        {
          title: "Months 1–3 · Foundations",
          text: `Resolve the main blocker: ${fundamentals.opportunity} ${fundamentals.action}`
        },
        {
          title: "Months 4–6 · Activation",
          text: `Improve visibility and lead generation: ${demand.opportunity} ${conversion.action}`
        },
        {
          title: "Months 7–9 · Optimization",
          text: `${automation.opportunity} Review performance data and automate one repeatable, low-risk process.`
        },
        {
          title: "Months 10–12 · Consolidation",
          text: `${loyalty.action} Review results and use what you learned to start a new DISCOVER cycle.`
        }
      ] : [
        {
          title: "Meses 1–3 · Fundamentos",
          text: `Resuelve el principal bloqueo: ${fundamentals.opportunity} ${fundamentals.action}`
        },
        {
          title: "Meses 4–6 · Activación",
          text: `Refuerza visibilidad y captación: ${demand.opportunity} ${conversion.action}`
        },
        {
          title: "Meses 7–9 · Optimización",
          text: `${automation.opportunity} Revisa los datos de rendimiento y automatiza un proceso repetible de bajo riesgo.`
        },
        {
          title: "Meses 10–12 · Consolidación",
          text: `${loyalty.action} Evalúa los resultados y usa lo aprendido para iniciar un nuevo ciclo DISCOVER.`
        }
      ];
      actionPlan.replaceChildren(...roadmap.map((stage) => {
        const article = document.createElement("article");
        article.className = "assessment-roadmap-stage";
        const title = document.createElement("h4");
        title.textContent = stage.title;
        const description = document.createElement("p");
        description.textContent = stage.text;
        article.append(title, description);
        return article;
      }));
      observeRevealItems(assessment.querySelectorAll(
        ".assessment-dimension, .assessment-insights li, .assessment-opportunity, .assessment-roadmap-stage"
      ));
      return results;
    }

    assessment.querySelector("[data-assessment-start]").addEventListener("click", () => {
      questionIndex = 0;
      showView("quiz");
      renderQuestion();
      questionTitle.focus({ preventScroll: true });
    });
    nextButton.addEventListener("click", () => {
      if (answers[questionIndex] === null) return;
      if (questionIndex < questions.length - 1) {
        questionIndex += 1;
        renderQuestion();
        questionTitle.focus({ preventScroll: true });
      } else {
        showView("results");
        renderResults();
        assessment.querySelector("#assessment-results-title").focus({ preventScroll: true });
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
    assessment.querySelector("[data-assessment-restart]").addEventListener("click", () => {
      answers.fill(null);
      questionIndex = 0;
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
