async function logout() {
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (response.ok) {
    // redirect user to home page
    document.location.replace('/');
  }
}

document.getElementById('logout').addEventListener('click', logout);