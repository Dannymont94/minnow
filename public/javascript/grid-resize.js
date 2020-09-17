function resizeGridItem(content){
  const grid = document.querySelector(".posts");
  const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
  const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
  const rowSpan = Math.ceil((content.querySelector('.post').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
  content.style.gridRowEnd = "span "+rowSpan;
}

function resizeAllGridItems(){
  const allItems = document.getElementsByClassName("content");
  for(let i = 0; i < allItems.length; i++){
    imagesLoaded(allItems[i], resizeInstance);
  }
}

function resizeInstance(instance){
  const item = instance.elements[0];
  resizeGridItem(item);
}

window.onload = resizeAllGridItems();
window.addEventListener("resize", resizeAllGridItems);