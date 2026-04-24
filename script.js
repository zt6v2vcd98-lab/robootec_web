const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isExpanded));
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    });
  });
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealElements.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("in-view"));
}

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = contactForm.querySelector(".form-status");
    const endpoint = contactForm.dataset.formEndpoint.trim();

    if (!contactForm.reportValidity()) {
      if (status) {
        status.textContent = "Prosím doplňte všechna povinná pole.";
      }
      return;
    }

    if (!endpoint) {
      if (status) {
        status.textContent = "Formulář je připravený, ale zatím bez odesílací služby. Prozatím použijte email radek@robootec.ai.";
      }
      return;
    }

    const formData = new FormData(contactForm);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      contactForm.reset();
      if (status) {
        status.textContent = "Děkujeme, zpráva byla odeslána.";
      }
    } catch (error) {
      if (status) {
        status.textContent = "Odeslání se nepodařilo. Zkuste to prosím znovu nebo napište na radek@robootec.ai.";
      }
    }
  });
}
