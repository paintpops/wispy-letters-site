let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop === 0) {
        // At the top of the page
        header.classList.remove('nav-hidden');
        header.classList.remove('nav-visible');
    } else if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        header.classList.add('nav-hidden');
        header.classList.remove('nav-visible');
    } else if (scrollTop < lastScrollTop) {
        // Scrolling up
        header.classList.remove('nav-hidden');
        header.classList.add('nav-visible');
    }

    lastScrollTop = scrollTop;
});

// Animate services title on scroll
const servicesTitle = document.querySelector('.services .container > img');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px 800px 0px' });

if (servicesTitle) {
    observer.observe(servicesTitle);
}

// Animate service card images on scroll
const serviceCardImages = document.querySelectorAll('.service-image img');
const serviceImageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered delay for each image
            setTimeout(() => {
                entry.target.classList.add('animate');
            }, index * 150); // 150ms delay between each image
            serviceImageObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2, rootMargin: '0px 0px -100px 0px' });

serviceCardImages.forEach(img => {
    serviceImageObserver.observe(img);
});

// Intro Gallery - Fixed Scroll Effect
const introGallery = document.querySelector('.intro-gallery');
const introGalleryFixed = document.querySelector('.intro-gallery-fixed');

if (introGallery) {
    const galleryRows = introGallery.querySelectorAll('.gallery-row');
    const viewportHeight = window.innerHeight;

    // Store original dimensions (before sticky is applied)
    const originalHeight = introGallery.offsetHeight;
    let originalTop = 0;
    let isInitialized = false;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        // Initialize originalTop on first scroll (when element is in normal flow)
        if (!isInitialized && !introGalleryFixed.classList.contains('sticky')) {
            originalTop = introGallery.offsetTop;
            isInitialized = true;
        }

        // Calculate position relative to original position
        const scrollPastStart = currentScroll - originalTop;
        const scrollPastEnd = scrollPastStart - (originalHeight - viewportHeight);
        
        // Should be sticky when we've scrolled to it but not past it
        const shouldBeSticky = scrollPastStart >= 0 && scrollPastEnd < 0;

        if (shouldBeSticky) {
            // Make sticky and scroll horizontally
            introGalleryFixed.classList.add('sticky');
            introGalleryFixed.classList.remove('past');
            const scrollProgress = Math.max(0, scrollPastStart);
            galleryRows.forEach(row => {
                row.style.transform = `translateX(${-scrollProgress}px)`;
            });
        } else if (scrollPastStart < 0) {
            // Before becoming sticky
            introGalleryFixed.classList.remove('sticky');
            galleryRows.forEach(row => {
                row.style.transform = 'translateX(0)';
            });
        } else {
            // After scrolling past - keep at final position
            introGalleryFixed.classList.remove('sticky');
            introGalleryFixed.classList.add('past');
            const maxScroll = originalHeight - viewportHeight;
            galleryRows.forEach(row => {
                row.style.transform = `translateX(${-maxScroll}px)`;
            });
        }
    });
}

