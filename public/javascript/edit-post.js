const captionInput = document.getElementById('caption-input');
const postEl = document.getElementById('post');

async function editFormHandler(event) {
  event.preventDefault();

  const caption = captionInput.value.trim() || null;
  const id = postEl.dataset.postId;

  const response = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      caption
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    alert(response.statusText);
  }
}

async function deleteFormHandler(event) {
  event.preventDefault();
  
  const id = postEl.dataset.postId;
  
  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE'
  });
  
  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    alert(response.statusText);
  }
}

document.getElementById('edit-post-form').addEventListener('submit', editFormHandler);
document.getElementById('delete-post-btn').addEventListener('click', deleteFormHandler);