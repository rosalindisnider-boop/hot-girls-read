import { getProfile, saveProfile, getPosts, addPost, toggleLikePost, addCommentToPost, getAllBooks, saveCustomBook, getCustomBooks, searchOnlineLibrary, updatePost, getFriendsList } from './storage.js';

// Application State
let currentFilter = 'all';
let selectedBookForPost = null;
let currentRatingSelection = 0;
let userProfile = null;
let searchTimeoutId = null;
let editingPostId = null;
let currentView = 'feed';
let currentProfileTab = 'bookshelf';

// DOM Elements
const navAvatar = document.getElementById('nav-profile-avatar');
const profileAvatar = document.getElementById('profile-avatar');
const profileName = document.getElementById('profile-name');
const profileUsername = document.getElementById('profile-username');
const profileBio = document.getElementById('profile-bio');
const profileBooksCount = document.getElementById('profile-books-count');
const profileGoalCount = document.getElementById('profile-goal-count');

const feedContainer = document.getElementById('feed-container');
const currentlyReadingCard = document.getElementById('currently-reading-card');
const currentReadWidgetInfo = document.getElementById('current-read-widget-info');
const sidebarTrendingBooks = document.getElementById('sidebar-trending-books');

const filterButtons = document.querySelectorAll('.filter-btn');
const feedFilters = document.querySelector('.feed-filters');

// Modal Elements
const postModalOverlay = document.getElementById('post-modal-overlay');
const btnNewPostNav = document.getElementById('btn-new-post-nav');
const btnNewPostTrigger = document.getElementById('btn-new-post-trigger');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancelPost = document.getElementById('btn-cancel-post');
const btnSubmitPost = document.getElementById('btn-submit-post');

const bookSearchInput = document.getElementById('book-search');
const searchResultsDropdown = document.getElementById('search-results-dropdown');
const selectedBookDisplay = document.getElementById('selected-book-display');
const selectedBookCover = document.getElementById('selected-book-cover');
const selectedBookTitle = document.getElementById('selected-book-title');
const selectedBookAuthor = document.getElementById('selected-book-author');
const btnRemoveSelectedBook = document.getElementById('btn-remove-selected-book');

const statusRadios = document.querySelectorAll('input[name="reading-status"]');
const ratingFormGroup = document.getElementById('rating-form-group');
const ratingStarsInteractive = document.getElementById('rating-stars-interactive');
const postCommentTextarea = document.getElementById('post-comment');

// Add Custom Book Form
const customBookForm = document.getElementById('custom-book-form');
const customTitleInput = document.getElementById('custom-title');
const customAuthorInput = document.getElementById('custom-author');
const customGenreInput = document.getElementById('custom-genre');

// Profile View Elements
const profileDashboardView = document.getElementById('profile-dashboard-view');
const profileCoverBanner = document.getElementById('profile-cover-banner');
const profileAvatarDashboard = document.getElementById('profile-avatar-dashboard');
const profileNameDisplay = document.getElementById('profile-name-display');
const profileUsernameDisplay = document.getElementById('profile-username-display');
const profileBioDisplay = document.getElementById('profile-bio-display');

const btnEditProfileBtn = document.getElementById('btn-edit-profile-btn');
const editProfileForm = document.getElementById('edit-profile-form');
const btnCancelProfileEdit = document.getElementById('btn-cancel-profile-edit');

// Edit profile inputs
const editNameInput = document.getElementById('edit-name');
const editUsernameInput = document.getElementById('edit-username');
const editAvatarInput = document.getElementById('edit-avatar');
const editCoverInput = document.getElementById('edit-cover');
const editBioInput = document.getElementById('edit-bio');
const editGoalInput = document.getElementById('edit-goal');

// Profile tabs and views
const profileTabButtons = document.querySelectorAll('.profile-tab-btn');
const bookshelfGrid = document.getElementById('bookshelf-grid');
const friendsDashboardGrid = document.getElementById('friends-dashboard-grid');

// Refresh Page Logo Link
const logoRefresh = document.getElementById('logo-refresh');

