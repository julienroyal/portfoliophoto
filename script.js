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
const documentaryEmbeds = [...document.querySelectorAll("[data-documentary-embed]")];

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

documentaryEmbeds.forEach((embed) => {
  embed.src = getYouTubeEmbedUrl(embed.dataset.videoId);
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
  section.querySelector(".photo, .video-thumbnail img, iframe")
);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const revealSectionColor = (section) => {
  section.classList.add("is-color-revealed");

  if (prefersReducedMotion.matches) return;

  section.classList.add("is-color-revealing");
  window.setTimeout(() => section.classList.remove("is-color-revealing"), 15200);
};

const colorRevealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const section = entry.target.closest(".work-section");
      revealSectionColor(section);
      colorRevealObserver.unobserve(entry.target);
      entry.target.remove();
    });
  },
  {
    threshold: 0,
    rootMargin: "-45% 0px -45% 0px"
  }
);

colorRevealSections.forEach((section) => {
  const trigger = document.createElement("span");
  trigger.className = "color-reveal-trigger";
  trigger.setAttribute("aria-hidden", "true");
  section.append(trigger);
  colorRevealObserver.observe(trigger);
});

const galleryData = {
  portraits: {
    title: "Portraits",
    images: [
      ["./assets/images/portraits-1.jpg?v=34974df", "Image temporaire de la série Portraits"],
      ["./assets/images/portraits-2.jpg?v=34974df", "Image temporaire de la série Portraits"],
      ["./assets/images/portraits-3.jpg?v=34974df", "Image temporaire de la série Portraits"],
      ["./assets/images/portraits-4.jpg", "Image temporaire de la série Portraits"],
      ["./assets/images/portraits-5.jpg", "Image temporaire de la série Portraits"]
    ]
  },
  mouvements: {
    title: "Mouvements sociaux",
    images: [
      ["./assets/images/mouvements-2.jpg", "Image temporaire de la série Mouvements sociaux"],
      ["./assets/images/mouvements-3.jpg", "Image temporaire de la série Mouvements sociaux"],
      ["./assets/images/mouvements-4.jpg", "Image temporaire de la série Mouvements sociaux"],
      ["./assets/images/mouvements-5.jpg", "Image temporaire de la série Mouvements sociaux"],
      ["./assets/images/mouvements-1.jpg", "Image temporaire de la série Mouvements sociaux"]
    ]
  },
  evenements: {
    title: "Événement",
    images: [
      ["./assets/images/mariages-3.jpg", "Image temporaire de la série Événement"],
      ["./assets/images/mariages-1.jpg", "Image temporaire de la série Événement"],
      ["./assets/images/mariages-5.jpg", "Image temporaire de la série Événement"],
      ["./assets/images/mariages-4.jpg", "Image temporaire de la série Événement"],
      ["./assets/images/mariages-2.jpg", "Image temporaire de la série Événement"]
    ]
  },
  reportages: {
    title: "Reportages",
    images: [
      ["./assets/images/documentaires-1.jpg", "Image temporaire de la série Reportages"],
      ["./assets/images/documentaires-2.jpg", "Image temporaire de la série Reportages"],
      ["./assets/images/documentaires-4.jpg", "Image temporaire de la série Reportages"],
      ["./assets/images/documentaires-5.jpg", "Image temporaire de la série Reportages"],
      ["./assets/images/mouvements-1.jpg", "Image temporaire de la série Reportages"]
    ]
  }
};

const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
let activeGallery = "portraits";
let activeIndex = 0;

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
  button.addEventListener("click", () => openGallery(button.dataset.openGallery));
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
