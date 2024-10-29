// barba.js
barba.init({
    transitions: [
        {
            name: "fade-transition",
            async leave(data) {
                await fadeOut(data.current.container);
            },
            async enter(data) {
                fadeIn(data.next.container);
                await initializePage(data.next.container);
            },
        },
    ],
});

// Fade-out
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

// Fade-in
function fadeIn(element) {
    element.style.display = "block";
    element.style.opacity = "0";
    element.offsetHeight;
    element.style.transition = "opacity .4s cubic-bezier(0.5, 0.5, 0, 1)";
    element.style.opacity = "1";
}

document.addEventListener("DOMContentLoaded", () => {
    initializePage(document.body);
});

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
