const radioForm = document.getElementById('radio-form');
const urlRadioLabel = document.getElementById('url-radio-label');
const urlRadio = document.getElementById('url-radio');
const fileRadioLabel = document.getElementById('file-radio-label');
const fileRadio = document.getElementById('file-radio');

const urlScreenshotForm = document.getElementById('url-screenshot-form');
const urlInput = document.getElementById('url-input');
const urlCaptionInput = document.getElementById('url-caption-input');
const urlSubmitBtn = document.getElementById('url-submit-btn');

const fileUploadForm = document.getElementById('file-upload-form');
const fileInput = document.getElementById('file-input');
const imagePreview = document.getElementById('image-preview');
const fileCaptionInput = document.getElementById('file-caption-input');
const fileSubmitBtn = document.getElementById('file-submit-btn');

const feedbackEl = document.getElementById('feedback');

function radioHandler() {
  if (urlRadio.checked) {
    fileUploadForm.style.display = "none";
    fileRadioLabel.style.borderBottom = "none";
    urlScreenshotForm.style.display = "block";
    urlRadioLabel.style.borderBottom =  "#cff03f solid 3px";
    urlCaptionInput.value = fileCaptionInput.value;
    feedbackEl.innerHTML = ``;
  } else if (fileRadio.checked) {
    urlScreenshotForm.style.display = "none";
    urlRadioLabel.style.borderBottom =  "none";
    fileUploadForm.style.display = "block";
    fileRadioLabel.style.borderBottom = "#cff03f solid 3px";
    fileCaptionInput.value = urlCaptionInput.value;
    feedbackEl.innerHTML = ``;
  }
}

async function uploadScreenshot(event) {
  event.preventDefault();

  const url = urlInput.value.trim();
  if (!url) {
    feedbackEl.innerHTML = `Please enter a url`;
    return;
  }

  urlSubmitBtn.disabled = true;
  urlInput.disabled = true;
  urlCaptionInput.disabled = true;
  fileInput.disabled = true;
  fileCaptionInput.disabled = true;
  fileSubmitBtn.disabled = true;

  feedbackEl.innerHTML = `Loading...`;

  const caption = urlCaptionInput.value.trim() || null;
  
  const response = await fetch('/api/posts/url', {
    method: 'POST',
    body: JSON.stringify({
      url: url,
      caption: caption
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    feedbackEl.innerHTML = `${response.statusText}`;
    reenableForms();
  }
}

function imageValidationAndPreview(event) {
  const filePath = fileInput.value;

  var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

  // checks to make sure the uploaded file is a .jpg, .jpeg, or .png file
  if (!allowedExtensions.exec(filePath)) {
    feedbackEl.innerHTML = `Invalid file type`;
    fileInput.value = '';
    imagePreview.innerHTML = '';
    return;
  }

  // loads image preview to #imagePreview
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = event => {
      imagePreview.innerHTML = `<img width="250px" src="${event.target.result}" />`;
    }

    reader.readAsDataURL(fileInput.files[0]);
  }
}

async function uploadFile(event) {
  event.preventDefault();

  
  if (!fileInput.value) {
    feedbackEl.innerHTML = `Please load a file`;
    return;
  }

  fileInput.disabled = true;
  fileCaptionInput.disabled = true;
  fileSubmitBtn.disabled = true;
  urlSubmitBtn.disabled = true;
  urlInput.disabled = true;
  urlCaptionInput.disabled = true;

  feedbackEl.innerHTML = `Loading...`;

  const caption = fileCaptionInput.value.trim() || null;
  
  const formData = new FormData();
  formData.append('caption', caption);
  formData.append('file', fileInput.files[0]);
  
  const response = await fetch('/api/posts/file', {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    feedbackEl.innerHTML = `${response.statusText}`;
    reenableForms();
  }

}

function reenableForms() {
  urlSubmitBtn.disabled = false;
  urlInput.disabled = false;
  urlCaptionInput.disabled = false;
  fileInput.disabled = false;
  fileCaptionInput.disabled = false;
  fileSubmitBtn.disabled = false;
}

urlScreenshotForm.addEventListener('submit', uploadScreenshot);
fileUploadForm.addEventListener('submit', uploadFile);
fileInput.addEventListener('change', imageValidationAndPreview);
radioForm.addEventListener('change', radioHandler);