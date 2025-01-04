// script.js

document.addEventListener('DOMContentLoaded', () => {
    const photoGrid = document.getElementById('photo-grid');
    const backToTopBtn = document.getElementById('back-to-top');

    // Configuration
    const totalImages = 39; // Total number of images
    const imagePrefix = 'photo'; // Prefix of image filenames
    const imageExtension = '.jpg'; // Extension of image files

    // Carousel Configuration
    const carouselSlide = document.querySelector('.carousel-slide');
    const carouselImages = document.querySelectorAll('.carousel-slide img');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let counter = 0;
    const size = carouselImages[0].clientWidth;

    // Function to format numbers with leading zeros
    const formatNumber = (num, digits) => {
        return num.toString().padStart(digits, '0');
    };

    // Function to create a photo element
    const createPhotoElement = (filename, index) => {
        const photoDiv = document.createElement('div');
        photoDiv.classList.add('photo');
        photoDiv.style.animationDelay = `${index * 0.05}s`; // Staggered animation

        const img = document.createElement('img');
        img.src = `images/${filename}`;
        img.alt = `Photo ${index + 1}`;
        img.loading = 'lazy'; // Enables lazy loading

        // Add event listener for lightbox effect
        img.addEventListener('click', () => {
            openLightbox(`images/${filename}`, `Photo ${index + 1}`);
        });

        // Create caption (optional)
        const caption = document.createElement('div');
        caption.classList.add('caption');
        caption.textContent = `Photo ${index + 1}`; // Customize captions if desired

        photoDiv.appendChild(img);
        photoDiv.appendChild(caption);

        return photoDiv;
    };

    // Function to load all images
    const loadImages = () => {
        const digits = 3; // Number of digits in the numbering (e.g., 001)

        for (let i = 1; i <= totalImages; i++) {
            const formattedNumber = formatNumber(i, digits);
            const filename = `${imagePrefix}${formattedNumber}${imageExtension}`;
            const photoElement = createPhotoElement(filename, i);
            photoGrid.appendChild(photoElement);
        }
    };

    // Lightbox functionality
    const openLightbox = (src, alt) => {
        // Create lightbox elements
        const lightboxOverlay = document.createElement('div');
        lightboxOverlay.classList.add('lightbox-overlay');

        const lightboxContent = document.createElement('div');
        lightboxContent.classList.add('lightbox-content');

        const lightboxImg = document.createElement('img');
        lightboxImg.src = src;
        lightboxImg.alt = alt;

        const closeButton = document.createElement('span');
        closeButton.classList.add('lightbox-close');
        closeButton.innerHTML = '&times;';

        // Append elements
        lightboxContent.appendChild(lightboxImg);
        lightboxContent.appendChild(closeButton);
        lightboxOverlay.appendChild(lightboxContent);
        document.body.appendChild(lightboxOverlay);

        // Close lightbox on click
        closeButton.addEventListener('click', () => {
            document.body.removeChild(lightboxOverlay);
        });

        // Close lightbox when clicking outside the image
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                document.body.removeChild(lightboxOverlay);
            }
        });
    };

    // Carousel Functionality
    const initializeCarousel = () => {
        // Clone first and last images for infinite loop effect
        const firstClone = carouselImages[0].cloneNode(true);
        const lastClone = carouselImages[carouselImages.length - 1].cloneNode(true);
        firstClone.id = 'first-clone';
        lastClone.id = 'last-clone';
        carouselSlide.appendChild(firstClone);
        carouselSlide.insertBefore(lastClone, carouselImages[0]);

        const newCarouselImages = document.querySelectorAll('.carousel-slide img');
        const newSize = newCarouselImages[0].clientWidth;

        carouselSlide.style.transform = `translateX(${-size * (counter + 1)}px)`;

        // Next Button
        nextBtn.addEventListener('click', () => {
            if (counter >= newCarouselImages.length - 2) return;
            carouselSlide.style.transition = 'transform 0.5s ease-in-out';
            counter++;
            carouselSlide.style.transform = `translateX(${-size * (counter + 1)}px)`;
        });

        // Prev Button
        prevBtn.addEventListener('click', () => {
            if (counter <= 0) return;
            carouselSlide.style.transition = 'transform 0.5s ease-in-out';
            counter--;
            carouselSlide.style.transform = `translateX(${-size * (counter + 1)}px)`;
        });

        // Transition End
        carouselSlide.addEventListener('transitionend', () => {
            const current = document.querySelector('.carousel-slide img:nth-child(' + (counter + 1) + ')');
            if (current.id === 'first-clone') {
                carouselSlide.style.transition = 'none';
                counter = 0;
                carouselSlide.style.transform = `translateX(${-size * (counter + 1)}px)`;
            }
            if (current.id === 'last-clone') {
                carouselSlide.style.transition = 'none';
                counter = carouselImages.length - 1;
                carouselSlide.style.transform = `translateX(${-size * (counter + 1)}px)`;
            }
        });

        // Auto Slide
        setInterval(() => {
            if (counter >= newCarouselImages.length - 2) return;
            carouselSlide.style.transition = 'transform 0.5s ease-in-out';
            counter++;
            carouselSlide.style.transform = `translateX(${-size * (counter + 1)}px)`;
        }, 5000);
    };

    // Back-to-Top Button Functionality
    const handleScroll = () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Initialize All Functions
    const initialize = () => {
        loadImages();
        initializeCarousel();
    };

    initialize();

    // Event Listeners
    window.addEventListener('scroll', handleScroll);
    backToTopBtn.addEventListener('click', scrollToTop);
});
