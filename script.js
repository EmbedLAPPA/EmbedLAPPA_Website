const year = document.getElementById("year");
if (year) {
  year.textContent = String(new Date().getFullYear());
}

const revealTargets = document.querySelectorAll(".section, .hero, .footer");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

const contactForm = document.getElementById("contact-form");
const formNote = document.getElementById("form-note");
const thanksOverlay = document.getElementById("thanks-overlay");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (formNote) {
      formNote.textContent = "Sending your inquiry...";
    }

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      contactForm.reset();

      if (formNote) {
        formNote.textContent = "Thanks! We received your inquiry.";
      }

      if (thanksOverlay) {
        document.body.dataset.thanks = "true";
        thanksOverlay.setAttribute("aria-hidden", "false");
      }

      const redirectTarget =
        contactForm.dataset.redirect || "https://embedlappa.github.io/EmbedLAPPA_Website/";

      setTimeout(() => {
        window.location.href = redirectTarget;
      }, 5000);
    } catch (error) {
      if (formNote) {
        formNote.textContent =
          "Sorry, something went wrong. Please try again in a minute.";
      }
    }
  });
}
