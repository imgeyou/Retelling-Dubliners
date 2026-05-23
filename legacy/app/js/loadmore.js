console.log('I load more cards!')

//load more
let loadMoreBtn = document.querySelector('.loadmore');
//number of cards that should appear on load
var currentItem;
if (window.innerWidth <= 768) {
    currentItem = 5;
} else if (window.innerWidth <= 1024) {
    currentItem = 7;
} else {
    currentItem = 9;
}

//tester code 1
// console.log(loadMoreBtn);
// console.log(currentItem);

let boxes = [...document.querySelectorAll('.locationCardContainer, .card')];
//hide the rest other than first 8/6/4
boxes.forEach((box, index) => {
    if (index >= currentItem) {
        box.style.display = 'none';
    }
});

//on buttom click more card will load in intances of 4
loadMoreBtn.onclick = () => {
    let boxes = [...document.querySelectorAll('.locationCardContainer, .card')];
    for (var i = currentItem; i < currentItem + 16; i++) {
        if(boxes[i]){
            boxes[i].style.display = 'inline-block';
            boxes[i].classList.add('card-reveal'); 
            //tester code 2
            console.log('I work!');
        }
    }
    currentItem += 16;
    // load more button will disappear when all cards run out
    if (currentItem >= boxes.length) {
        loadMoreBtn.style.display = 'none';
    }
}
