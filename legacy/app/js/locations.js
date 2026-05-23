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
        //clean the "display:none" applied by the loadmore button
        card.style.display = '';
        //add hide class to hide the card intitially
        card.classList.add("hide");

        //check if the card matches the selected filter or the "all" is selected statement
        if (card.dataset.name === e.target.dataset.name || e.target.dataset.name === "all") {
            card.classList.remove("hide");

        }

        if (e.target.dataset.name === "all") {
            filterableCards.forEach((card, index) => {
                if (index >= currentItem) {
                    card.style.display = 'none';
                }
            });
        }

    });
};

//click event listener for filter buttons
filterButtons.forEach(button => button.addEventListener("click", filterCards));
