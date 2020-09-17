const signupForm = document.getElementById('signup-form');
const submitBtn = document.getElementById('submit-btn');
const feedbackEl = document.getElementById('feedback');

async function validateById(id, value) {
  let isValid = true;
  if (id.split('-')[0] === 'username') {
    // checks username value. Allows a-z, A-Z, 0-9, underscores, and dashes. Must be between 3 and 16 characters.
    if (!/^[a-zA-Z0-9_-]{3,16}$/.test(value)) {
      isValid = false;
    }
  } else if (id.split('-')[0] === 'email') {
    // checks for valid email
    if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
      isValid = false;
    }
  } else if (id.split('-')[0] === 'password') {
    // checks password value. Requires at least one uppercase letter, at least one lowercase letter, at least one number, at least one special character. Must be at least 6 characters.
    if (!/^(?=^.{6,}$)((?=.*\w)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[|!"$%&\/\(\)\?\^\'\\\+\-\*]))^.*$/.test(value)) {
      isValid = false;
    }
  } else {
    isValid = false;
  }
  return isValid;
}

async function validateForm() {
  let canSubmit = true;

  for (let i = 0; i < signupForm.length - 1; i++) {
    const current = signupForm[i];
    if (/\s/.test(current.value)) {
      // contains whitespace characters
      document.getElementById(`${current.id}-img`).src = '/icons/x.png';
      document.getElementById(`${current.id}-img`).alt = 'field value does not meet requirements';
      canSubmit = false;
    } else if (current.value.length == 0) {
      // input is blank
      document.getElementById(`${current.id}-img`).src = '';
      document.getElementById(`${current.id}-img`).alt = '';
      canSubmit = false;
    } else {
      if (await validateById(current.id, current.value)) {
        // meets all requirements
        document.getElementById(`${current.id}-img`).src = '/icons/check.png';
        document.getElementById(`${current.id}-img`).alt = 'field value meets all requirements';
      } else {
        // does not meet the requirements
        document.getElementById(`${current.id}-img`).src = '/icons/x.png';
        document.getElementById(`${current.id}-img`).alt = 'field value does not meet requirements';
        canSubmit = false;
      }
    }
  }

  submitBtn.disabled = !canSubmit;
}

async function signupFormHandler(event) {
  event.preventDefault();

  const username = document.getElementById('username-signup').value.trim();
  const email = document.getElementById('email-signup').value.trim();
  const password = document.getElementById('password-signup').value.trim();

  if (username && email && password) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        username,
        email,
        password
      }),
      headers: { 'Content-Type': 'application/json'}
    });
    if (response.ok) {
      document.location.replace('/');
    } else {
      feedbackEl.innerHTML = `${response.statusText}`;
    }
  }
}

submitBtn.disabled = true;

signupForm.addEventListener("keyup", validateForm);
signupForm.addEventListener("change", validateForm);
signupForm.addEventListener('submit', signupFormHandler);