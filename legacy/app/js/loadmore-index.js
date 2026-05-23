console.log('index load more loaded!');

let loadMoreBtn = document.querySelector('.loadmore');

if (loadMoreBtn) {
    let currentItem = 8;
    let boxes = [...document.querySelectorAll('figure.card')];

    boxes.forEach((box, index) => {
        if (index >= currentItem) {
            box.style.display = 'none';
        }
    });

   loadMoreBtn.onclick = () => {
    for (var i = currentItem; i < currentItem + 4; i++) {
        if (boxes[i]) {
            boxes[i].style.display = 'block';
            requestAnimationFrame(() => {
                boxes[i].classList.add('card-reveal');
            });
        }
    }
    currentItem += 4;
    if (currentItem >= boxes.length) {
        loadMoreBtn.style.display = 'none';
    }
}
}