// Initialize App
function init() {
  loadProfile();
  renderTrendingBooks();
  renderFeed();
  setupEventListeners();
}

// Load Profile Info
function loadProfile() {
  userProfile = getProfile();
  
  // Set navbar avatar
  if (navAvatar) {
    navAvatar.src = userProfile.avatar;
    navAvatar.alt = `${userProfile.name}'s Avatar`;
  }
  
  // Set profile card
  if (profileAvatar) {
    profileAvatar.src = userProfile.avatar;
    profileAvatar.alt = `${userProfile.name}'s Avatar`;
  }
  if (profileName) profileName.textContent = userProfile.name;
  if (profileUsername) profileUsername.textContent = `@${userProfile.username}`;
  if (profileBio) profileBio.textContent = userProfile.bio;
  if (profileBooksCount) profileBooksCount.textContent = userProfile.booksRead;
  if (profileGoalCount) profileGoalCount.textContent = userProfile.readingGoal;

  // Set Profile Dashboard View details
  if (profileAvatarDashboard) {
    profileAvatarDashboard.src = userProfile.avatar;
    profileAvatarDashboard.alt = `${userProfile.name}'s Avatar`;
  }
  if (profileNameDisplay) profileNameDisplay.textContent = userProfile.name;
  if (profileUsernameDisplay) profileUsernameDisplay.textContent = `@${userProfile.username}`;
  if (profileBioDisplay) profileBioDisplay.textContent = userProfile.bio;
  if (profileCoverBanner) {
    profileCoverBanner.style.backgroundImage = `url('${userProfile.cover || "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80"}')`;
  }

  updateCurrentlyReadingWidget();
}

// Update the Left Sidebar "Currently Reading" Widget
function updateCurrentlyReadingWidget() {
  const posts = getPosts();
  // Find latest post with status "reading"
  const activeReadPost = posts.find(p => p.status === 'reading' && p.user.username === userProfile.username);

  if (activeReadPost) {
    currentlyReadingCard.style.display = 'block';
    currentReadWidgetInfo.innerHTML = `
      <img class="mini-book-cover" src="${activeReadPost.book.cover}" alt="${activeReadPost.book.title} Cover">
      <div class="mini-book-info">
        <span class="mini-book-title">${activeReadPost.book.title}</span>
        <span class="mini-book-author">by ${activeReadPost.book.author}</span>
        <span class="mini-book-genre" style="font-size: 0.65rem; background: var(--color-accent-light); color: var(--color-primary); padding: 1px 6px;">
          Reading Progress
        </span>
      </div>
    `;
    
    // Add click to edit or view this post
    currentReadWidgetInfo.onclick = () => {
      openPostModal(activeReadPost.book, activeReadPost.id);
    };
  } else {
    currentlyReadingCard.style.display = 'none';
  }
}

// Render Trending Books Sidebar (Right)
function renderTrendingBooks() {
  const allBooks = getAllBooks();
  // Take first 5 books for the sidebar
  const featured = allBooks.slice(0, 5);
  
  sidebarTrendingBooks.innerHTML = '';
  featured.forEach(book => {
    const item = document.createElement('div');
    item.className = 'mini-book-item';
    item.innerHTML = `
      <img class="mini-book-cover" src="${book.cover}" alt="${book.title} Cover">
      <div class="mini-book-info">
        <span class="mini-book-title">${book.title}</span>
        <span class="mini-book-author">${book.author}</span>
        <span class="mini-book-genre">${book.genre || 'Book'}</span>
      </div>
    `;
    
    item.addEventListener('click', () => {
      openPostModal(book);
    });
    
    sidebarTrendingBooks.appendChild(item);
  });
}

