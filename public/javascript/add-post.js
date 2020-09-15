const radioForm = document.getElementById('radio-form');
const urlRadio = document.getElementById('url-radio');
const fileRadio = document.getElementById('file-radio');

const urlScreenshotForm = document.getElementById('url-screenshot-form');
const urlInput = document.getElementById('url-input');
const urlCaptionInput = document.getElementById('url-caption-input');

const fileUploadForm = document.getElementById('file-upload-form');
const fileInput = document.getElementById('file-input');
const imagePreview = document.getElementById('image-preview');
const fileCaptionInput = document.getElementById('file-caption-input');

function radioHandler() {
  if (urlRadio.checked) {
    fileUploadForm.style.display = "none";
    urlScreenshotForm.style.display = "block";
  } else if (fileRadio.checked) {
    urlScreenshotForm.style.display = "none";
    fileUploadForm.style.display = "block";
  }
}

async function uploadScreenshot(event) {
  event.preventDefault();

  const url = urlInput.value.trim();
  if (!url) {
    alert(`Please enter a url`);
    return;
  }
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
    alert(response.statusText);
  }
}

function imageValidationAndPreview(event) {
  const filePath = fileInput.value;

  var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

  // checks to make sure the uploaded file is a .jpg, .jpeg, or .png file
  if (!allowedExtensions.exec(filePath)) {
    alert('Invalid file type');
    fileInput.value = '';
    imagePreview.innerHTML = '';
    return;
  }

  // loads image preview to #imagePreview
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = event => {
      imagePreview.innerHTML = `<img height="200px" src="${event.target.result}" />`;
    }

    reader.readAsDataURL(fileInput.files[0]);
  }
}

async function uploadFile(event) {
  event.preventDefault();
  
  if (!fileInput.value) {
    alert('Please load a file');
    return;
  }

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
    alert(response.statusText);
  }
}

urlScreenshotForm.addEventListener('submit', uploadScreenshot);
fileUploadForm.addEventListener('submit', uploadFile);
fileInput.addEventListener('change', imageValidationAndPreview);
radioForm.addEventListener('change', radioHandler);