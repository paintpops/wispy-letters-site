// Shared navigation component
document.addEventListener('DOMContentLoaded', function() {
    const navHTML = `
        <nav>
            <ul class="nav-links nav-links-left">
                <li><a href="onsite.html">On-site</a></li>
                <li><a href="instudio.html">In-studio</a></li>
                <li><a href="workshops.html">Workshops</a></li>
            </ul>
            <div class="logo"><a href="index.html"><img src="GlobalAssets/wispyletters_logo.svg" alt="Wispy Letters"></a></div>
            <ul class="nav-links nav-links-right">
                <li><a href="portfolio.html">Portfolio</a></li>
                <li><a href="about.html">About</a></li>
                <!--<li><a href="blog.html">Blog</a></li>-->
                <li><a href="#contact">Contact</a></li>
            </ul>
            <button class="hamburger-btn" aria-label="Toggle navigation" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
        <div class="nav-drawer" aria-hidden="true">
            <ul class="nav-drawer-links">
                <li><a href="onsite.html">On-site</a></li>
                <li><a href="instudio.html">In-studio</a></li>
                <li><a href="workshops.html">Workshops</a></li>
                <li><a href="portfolio.html">Portfolio</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    `;

    const header = document.querySelector('header');
    if (header) {
        header.innerHTML = navHTML;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        header.querySelectorAll('.nav-links a').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });

        // Hamburger toggle
        const hamburgerBtn = header.querySelector('.hamburger-btn');
        const navDrawer = header.querySelector('.nav-drawer');

        if (hamburgerBtn && navDrawer) {
            hamburgerBtn.addEventListener('click', function() {
                const isOpen = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', String(!isOpen));
                navDrawer.setAttribute('aria-hidden', String(isOpen));
                document.body.classList.toggle('nav-open', !isOpen);
            });

            // Close drawer when a link is clicked
            navDrawer.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburgerBtn.setAttribute('aria-expanded', 'false');
                    navDrawer.setAttribute('aria-hidden', 'true');
                    document.body.classList.remove('nav-open');
                });
            });
        }
    }
});