// Render Feed Posts
function renderFeed() {
  const posts = getPosts();
  
  // Apply filter
  let filteredPosts = posts;
  if (currentFilter === 'reading') {
    filteredPosts = posts.filter(p => p.status === 'reading');
  } else if (currentFilter === 'finished') {
    filteredPosts = posts.filter(p => p.status === 'finished');
  }

  feedContainer.innerHTML = '';

  if (filteredPosts.length === 0) {
    feedContainer.innerHTML = `
      <div class="card empty-state">
        <div class="empty-state-icon">📚</div>
        <h3>No updates yet</h3>
        <p>Start sharing what you are reading or select finished to post reviews!</p>
      </div>
    `;
    return;
  }

  filteredPosts.forEach(post => {
    const postCard = document.createElement('article');
    postCard.className = 'card post-card';
    postCard.dataset.id = post.id;

    // Create star display if rating exists
    let ratingStarsHtml = '';
    if (post.status === 'finished' && post.rating > 0) {
      ratingStarsHtml = `<div class="post-rating">`;
      for (let i = 1; i <= 5; i++) {
        ratingStarsHtml += `<span class="star ${i <= post.rating ? 'filled' : ''}">★</span>`;
      }
      ratingStarsHtml += `</div>`;
    }

    const badgeLabel = post.status === 'reading' ? '📖 Reading' : '🏆 Finished';
    const badgeClass = post.status === 'reading' ? 'reading' : 'finished';

    // Comments HTML
    let commentsListHtml = '';
    if (post.comments && post.comments.length > 0) {
      commentsListHtml = `
        <div class="comment-list">
          ${post.comments.map(c => `
            <div class="comment-item">
              <img class="comment-avatar" src="${c.user.avatar}" alt="${c.user.name}">
              <div class="comment-body">
                <div>
                  <span class="comment-user-name">${c.user.name}</span>
                  <span class="comment-text">${escapeHTML(c.text)}</span>
                </div>
                <div class="comment-meta">${c.timestamp || 'Just now'}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    postCard.innerHTML = `
      <div class="post-header">
        <img class="post-avatar" src="${post.user.avatar}" alt="${post.user.name}">
        <div class="post-user-info">
          <span class="post-user-name">${post.user.name}</span>
          <span class="post-user-handle">@${post.user.username}</span>
        </div>
        <span class="post-status-badge ${badgeClass}">${badgeLabel}</span>
        <span class="post-meta">${post.timestamp}</span>
      </div>

      <div class="post-book-subcard">
        <img class="post-book-cover" src="${post.book.cover}" alt="${post.book.title} Cover">
        <div class="post-book-details">
          <span class="post-book-title">${post.book.title}</span>
          <span class="post-book-author">by ${post.book.author}</span>
          <span class="mini-book-genre" style="margin-top: 4px;">${post.book.genre}</span>
          ${ratingStarsHtml}
        </div>
      </div>

      ${post.comment ? `<p class="post-comment-text">${escapeHTML(post.comment)}</p>` : ''}
      
      ${(() => {
        const isCurrentUserPost = post.user.username === userProfile.username;
        const canUpdateProgress = isCurrentUserPost && post.status === 'reading';
        const updateProgressBtnHtml = canUpdateProgress ? `
          <button class="action-btn update-progress-btn" data-post-id="${post.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px; vertical-align: middle;">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Update Status
          </button>
        ` : '';
        return `
          <div class="post-actions">
            <button class="action-btn like-btn ${post.likedByUser ? 'active' : ''}" data-post-id="${post.id}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span class="like-count">${post.likes}</span> Likes
            </button>
            <button class="action-btn comment-trigger-btn" data-post-id="${post.id}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>${post.comments ? post.comments.length : 0}</span> Comments
            </button>
            ${updateProgressBtnHtml}
          </div>
        `;
      })()}

      <div class="post-comments-container">
        ${commentsListHtml}
        <form class="comment-input-form" data-post-id="${post.id}">
          <input type="text" class="comment-input" placeholder="Type a comment..." required>
          <button type="submit" class="comment-submit-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
    `;

    feedContainer.appendChild(postCard);
  });
}

// Open Modal Panel
function openPostModal(preSelectedBook = null, postId = null) {
  postModalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  const modalTitle = document.querySelector('.modal-title');

  if (postId) {
    editingPostId = postId;
    if (modalTitle) modalTitle.textContent = 'Update Reading Progress';
    btnSubmitPost.textContent = 'Save Progress';
    btnRemoveSelectedBook.style.display = 'none';

    const posts = getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      selectBook(post.book);
      const statusRadio = document.querySelector(`input[name="reading-status"][value="${post.status}"]`);
      if (statusRadio) statusRadio.checked = true;

      if (post.status === 'finished') {
        ratingFormGroup.classList.add('active');
        currentRatingSelection = post.rating;
        const interactiveStars = ratingStarsInteractive.querySelectorAll('.star-interactive');
        interactiveStars.forEach(s => {
          s.classList.toggle('active', parseInt(s.dataset.val) <= currentRatingSelection);
        });
      } else {
        ratingFormGroup.classList.remove('active');
        resetStars();
      }

      postCommentTextarea.value = post.comment || '';
    }
  } else {
    editingPostId = null;
    if (modalTitle) modalTitle.textContent = 'New Book Update';
    btnSubmitPost.textContent = 'Post Update';
    btnRemoveSelectedBook.style.display = 'block';

    if (preSelectedBook) {
      selectBook(preSelectedBook);
    } else {
      resetSelectedBook();
    }
  }
}

