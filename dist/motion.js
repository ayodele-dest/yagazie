(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  const {gsap, ScrollTrigger} = window;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  let introPlayed = false;
  media.add('(prefers-reduced-motion: no-preference)', context => {
    const cleanup = [];
    const listen = (element, name, callback) => {
      const safeCallback = context.add(null, callback);
      element.addEventListener(name, safeCallback);
      cleanup.push(() => element.removeEventListener(name, safeCallback));
    };
    const defaults = {duration: .8, ease: 'power3.out'};
    if (!introPlayed && window.scrollY < 80 && !location.hash) {
      introPlayed = true;
      gsap.timeline({defaults})
        .from('.header .wordmark, .header nav a', {y: -12, opacity: 0, stagger: .055, duration: .55})
        .from('.hero-line-inner', {yPercent: 108, stagger: .12, duration: 1.05}, .18)
        .from('.portrait', {clipPath: 'inset(0 0 100% 0)', duration: 1.15, ease: 'power3.inOut', clearProps: 'clipPath'}, .15)
        .from('.portrait img', {scale: 1.075, duration: 1.4, clearProps: 'transform'}, .15)
        .from('.asterisk', {scale: .6, rotation: -80, opacity: 0, duration: .9}, .52)
        .from('.hero-bottom > *', {y: 18, opacity: 0, stagger: .1}, .64)
        .from('.portrait-note', {y: 16, opacity: 0, stagger: .1}, .9);
    }

    // Start each entrance at its own viewport boundary; native scrolling stays intact.
    const reveal = (targets, trigger, stagger = .08) => {
      const elements = gsap.utils.toArray(targets);
      if (!elements.length) return;
      return gsap.from(elements, {...defaults, y: 30, opacity: 0, stagger,
        scrollTrigger: {trigger, start: 'top 92%', once: true},
        onComplete: () => gsap.set(elements, {clearProps: 'transform,opacity'})});
    };

    document.querySelectorAll('main > section:not(.hero)').forEach(section => {
      const heading = section.querySelector('h2');
      if (heading) reveal(heading, heading, 0);
    });
    const cardReveals = [...document.querySelectorAll('.work-grid .project')].map(card => reveal(card, card, 0));
    document.querySelectorAll('.method-steps > div, .note-grid > article, .events-grid > article').forEach(item => reveal(item, item, 0));
    reveal('.about-photo', '.about-photo', .12);
    reveal('.contact-links > *', '.contact-links', .07);

    gsap.fromTo('.reading-progress', {scaleX: 0}, {scaleX: 1, ease: 'none',
      scrollTrigger: {trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: .15}});

    document.querySelectorAll('[data-filter]').forEach(button => {
      listen(button, 'click', () => {
        cardReveals.forEach(tween => {tween?.scrollTrigger?.kill(); tween?.kill();});
        const cards = gsap.utils.toArray('.work-grid .project');
        gsap.killTweensOf(cards);
        gsap.set(cards, {clearProps: 'transform,opacity'});
        gsap.fromTo(cards.filter(card => !card.hidden), {y: 14, opacity: .3},
          {y: 0, opacity: 1, duration: .4, stagger: .045, ease: 'power2.out', overwrite: true,
            onComplete: () => gsap.set(cards, {clearProps: 'transform,opacity'})});
        ScrollTrigger.refresh();
      });
    });

    const dialog = document.querySelector('#case-dialog');
    document.querySelectorAll('[data-case]').forEach(button => {
      listen(button, 'click', () => {
        gsap.fromTo(dialog, {y: 24, opacity: 0, scale: .985},
          {y: 0, opacity: 1, scale: 1, duration: .36, ease: 'power3.out', overwrite: true, clearProps: 'transform,opacity'});
      });
    });
    listen(document.querySelector('#next-case'), 'click', () => {
      gsap.fromTo('#case-body', {y: 12, opacity: .25}, {y: 0, opacity: 1, duration: .32, overwrite: true, clearProps: 'transform,opacity'});
    });
    listen(dialog, 'close', () => {
      gsap.killTweensOf([dialog, document.querySelector('#case-body')]);
      gsap.set([dialog, document.querySelector('#case-body')], {clearProps: 'transform,opacity'});
    });

    // Hover movement is restricted to precise pointers, keeping touch targets stable.
    const hoverMedia = gsap.matchMedia();
    hoverMedia.add('(hover: hover) and (pointer: fine)', hoverContext => {
      const handlers = [];
      document.querySelectorAll('.project-open').forEach(card => {
        const art = card.querySelector('.sleep-word, .therapy-title, .stitch-title, .aiesec-title, .research-title, .tony-title');
        if (!art) return;
        const enter = hoverContext.add(null, () => gsap.to(art, {y: -7, duration: .4, ease: 'power2.out', overwrite: true}));
        const leave = hoverContext.add(null, () => gsap.to(art, {y: 0, duration: .45, ease: 'power2.out', overwrite: true}));
        card.addEventListener('pointerenter', enter);
        card.addEventListener('pointerleave', leave);
        handlers.push(() => {card.removeEventListener('pointerenter', enter); card.removeEventListener('pointerleave', leave);});
      });
      return () => handlers.forEach(remove => remove());
    });

    let active = true;
    document.fonts.ready.then(() => {if (active) ScrollTrigger.refresh();});
    document.querySelectorAll('img').forEach(img => {
      if (!img.complete) listen(img, 'load', () => ScrollTrigger.refresh());
    });
    listen(window, 'load', () => ScrollTrigger.refresh());
    listen(document, 'focusin', event => {
      // Keyboard users never land on content waiting for a scroll entrance.
      const card = event.target.closest('.project');
      if (card) {gsap.killTweensOf(card); gsap.set(card, {clearProps: 'opacity,transform'});}
    });
    return () => {active = false; cleanup.forEach(remove => remove()); hoverMedia.revert();};
  });
})();
