document.addEventListener("DOMContentLoaded", function() {
    const body = document.body;
    const numStars = 750;

    for (let i = 0; i < numStars; i++) {
        let star = document.createElement("div");
        star.className = "star";
        star.style.top = `${Math.random() * 100}vh`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.width = `${Math.random() * 5 + 1}px`;
        star.style.height = star.style.width;
        body.appendChild(star);
    }
});
