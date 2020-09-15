const formEl = document.querySelector('form');
const submitBtn = document.getElementById('submit-btn');

async function checkInputValues(id, value) {
  let isValid = true;
  if (id.split('-')[0] === 'username') {
    // checks username value. Allows a-z, A-Z, 0-9, underscores, and dashes. Must be between 3 and 16 characters
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

async function checkForm() {
  let canSubmit = true;

  for (let i = 0; i < formEl.length - 1; i++) {
    const current = formEl[i];
    if (/\s/.test(current.value)) {
      // contains whitespace characters
      document.getElementById(`${current.id}-img`).src = 'https://static.thenounproject.com/png/114046-200.png';
      canSubmit = false;
    } else if (current.value.length == 0) {
      // input is blank
      document.getElementById(`${current.id}-img`).src = '';
      canSubmit = false;
    } else {
      if (await checkInputValues(current.id, current.value)) {
        // meets all requirements
        document.getElementById(`${current.id}-img`).src = 'https://static.thenounproject.com/png/6156-200.png';
      } else {
        // does not meet the requirements
        document.getElementById(`${current.id}-img`).src = 'https://static.thenounproject.com/png/114046-200.png';
        canSubmit = false;
      }
    }
  }

  submitBtn.disabled = !canSubmit;
}

submitBtn.disabled = true;

document.querySelector('form').addEventListener("keyup", checkForm);
document.querySelector('form').addEventListener("change", checkForm);