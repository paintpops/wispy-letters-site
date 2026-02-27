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

    let originalTop = 0;
    let isInitialized = false;
    let maxHorizontalScroll = 0;
    let currentScrollX = 0;
    let targetScrollX = 0;

    // Calculate and set container height based on horizontal scroll needs
    function updateGalleryHeight() {
        const rowWidth = galleryRows[0] ? galleryRows[0].scrollWidth : 0;
        maxHorizontalScroll = Math.max(0, rowWidth - window.innerWidth);
        // Set container height to accommodate horizontal scroll + viewport height
        introGallery.style.height = `${maxHorizontalScroll + viewportHeight}px`;
    }

    // Smooth lerp function
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Animation loop for smooth scrolling
    function animateGallery() {
        // Smooth interpolation with easing
        currentScrollX = lerp(currentScrollX, targetScrollX, 0.1);

        galleryRows.forEach(row => {
            row.style.transform = `translateX(${-currentScrollX}px)`;
        });

        requestAnimationFrame(animateGallery);
    }

    // Start animation loop
    animateGallery();

    // Initial height calculation
    updateGalleryHeight();

    // Recalculate on window resize
    window.addEventListener('resize', updateGalleryHeight);

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const galleryRect = introGallery.getBoundingClientRect();

        // Initialize originalTop on first scroll (when element is in normal flow)
        if (!isInitialized && !introGalleryFixed.classList.contains('sticky')) {
            originalTop = introGallery.offsetTop;
            isInitialized = true;
        }

        // Calculate position relative to original position
        const scrollPastStart = currentScroll - originalTop;
        const scrollPastEnd = scrollPastStart - maxHorizontalScroll;

        // Should be sticky when we've scrolled to it but not past it
        const shouldBeSticky = scrollPastStart >= 0 && scrollPastEnd < 0;

        if (shouldBeSticky) {
            // Make sticky and scroll horizontally
            introGalleryFixed.classList.add('sticky');
            introGalleryFixed.classList.remove('past');
            targetScrollX = Math.max(0, scrollPastStart);
        } else if (scrollPastStart < 0) {
            // Before becoming sticky
            introGalleryFixed.classList.remove('sticky');
            targetScrollX = 0;
        } else {
            // After scrolling past - keep at final position
            introGalleryFixed.classList.remove('sticky');
            introGalleryFixed.classList.add('past');
            targetScrollX = maxHorizontalScroll;
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

        // Check if auto-gallery is 60% out of view
        const gallery = document.querySelector('.auto-gallery');
        const galleryRect = gallery ? gallery.getBoundingClientRect() : null;
        const galleryExitProgress = galleryRect ? 1 - (galleryRect.bottom / viewportHeight) : 0;
        const sectionStarted = galleryExitProgress >= 0.6;
        const sectionEnded = sectionRect.bottom <= viewportHeight;

        if (!sectionStarted || sectionEnded) {
            // Hide images and text when section hasn't started or has ended
            introImages.forEach(image => {
                image.style.opacity = 0;
            });
            introContent.style.opacity = 0;
            return;
        }

        // Calculate scroll progress based on intro section position
        // Progress goes from 0 (when started) to 1 (when section ends)
        const scrollProgress = Math.max(0, Math.min(1, -sectionRect.top / (sectionHeight - viewportHeight)));

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

        // Phase 1: Images move vertically (first 50% of scroll)
        if (scrollProgress <= 0.5) {
            const imageProgress = scrollProgress / 0.5;

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
        // Phase 2: Fade and blur text (last 50% of scroll)
        else {
            const fadeProgress = (scrollProgress - 0.5) / 0.5;

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
    const maxExtraScroll = 1000; // Max pixels of "extra" scroll to fully reveal contact

    // Easing function for smooth slide-up (starts fast, slows down)
    function easeOutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }

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
        const linearProgress = Math.max(0, Math.min(1, extraScrollAmount / maxExtraScroll));

        // Apply easing for smooth slide-up
        const slideProgress = easeOutCubic(linearProgress);

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

// Service Section Parallax Effect (instudio.html)
const serviceSections = document.querySelectorAll('.service-section');

if (serviceSections.length > 0) {
    // Track current and target positions for both container and image
    const parallaxStates = [];

    serviceSections.forEach((section, index) => {
        const imageWrapper = section.querySelector('.service-image-wrapper');
        const img = imageWrapper ? imageWrapper.querySelector('img') : null;

        if (!img || !imageWrapper) return;

        parallaxStates[index] = {
            containerCurrent: 0,
            containerTarget: 0,
            imageCurrent: -10,
            imageTarget: -10
        };
    });

    // Smooth lerp function
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Animation loop for smooth scrolling
    function animateServiceParallax() {
        parallaxStates.forEach((state, index) => {
            if (!serviceSections[index]) return;

            const imageWrapper = serviceSections[index].querySelector('.service-image-wrapper');
            const img = imageWrapper ? imageWrapper.querySelector('img') : null;
            if (!img || !imageWrapper) return;

            // Smooth interpolation with easing
            state.containerCurrent = lerp(state.containerCurrent, state.containerTarget, 0.05);
            state.imageCurrent = lerp(state.imageCurrent, state.imageTarget, 0.05);

            // Apply transforms
            imageWrapper.style.transform = `translateY(${state.containerCurrent}vh)`;
            img.style.transform = `translateY(${state.imageCurrent}vh)`;
        });

        requestAnimationFrame(animateServiceParallax);
    }

    // Start animation loop
    animateServiceParallax();

    // Update target positions on scroll
    serviceSections.forEach((section, index) => {
        window.addEventListener('scroll', function() {
            const sectionRect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const sectionHeight = section.offsetHeight;

            // Calculate scroll progress through the section (0 to 1)
            const scrollProgress = Math.max(0, Math.min(1,
                (viewportHeight - sectionRect.top) / (sectionHeight + viewportHeight)
            ));

            // Container moves more noticeably (sliding effect)
            const containerStart = 0;
            const containerEnd = -50;
            const containerPosition = containerStart - (scrollProgress * (containerStart - containerEnd));

            // Image moves more subtly inside the container (starts with top hidden, ends with bottom hidden)
            const imageStart = -10;
            const imageEnd = 10;
            const imagePosition = imageStart + (scrollProgress * (imageEnd - imageStart));

            parallaxStates[index].containerTarget = containerPosition;
            parallaxStates[index].imageTarget = imagePosition;
        });
    });
}

// Old Service Details Code (can be removed if not needed)
const servicesDataContainer = document.querySelector('.services-data');

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

        // Calculate overall scroll progress through the wrapper
        const overallProgress = Math.max(0, Math.min(1, -wrapperRect.top / (wrapperHeight - viewportHeight)));

        // Apply parallax effect to image (scrolls upward faster than page)
        const parallaxAmount = overallProgress * 200; // Image moves up 200px over the scroll
        imageContainer.style.transform = `translateY(-${parallaxAmount}px)`;

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

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        // Close all other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle current item
        item.classList.toggle('active');
    });
});

