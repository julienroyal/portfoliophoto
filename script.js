document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const hero = document.querySelector(".hero");

const heroSlideshow = document.querySelector("[data-hero-slideshow]");
const heroImages = heroSlideshow ? [...heroSlideshow.querySelectorAll(".hero-image")] : [];
const heroInterval = 3000;
let activeHeroIndex = 0;
let heroTimer;

const showHeroImage = (index) => {
  heroImages.forEach((image, imageIndex) => {
    image.classList.toggle("is-active", imageIndex === index);
  });
  activeHeroIndex = index;
};

const scheduleNextHeroImage = () => {
  window.clearTimeout(heroTimer);
  heroTimer = window.setTimeout(() => {
    showHeroImage((activeHeroIndex + 1) % heroImages.length);
    scheduleNextHeroImage();
  }, heroInterval);
};

if (heroImages.length > 1) {
  showHeroImage(0);
  scheduleNextHeroImage();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearTimeout(heroTimer);
      return;
    }

    scheduleNextHeroImage();
  });
}

const videoPlayer = document.querySelector("[data-video-player]");
const videoChoices = [...document.querySelectorAll("[data-video-choice]")];

const getYouTubeEmbedUrl = (videoId, autoplay = false) => {
  const parameters = new URLSearchParams({
    rel: "0",
    playsinline: "1",
    widget_referrer: window.location.href
  });

  if (window.location.origin !== "null") {
    parameters.set("origin", window.location.origin);
  }

  if (autoplay) {
    parameters.set("autoplay", "1");
  }

  return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?${parameters}`;
};

if (videoPlayer && videoChoices.length > 0) {
  videoPlayer.src = getYouTubeEmbedUrl(videoChoices[0].dataset.videoId);
}

videoChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    if (choice.classList.contains("is-active")) return;

    videoChoices.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-pressed", "false");
    });

    choice.classList.add("is-active");
    choice.setAttribute("aria-pressed", "true");
    videoPlayer.title = choice.dataset.videoTitle;
    videoPlayer.src = getYouTubeEmbedUrl(choice.dataset.videoId, true);
  });
});

const headerObserver = new IntersectionObserver(
  ([entry]) => header.classList.toggle("is-scrolled", !entry.isIntersecting),
  { threshold: 0.92 }
);
headerObserver.observe(hero);

const closeMenu = () => {
  navigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "Menu";
  document.body.classList.remove("menu-open");
};

menuToggle.addEventListener("click", () => {
  const willOpen = !navigation.classList.contains("is-open");
  navigation.classList.toggle("is-open", willOpen);
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  menuToggle.textContent = willOpen ? "Fermer" : "Menu";
  document.body.classList.toggle("menu-open", willOpen);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("is-open")) {
    closeMenu();
    menuToggle.focus();
  }
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const colorRevealSections = [...document.querySelectorAll(".work-section")].filter((section) =>
  section.querySelector(".photo, .video-thumbnail img, iframe, .documentary-poster-media img")
);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const revealSectionColor = (section) => {
  section.classList.add("is-color-revealed");

  if (prefersReducedMotion.matches) return;

  section.classList.add("is-color-revealing");
  window.setTimeout(() => section.classList.remove("is-color-revealing"), 1700);
};

const handleColorRevealEntries = (entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const section = entry.target.closest(".work-section");
    revealSectionColor(section);
    observer.unobserve(entry.target);
    entry.target.remove();
  });
};

const colorRevealObserver = new IntersectionObserver(
  handleColorRevealEntries,
  {
    threshold: 0,
    rootMargin: "-30% 0px -30% 0px"
  }
);

const introColorRevealObserver = new IntersectionObserver(
  handleColorRevealEntries,
  {
    threshold: 0,
    rootMargin: "0px 0px -90% 0px"
  }
);

colorRevealSections.forEach((section) => {
  const trigger = document.createElement("span");
  trigger.className = "color-reveal-trigger";
  trigger.setAttribute("aria-hidden", "true");
  const firstMedia = section.querySelector(".photo, .video-player-frame, .documentary-poster-media");
  let triggerHost = firstMedia;

  if (section.id === "videos") {
    triggerHost = section.querySelector(".video-heading p");
  } else if (section.id === "portraits") {
    triggerHost = section.querySelector(".portrait-heading p");
  } else if (section.id === "documentaires") {
    triggerHost = section.querySelector(".documentary-heading p");
  }

  (triggerHost ?? section).append(trigger);
  const usesIntroColorTrigger = section.id === "portraits" || section.id === "documentaires";
  const sectionObserver = usesIntroColorTrigger
    ? introColorRevealObserver
    : colorRevealObserver;
  sectionObserver.observe(trigger);
});

const documentaryCinema = document.querySelector("[data-documentary-cinema]");

if (documentaryCinema) {
  const documentaryFilms = [...documentaryCinema.querySelectorAll("[data-documentary-film]")];
  const documentaryDesktop = window.matchMedia("(min-width: 768px)");

  const activateDocumentary = (film) => {
    if (!documentaryDesktop.matches) return;

    documentaryFilms.forEach((item) => {
      const isActive = item === film;
      const poster = item.querySelector(".documentary-poster");
      const trigger = item.querySelector("[data-documentary-trigger]");
      item.classList.toggle("is-active", isActive);
      trigger.setAttribute("aria-pressed", String(isActive));
      poster.toggleAttribute("aria-hidden", !isActive);
      poster.tabIndex = isActive ? 0 : -1;
    });
  };

  const syncDocumentaryMode = () => {
    if (documentaryDesktop.matches) {
      documentaryCinema.removeAttribute("tabindex");
    } else {
      documentaryCinema.tabIndex = 0;
    }

    documentaryFilms.forEach((film, index) => {
      const trigger = film.querySelector("[data-documentary-trigger]");
      const poster = film.querySelector(".documentary-poster");

      if (documentaryDesktop.matches) {
        trigger.tabIndex = 0;
        trigger.setAttribute("role", "button");
        trigger.setAttribute("aria-controls", poster.id);
        const isActive = film.classList.contains("is-active") || index === 0;
        film.classList.toggle("is-active", isActive && !documentaryFilms.some((item, itemIndex) => itemIndex < index && item.classList.contains("is-active")));
        trigger.setAttribute("aria-pressed", String(film.classList.contains("is-active")));
        poster.toggleAttribute("aria-hidden", !film.classList.contains("is-active"));
        poster.tabIndex = film.classList.contains("is-active") ? 0 : -1;
      } else {
        trigger.removeAttribute("tabindex");
        trigger.removeAttribute("role");
        trigger.removeAttribute("aria-controls");
        trigger.removeAttribute("aria-pressed");
        film.classList.remove("is-active");
        poster.removeAttribute("aria-hidden");
        poster.removeAttribute("tabindex");
      }
    });

    if (documentaryDesktop.matches && !documentaryFilms.some((film) => film.classList.contains("is-active"))) {
      activateDocumentary(documentaryFilms[0]);
    }
  };

  documentaryFilms.forEach((film) => {
    const trigger = film.querySelector("[data-documentary-trigger]");
    trigger.addEventListener("click", () => activateDocumentary(film));
    trigger.addEventListener("mouseenter", () => activateDocumentary(film));
    trigger.addEventListener("focusin", () => activateDocumentary(film));
    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      activateDocumentary(film);
      film.querySelector(".documentary-poster").focus();
    });
    film.querySelector(".documentary-poster").addEventListener("focusin", () => activateDocumentary(film));
  });

  documentaryDesktop.addEventListener("change", syncDocumentaryMode);
  syncDocumentaryMode();
}

const galleryData = {
  portraits: {
    title: "Portraits",
    images: [
      ["./assets/images/portraits/portrait-01.webp", "Marie-Pierre, octobre 2021"],
      ["./assets/images/portraits/portrait-02.webp", "Papa, Beloeil, mars 2026 — extrait d'un projet documentaire sur le vieillissement et l'Alzheimer"],
      ["./assets/images/portraits/portrait-03.webp", "Yolande, 2008"],
      ["./assets/images/portraits/portrait-04.webp", "Pierre Céré, candidat NPD dans la circonscription de Rosemont–Petite-Patrie, Montréal, juillet 2026"],
      ["./assets/images/portraits/portrait-05.webp", "Conseiller syndical, FNEEQ-CSN, printemps 2026"],
      ["./assets/images/portraits/portrait-06.webp", "Jérémy, printemps 2014 — extrait de l'exposition « Le lien vert, une série de portraits »"],
      ["./assets/images/portraits/dmorissette-16130.webp", "Caroline Quesnel, présidente de la FNEEQ-CSN, août 2023"],
      ["./assets/images/portraits/dmorissette-7038.webp", "Jessica Goldschleger, présidente de la FP-CSN, septembre 2024"]
    ]
  },
  photographie: {
    title: "Photographie",
    images: [
      ["./assets/images/hero/hero-04.webp", "Manifestation pour le climat, Montréal, 27 septembre 2019"],
      ["./assets/images/photographie/photographie-05.webp", "Erbil, Irak, automne 2010"],
      ["./assets/images/hero/hero-02.webp", "« Dans la rue pour le Québec », manifestation d'une alliance syndicale, Montréal, 25 novembre 2025"],
      ["./assets/images/hero/hero-01.webp", "Quelques jours après le séisme, Port-au-Prince, Haïti, 19 janvier 2010"],
      ["./assets/images/photographie/photographie-01.webp", "Petit-de-Grat, Nouvelle-Écosse, printemps 1998 — projet documentaire « Littoral, la pêche côtière au Canada »"],
      ["./assets/images/photographie/photographie-02.webp", "Grève des syndiqué-es d'entretien de la STM, Montréal, 11 septembre 2025"],
      ["./assets/images/photographie/photographie-03.webp", "Élection présidentielle post-taliban, province de Bamiyan, Afghanistan, été 2004"],
      ["./assets/images/photographie/photographie-04.webp", "Manifestation des syndiqué-es d'entrepôt d'Amazon, Laval, 21 septembre 2024"],
      ["./assets/images/photographie/photographie-06.webp", "Mont du Lac-des-Cygnes, parc national des Grands-Jardins, Québec, août 2025"],
      ["./assets/images/photographie/photographie-premier-confinement-jules.webp", "Jules, rue Lajeunesse, Montréal, 27 mars 2020 — extrait de l'exposition « Premier confinement »"],
      ["./assets/images/hero/hero-03.webp", "Route 138 sur la Côte-Nord, Québec, automne 2023"],
      ["./assets/images/hero/hero-05.webp", "Mali, printemps 2010"]
    ]
  },
  evenements: {
    title: "Événements",
    images: [
      ["./assets/images/evenements/dmorissette-1087.webp", "Mot de la présidente, Caroline Senneville, 67e congrès de la CSN, Montréal, mai 2023"],
      ["./assets/images/evenements/dmorissette-7882.webp", "Colloque sur la recherche qui soigne, avec la Fondation McPeak-Sirois, Brossard, octobre 2023"],
      ["./assets/images/evenements/dmorissette-22457.webp", "Assemblée générale annuelle d'Amnistie internationale, Montréal, mai 2024"],
      ["./assets/images/evenements/dmorissette-16072.webp", "« Pour un réseau vraiment public », Trois-Rivières, 23 novembre 2024"],
      ["./assets/images/evenements/dmorissette-16691.webp", "« Pour un réseau vraiment public », Trois-Rivières, 23 novembre 2024"],
      ["./assets/images/evenements/dmorissette-15725.webp", "Caroline Senneville, présidente de la CSN, en conférence de presse, Montréal, août 2023"],
      ["./assets/images/evenements/dmorissette-1659.webp", "67e congrès de la CSN, Montréal, mai 2023"]
    ]
  }
};

const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const seriesDialog = document.querySelector("[data-series-dialog]");
const seriesTitle = document.querySelector("[data-series-title]");
const seriesCount = document.querySelector("[data-series-count]");
const seriesGrid = document.querySelector("[data-series-grid]");
let activeGallery = "portraits";
let activeIndex = 0;
let returnToSeries = false;

const renderLightbox = () => {
  const gallery = galleryData[activeGallery];
  const [source, alt] = gallery.images[activeIndex];
  lightboxTitle.textContent = gallery.title;
  lightboxImage.src = source;
  lightboxImage.alt = alt;
  lightboxCaption.textContent = alt;
};

const openGallery = (gallery, index = 0) => {
  activeGallery = gallery;
  activeIndex = index;
  renderLightbox();
  lightbox.showModal();
};

const renderSeriesGrid = (galleryKey) => {
  const gallery = galleryData[galleryKey];
  seriesTitle.textContent = gallery.title;
  seriesCount.textContent = `${gallery.images.length} images`;
  seriesGrid.dataset.gallery = galleryKey;
  seriesGrid.replaceChildren();

  gallery.images.forEach(([source, alt], index) => {
    const button = document.createElement("button");
    const image = document.createElement("img");

    button.type = "button";
    button.className = "series-grid-item";
    button.setAttribute("aria-label", `Agrandir : ${alt}`);
    image.src = source;
    image.alt = alt;
    image.loading = "lazy";

    button.append(image);
    button.addEventListener("click", () => {
      returnToSeries = true;
      seriesDialog.close();
      openGallery(galleryKey, index);
    });
    seriesGrid.append(button);
  });
};

const openSeriesGrid = (galleryKey) => {
  activeGallery = galleryKey;
  renderSeriesGrid(galleryKey);
  seriesDialog.showModal();
};

const moveGallery = (direction) => {
  const imageCount = galleryData[activeGallery].images.length;
  activeIndex = (activeIndex + direction + imageCount) % imageCount;
  renderLightbox();
};

document.querySelectorAll("[data-gallery]").forEach((button) => {
  button.addEventListener("click", () => {
    openGallery(button.dataset.gallery, Number(button.dataset.index));
  });
});

document.querySelectorAll("[data-open-gallery]").forEach((button) => {
  button.addEventListener("click", () => openSeriesGrid(button.dataset.openGallery));
});

document.querySelector("[data-series-close]").addEventListener("click", () => seriesDialog.close());

seriesDialog.addEventListener("click", (event) => {
  if (event.target === seriesDialog) {
    seriesDialog.close();
  }
});

document.querySelector("[data-lightbox-close]").addEventListener("click", () => lightbox.close());
document.querySelector("[data-lightbox-prev]").addEventListener("click", () => moveGallery(-1));
document.querySelector("[data-lightbox-next]").addEventListener("click", () => moveGallery(1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") moveGallery(-1);
  if (event.key === "ArrowRight") moveGallery(1);
});

lightbox.addEventListener("close", () => {
  if (!returnToSeries) return;

  returnToSeries = false;
  renderSeriesGrid(activeGallery);
  seriesDialog.showModal();
});
