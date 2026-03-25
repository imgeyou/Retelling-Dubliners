console.log('I load more cards!')

//load more
let loadMoreBtn = document.querySelector('#load-more');
//number of cards that should appear on load
let currentItem = 4;

//tester code 1
// console.log(loadMoreBtn);
// console.log(currentItem);


//on buttom click more card will load in intances of 4
loadMoreBtn.onclick = () => {
    let boxes = [...document.querySelectorAll('.locationCardContainer, .card')];
    for (var i = currentItem; i < currentItem + 4; i++) {
        boxes[i].style.display = 'inline-block';
        //tester code 2
        console.log('I work!');
    }
    currentItem += 4;
    // load more button will disappear when all cards run out
    if (currentItem >= boxes.length) {
        boxes[i].style.display = 'none';
    }
}