// Close Modal Panel
function closeModal() {
  postModalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  
  editingPostId = null;
  const modalTitle = document.querySelector('.modal-title');
  if (modalTitle) modalTitle.textContent = 'New Book Update';
  btnSubmitPost.textContent = 'Post Update';
  btnRemoveSelectedBook.style.display = 'block';

  // Reset fields
  bookSearchInput.value = '';
  searchResultsDropdown.classList.remove('active');
  searchResultsDropdown.innerHTML = '';
  postCommentTextarea.value = '';
  
  // Reset radios
  document.querySelector('input[name="reading-status"][value="reading"]').checked = true;
  ratingFormGroup.classList.remove('active');
  resetStars();
}

// Select Book for Post Creation
function selectBook(book) {
  selectedBookForPost = book;
  
  // Update modal view
  bookSearchInput.style.display = 'none';
  searchResultsDropdown.classList.remove('active');
  
  selectedBookCover.src = book.cover;
  selectedBookTitle.textContent = book.title;
  selectedBookAuthor.textContent = `by ${book.author}`;
  selectedBookDisplay.classList.add('active');
}

// Remove Selected Book in Modal
function resetSelectedBook() {
  selectedBookForPost = null;
  
  bookSearchInput.style.display = 'block';
  bookSearchInput.value = '';
  bookSearchInput.focus();
  
  selectedBookDisplay.classList.remove('active');
  selectedBookCover.src = '';
  selectedBookTitle.textContent = '';
  selectedBookAuthor.textContent = '';
}

// Reset interactive rating stars
function resetStars() {
  currentRatingSelection = 0;
  const stars = ratingStarsInteractive.querySelectorAll('.star-interactive');
  stars.forEach(s => s.classList.remove('active', 'hover'));
}

// Switch views between Feed and Profile
function switchView(viewName) {
  currentView = viewName;
  if (viewName === 'profile') {
    // Hide Feed elements
    btnNewPostTrigger.style.display = 'none';
    feedFilters.style.display = 'none';
    feedContainer.style.display = 'none';
    
    // Show Profile Dashboard
    profileDashboardView.style.display = 'flex';
    
    // Render Profile Contents
    renderProfileDashboard();
  } else {
    // Show Feed elements
    btnNewPostTrigger.style.display = 'flex';
    feedFilters.style.display = 'flex';
    feedContainer.style.display = 'flex';
    
    // Hide Profile Dashboard
    profileDashboardView.style.display = 'none';
    
    // Close Edit panel if open
    editProfileForm.style.display = 'none';
  }
}

// Switch Profile Dashboard tab views
function switchProfileTab(tabName) {
  currentProfileTab = tabName;
  
  // Update active button state
  profileTabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  
  // Hide all tab panes
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
    pane.style.display = 'none';
  });
  
  // Show active tab pane
  const activePane = document.getElementById(`tab-${tabName}`);
  if (activePane) {
    activePane.classList.add('active');
    activePane.style.display = 'block';
  }
  
  // Trigger rendering for the active tab content
  if (tabName === 'bookshelf') {
    renderProfileBookshelf();
  } else if (tabName === 'stats') {
    renderProfileStats();
  } else if (tabName === 'friends') {
    renderProfileFriends();
  }
}

