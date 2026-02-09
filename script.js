const year = document.getElementById("year");
if (year) {
  year.textContent = String(new Date().getFullYear());
}

const revealTargets = document.querySelectorAll(".section, .hero, .footer");
const navToggle = document.querySelector(".nav-toggle");
const navBar = document.querySelector(".nav");
const navLinks = document.querySelector(".nav-links");

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

if (navToggle && navBar) {
  navToggle.addEventListener("click", () => {
    const isOpen = navBar.classList.toggle("nav--open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

if (navLinks && navBar && navToggle) {
  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navBar.classList.remove("nav--open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const contactForm = document.getElementById("contact-form");
const formNote = document.getElementById("form-note");
const thanksOverlay = document.getElementById("thanks-overlay");
const formErrors = document.getElementById("form-errors");

const clearFieldError = (field) => {
  field.classList.remove("has-error");
  const label = field.closest("label");
  if (label) {
    label.classList.remove("has-error");
  }
};

const markFieldError = (field) => {
  field.classList.add("has-error");
  const label = field.closest("label");
  if (label) {
    label.classList.add("has-error");
  }
};

const validateForm = (form) => {
  const fields = Array.from(form.querySelectorAll("input, select, textarea"));
  const errors = [];

  fields.forEach((field) => clearFieldError(field));

  fields.forEach((field) => {
    if (field.disabled) {
      return;
    }

    if (!field.checkValidity()) {
      const labelText = field.closest("label")?.childNodes[0]?.textContent?.trim();
      if (field.validity.valueMissing) {
        errors.push(`${labelText || "This field"} is required.`);
      } else if (field.validity.typeMismatch) {
        errors.push("Email must be a valid address.");
      } else {
        errors.push("Please check the highlighted fields.");
      }
      markFieldError(field);
    }
  });

  return { isValid: errors.length === 0, errors };
};

if (contactForm) {
  const fields = contactForm.querySelectorAll("input, select, textarea");
  fields.forEach((field) => {
    field.addEventListener("input", () => clearFieldError(field));
    field.addEventListener("change", () => clearFieldError(field));
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (formErrors) {
      formErrors.textContent = "";
    }

    const { isValid, errors } = validateForm(contactForm);
    if (!isValid) {
      if (formErrors) {
        formErrors.textContent = errors[0];
      }

      const firstInvalid = contactForm.querySelector(".has-error");
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalid.focus({ preventScroll: true });
      }
      return;
    }

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
