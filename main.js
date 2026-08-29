// --- DOM Elements ---
// Navigation & Main Screens
const containerOne = document.querySelector('.container-one');
const writeBtn = document.querySelector('#write-BTN');
const seeBtn = document.querySelector('#seeBtn');
const postDiv = document.querySelector('#posts');
const backBtn = document.querySelector('#go-back');

// Auth Screens & Elements
const authWind = document.querySelector('.Auth-wind');
const authFormContainer = document.querySelector('.auth-form');
const authForm = document.querySelector('#id-form');
const loginTab = document.querySelector('#login');
const registerTab = document.querySelector('#register');

// Auth Inputs & Buttons
const confirmPassGroup = document.querySelectorAll('.auth-form .input-group')[2]; // 3rd input group
const authSubmitBtn = document.querySelector('.auth-form button[type="submit"]');
const authCancelBtn = document.querySelector('.auth-form button[type="button"]');

// Blog Form Elements
const blogFormContainer = document.querySelector('.form');
const blogForm = document.querySelector('#qu');
const titleInput = document.querySelector('#title');
const blogInput = document.querySelector('#blog');
const blogCancelBtn = document.querySelector('#cancelBtn');

// --- State Variables ---
let isLoggedIn = false;
let isRegisterMode = false;

// --- Utility Functions ---

// Hides all views to avoid layout overlap
function hideAllViews() {
  containerOne.classList.add('hidden');
  authWind.classList.add('hidden');
  authFormContainer.classList.add('hidden');
  blogFormContainer.classList.add('hidden');
  postDiv.classList.add('hidden');
}

// Renders a single post card inside #posts
function createPostElement(title, content) {
  const newPost = document.createElement('article');
  newPost.className = 'post-card';
  newPost.innerHTML = `
    <h2>${title}</h2>
    <p>${content}</p>
  `;
  postDiv.appendChild(newPost);
}

// Saves post array to browser memory
function savePostToStorage(title, content) {
  const storedPosts = JSON.parse(localStorage.getItem('my_blogs') || '[]');
  storedPosts.push({ title, content });
  localStorage.setItem('my_blogs', JSON.stringify(storedPosts));
}

// Loads posts from localStorage on refresh
function loadPosts() {
  const storedPosts = JSON.parse(localStorage.getItem('my_blogs') || '[]');
  storedPosts.forEach(post => createPostElement(post.title, post.content));
}

// Initial Load
loadPosts();

// --- Auth Tab Switching Logic ---

loginTab.addEventListener('click', () => {
  isRegisterMode = false;
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  confirmPassGroup.classList.add('hidden');
  authSubmitBtn.textContent = 'Sign in';
});

registerTab.addEventListener('click', () => {
  isRegisterMode = true;
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
  confirmPassGroup.classList.remove('hidden');
  authSubmitBtn.textContent = 'Register Account';
});

// --- Main Navigation Listeners ---

// "Write New Blog" Click
writeBtn.addEventListener('click', () => {
  hideAllViews();
  if (!isLoggedIn) {
    // Prompt auth windows if user isn't logged in
    authWind.classList.remove('hidden');
    authFormContainer.classList.remove('hidden');
  } else {
    // Open blog creation form directly
    blogFormContainer.classList.remove('hidden');
  }
});

// Auth Form Submission (Simulating Login / Register)
authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Set user as authenticated
  isLoggedIn = true;
  authForm.reset();

  // Redirect directly to the blog writing form
  hideAllViews();
  blogFormContainer.classList.remove('hidden');
});

// Auth Cancel Button
authCancelBtn.addEventListener('click', () => {
  hideAllViews();
  containerOne.classList.remove('hidden');
});

// Blog Form Submission (Creating a Post)
blogForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const titleValue = titleInput.value.trim();
  const blogValue = blogInput.value.trim();

  if (!titleValue || !blogValue) {
    alert('Please fill out both the title and content!');
    return;
  }

  // Create & persist the post
  createPostElement(titleValue, blogValue);
  savePostToStorage(titleValue, blogValue);

  // Reset form & return home
  blogForm.reset();
  hideAllViews();
  containerOne.classList.remove('hidden');
});

// Blog Form Cancel Button
blogCancelBtn.addEventListener('click', () => {
  hideAllViews();
  containerOne.classList.remove('hidden');
});

// "See Old Blogs" Click
seeBtn.addEventListener('click', () => {
  hideAllViews();
  postDiv.classList.remove('hidden');
});

// "Go Back" Click
backBtn.addEventListener('click', () => {
  hideAllViews();
  containerOne.classList.remove('hidden');
});