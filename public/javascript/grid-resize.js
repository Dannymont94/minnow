function resizeGridItem(content){
  const grid = document.querySelector(".posts");
  const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
  const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
  const rowSpan = Math.ceil((content.querySelector('.post').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
  content.style.gridRowEnd = "span "+rowSpan;
}

function resizeAllGridItems(){
  const allItems = document.getElementsByClassName("content");
  for(x=0; x<allItems.length; x++){
    imagesLoaded(allItems[x], resizeInstance);
  }
}

function resizeInstance(instance){
  const item = instance.elements[0];
  resizeGridItem(item);
}

window.onload = resizeAllGridItems();
window.addEventListener("resize", resizeAllGridItems);