// Intro Section - Image Float and Text Fade
const introSection = document.querySelector('.intro');
if (introSection) {
    const introImages = document.querySelectorAll('.intro-image');
    const introContent = document.querySelector('.intro-content');
    const introH2 = introContent.querySelector('h2');
    let wordAnimationTriggered = false;

    window.addEventListener('scroll', function() {
        const sectionRect = introSection.getBoundingClientRect();
        const sectionHeight = introSection.offsetHeight;
        const viewportHeight = window.innerHeight;

        // Start showing when section is 50% into view (hero 50% out of view)
        const sectionStarted = sectionRect.top <= viewportHeight * 0.5;
        const sectionEnded = sectionRect.bottom <= viewportHeight;

        if (!sectionStarted || sectionEnded) {
            // Hide images and text when section hasn't started or has ended
            introImages.forEach(image => {
                image.style.opacity = 0;
            });
            introContent.style.opacity = 0;
            return;
        }

        // Calculate scroll progress through the section (0 to 1)
        // Adjust calculation to account for earlier start point
        const adjustedTop = sectionRect.top - (viewportHeight * 0.5);
        const scrollProgress = Math.max(0, Math.min(1, -adjustedTop / (sectionHeight - viewportHeight * 0.5)));

        // Trigger word animation when section first becomes visible and spans are ready
        if (!wordAnimationTriggered && scrollProgress > 0) {
            const words = introH2.querySelectorAll('span');
            if (words.length > 0) {
                wordAnimationTriggered = true;
                words.forEach(word => {
                    const delay = word.getAttribute('data-animation-delay');
                    word.style.animation = `slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
                    word.style.animationDelay = delay;
                });
            }
        }

        // Phase 1: Images move vertically (first 60% of scroll)
        if (scrollProgress <= 0.6) {
            const imageProgress = scrollProgress / 0.6;

            introImages.forEach((image, index) => {
                // Vertical movement only
                let translateY = 0;

                if (index === 0) {
                    // First image moves down
                    translateY = imageProgress * 255;
                } else {
                    // Second image moves up
                    translateY = -imageProgress * 255;
                }

                image.style.transform = `translateY(${translateY}px)`;
                image.style.opacity = 1;
                image.style.filter = 'blur(0px)';
            });

            // Keep content visible and centered
            introContent.style.opacity = 1;
            introContent.style.transform = 'translate(-50%, -50%)';
            introContent.style.filter = 'blur(0px)';
        }
        // Phase 2: Fade and blur text (last 40% of scroll)
        else {
            const fadeProgress = (scrollProgress - 0.6) / 0.4;

            // Continue moving images vertically
            introImages.forEach((image, index) => {
                let translateY = 0;

                if (index === 0) {
                    translateY = 255 + (fadeProgress * 170);
                } else {
                    translateY = -255 - (fadeProgress * 170);
                }

                const blurAmount = fadeProgress * 10;
                image.style.transform = `translateY(${translateY}px)`;
                image.style.opacity = 1 - fadeProgress;
                image.style.filter = `blur(${blurAmount}px)`;
            });

            // Fade and blur text
            const translateY = -50 + (-fadeProgress * 50);
            const blurAmount = fadeProgress * 10;
            const opacity = 1 - fadeProgress;

            introContent.style.transform = `translate(-50%, ${translateY}%)`;
            introContent.style.filter = `blur(${blurAmount}px)`;
            introContent.style.opacity = opacity;
        }
    });
}

// Expand video on scroll from center, then fade up with blur
const videoContainer = document.querySelector('.video-container');
if (videoContainer) {
    const video = videoContainer.querySelector('video');

    window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const heroHeight = window.innerHeight;

    // Phase 1: Expand from center (scroll 50% to 100% of viewport)
    if (scrollTop > heroHeight * 0.5 && scrollTop <= heroHeight) {
        videoContainer.classList.add('expanded');
        video.style.transform = 'translateY(0)';
        video.style.filter = 'blur(0px)';
        video.style.opacity = '1';
    }
    // Phase 2: Fade up with blur (scroll 100% to 200% of viewport)
    else if (scrollTop > heroHeight && scrollTop <= heroHeight * 2) {
        const fadeProgress = (scrollTop - heroHeight) / heroHeight;
        const translateY = -fadeProgress * 100; // Move up by 100vh
        const blurAmount = fadeProgress * 8; // Blur up to 8px (softer)
        const opacity = 1 - fadeProgress; // Fade to 0

        video.style.transform = `translateY(${translateY}vh)`;
        video.style.filter = `blur(${blurAmount}px)`;
        video.style.opacity = opacity;
    }
    // Before expansion
    else if (scrollTop <= heroHeight * 0.5) {
        videoContainer.classList.remove('expanded');
        video.style.transform = 'translateY(0)';
        video.style.filter = 'blur(0px)';
        video.style.opacity = '0';
    }
    // After fade out
    else if (scrollTop > heroHeight * 2) {
        video.style.transform = 'translateY(-100vh)';
        video.style.filter = 'blur(8px)';
        video.style.opacity = '0';
    }
    });
}

// Parallax effect for service images
const serviceImages = document.querySelectorAll('.service-image');

window.addEventListener('scroll', function() {
    serviceImages.forEach(image => {
        const rect = image.getBoundingClientRect();
        const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

        if (scrollProgress >= 0 && scrollProgress <= 1) {
            const translateY = (scrollProgress - 0.5) * -50;
            image.style.transform = `translateY(${translateY}px)`;
        }
    });
});

// Hide hero section when video section is in view
const heroSection = document.querySelector('.hero');
const videoSection = document.querySelector('.video-section');

if (heroSection && videoSection) {
    window.addEventListener('scroll', function() {
        const videoRect = videoSection.getBoundingClientRect();

    // Only start fading when video top reaches the top of viewport
    // Complete fade when video completely covers the viewport
    if (videoRect.top <= 0 && videoRect.top >= -window.innerHeight) {
        const fadeProgress = Math.abs(videoRect.top) / window.innerHeight;
        heroSection.style.opacity = 1 - fadeProgress;
        heroSection.style.display = 'flex';
    } else if (videoRect.top > 0) {
        heroSection.style.opacity = 1;
        heroSection.style.display = 'flex';
    } else {
        heroSection.style.opacity = 0;
        heroSection.style.display = 'none';
    }
    });
}


// H2 Word-by-Word Animation on Scroll
window.addEventListener('load', function() {
    setTimeout(() => {
        const h2Elements = document.querySelectorAll('h2');
        const introH2 = document.querySelector('.intro-content h2');

        h2Elements.forEach(h2 => {
            // Skip h2 elements with images
            if (h2.querySelector('img')) return;

            const text = h2.textContent.trim();
            const words = text.split(' ');

            // Clear the h2
            h2.innerHTML = '';
            h2.style.overflow = 'visible'; // Changed from 'hidden' to allow words to be visible

            // Add each word wrapped in a span
            words.forEach((word, index) => {
                const wordSpan = document.createElement('span');
                wordSpan.textContent = word;
                wordSpan.style.display = 'inline-block';
                wordSpan.style.marginRight = '0.25em';
                wordSpan.style.opacity = '0';
                wordSpan.style.transform = 'translateY(100%)';
                wordSpan.setAttribute('data-animation-delay', `${index * 0.03}s`);
                h2.appendChild(wordSpan);
            });
        });

        // Observe h2 elements and trigger animation when in view
        const h2Observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const words = entry.target.querySelectorAll('span');
                    words.forEach(word => {
                        const delay = word.getAttribute('data-animation-delay');
                        word.style.animation = `slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
                        word.style.animationDelay = delay;
                    });
                    h2Observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

        h2Elements.forEach(h2 => {
            // Skip h2 elements with images and the intro h2 (handled separately by scroll handler)
            if (!h2.querySelector('img') && h2 !== introH2) {
                h2Observer.observe(h2);
            }
        });
    }, 100);
});

// Load Behold Instagram widget
(function() {
    const d = document;
    const s = d.createElement("script");
    s.type = "module";
    s.src = "https://w.behold.so/widget.js";
    d.head.append(s);
})();

// Contact Section Slide Up (index.html only)
const contactSection = document.querySelector('#contact.contact');
const instagramSection = document.querySelector('.instagram-feed');

if (contactSection) {
    let extraScrollAmount = 0;
    const maxExtraScroll = 500; // Max pixels of "extra" scroll to fully reveal contact

    function updateContactPosition() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;

        // Calculate distance from bottom of page
        const scrollBottom = scrollTop + viewportHeight;
        const distanceFromBottom = documentHeight - scrollBottom;

        // Check if we're at the bottom (within 5px tolerance)
        const atBottom = distanceFromBottom < 5;

        if (!atBottom) {
            // Not at bottom, reset extra scroll
            extraScrollAmount = 0;
        }

        // Calculate slide progress based on extra scroll attempts
        const slideProgress = Math.max(0, Math.min(1, extraScrollAmount / maxExtraScroll));

        // Apply transform based on scroll progress
        // 100% hidden to 0% visible
        const translateY = 100 - (slideProgress * 100);
        contactSection.style.transform = `translateY(${translateY}%)`;

        console.log('Contact slide:', {
            scrollTop,
            documentHeight,
            viewportHeight,
            distanceFromBottom,
            atBottom,
            extraScrollAmount,
            slideProgress,
            translateY
        });
    }

    // Track wheel events to detect scroll attempts at bottom
    window.addEventListener('wheel', function(e) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        const scrollBottom = scrollTop + viewportHeight;
        const distanceFromBottom = documentHeight - scrollBottom;
        const atBottom = distanceFromBottom < 5;

        if (atBottom && e.deltaY > 0) {
            // At bottom and trying to scroll down
            extraScrollAmount += e.deltaY;
            extraScrollAmount = Math.min(extraScrollAmount, maxExtraScroll);
            updateContactPosition();
            e.preventDefault();
        } else if (e.deltaY < 0 && extraScrollAmount > 0) {
            // Scrolling up while contact is visible
            extraScrollAmount += e.deltaY;
            extraScrollAmount = Math.max(extraScrollAmount, 0);
            updateContactPosition();
            if (extraScrollAmount > 0) {
                e.preventDefault();
            }
        }
    }, { passive: false });

    // Update on scroll
    window.addEventListener('scroll', updateContactPosition);

    // Initial update
    updateContactPosition();

    // Handle contact anchor link click
    const contactLinks = document.querySelectorAll('a[href="#contact"]');
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Scroll to bottom of page
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
            // Then trigger the slide up with extra scroll
            setTimeout(() => {
                extraScrollAmount = maxExtraScroll;
                updateContactPosition();
            }, 800); // Wait for scroll to finish
        });
    });
}

