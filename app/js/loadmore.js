console.log('I load things!');


//load more button
const loadBtn = document.querySelector(".loadmore");
var items = [...document.querySelectorAll(".card")];
var currentValue = 6;


loadBtn.addEventListener('click', () => {
    setTimeout(() => {
        for (var i = currentValue; i < currentValue + 6; i++) {
            items[i].style.display = "block";
        }
        currentValue += 6;

        if (currentValue >= items.length) {
            loadBtn.style.display = "none";
        }
        loadBtn.innerText = 'Load More';
        console.log("I work yay!")
    }, 3000)
    loadBtn.innerText = ' ';
    loadBtn.innerHTML = '<span class="loader></span>';
})