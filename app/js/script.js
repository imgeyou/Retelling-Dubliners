console.log("HELLO");

/* past-present image slider script. reference code: https://codepen.io/Coding-in-Public/pen/NWyjZwO */
document.querySelectorAll('.slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
        e.target.closest('.img-column').style.setProperty('--position', `${e.target.value}%`);
    });
})

//light mode + dark mode toggle
const body = document.querySelector("body");
toggle = document.querySelector(".toggle");

//setting what color mode it's in
let getMode = localStorage.getItem("mode");
console.log(getMode);
if (getMode && getMode === "dark"){
    body.classList.toggle("dark");
    toggle.classList.toggle("active")
}

//toggling light vs dark mode
toggle.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (!body.classList.contains("dark")) {
        return localStorage.setItem("mode", "light");
    }
    localStorage.setItem("mode", "dark");
})

// activating toggle on click
toggle.addEventListener("click", () => toggle.classList.toggle("active"));