// Service Details Fixed Scroll Effect (instudio.html)
const servicesDataContainer = document.querySelector('.services-data');
console.log('Service Details Script Initializing...', {
    servicesDataContainer: !!servicesDataContainer,
    wrapper: !!document.querySelector('.service-details-wrapper'),
    display: !!document.querySelector('.service-details-display')
});

if (servicesDataContainer) {
    // Read service data from HTML elements
    const serviceItems = servicesDataContainer.querySelectorAll('.service-item');
    const servicesData = Array.from(serviceItems).map(item => ({
        title: item.querySelector('h2').textContent,
        description: item.querySelector('p').textContent,
        image: item.getAttribute('data-image')
    }));

    console.log('Services Data Loaded:', servicesData);
    const wrapper = document.querySelector('.service-details-wrapper');
    const display = document.querySelector('.service-details-display');
    const h2 = display.querySelector('h2');
    const description = display.querySelector('.service-description');
    const imageContainer = display.querySelector('.service-details-image');
    const img = imageContainer.querySelector('img');

    let currentServiceIndex = 0;
    let isTransitioning = false;

    // Ensure base image is absolutely positioned for layering
    img.style.position = 'absolute';
    img.style.top = '0';
    img.style.left = '0';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.zIndex = '1';

    function swipeToImage(newSrc, direction = 'left') {
        if (isTransitioning) return;
        isTransitioning = true;

        // Create new image element for the transition
        const newImg = document.createElement('img');
        newImg.src = newSrc;
        newImg.alt = 'Service image';
        newImg.style.position = 'absolute';
        newImg.style.bottom = '0';
        newImg.style.left = '0';
        newImg.style.width = '100%';
        newImg.style.height = '0';
        newImg.style.objectFit = 'cover';
        newImg.style.objectPosition = 'bottom';
        newImg.style.transition = 'height 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)';
        newImg.style.zIndex = '2';

        // Set original image z-index
        img.style.zIndex = '1';

        // Add new image to container
        imageContainer.appendChild(newImg);

        // Trigger animation after a brief delay
        setTimeout(() => {
            newImg.style.height = '100%';
        }, 50);

        // After animation completes, update main image and remove new one
        setTimeout(() => {
            img.src = newSrc;
            imageContainer.removeChild(newImg);
            isTransitioning = false;
        }, 850);
    }

    function updateContent(index, fade = true) {
        if (index < 0 || index >= servicesData.length) return;

        const service = servicesData[index];

        if (fade) {
            // Blur, fade out, and slide down
            h2.style.opacity = 0;
            h2.style.filter = 'blur(10px)';
            h2.style.transform = 'translateY(50px)';
            description.style.opacity = 0;
            description.style.filter = 'blur(10px)';
            description.style.transform = 'translateY(50px)';

            setTimeout(() => {
                h2.textContent = service.title;
                description.textContent = service.description;

                // Clear blur, fade in, and slide back up
                h2.style.opacity = 1;
                h2.style.filter = 'blur(0px)';
                h2.style.transform = 'translateY(0)';
                description.style.opacity = 1;
                description.style.filter = 'blur(0px)';
                description.style.transform = 'translateY(0)';
            }, 300);
        } else {
            h2.textContent = service.title;
            description.textContent = service.description;
        }
    }

    window.addEventListener('scroll', function() {
        const wrapperRect = wrapper.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const wrapperHeight = wrapper.offsetHeight;

        // Determine if display should be sticky
        const isFullyVisible = wrapperRect.top <= 0 && wrapperRect.bottom > viewportHeight;
        const shouldUnstick = wrapperRect.bottom <= viewportHeight;

        console.log('Service Details Scroll:', {
            wrapperTop: wrapperRect.top,
            wrapperBottom: wrapperRect.bottom,
            isFullyVisible,
            shouldUnstick,
            isSticky: display.classList.contains('sticky')
        });

        if (isFullyVisible && !shouldUnstick) {
            // Make it sticky when fully in viewport
            display.classList.add('sticky');
            display.style.top = '50vh';
        } else if (shouldUnstick) {
            // Position at bottom when scrolling out
            display.classList.remove('sticky');
            display.style.top = `${wrapperHeight - viewportHeight / 2}px`;
        } else {
            // Normal scroll at top
            display.classList.remove('sticky');
            display.style.top = '50vh';
        }

        // Only do content swapping when sticky
        if (display.classList.contains('sticky')) {
            // Calculate scroll progress through wrapper (0 to 1)
            const scrollProgress = Math.max(0, Math.min(1,
                Math.abs(wrapperRect.top) / (wrapperHeight - viewportHeight)
            ));

            // Determine which service should be displayed (0, 1, or 2)
            const serviceIndex = Math.min(
                Math.floor(scrollProgress * servicesData.length),
                servicesData.length - 1
            );

            console.log('Service Index:', {
                scrollProgress,
                serviceIndex,
                currentServiceIndex,
                totalServices: servicesData.length
            });

            // Swap content/image when service changes
            if (serviceIndex !== currentServiceIndex) {
                console.log('Changing service from', currentServiceIndex, 'to', serviceIndex);
                const direction = serviceIndex > currentServiceIndex ? 'left' : 'right';
                swipeToImage(servicesData[serviceIndex].image, direction);
                updateContent(serviceIndex);
                currentServiceIndex = serviceIndex;
            }
        }

        // Apply blur when scrolling out after last service
        if (shouldUnstick) {
            const exitProgress = Math.min(1, (viewportHeight - wrapperRect.bottom) / viewportHeight);
            const blurAmount = exitProgress * 10;
            const opacity = 1 - exitProgress;

            display.style.filter = `blur(${blurAmount}px)`;
            display.style.opacity = opacity;
        } else {
            display.style.filter = 'blur(0px)';
            display.style.opacity = 1;
        }
    });
}

