// Shared contact footer component
document.addEventListener('DOMContentLoaded', function() {
    const basePath = window.location.pathname.includes('/blog-posts/') ? '../' : '';

    const contactHTML = `
        <section id="contact" class="contact">
            <div class="container">
                <img src="${basePath}SectionTitles/contact_title.svg" alt="Let's Create Something Beautiful">
                <div class="contact-content-wrapper">
                    <form class="contact-form" method="POST" action="https://api.web3forms.com/submit">
                        <input type="hidden" name="access_key" value="df64a07f-a6fe-4c41-9009-09376db4cc52">
                        <input type="hidden" name="subject" value="New inquiry from Wispy Letters">
                        <input type="hidden" name="redirect" value="false">
                        <input type="checkbox" name="botcheck" style="display:none" tabindex="-1" autocomplete="off">
                        <div class="form-row">
                            <div class="form-field">
                                <label class="form-label" for="contact-name">Full Name*</label>
                                <input type="text" id="contact-name" name="name" placeholder="Please provide your full name" required>
                            </div>
                            <div class="form-field">
                                <label class="form-label" for="contact-email">Email address*</label>
                                <input type="email" id="contact-email" name="email" placeholder="Please provide your email address" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-field">
                                <label class="form-label" for="contact-phone">Phone Number</label>
                                <input type="tel" id="contact-phone" name="phone" placeholder="(XXX) XXX-XXXX" maxlength="14">
                            </div>
                            <div class="form-field">
                                <label class="form-label" for="contact-service">What service are you interested in?*</label>
                                <select id="contact-service" name="service" required>
                                    <option value="">Select a Service</option>
                                    <option value="event-calligraphy">Live event calligraphy / engraving</option>
                                    <option value="custom-commission">Custom commissions / gifting</option>
                                    <option value="workshops">Workshops</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-field">
                                <label class="form-label">How did you hear about Wispy Letters?*</label>
                                <select class="referral-select" name="referral" required>
                                    <option value="">Select an option</option>
                                    <option value="search-engine">Google / search engine</option>
                                    <option value="referral">Word of mouth / referral</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="other">Other</option>
                                </select>
                                <input type="text" class="referral-other" name="referral_other" placeholder="Please specify" style="display:none; margin-top: 10px;">
                            </div>
                            <div class="form-field">
                                <label class="form-label">When is your event / when do you need your items?*</label>
                                <input type="date" class="date-picker" name="event_date" required>
                            </div>
                        </div>
                        <div class="form-field">
                            <label class="form-label" for="contact-message">Tell me about your project*</label>
                            <textarea id="contact-message" name="message" placeholder="Please include as many details as possible so I can get back to you with an accurate quote and timeline" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="submit-button">Send Message</button>
                    </form>
                </div>
            </div>
            <footer>
                <div class="container">
                    <p>&copy; 2026 Wispy Letters. All rights reserved.</p>
                    <div class="social-links">
                        <a href="https://www.instagram.com/wispyletters/" target="_blank">Instagram</a>
                        <a href="https://www.etsy.com/shop/wispyletters" target="_blank">Etsy</a>
                    </div>
                </div>
            </footer>
        </section>
    `;

    const placeholder = document.querySelector('#contact-footer');
    if (placeholder) {
        placeholder.outerHTML = contactHTML;

        // Show/hide write-in field when "Other" is selected for referral
        const referralSelect = document.querySelector('.referral-select');
        const referralOther = document.querySelector('.referral-other');
        if (referralSelect && referralOther) {
            referralSelect.addEventListener('change', function() {
                referralOther.style.display = this.value === 'other' ? 'block' : 'none';
            });
        }

        // Phone number auto-formatting
        const phoneInput = document.getElementById('contact-phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                const digits = this.value.replace(/\D/g, '').slice(0, 10);
                let formatted = '';
                if (digits.length > 0) formatted = '(' + digits.slice(0, 3);
                if (digits.length >= 4) formatted += ') ' + digits.slice(3, 6);
                if (digits.length >= 7) formatted += '-' + digits.slice(6, 10);
                this.value = formatted;
            });
        }

        // Toast helper
        function showToast(message) {
            let toast = document.querySelector('.toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.className = 'toast';
                document.body.appendChild(toast);
            }
            toast.textContent = message;
            toast.classList.add('visible');
            clearTimeout(toast._dismissTimer);
            toast._dismissTimer = setTimeout(() => toast.classList.remove('visible'), 4000);
        }

        // Web3Forms submission
        const form = document.querySelector('.contact-form');
        if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                const submitBtn = form.querySelector('.submit-button');
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                try {
                    const response = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        body: new FormData(form)
                    });
                    const data = await response.json();

                    if (data.success) {
                        form.reset();
                        showToast('Message sent! I\'ll be in touch soon.');
                    } else {
                        throw new Error(data.message || 'Submission failed');
                    }
                } catch (error) {
                    showToast('Something went wrong. Please try again.');
                } finally {
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                }
            });
        }

        // Contact section background texture observer
        const contactEl = document.querySelector('#contact');
        if (contactEl) {
            const isMobile = window.innerWidth <= 768;
            const textureObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    document.body.classList.toggle('contact-visible', entry.isIntersecting);
                });
            }, { threshold: isMobile ? 0.1 : 0.5 });
            textureObserver.observe(contactEl);
        }
    }
});
