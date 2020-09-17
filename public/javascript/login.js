const loginForm = document.getElementById('login-form');
const submitBtn = document.getElementById('submit-btn');
const feedbackEl = document.getElementById('feedback');

async function validateForm() {
  let canSubmit = true;

  for (let i = 0; i < loginForm.length - 1; i++) {
    const current = loginForm[i];
    if (/\s/.test(current.value)) {
      // contains whitespace characters
      canSubmit = false;
    } else if (current.value.length == 0) {
      // input is blank
      canSubmit = false;
    }
  }

  submitBtn.disabled = !canSubmit;
}

async function loginFormHandler(event) {
  event.preventDefault();

  const email = document.getElementById('email-login').value.trim();
  const password = document.getElementById('password-login').value.trim();

  if (email && password) {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      document.location.replace('/');
    } else {
      feedbackEl.innerHTML = `${response.statusText}`;
    }
  }
}

submitBtn.disabled = true;

loginForm.addEventListener("keyup", validateForm);
loginForm.addEventListener("change", validateForm);
loginForm.addEventListener('submit', loginFormHandler);