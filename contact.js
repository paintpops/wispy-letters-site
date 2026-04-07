// Shared contact footer component
document.addEventListener('DOMContentLoaded', function() {
    const basePath = window.location.pathname.includes('/blog-posts/') ? '../' : '';

    const contactHTML = `
        <section id="contact" class="contact">
            <div class="container">
                <img src="${basePath}SectionTitles/contact_title.svg" alt="Let's Create Something Beautiful">
                <div class="contact-content-wrapper">
                    <form class="contact-form">
                        <div class="form-row">
                            <div class="form-field">
                                <label class="form-label" for="contact-name">Full Name*</label>
                                <input type="text" id="contact-name" placeholder="Please provide your full name" required>
                            </div>
                            <div class="form-field">
                                <label class="form-label" for="contact-email">Email address*</label>
                                <input type="email" id="contact-email" placeholder="Please provide your email address" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-field">
                                <label class="form-label" for="contact-phone">Phone Number</label>
                                <input type="tel" id="contact-phone" placeholder="(XXX) XXX-XXXX" maxlength="14">
                            </div>
                            <div class="form-field">
                                <label class="form-label" for="contact-service">What service are you interested in?*</label>
                                <select id="contact-service" required>
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
                                <select class="referral-select" required>
                                    <option value="">Select an option</option>
                                    <option value="search-engine">Google / search engine</option>
                                    <option value="referral">Word of mouth / referral</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="other">Other</option>
                                </select>
                                <input type="text" class="referral-other" placeholder="Please specify" style="display:none; margin-top: 10px;">
                            </div>
                            <div class="form-field">
                                <label class="form-label">When is your event / when do you need your items?*</label>
                                <input type="date" class="date-picker" required>
                            </div>
                        </div>
                        <div class="form-field">
                                <label class="form-label" for="contact-message">Tell me about your project*</label>
                                <textarea id="contact-message" placeholder="Please include as many details as possible so I can get back to you with an accurate quote and timeline" rows="5" required></textarea>
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

        // Show/hide write-in field when "Other" is selected
        const referralSelect = document.querySelector('.referral-select');
        const referralOther = document.querySelector('.referral-other');
        if (referralSelect && referralOther) {
            referralSelect.addEventListener('change', function() {
                referralOther.style.display = this.value === 'other' ? 'block' : 'none';
            });
        }

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
