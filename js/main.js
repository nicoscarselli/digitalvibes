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
    : "light";

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

  const revealItems = document.querySelectorAll("main section");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.animate(
            [{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "translateY(0)" }],
            { duration: 550, easing: "cubic-bezier(.2,.7,.2,1)", fill: "both" }
          );
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

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

  const contactForm = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");
  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const formData = new FormData(contactForm);
    const subject = encodeURIComponent(isEnglish ? "Website inquiry — Digital Vibes" : "Consulta desde el sitio — Digital Vibes");
    const body = encodeURIComponent(
      `${isEnglish ? "Name" : "Nombre"}: ${formData.get("name")}\n` +
      `${isEnglish ? "Email" : "Correo"}: ${formData.get("email")}\n\n` +
      `${isEnglish ? "Message" : "Mensaje"}:\n${formData.get("message")}`
    );
    if (formStatus) {
      formStatus.textContent = isEnglish
        ? "Your email app will open with the message ready to send."
        : "Se abrirá tu aplicación de correo con el mensaje listo para enviar.";
    }
    window.location.href = `mailto:hola@digitalvibes.com?subject=${subject}&body=${body}`;
  });
})();
