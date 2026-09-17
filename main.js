// --- DOM Elements ---
// Navigation & Main Screens
const containerOne = document.querySelector('.container-one');
const writeBtn = document.querySelector('#write-BTN');
const seeBtn = document.querySelector('#seeBtn');
const postDiv = document.querySelector('#posts');
const backBtn = document.querySelector('#go-back');
const homeStatus = document.querySelector('#home-status');

// Blog Form Elements
const blogFormContainer = document.querySelector('.form');
const blogForm = document.querySelector('#qu');
const titleInput = document.querySelector('#title');
const blogInput = document.querySelector('#blog');
const blogCancelBtn = document.querySelector('#cancelBtn');

// --- State Variables ---
const API_URL = 'https://my-boilerplate-production.up.railway.app';
const telegramWebApp = window.Telegram?.WebApp;
const miniAppInitData = telegramWebApp?.initData || '';
let isLoggedIn = Boolean(miniAppInitData);
const postsStatus = document.querySelector('#posts-status');

// --- Utility Functions ---

// Hides all views to avoid layout overlap
function hideAllViews() {
  containerOne.classList.add('hidden');
  blogFormContainer.classList.add('hidden');
  postDiv.classList.add('hidden');
}

if (!isLoggedIn) {
  homeStatus.textContent = 'Open this page inside Telegram to connect your account.';
}

function apiHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `TelegramMiniApp ${miniAppInitData}`,
  };
}

// Renders a single post card inside #posts
function createPostElement(id, title, content) {
  const newPost = document.createElement('article');
  newPost.className = 'post-card';
  const titleElement = document.createElement('h2');
  const contentElement = document.createElement('p');
  const deleteButton = document.createElement('button');
  titleElement.textContent = title;
  contentElement.textContent = content;
  deleteButton.type = 'button';
  deleteButton.textContent = 'Delete';
  deleteButton.dataset.diaryId = id;
  deleteButton.addEventListener('click', () => deletePost(id));
  newPost.append(titleElement, contentElement, deleteButton);
  postDiv.appendChild(newPost);
}

async function loadPosts() {
  if (!miniAppInitData) {
    postsStatus.textContent = 'Open this page inside Telegram to load your diaries.';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/miniapp/diaries/`, {
      headers: apiHeaders(),
    });
    if (!response.ok) throw new Error('Unable to load diaries.');

    postDiv.querySelectorAll('.post-card').forEach((post) => post.remove());
    const diaries = await response.json();
    if (!diaries.length) {
      postsStatus.textContent = 'No diary entries yet.';
      return;
    }
    postsStatus.textContent = '';
    diaries.forEach((diary) => createPostElement(diary.id, diary.title, diary.content));
  } catch (error) {
    postsStatus.textContent = error.message;
  }
}

async function deletePost(id) {
  if (!confirm('Delete this diary entry?')) return;

  try {
    const response = await fetch(`${API_URL}/miniapp/diaries/${id}`, {
      method: 'DELETE',
      headers: apiHeaders(),
    });
    if (!response.ok) throw new Error('The diary entry could not be deleted.');
    await loadPosts();
  } catch (error) {
    alert(error.message);
  }
}

// Initial Mini App setup
telegramWebApp?.ready();
telegramWebApp?.expand();

// --- Main Navigation Listeners ---

// "Write New Blog" Click
writeBtn.addEventListener('click', () => {
  if (!isLoggedIn) {
    homeStatus.textContent = 'Open this page inside Telegram to create diary entries.';
    return;
  }
  hideAllViews();
  blogFormContainer.classList.remove('hidden');
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

  if (!miniAppInitData) {
    alert('Open this page inside Telegram to save diary entries.');
    return;
  }

  fetch(`${API_URL}/miniapp/diaries/`, {
    method: 'POST',
    headers: apiHeaders(),
    body: JSON.stringify({ title: titleValue, content: blogValue }),
  }).then(async (response) => {
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Save failed (${response.status}): ${detail || 'backend rejected the request.'}`);
    }
    blogForm.reset();
    hideAllViews();
    containerOne.classList.remove('hidden');
    await loadPosts();
  }).catch((error) => alert(error.message));

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
  loadPosts();
});

// "Go Back" Click
backBtn.addEventListener('click', () => {
  hideAllViews();
  containerOne.classList.remove('hidden');
});