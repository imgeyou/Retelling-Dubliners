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

// activating toggle on click
toggle.addEventListener("click", () => toggle.classList.toggle("active"));













//life of jj quotes swapping section
// quote array begins here
// const quotes = [
//     "Life is too short to read a bad book — James Joyce",
//     "Why is it that words like these seem dull and cold? Is it because there is no word tender enough to be your name?― James Joyce, The Dead",
//     "Better pass boldly into that other world, in the full glory of some passion, than fade and wither dismally with age — James Joyce",
//     "I want to give a picture of Dublin so complete that if the city suddenly disappeared from the earth it could be reconstructed out of my book — James Joyce said in conversation with Frank Budgen, 1918",
//     "Joyce is right about history being a nightmare — but it may be the nightmare from which no one can awaken. People are trapped in history and history is trapped in them. – James Baldwin, Notes of a Native Son about James Joyce",
// ];

//Swapping quotes
// function randomQuote() {
//     const quoteSpan = document.getElementById("quote");
//     if (quoteSpan) {
//         quoteSpan.innerHTML = quotes[Math.floor(Math.random() * quotes.length)];
//     }
// }
//Quote Time Intervals
// randomQuote();
// window.setInterval(randomQuote, 5000);