// Parallax Section - Image Float and Text Fade (instudio.html)
const parallaxSection = document.querySelector('.parallax-section');
if (parallaxSection) {
    const parallaxImages = document.querySelectorAll('.parallax-image');
    const parallaxContent = document.querySelector('.parallax-content');

    window.addEventListener('scroll', function() {
        const sectionRect = parallaxSection.getBoundingClientRect();
        const sectionHeight = parallaxSection.offsetHeight;
        const viewportHeight = window.innerHeight;

        // Only show images when the parallax section top has reached the top of viewport
        // and we're actively scrolling through it
        const sectionStarted = sectionRect.top <= 0;
        const sectionEnded = sectionRect.bottom <= viewportHeight;

        if (!sectionStarted || sectionEnded) {
            // Hide images and text when section hasn't started or has ended
            parallaxImages.forEach(image => {
                image.style.opacity = 0;
            });
            parallaxContent.style.opacity = 0;
            return;
        }

        // Calculate scroll progress through the section (0 to 1)
        const scrollProgress = Math.max(0, Math.min(1, -sectionRect.top / (sectionHeight - viewportHeight)));

        // Phase 1: Images move vertically (first 60% of scroll)
        if (scrollProgress <= 0.6) {
            const imageProgress = scrollProgress / 0.6;

            parallaxImages.forEach((image, index) => {
                // Vertical movement only
                let translateY = 0;

                switch(index) {
                    case 0: // Top-left moves down
                        translateY = imageProgress * 300;
                        break;
                    case 1: // Bottom-right moves up
                        translateY = -imageProgress * 250;
                        break;
                    case 2: // Top-right moves down
                        translateY = imageProgress * 350;
                        break;
                    case 3: // Bottom-left moves up
                        translateY = -imageProgress * 280;
                        break;
                }

                image.style.transform = `translateY(${translateY}px)`;
                image.style.opacity = 1; // Fully visible
            });

            // Keep content visible and centered
            parallaxContent.style.opacity = 1;
            parallaxContent.style.transform = 'translateY(-50%)';
            parallaxContent.style.filter = 'blur(0px)';
        }
        // Phase 2: Fade and blur text (last 40% of scroll)
        else {
            const fadeProgress = (scrollProgress - 0.6) / 0.4;

            // Continue moving images vertically
            parallaxImages.forEach((image, index) => {
                let translateY = 0;

                switch(index) {
                    case 0:
                        translateY = 300 + (fadeProgress * 200);
                        break;
                    case 1:
                        translateY = -250 - (fadeProgress * 200);
                        break;
                    case 2:
                        translateY = 350 + (fadeProgress * 150);
                        break;
                    case 3:
                        translateY = -280 - (fadeProgress * 180);
                        break;
                }

                image.style.transform = `translateY(${translateY}px)`;
                image.style.opacity = 1 - fadeProgress; // Fade out with text
            });

            // Fade and blur text
            const translateY = -50 + (-fadeProgress * 50);
            const blurAmount = fadeProgress * 10;
            const opacity = 1 - fadeProgress;

            parallaxContent.style.transform = `translateY(${translateY}%)`;
            parallaxContent.style.filter = `blur(${blurAmount}px)`;
            parallaxContent.style.opacity = opacity;
        }
    });
}