// Render Profile Dashboard View wrapper
function renderProfileDashboard() {
  loadProfile();
  switchProfileTab(currentProfileTab);
}

// Render User Bookshelf grid (derived from user's posts)
function renderProfileBookshelf() {
  const posts = getPosts();
  const userPosts = posts.filter(p => p.user.username === userProfile.username);
  
  // De-duplicate books, preferring 'finished' status
  const uniqueBooksMap = new Map();
  userPosts.forEach(post => {
    const key = post.book.title.toLowerCase();
    if (!uniqueBooksMap.has(key) || (post.status === 'finished' && uniqueBooksMap.get(key).status === 'reading')) {
      uniqueBooksMap.set(key, {
        book: post.book,
        status: post.status
      });
    }
  });
  
  bookshelfGrid.innerHTML = '';
  if (uniqueBooksMap.size === 0) {
    bookshelfGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: var(--color-text-muted);">
        <span style="font-size: 2.5rem; display: block; margin-bottom: 8px;">📚</span>
        <p style="font-weight: 500;">No books on your shelf yet.</p>
        <p style="font-size: 0.85rem; margin-top: 4px;">Update what you are reading or finished to see them here!</p>
      </div>
    `;
    return;
  }
  
  uniqueBooksMap.forEach(({ book, status }) => {
    const item = document.createElement('div');
    item.className = 'bookshelf-item';
    const badgeLabel = status === 'reading' ? 'Reading' : 'Finished';
    const badgeClass = status === 'reading' ? 'reading' : 'finished';
    
    item.innerHTML = `
      <span class="bookshelf-badge ${badgeClass}">${badgeLabel}</span>
      <img class="bookshelf-cover" src="${book.cover}" alt="${book.title}" onerror="this.src='https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80'">
      <div class="bookshelf-title" title="${book.title}">${book.title}</div>
      <div class="bookshelf-author">by ${book.author}</div>
    `;
    
    item.addEventListener('click', () => {
      openPostModal(book);
    });
    bookshelfGrid.appendChild(item);
  });
}

// Calculate and render reading stats/goals
function renderProfileStats() {
  const posts = getPosts();
  const userPosts = posts.filter(p => p.user.username === userProfile.username);
  
  const finishedPosts = userPosts.filter(p => p.status === 'finished');
  const readingPosts = userPosts.filter(p => p.status === 'reading');
  
  const totalRead = finishedPosts.length;
  const currentlyReading = readingPosts.length;
  const likesReceived = userPosts.reduce((acc, p) => acc + (p.likes || 0), 0);
  
  const ratingSum = finishedPosts.reduce((acc, p) => acc + (p.rating || 0), 0);
  const avgRating = finishedPosts.length > 0 ? (ratingSum / finishedPosts.length).toFixed(1) : '0.0';
  
  document.getElementById('stat-books-read').textContent = totalRead;
  document.getElementById('stat-books-reading').textContent = currentlyReading;
  document.getElementById('stat-likes-received').textContent = likesReceived;
  document.getElementById('stat-avg-rating').textContent = avgRating;
  
  // Reading challenge goal progress
  const goal = userProfile.readingGoal || 50;
  const percentage = Math.min(100, Math.round((totalRead / goal) * 100));
  
  const progressFill = document.getElementById('goal-progress-fill');
  const progressText = document.getElementById('goal-progress-text');
  
  if (progressFill) progressFill.style.width = `${percentage}%`;
  if (progressText) {
    progressText.textContent = `${totalRead} of ${goal} books read (${percentage}% completed)`;
  }
  
  // Genre breakdown
  const genresMap = {};
  userPosts.forEach(p => {
    const genre = p.book.genre || 'General';
    genresMap[genre] = (genresMap[genre] || 0) + 1;
  });
  
  const sortedGenres = Object.entries(genresMap).sort((a, b) => b[1] - a[1]);
  const maxCount = sortedGenres.length > 0 ? sortedGenres[0][1] : 1;
  
  const chartContainer = document.getElementById('genre-chart-container');
  chartContainer.innerHTML = '';
  
  if (sortedGenres.length === 0) {
    chartContainer.innerHTML = `
      <p style="text-align: center; color: var(--color-text-muted); font-size: 0.9rem; padding: 20px;">
        No genre stats available yet. Start sharing book updates to see insights!
      </p>
    `;
    return;
  }
  
  sortedGenres.forEach(([genre, count]) => {
    const pct = Math.round((count / maxCount) * 100);
    const row = document.createElement('div');
    row.className = 'genre-bar-row';
    row.innerHTML = `
      <div class="genre-bar-label">${genre}</div>
      <div class="genre-bar-track">
        <div class="genre-bar-fill" style="width: ${pct}%"></div>
      </div>
      <div class="genre-bar-count">${count}</div>
    `;
    chartContainer.appendChild(row);
  });
}

// Render friends list card items
function renderProfileFriends() {
  const friends = getFriendsList();
  friendsDashboardGrid.innerHTML = '';
  
  friends.forEach(f => {
    const card = document.createElement('div');
    card.className = 'friend-dashboard-card';
    const statusText = f.status === 'reading' ? `📖 Reading <em>${f.bookTitle}</em>` : `🏆 Finished <em>${f.bookTitle}</em>`;
    
    card.innerHTML = `
      <img class="friend-dashboard-avatar" src="${f.avatar}" alt="${f.name}">
      <div class="friend-dashboard-info">
        <span class="friend-dashboard-name">${f.name}</span>
        <span class="friend-dashboard-username">@${f.username}</span>
        <span class="friend-dashboard-status">${statusText}</span>
      </div>
    `;
    friendsDashboardGrid.appendChild(card);
  });
}

// Event Listeners Setup
function setupEventListeners() {
  // Navigation Logo click - scrolls to top, resets filter, switches to feed view
  logoRefresh.addEventListener('click', (e) => {
    e.preventDefault();
    currentFilter = 'all';
    filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === 'all');
    });
    switchView('feed');
    renderFeed();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Filters Selection
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderFeed();
    });
  });

  // Modal Open Triggers
  btnNewPostNav.addEventListener('click', () => openPostModal());
  btnNewPostTrigger.addEventListener('click', () => openPostModal());

  // Modal Close Triggers
  btnCloseModal.addEventListener('click', closeModal);
  btnCancelPost.addEventListener('click', closeModal);
  postModalOverlay.addEventListener('click', (e) => {
    if (e.target === postModalOverlay) closeModal();
  });

  // Live Auto-Complete Book Search (Debounced & Online Library API)
  bookSearchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase().trim();
    if (!val) {
      searchResultsDropdown.classList.remove('active');
      searchResultsDropdown.innerHTML = '';
      return;
    }

    // Show a loading spinner immediately
    searchResultsDropdown.innerHTML = `
      <div class="search-result-item" style="cursor: default; justify-content: center; gap: 8px; padding: 16px;">
        <span class="spinner-mini"></span>
        <span style="color: var(--color-text-muted); font-size: 0.85rem; font-weight: 500;">Searching online library...</span>
      </div>
    `;
    searchResultsDropdown.classList.add('active');

    // Debounce the API request
    clearTimeout(searchTimeoutId);
    searchTimeoutId = setTimeout(async () => {
      // Ensure the user hasn't cleared the input in the meantime
      if (bookSearchInput.value.trim() !== val) return;

      try {
        const matches = await searchOnlineLibrary(val);
        searchResultsDropdown.innerHTML = '';

        if (matches.length > 0) {
          matches.forEach(book => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `
              <img class="search-result-cover" src="${book.cover}" alt="${book.title}" onerror="this.src='https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80'">
              <div class="search-result-info">
                <span class="search-result-title" title="${book.title}">${book.title}</span>
                <span class="search-result-author">by ${book.author}</span>
              </div>
            `;
            item.addEventListener('click', () => selectBook(book));
            searchResultsDropdown.appendChild(item);
          });
          searchResultsDropdown.classList.add('active');
        } else {
          searchResultsDropdown.innerHTML = `
            <div class="search-result-item" style="cursor: default; padding: 12px 14px;">
              <div class="search-result-info">
                <span class="search-result-title" style="color: var(--color-text-muted);">No books found online</span>
                <span class="search-result-author">Try adjusting your spelling or add a custom book!</span>
              </div>
            </div>
          `;
          searchResultsDropdown.classList.add('active');
        }
      } catch (err) {
        console.error('Online library search failed:', err);
        searchResultsDropdown.innerHTML = `
          <div class="search-result-item" style="cursor: default; padding: 12px 14px;">
            <div class="search-result-info">
              <span class="search-result-title" style="color: var(--color-primary);">Search Error</span>
              <span class="search-result-author">Failed to connect to book database. Please try again.</span>
            </div>
          </div>
        `;
        searchResultsDropdown.classList.add('active');
      }
    }, 400); // 400ms debounce
  });

  // Hide Search Suggests on Click Outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
      searchResultsDropdown.classList.remove('active');
    }
  });

  // Remove Selected Book Button
  btnRemoveSelectedBook.addEventListener('click', resetSelectedBook);

  // Status Radios Change Listener
  statusRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'finished') {
        ratingFormGroup.classList.add('active');
      } else {
        ratingFormGroup.classList.remove('active');
        resetStars();
      }
    });
  });

  // Interactive Stars Rating Events
  const interactiveStars = ratingStarsInteractive.querySelectorAll('.star-interactive');
  interactiveStars.forEach(star => {
    star.addEventListener('mouseenter', () => {
      const hoverVal = parseInt(star.dataset.val);
      interactiveStars.forEach(s => {
        s.classList.toggle('hover', parseInt(s.dataset.val) <= hoverVal);
      });
    });

    star.addEventListener('mouseleave', () => {
      interactiveStars.forEach(s => s.classList.remove('hover'));
    });

    star.addEventListener('click', () => {
      currentRatingSelection = parseInt(star.dataset.val);
      interactiveStars.forEach(s => {
        s.classList.toggle('active', parseInt(s.dataset.val) <= currentRatingSelection);
      });
    });
  });

  // Post Submission
  btnSubmitPost.addEventListener('click', () => {
    if (!selectedBookForPost) {
      alert('Please select or search for a book first!');
      bookSearchInput.focus();
      return;
    }

    const comment = postCommentTextarea.value.trim();
    const status = document.querySelector('input[name="reading-status"]:checked').value;
    const rating = status === 'finished' ? currentRatingSelection : 0;

    if (editingPostId) {
      updatePost(editingPostId, {
        status: status,
        rating: rating,
        comment: comment
      });
    } else {
      const newPost = {
        id: `post_${Date.now()}`,
        user: {
          name: userProfile.name,
          username: userProfile.username,
          avatar: userProfile.avatar
        },
        book: selectedBookForPost,
        status: status,
        rating: rating,
        comment: comment,
        likes: 0,
        likedByUser: false,
        comments: [],
        timestamp: "Just now"
      };
      addPost(newPost);
    }

    closeModal();
    loadProfile(); // Updates count stats and currently reading card
    renderFeed();
  });

  // Feed Event Delegation: Likes and Comment Forms
  feedContainer.addEventListener('click', (e) => {
    // Likes Button
    const likeBtn = e.target.closest('.like-btn');
    if (likeBtn) {
      const postId = likeBtn.dataset.postId;
      const updatedPosts = toggleLikePost(postId);
      const post = updatedPosts.find(p => p.id === postId);
      
      likeBtn.classList.toggle('active', post.likedByUser);
      likeBtn.querySelector('.like-count').textContent = post.likes;
      
      // Heart Pop animation effect handled by CSS
      return;
    }

    // Comment Input Focus Trigger
    const commentTrigger = e.target.closest('.comment-trigger-btn');
    if (commentTrigger) {
      const postId = commentTrigger.dataset.postId;
      const card = feedContainer.querySelector(`[data-id="${postId}"]`);
      if (card) {
        const inputField = card.querySelector('.comment-input');
        if (inputField) inputField.focus();
      }
      return;
    }

    // Update Progress Button Trigger
    const updateProgressBtn = e.target.closest('.update-progress-btn');
    if (updateProgressBtn) {
      const postId = updateProgressBtn.dataset.postId;
      const posts = getPosts();
      const post = posts.find(p => p.id === postId);
      if (post) {
        openPostModal(post.book, postId);
      }
      return;
    }
  });

  // Feed Event Delegation: Comments Submission
  feedContainer.addEventListener('submit', (e) => {
    const form = e.target.closest('.comment-input-form');
    if (form) {
      e.preventDefault();
      const postId = form.dataset.postId;
      const inputField = form.querySelector('.comment-input');
      const val = inputField.value.trim();
      
      if (!val) return;

      addCommentToPost(postId, val, userProfile);
      inputField.value = '';
      
      renderFeed();
    }
  });

  // Custom Book Form Submission (Right Sidebar)
  customBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = customTitleInput.value.trim();
    const author = customAuthorInput.value.trim();
    const genre = customGenreInput.value.trim() || 'Fiction';

    if (!title || !author) return;

    // Generate a beautiful placeholder cover based on OpenLibrary title search
    // Or a generic gorgeous SVG/Unsplash path. 
    // OpenLibrary covers don't support searching by title immediately, so we can use a high-quality Unsplash read image
    const randomCovers = [
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=300&q=80"
    ];
    const coverUrl = randomCovers[Math.floor(Math.random() * randomCovers.length)];

    const customBook = {
      id: `custom_${Date.now()}`,
      title: title,
      author: author,
      cover: coverUrl,
      genre: genre,
      pages: 300,
      description: "A wonderful custom added book."
    };

    saveCustomBook(customBook);
    
    // Clear Form inputs
    customTitleInput.value = '';
    customAuthorInput.value = '';
    customGenreInput.value = '';

    // Alert user with a premium custom alert message, then refresh
    alert(`"${title}" has been successfully added to your database! You can now search for it when creating a post.`);
    renderTrendingBooks();
  });

  // Switch to Profile View Triggers
  if (navAvatar) navAvatar.addEventListener('click', () => switchView('profile'));
  if (profileAvatar) profileAvatar.addEventListener('click', () => switchView('profile'));
  if (profileName) profileName.addEventListener('click', () => switchView('profile'));
  if (profileUsername) profileUsername.addEventListener('click', () => switchView('profile'));

  // Profile Dashboard tab controls
  profileTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchProfileTab(btn.dataset.tab);
    });
  });

  // Toggle Edit Profile Panel
  if (btnEditProfileBtn) {
    btnEditProfileBtn.addEventListener('click', () => {
      const isHidden = editProfileForm.style.display === 'none';
      if (isHidden) {
        editNameInput.value = userProfile.name;
        editUsernameInput.value = userProfile.username;
        editAvatarInput.value = userProfile.avatar || '';
        editCoverInput.value = userProfile.cover || '';
        editBioInput.value = userProfile.bio || '';
        editGoalInput.value = userProfile.readingGoal || 50;
        
        editProfileForm.style.display = 'flex';
      } else {
        editProfileForm.style.display = 'none';
      }
    });
  }

  // Cancel profile edits
  if (btnCancelProfileEdit) {
    btnCancelProfileEdit.addEventListener('click', () => {
      editProfileForm.style.display = 'none';
    });
  }

  // Submit profile edits
  if (editProfileForm) {
    editProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const updated = {
        ...userProfile,
        name: editNameInput.value.trim(),
        username: editUsernameInput.value.trim(),
        avatar: editAvatarInput.value.trim(),
        cover: editCoverInput.value.trim(),
        bio: editBioInput.value.trim(),
        readingGoal: parseInt(editGoalInput.value) || 50
      };
      saveProfile(updated);
      editProfileForm.style.display = 'none';
      loadProfile();
      renderProfileDashboard();
    });
  }
}

// Utility: Escape HTML to prevent XSS
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Start Application
window.addEventListener('DOMContentLoaded', init);
