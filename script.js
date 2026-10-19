
'use strict';

// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');

    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute(
      'aria-label',
      isOpen ? 'Close menu' : 'Open menu'
    );
  });

  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
    });
  });
}

// Automatic copyright year
const yearElement = document.getElementById('year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Contact form email integration - Formspree
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async event => {
    event.preventDefault();

    const status = contactForm.querySelector('.form-status');
    const submitButton = contactForm.querySelector(
      'button[type="submit"]'
    );

    if (!contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);

    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const topic = String(formData.get('topic') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !email || !topic || !message) {
      status.textContent = 'Please complete all required fields.';
      return;
    }

    const originalButtonHTML = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    status.textContent = 'Sending your enquiry. Please wait.';

    // Formspree fields
    formData.set('name', name);
    formData.set('email', email);
    formData.set('topic', topic);
    formData.set('message', message);
    formData.set('_replyto', email);
    formData.set('_subject', `New RL_Humate Enquiry: ${topic}`);

    try {
      const response = await fetch(
        'https://formspree.io/f/xgaobypk',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        }
      );

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          'The email service returned an invalid response.'
        );
      }

      if (!response.ok) {
        const errorMessage = Array.isArray(result.errors)
          ? result.errors.map(error => error.message).join(' ')
          : 'The email service could not accept your enquiry.';

        throw new Error(errorMessage);
      }

      status.textContent =
        'Thank you! Your enquiry has been submitted.';

      contactForm.reset();

    } catch (error) {
      console.error('Formspree submission error:', error);

      status.textContent =
        'We could not confirm your submission. Please check your internet connection and try again, or email RL_Humate@hotmail.com directly.';

    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonHTML;
    }
  });
}