// Testimonials carousel
const testimonialItems = document.querySelectorAll('.testimonial-item');
const testimonialDots = document.querySelectorAll('.testimonial-dot');

if (testimonialItems.length > 0 && testimonialDots.length > 0) {
    let currentTestimonial = 0;
    let testimonialInterval;

    function showTestimonial(index) {
        // Remove active class from all items and dots
        testimonialItems.forEach(item => item.classList.remove('active'));
        testimonialDots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current item and dot
        testimonialItems[index].classList.add('active');
        testimonialDots[index].classList.add('active');

        currentTestimonial = index;
    }

    function nextTestimonial() {
        const next = (currentTestimonial + 1) % testimonialItems.length;
        showTestimonial(next);
    }

    function startAutoplay() {
        testimonialInterval = setInterval(nextTestimonial, 8000);
    }

    function resetAutoplay() {
        clearInterval(testimonialInterval);
        startAutoplay();
    }

    // Add click handlers to dots
    testimonialDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            showTestimonial(index);
            resetAutoplay();
        });
    });

    // Start autoplay
    startAutoplay();
}

// Services list: fade-in images and parallax
const servicesListSection = document.querySelector('.services-list-section');
if (servicesListSection) {
    const servicesListImages = document.querySelectorAll('.services-list-image');
    const servicesListItems = document.querySelectorAll('.services-list-item');

    window.addEventListener('load', function() {
        servicesListImages.forEach(image => {
            image.style.opacity = 1;
        });
    });

    const listObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -10% 0px'
    });

    servicesListItems.forEach(item => {
        listObserver.observe(item);
    });

    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset;
        const sectionTop = servicesListSection.offsetTop;
        const sectionHeight = servicesListSection.offsetHeight;
        const viewportHeight = window.innerHeight;

        if (scrollY + viewportHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
            const relativeScroll = scrollY - sectionTop + viewportHeight;
            const scrollProgress = relativeScroll / (sectionHeight + viewportHeight);

            servicesListImages.forEach((image, index) => {
                let direction;
                if (index === 0) direction = 1;
                else if (index === 1) direction = -1;
                else if (index === 2) direction = -1;
                else direction = 1;

                const translateY = direction * scrollProgress * 200;
                image.style.transform = `translateY(${translateY}px)`;
            });
        }
    });
}


// Parallax within grid gallery image containers
const gridGallerySection = document.querySelector('.grid-gallery-section');
if (gridGallerySection) {
    const gridGalleryItems = document.querySelectorAll('.grid-gallery-item');

    function updateGridGalleryParallax() {
        gridGalleryItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            if (rect.bottom > 0 && rect.top < viewportHeight) {
                const wrapper = item.querySelector('.grid-gallery-img-wrapper');
                const img = item.querySelector('img');
                const maxShift = img.offsetHeight - wrapper.offsetHeight;
                const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
                img.style.transform = `translateY(${-progress * maxShift}px)`;
            }
        });
    }

    window.addEventListener('scroll', updateGridGalleryParallax);
    updateGridGalleryParallax();
}

