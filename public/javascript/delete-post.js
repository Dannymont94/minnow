const postEl = document.getElementById('post');

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

document.getElementById('delete-post-btn').addEventListener('click', deleteFormHandler);