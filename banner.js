// Shared announcement banner component
// Dismissed state persists for the current browser session via sessionStorage
document.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('bannerDismissed')) return;

    const bannerEl = document.createElement('div');
    bannerEl.id = 'announcement-banner';
    bannerEl.innerHTML = `
        <p>Available for bookings November 2026 and onwards. <a href="#contact">Contact me.</a></p>
        <button id="banner-dismiss" aria-label="Dismiss announcement">&times;</button>
    `;
    document.body.insertBefore(bannerEl, document.body.firstChild);

    function updateBannerHeight() {
        document.documentElement.style.setProperty('--banner-height', bannerEl.offsetHeight + 'px');
    }

    updateBannerHeight();
    window.addEventListener('resize', updateBannerHeight);

    document.getElementById('banner-dismiss').addEventListener('click', function() {
        window.removeEventListener('resize', updateBannerHeight);
        bannerEl.remove();
        document.documentElement.style.setProperty('--banner-height', '0px');
        sessionStorage.setItem('bannerDismissed', '1');
    });
});