// Services detail section image parallax (lerp easing, matches Lenis lerp: 0.1)
const servicesDetailSection = document.querySelector('.services-detail-section');
if (servicesDetailSection) {
    const servicesDetailWrappers = document.querySelectorAll('.services-detail-img-wrapper');
    const currentY = new Array(servicesDetailWrappers.length).fill(0);
    const targetY = new Array(servicesDetailWrappers.length).fill(0);

    function updateServicesDetailTargets() {
        const viewportHeight = window.innerHeight;
        servicesDetailWrappers.forEach((wrapper, i) => {
            const rect = wrapper.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < viewportHeight) {
                const img = wrapper.querySelector('img');
                const maxShift = img.offsetHeight - wrapper.offsetHeight;
                const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
                targetY[i] = -progress * maxShift;
            }
        });
    }

    function animateServicesDetail() {
        updateServicesDetailTargets();
        servicesDetailWrappers.forEach((wrapper, i) => {
            currentY[i] += (targetY[i] - currentY[i]) * 0.1;
            const img = wrapper.querySelector('img');
            img.style.transform = `translateY(${currentY[i]}px)`;
        });
        requestAnimationFrame(animateServicesDetail);
    }

    animateServicesDetail();
}

// Instudio services detail section image parallax (mirrors services-detail parallax)
const instudioServicesDetailSection = document.querySelector('.instudio-services-detail-section');
if (instudioServicesDetailSection) {
    const instudioDetailWrappers = document.querySelectorAll('.instudio-services-detail-img-wrapper');
    const instudioCurrentY = new Array(instudioDetailWrappers.length).fill(0);
    const instudioTargetY = new Array(instudioDetailWrappers.length).fill(0);

    function updateInstudioDetailTargets() {
        const viewportHeight = window.innerHeight;
        instudioDetailWrappers.forEach((wrapper, i) => {
            const rect = wrapper.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < viewportHeight) {
                const img = wrapper.querySelector('img');
                const maxShift = img.offsetHeight - wrapper.offsetHeight;
                const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
                instudioTargetY[i] = -progress * maxShift;
            }
        });
    }

    function animateInstudioDetail() {
        updateInstudioDetailTargets();
        instudioDetailWrappers.forEach((wrapper, i) => {
            instudioCurrentY[i] += (instudioTargetY[i] - instudioCurrentY[i]) * 0.1;
            const img = wrapper.querySelector('img');
            img.style.transform = `translateY(${instudioCurrentY[i]}px)`;
        });
        requestAnimationFrame(animateInstudioDetail);
    }

    animateInstudioDetail();
}

// About section image parallax (lerp easing, matches instudio/services-detail pattern)
const aboutParallaxImg = document.querySelector('.about-parallax-img');
if (aboutParallaxImg) {
    let aboutCurrentY = 0;
    let aboutTargetY = 0;

    function updateAboutParallaxTarget() {
        const wrapper = aboutParallaxImg.parentElement;
        const rect = wrapper.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        if (rect.bottom > 0 && rect.top < viewportHeight) {
            const maxShift = aboutParallaxImg.offsetHeight - wrapper.offsetHeight;
            const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
            aboutTargetY = -progress * maxShift;
        }
    }

    function animateAboutParallax() {
        updateAboutParallaxTarget();
        aboutCurrentY += (aboutTargetY - aboutCurrentY) * 0.1;
        aboutParallaxImg.style.transform = `translateY(${aboutCurrentY}px)`;
        requestAnimationFrame(animateAboutParallax);
    }

    animateAboutParallax();
}

// Onsite page: scrolling images within containers (staggered)
const scrollingImagesSection = document.querySelector('.scrolling-images-section');
if (scrollingImagesSection) {
    const scrollingImageContainers = document.querySelectorAll('.scrolling-image-container');

    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset;
        const viewportHeight = window.innerHeight;

        scrollingImageContainers.forEach((container, index) => {
            const containerTop = container.getBoundingClientRect().top + scrollY;
            const containerHeight = container.offsetHeight;

            if (scrollY + viewportHeight > containerTop && scrollY < containerTop + containerHeight) {
                const image = container.querySelector('.scrolling-image');
                const imageHeight = image.offsetHeight;
                const maxScroll = imageHeight - containerHeight;
                const containerProgress = (scrollY + viewportHeight - containerTop) / (containerHeight + viewportHeight);
                const scrollSpeed = index === 0 ? 0.6 : 1.2;
                const scrollAmount = Math.max(0, Math.min(maxScroll, containerProgress * maxScroll * scrollSpeed));
                image.style.transform = `translateY(-${scrollAmount}px)`;
            }
        });
    });
}

