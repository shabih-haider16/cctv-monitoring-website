document.addEventListener("DOMContentLoaded", () => {
  // Sticky Header Logic
  const header = document.querySelector("header");
  const scrollThreshold = 20;

  function updateHeaderState() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateHeaderState);
  updateHeaderState(); // Check initial scroll state

  // Mobile Menu Toggling
  const menuBtn = document.querySelector(".menu-btn");
  const navMenu = document.querySelector(".nav-menu");

  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active");

      // Animate hamburger lines
      const spans = menuBtn.querySelectorAll("span");
      if (navMenu.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
        spans[1].style.opacity = "0";
        spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
      } else {
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      }
    });

    // Close menu when links are clicked
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        const spans = menuBtn.querySelectorAll("span");
        spans[0].style.transform = "none";
        spans[1].style.opacity = "1";
        spans[2].style.transform = "none";
      });
    });
  }

  // Back to top button visibility and scroll-to-top behavior
  const backToTopButton = document.getElementById("backToTop");
  if (backToTopButton) {
    const toggleBackToTop = () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    };

    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Reliable mailto handling for email links
  const mailtoLinks = document.querySelectorAll(".mailto-link");
  mailtoLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("mailto:")) return;

      e.preventDefault();
      try {
        window.location.href = href;
      } catch (err) {
        window.open(href, "_self");
      }
    });
  });

  // LIVE FORMSUBMIT CONNECTION (Replaced the placeholder)
  const contactForm = document.querySelector(".quote-form-element");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Stop standard page reload

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Update UI status to sending
      submitBtn.innerHTML = "Sending Quote Request...";
      submitBtn.disabled = true;

      // Grab the layout data from the HTML form elements dynamically
      const formData = new FormData(contactForm);

      // Post asynchronous fetch directly to FormSubmit endpoint background channel
      fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            // Update button style to green success checkmark status
            submitBtn.innerHTML = "✓ Quote Request Sent Successfully!";
            submitBtn.style.backgroundColor = "#10b981";
            contactForm.reset(); // Clears all filled form fields safely

            // Revert back button appearance state after 4 seconds
            setTimeout(() => {
              submitBtn.innerHTML = originalText;
              submitBtn.style.backgroundColor = "";
              submitBtn.disabled = false;
            }, 4000);
          } else {
            throw new Error("Form submission failed.");
          }
        })
        .catch((error) => {
          // Fallback UI error handler state notice
          submitBtn.innerHTML = "Error! Try Again.";
          submitBtn.style.backgroundColor = "#ef4444";
          submitBtn.disabled = false;

          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.backgroundColor = "";
          }, 3000);
        });
    });
  }
});
