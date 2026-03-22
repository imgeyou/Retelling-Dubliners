console.log('hello I work!');
//location filter 
const filterButtons = document.querySelectorAll(".filter-buttons button");
const filterableCards = document.querySelectorAll(".filterable-cards .card");
// console.log(filterButtons, filterableCards);


//define filter cards function
const filterCards = e => {
    document.querySelector(".active").classList.remove("active");
    e.target.classList.add("active");

    //iterate over each filterable card
    filterableCards.forEach(card => {
        //add hide class to hide the card intitially
        card.classList.add("hide");

        //check if the card matches the selected filter or the "all" is selected statement
        if (card.dataset.name === e.target.dataset.name || e.target.dataset.name === "all") {
            card.classList.remove("hide");

        }
    });
};

//click event listener for filter buttons
filterButtons.forEach(button => button.addEventListener("click", filterCards));

//load more button
const loadBtn = document.querySelector("#load-more");
var items = [...document.querySelectorAll(".card")];
var currentValue = 6;

console.log(loadBtn);
console.log(items);


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