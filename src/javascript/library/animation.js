// barba.js
barba.init({
    transitions: [
        {
            name: "fade-transition",
            async leave(data) {
                await fadeOut(data.current.container);
            },
            enter(data) {
                fadeIn(data.next.container);
            },
            afterEnter({ next }) {
                initializePage(next.container);
            },
        },
    ],
});

function fadeOut(element) {
    return new Promise((resolve) => {
        element.style.transition = "opacity .4s cubic-bezier(0.5, 0.5, 0, 1)";
        element.style.opacity = "0";
        setTimeout(() => {
            element.style.display = "none";
            resolve();
        }, 400);
    });
}

function fadeIn(element) {
    element.style.display = "block";
    element.style.opacity = "0";
    element.style.transition = "opacity .4s cubic-bezier(0.5, 0.5, 0, 1)";
}

// Fade animate
$(document).ready(function () {
    const images = document.querySelectorAll(".fade-in-out");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const { isIntersecting, target } = entry;

                if (isIntersecting && !target.classList.contains("visible")) {
                    const delay = target.dataset.delay || 0;

                    setTimeout(() => {
                        target.classList.add("visible");
                    }, delay);
                }
            });
        },
        { threshold: 0.05 }
    );

    images.forEach((image) => observer.observe(image));
});
