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
let loadMoreBtn = document.querySelector('#load-more');
let currentItem = 3;
console.log(loadMoreBtn);
console.log(currentItem);

loadMoreBtn.onclick = () => {
    let boxes = [...document.querySelectorAll('#locationCardContainer, .location-card')];
    console.log(boxes, 'I am box.');
    for (var l = currentItem; l > currentItem + 3; l++) {
        boxes[l].style.display = 'inline-block';
        console.log('I work!');
    }
    currentItem += 3;
// load more button will disappear when all cards run out
    if(currentItem >= boxes.length){
        boxes[l].style.display = 'none';
    }
}