// Shared navigation component
document.addEventListener('DOMContentLoaded', function() {
    const navHTML = `
        <nav>
            <ul class="nav-links nav-links-left">
                <li><a href="instudio.html">In-studio</a></li>
                <li><a href="onsite.html">On-site</a></li>
                <li><a href="workshops.html">Workshops</a></li>
            </ul>
            <div class="logo"><a href="index.html"><img src="GlobalAssets/wispyletters_logo.svg" alt="Wispy Letters"></a></div>
            <ul class="nav-links nav-links-right">
                <li><a href="portfolio.html">Portfolio</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="blog.html">Blog</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    `;

    const header = document.querySelector('header');
    if (header) {
        header.innerHTML = navHTML;
    }
});
