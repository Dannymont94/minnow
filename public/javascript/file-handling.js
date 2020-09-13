const fileUploadForm = document.getElementById('file-upload-form');
const fileInput = document.getElementById('file-input');
const imagePreview = document.getElementById('image-preview');
const captionInput = document.getElementById('caption-input');

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
      imagePreview.innerHTML = `<img src="${event.target.result}" />`;
    }

    reader.readAsDataURL(fileInput.files[0]);
  }
}

function uploadFile(event) {
  event.preventDefault();
  const caption = captionInput.value.trim() || null;
  const formData = new FormData();
  
  formData.append('caption', caption);
  formData.append('file', fileInput.files[0]);
  
  fetch('/api/posts/file', {
    method: 'POST',
    body: formData
  });
}

fileUploadForm.addEventListener('submit', uploadFile);
fileInput.addEventListener('change', imageFileValidation);