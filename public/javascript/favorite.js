async function favoriteHandler(event) {
  if (event.target.className !== "favorite-checkbox") {
    return;
  }

  // store value before checkbox was clicked and disable checkbox
  const wasChecked = !event.target.checked;
  event.target.disabled = true;

  // traverse up DOM tree until it finds an element with class "post", and then return data-post-id of that element
  const post_id = event.target.closest(".post").dataset.postId;
  
  const response = await fetch('/api/posts/favorite', {
    method: 'PUT',
    body: JSON.stringify({
      post_id
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    // re-enable checkbox
    event.target.disabled = false;
  } else {
    // set checkbox to status from before being clicked and re-enable checkbox
    event.target.checked = wasChecked;
    event.target.disabled = false;
  }
}

document.querySelector("main").addEventListener("click", favoriteHandler);