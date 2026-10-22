const INK = "#121213"
const FADED = "#d2d2d7";

function setFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = "";

  return words.map((word, index) => {
    const span = document.createElement("span");
    span.className = "word";
    span.textContent = word;
    el.appendChild(span);
    if (index < words.length - 1) {
      el.appendChild(document.createTextNode(" "));
    }
    return span;
  });
}

function animateHero() {
  const title = document.querySelector(".hero__title");
  const lead = document.querySelector(".hero__lead");
  const originals = [title.textContent, lead.textContent];
  const words = [...splitWords(title), ...splitWords(lead)];

  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".hero__dots", { autoAlpha: 0, scale: 0.85, duration: 1.4 }, 0)
    .from(".hero__eyebrow", { y: 16, autoAlpha: 0, duration: 0.6 }, 0.1)
    .from(words, { yPercent: 70, autoAlpha: 0, duration: 0.8, stagger: 0.03 }, 0.2)
    .from(".hero__scroll", { autoAlpha: 0, duration: 0.6 }, "-=0.3");

  // Pinned scrub: words "ink in" one by one as the reader scrolls, like reading along.
  gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "+=120%",
      pin: true,
      scrub: 0.6
    }
  })
    .fromTo(words, { color: FADED }, { color: INK, ease: "none", stagger: 0.1 })
    .to(".hero__dots", { scale: 1.25, autoAlpha: 0.3, ease: "none" }, 0)
    .to(".hero__scroll", { autoAlpha: 0, ease: "none", duration: 0.2 }, 0);

  return () => {
    title.textContent = originals[0];
    lead.textContent = originals[1];
  };
}

function revealServices() {
  const services = gsap.utils.toArray(".service");
  gsap.set(services, { autoAlpha: 0, y: 60 });
  gsap.set(".service__dots", { scaleX: 0 });

  ScrollTrigger.batch(services, {
    start: "top 85%",
    once: true,
    onEnter: (batch) => {
      const cards = batch.map((item) => item.querySelector(".service__card"));
      const dots = batch.map((item) => item.querySelector(".service__dots"));

      gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.15 });
      gsap.fromTo(cards,
        { clipPath: "inset(10% 5% 0% 5% round 24px)" },
        { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1.2, ease: "power3.out", stagger: 0.15 }
      );
      gsap.to(dots, { scaleX: 1, duration: 1.2, ease: "power2.out", delay: 0.4, stagger: 0.15 });
    }
  });
}

function drawSelections() {
  gsap.utils.toArray(".selection").forEach((box) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: box, start: "top 80%", once: true }
    });

    const frame = box.querySelector(".selection__frame");
    const fill = box.querySelector(".selection__fill");

    if (frame) {
      tl.from(frame, { clipPath: "inset(50% 50% 50% 50%)", duration: 0.7, ease: "power3.inOut" });
    }
    if (fill) {
      tl.from(fill, { scaleX: 0, duration: 0.8, ease: "power3.inOut" });
    }
    tl.from(box.querySelectorAll(".selection__handle"), {
      scale: 0,
      duration: 0.35,
      ease: "back.out(3)",
      stagger: 0.08
    }, "-=0.2");
  });
}

function animatePipeline() {
  const steps = gsap.utils.toArray(".pipeline__step");
  if (steps.length === 0) {
    return;
  }

  ScrollTrigger.create({
    trigger: ".pipeline-section",
    start: "top 60%",
    end: "bottom 40%",
    toggleClass: { targets: document.body, className: "is-dark" }
  });

  gsap.from(".panel", {
    y: 80,
    autoAlpha: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: { trigger: ".panel", start: "top 85%", once: true }
  });

  gsap.fromTo(".pipeline__progress", { scaleY: 0 }, {
    scaleY: 1,
    ease: "none",
    scrollTrigger: {
      trigger: ".pipeline__steps",
      start: "top 75%",
      end: "bottom 55%",
      scrub: 0.5
    }
  });

  gsap.from(steps, {
    x: -30,
    autoAlpha: 0,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.25,
    scrollTrigger: { trigger: ".pipeline__steps", start: "top 75%", once: true }
  });

  steps.forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: "top 60%",
      toggleClass: { targets: step, className: "is-active" }
    });
  });
}

function animateContact() {
  gsap.from(".contact__text > *", {
    y: 40,
    autoAlpha: 0,
    duration: 0.9,
    ease: "power3.out",
    stagger: 0.15,
    scrollTrigger: { trigger: ".contact__text", start: "top 85%", once: true }
  });

  gsap.from(".float", {
    scale: 0.8,
    autoAlpha: 0,
    duration: 0.8,
    ease: "back.out(1.6)",
    stagger: 0.12,
    scrollTrigger: { trigger: ".contact", start: "top 75%", once: true }
  });

  gsap.to(".float", {
    y: "random(-14, 14)",
    rotation: "random(-3, 3)",
    duration: "random(2.5, 4)",
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    repeatRefresh: true
  });
}

function addCardHover(context) {
  // Tweens created later inside event handlers are only reverted by matchMedia
  // if they are registered on the context as named methods.
  context.add("lift", (card, lifted) => {
    gsap.to(card, { y: lifted ? -6 : 0, duration: 0.4, ease: "power3.out", overwrite: "auto" });
  });
  context.add("glow", (card, x, y) => {
    gsap.to(card, { "--mx": x + "%", "--my": y + "%", duration: 0.6, ease: "power3.out", overwrite: "auto" });
  });

  const bindings = gsap.utils.toArray(".service__card").map((card) => {
    const onEnter = () => context.lift(card, true);
    const onLeave = () => {
      context.lift(card, false);
      context.glow(card, 78, 72);
    };
    const onMove = (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      context.glow(card, x.toFixed(1), y.toFixed(1));
    };
    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointerleave", onLeave);
    card.addEventListener("pointermove", onMove);
    return { card, onEnter, onLeave, onMove };
  });

  return () => {
    bindings.forEach(({ card, onEnter, onLeave, onMove }) => {
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onLeave);
      card.removeEventListener("pointermove", onMove);
    });
  };
}

function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const restoreHero = animateHero();
    revealServices();
    drawSelections();
    animatePipeline();
    animateContact();
    return restoreHero;
  });

  mm.add("(prefers-reduced-motion: no-preference) and (hover: hover)", (context) => {
    return addCardHover(context);
  });
}

function init() {
  setFooterYear();

  // If the CDN is blocked the page still works; it just doesn't animate.
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  initAnimations();
}

init();
