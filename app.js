import { 
  getProfile, saveProfile, getPosts, addPost, toggleLikePost, addCommentToPost, 
  getAllBooks, saveCustomBook, getCustomBooks, searchOnlineLibrary, updatePost, 
  getFriendsList, getAllUsers, signUpUser, signInUser, signOutUser, subscribeToAuthChanges, 
  registerPostsUpdateListener, isFirebaseConfigured, fetchFriends 
} from './storage.js?v=5';

// Application State
let currentFilter = 'all';
let selectedBookForPost = null;
let currentRatingSelection = 0;
let userProfile = null;
let searchTimeoutId = null;
let editingPostId = null;
let currentView = 'feed';
let previousView = 'feed';
let browseSearchQuery = '';
let browseCategorySelected = 'all';
let currentProfileTab = 'bookshelf';
let viewedProfileUser = null; // stores username when viewing other profiles, or null for own profile
let zoomedShelfIndex = null; // tracks which shelf index is currently zoomed in, or null if zoomed out
let showingLogin = true;

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

// Book Details Modal Elements
const bookDetailsModalOverlay = document.getElementById('book-details-modal-overlay');
const btnCloseBookDetails = document.getElementById('btn-close-book-details');
const btnDetLogProgress = document.getElementById('btn-det-log-progress');
const bookDetCover = document.getElementById('book-det-cover');
const bookDetTitle = document.getElementById('book-det-title');
const bookDetAuthor = document.getElementById('book-det-author');
const bookDetGenre = document.getElementById('book-det-genre');
const bookDetPages = document.getElementById('book-det-pages');
const bookDetAvgRating = document.getElementById('book-det-avg-rating');
const bookDetDescription = document.getElementById('book-det-description');
const bookDetReviews = document.getElementById('book-det-reviews');

// Add Custom Book Form
const customBookForm = document.getElementById('custom-book-form');
const customTitleInput = document.getElementById('custom-title');
const customAuthorInput = document.getElementById('custom-author');
const customGenreInput = document.getElementById('custom-genre');

// Browse View & Full Page Book Details DOM Selections
const btnTabBrowse = document.getElementById('btn-tab-browse');
const browseView = document.getElementById('browse-view');
const browseSearchInput = document.getElementById('browse-search-input');
const btnBrowseSearchSubmit = document.getElementById('btn-browse-search-submit');
const browseFilterType = document.getElementById('browse-filter-type');
const browseFilterCategory = document.getElementById('browse-filter-category');
const browseFilterSort = document.getElementById('browse-filter-sort');
const browseCategoriesSection = document.getElementById('browse-categories-section');
const browseResultsContainer = document.getElementById('browse-results-container');
const browseResultsSummaryText = document.getElementById('browse-results-summary-text');
const btnBrowseReset = document.getElementById('btn-browse-reset');
const browseResultsUsersSection = document.getElementById('browse-results-users-section');
const browseResultsUsersList = document.getElementById('browse-results-users-list');
const browseResultsBooksSection = document.getElementById('browse-results-books-section');
const browseResultsBooksGrid = document.getElementById('browse-results-books-grid');
const browseResultsEmpty = document.getElementById('browse-results-empty');

const bookDetailsPageView = document.getElementById('book-details-page-view');
const btnBookDetailsBack = document.getElementById('btn-book-details-back');
const bookPageCover = document.getElementById('book-page-cover');
const bookPageTitle = document.getElementById('book-page-title');
const bookPageAuthor = document.getElementById('book-page-author');
const bookPageGenre = document.getElementById('book-page-genre');
const bookPagePages = document.getElementById('book-page-pages');
const bookPageAvgRating = document.getElementById('book-page-avg-rating');
const bookPageDescription = document.getElementById('book-page-description');
const bookPageReviews = document.getElementById('book-page-reviews');
const btnPageLogProgress = document.getElementById('btn-page-log-progress');

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

// Header nav tabs
const btnTabFeed = document.getElementById('btn-tab-feed');
const btnTabLibrary = document.getElementById('btn-tab-library');

// Library View Elements
const libraryViewContainer = document.getElementById('library-view-container');
const libraryGrid = document.getElementById('library-grid');
const btnLibraryZoomOut = document.getElementById('btn-library-zoom-out');

// Refresh Page Logo Link
const logoRefresh = document.getElementById('logo-refresh');

// Auth UI elements
const authContainer = document.getElementById('auth-container');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const btnToggleAuth = document.getElementById('btn-toggle-auth');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const authSwitchText = document.getElementById('auth-switch-text');
const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');
const btnSignoutNav = document.getElementById('btn-signout-nav');

const mainHeader = document.querySelector('header');
const mainWrapper = document.querySelector('.main-wrapper');

// Auth View Helpers
function toggleAuthView(showAuth) {
  if (showAuth) {
    if (authContainer) authContainer.style.display = 'flex';
    if (mainHeader) mainHeader.style.display = 'none';
    if (mainWrapper) mainWrapper.style.display = 'none';
  } else {
    if (authContainer) authContainer.style.display = 'none';
    if (mainHeader) mainHeader.style.display = 'block';
    if (mainWrapper) mainWrapper.style.display = 'grid';
  }
}

function toggleAuthMode() {
  showingLogin = !showingLogin;
  if (showingLogin) {
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
    authTitle.textContent = 'Welcome to the Club';
    authSubtitle.textContent = 'Share your reading journey, track goals, and connect with friends.';
    authSwitchText.textContent = 'New to HotGirlsRead?';
    btnToggleAuth.textContent = 'Create an account';
  } else {
    loginForm.style.display = 'none';
    signupForm.style.display = 'flex';
    authTitle.textContent = 'Join the Club';
    authSubtitle.textContent = 'Create your account to start tracking and sharing your reading.';
    authSwitchText.textContent = 'Already have an account?';
    btnToggleAuth.textContent = 'Sign in';
  }
  
  // Clear errors
  loginError.style.display = 'none';
  loginError.textContent = '';
  signupError.style.display = 'none';
  signupError.textContent = '';
}

function formatAuthError(errorCode) {
  switch (errorCode) {
    case 'auth/invalid-email':
    case 'invalid-email':
      return 'The email address is invalid.';
    case 'auth/user-disabled':
    case 'user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
    case 'user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
    case 'wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
    case 'email-already-in-use':
      return 'An account already exists with this email.';
    case 'auth/weak-password':
    case 'weak-password':
      return 'The password must be at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled in Firebase Console.';
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please verify your email and password.';
    default:
      return errorCode.replace('auth/', '').replace(/-/g, ' ');
  }
}

// Initialize App
function init() {
  setupEventListeners();

  // Register database realtime listeners to refresh interface on updates
  registerPostsUpdateListener(() => {
    renderFeed();
    updateCurrentlyReadingWidget();
  });

  // Observe Auth Session changes
  subscribeToAuthChanges((user) => {
    if (user) {
      toggleAuthView(false);
      loadProfile();
      renderTrendingBooks();
      renderFeed();

      // Async load friends and update UI if view is visible
      fetchFriends().then(() => {
        if (currentProfileTab === 'friends' && currentView === 'profile') {
          renderProfileFriends();
        }
      });
    } else {
      toggleAuthView(true);
    }
  });
}

// Load Profile Info
// Load Logged-in Profile Info for Sidebar/Navbar
function loadProfile() {
  const loggedInProfile = getProfile();
  userProfile = loggedInProfile; // Maintain backward compatibility
  
  // Set navbar avatar
  if (navAvatar) {
    navAvatar.src = loggedInProfile.avatar;
    navAvatar.alt = `${loggedInProfile.name}'s Avatar`;
  }
  
  // Set left sidebar profile card
  if (profileAvatar) {
    profileAvatar.src = loggedInProfile.avatar;
    profileAvatar.alt = `${loggedInProfile.name}'s Avatar`;
  }
  if (profileName) profileName.textContent = loggedInProfile.name;
  if (profileUsername) profileUsername.textContent = `@${loggedInProfile.username}`;
  if (profileBio) profileBio.textContent = loggedInProfile.bio;
  if (profileBooksCount) profileBooksCount.textContent = loggedInProfile.booksRead;
  if (profileGoalCount) profileGoalCount.textContent = loggedInProfile.readingGoal;

  updateCurrentlyReadingWidget(loggedInProfile.username);
}

// Load profile details into the Center Column Profile Dashboard View
function loadProfileDashboard() {
  const loggedInProfile = getProfile();
  let targetProfile = loggedInProfile;
  const isOwnProfile = !viewedProfileUser || viewedProfileUser === loggedInProfile.username;

  if (!isOwnProfile) {
    const allUsers = getAllUsers();
    const foundUser = allUsers.find(u => u.username === viewedProfileUser);
    if (foundUser) {
      targetProfile = {
        ...foundUser,
        booksRead: getPosts().filter(p => p.user.username === viewedProfileUser && p.status === 'finished').length,
        readingGoal: foundUser.readingGoal || 50,
        cover: foundUser.cover || "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80"
      };
    }
  }

  // Set Profile Dashboard View details
  if (profileAvatarDashboard) {
    profileAvatarDashboard.src = targetProfile.avatar;
    profileAvatarDashboard.alt = `${targetProfile.name}'s Avatar`;
  }
  if (profileNameDisplay) profileNameDisplay.textContent = targetProfile.name;
  if (profileUsernameDisplay) profileUsernameDisplay.textContent = `@${targetProfile.username}`;
  if (profileBioDisplay) profileBioDisplay.textContent = targetProfile.bio;
  if (profileCoverBanner) {
    profileCoverBanner.style.backgroundImage = `url('${targetProfile.cover}')`;
  }

  // Toggle Edit Profile Button vs Friend Badge
  if (btnEditProfileBtn) {
    btnEditProfileBtn.style.display = isOwnProfile ? 'inline-flex' : 'none';
  }

  // Handle a follow/friend badge for other users
  let friendBadge = document.getElementById('profile-friend-badge');
  if (!isOwnProfile) {
    if (!friendBadge) {
      friendBadge = document.createElement('span');
      friendBadge.id = 'profile-friend-badge';
      friendBadge.className = 'profile-status-badge-custom';
      friendBadge.textContent = 'Friend';
      // Append it right next to edit profile button
      if (btnEditProfileBtn && btnEditProfileBtn.parentNode) {
        btnEditProfileBtn.parentNode.appendChild(friendBadge);
      }
    }
    if (friendBadge) friendBadge.style.display = 'inline-flex';
  } else if (friendBadge) {
    friendBadge.style.display = 'none';
  }
}

// Update the Left Sidebar "Currently Reading" Widget
function updateCurrentlyReadingWidget(username) {
  const posts = getPosts();
  // Find latest post with status "reading"
  const activeReadPost = posts.find(p => p.status === 'reading' && p.user.username === username);

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
      openBookDetailsModal(book);
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
              <img class="comment-avatar user-profile-link" data-username="${c.user.username}" src="${c.user.avatar}" alt="${c.user.name}" style="cursor: pointer;">
              <div class="comment-body">
                <div>
                  <span class="comment-user-name user-profile-link" data-username="${c.user.username}" style="cursor: pointer;">${c.user.name}</span>
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
      <div class="post-header user-profile-link" data-username="${post.user.username}" style="cursor: pointer;">
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
        const isCurrentUserPost = userProfile && (post.user.username === userProfile.username);
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

// Open Book Details Modal Panel
function openBookDetailsModal(book) {
  selectedBookForPost = book; // Cache for the "Post Update" button
  
  if (bookDetailsModalOverlay) {
    bookDetailsModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Populate basic info
  if (bookDetCover) bookDetCover.src = book.cover;
  if (bookDetTitle) bookDetTitle.textContent = book.title;
  if (bookDetAuthor) bookDetAuthor.textContent = `by ${book.author}`;
  if (bookDetGenre) bookDetGenre.textContent = book.genre || 'General';
  if (bookDetPages) bookDetPages.textContent = book.pages || 300;
  if (bookDetDescription) {
    bookDetDescription.textContent = book.description || 
      `An exciting and deeply moving selection from our library collection, "${book.title}" explores themes of love, personal growth, and self-discovery.`;
  }

  // Fetch reviews from feed posts
  const posts = getPosts();
  const bookReviews = posts.filter(p => p.book.title.toLowerCase() === book.title.toLowerCase());

  // Calculate Average Rating
  const finishedRatings = bookReviews.filter(p => p.status === 'finished' && p.rating > 0);
  if (finishedRatings.length > 0) {
    const totalRating = finishedRatings.reduce((sum, p) => sum + p.rating, 0);
    const avg = (totalRating / finishedRatings.length).toFixed(1);
    if (bookDetAvgRating) bookDetAvgRating.textContent = `${avg} ★`;
  } else {
    if (bookDetAvgRating) bookDetAvgRating.textContent = '0.0';
  }

  // Populate Reviews List
  if (bookDetReviews) {
    bookDetReviews.innerHTML = '';
    
    // Filter posts that have comments or ratings
    const validReviews = bookReviews.filter(p => p.comment || p.rating > 0);

    if (validReviews.length === 0) {
      bookDetReviews.innerHTML = `
        <div style="text-align: center; padding: 20px; color: var(--color-text-muted); font-size: 0.85rem;">
          No reviews for this book yet. Be the first to share your thoughts!
        </div>
      `;
    } else {
      validReviews.forEach(rev => {
        const reviewEl = document.createElement('div');
        reviewEl.className = 'book-review-item';

        let starsHtml = '';
        if (rev.status === 'finished' && rev.rating > 0) {
          starsHtml = '<div class="review-rating">';
          for (let s = 1; s <= 5; s++) {
            starsHtml += `<span class="star ${s <= rev.rating ? 'filled' : ''}">★</span>`;
          }
          starsHtml += '</div>';
        }

        const badgeLabel = rev.status === 'reading' ? 'Reading' : 'Finished';
        const badgeClass = rev.status === 'reading' ? 'reading' : 'finished';

        reviewEl.innerHTML = `
          <div class="review-header">
            <img class="review-avatar" src="${rev.user.avatar}" alt="${rev.user.name}">
            <div style="display: flex; flex-direction: column;">
              <span class="review-user-name">${rev.user.name}</span>
              <span style="font-size: 0.7rem; color: var(--color-text-muted);">@${rev.user.username}</span>
            </div>
            <span class="review-badge ${badgeClass}" style="margin-left: 10px;">${badgeLabel}</span>
            <span class="review-meta">${rev.timestamp || 'Recent'}</span>
          </div>
          ${starsHtml}
          <p class="review-text">${escapeHTML(rev.comment || 'No comment written.')}</p>
        `;
        bookDetReviews.appendChild(reviewEl);
      });
    }
  }
}

// Close Book Details Modal Panel
function closeBookDetailsModal() {
  if (bookDetailsModalOverlay) {
    bookDetailsModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
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

// Switch views between Feed, Library, Profile, Browse, and Book Details Page
function switchView(viewName, extraParam = null) {
  if (viewName !== currentView) {
    previousView = currentView;
  }
  currentView = viewName;
  
  // Update nav tabs active state
  if (btnTabFeed) btnTabFeed.classList.toggle('active', viewName === 'feed');
  if (btnTabLibrary) btnTabLibrary.classList.toggle('active', viewName === 'library');
  if (btnTabBrowse) btnTabBrowse.classList.toggle('active', viewName === 'browse');

  // Hide edit profile form if it was open
  if (editProfileForm) editProfileForm.style.display = 'none';

  // Hide new page views by default
  if (browseView) browseView.style.display = 'none';
  if (bookDetailsPageView) bookDetailsPageView.style.display = 'none';

  if (viewName === 'feed') {
    viewedProfileUser = null;
    // Show Feed elements
    btnNewPostTrigger.style.display = 'flex';
    feedFilters.style.display = 'flex';
    feedContainer.style.display = 'block';
    
    // Hide others
    libraryViewContainer.style.display = 'none';
    profileDashboardView.style.display = 'none';
  } else if (viewName === 'library') {
    viewedProfileUser = null;
    // Hide Feed elements
    btnNewPostTrigger.style.display = 'none';
    feedFilters.style.display = 'none';
    feedContainer.style.display = 'none';
    
    // Show Library View
    libraryViewContainer.style.display = 'flex';
    
    // Hide Profile Dashboard
    profileDashboardView.style.display = 'none';
    
    // Reset shelf zoom state
    zoomedShelfIndex = null;
    
    // Render Library Books
    renderLibrary();
  } else if (viewName === 'profile') {
    viewedProfileUser = extraParam;
    // Hide Feed elements
    btnNewPostTrigger.style.display = 'none';
    feedFilters.style.display = 'none';
    feedContainer.style.display = 'none';
    
    // Hide Library View
    libraryViewContainer.style.display = 'none';
    
    // Show Profile Dashboard
    profileDashboardView.style.display = 'flex';
    
    // Render Profile Contents
    renderProfileDashboard();
  } else if (viewName === 'browse') {
    // Hide Feed, Library, Profile Views
    btnNewPostTrigger.style.display = 'none';
    feedFilters.style.display = 'none';
    feedContainer.style.display = 'none';
    libraryViewContainer.style.display = 'none';
    profileDashboardView.style.display = 'none';

    // Show browse view
    if (browseView) browseView.style.display = 'block';
    
    // Reset browse view back to category list if no search query is active
    if (!extraParam && !browseSearchQuery && browseCategorySelected === 'all') {
      resetBrowseSearch();
    } else if (extraParam) {
      executeBrowseSearch(extraParam);
    }
  } else if (viewName === 'book_details') {
    // Hide Feed, Library, Profile Views
    btnNewPostTrigger.style.display = 'none';
    feedFilters.style.display = 'none';
    feedContainer.style.display = 'none';
    libraryViewContainer.style.display = 'none';
    profileDashboardView.style.display = 'none';

    // Show full details page view
    if (bookDetailsPageView) bookDetailsPageView.style.display = 'block';
    renderBookDetailsPage(extraParam);
  }
}

// Perform catalog browse search with custom filters (target, category, sort)
function executeBrowseSearch(categoryParam = null) {
  // If categoryParam is provided (clicked a category card), set filters
  if (categoryParam) {
    browseFilterCategory.value = categoryParam;
    browseFilterType.value = 'book';
    browseSearchInput.value = '';
  }

  const query = browseSearchInput.value.trim();
  const searchType = browseFilterType.value; // all, book, account
  const category = browseFilterCategory.value; // all, romance, fantasy, thriller, fiction, dystopian, classics
  const sortBy = browseFilterSort.value; // relevance, title, rating, pages

  browseSearchQuery = query;
  browseCategorySelected = category;

  // Toggle visible sections
  if (browseCategoriesSection) browseCategoriesSection.style.display = 'none';
  if (browseResultsContainer) browseResultsContainer.style.display = 'block';

  // Construct summary status text
  let summaryText = 'Showing results';
  if (query) summaryText += ` for "${query}"`;
  if (category !== 'all') {
    const categoryName = browseFilterCategory.options[browseFilterCategory.selectedIndex].text;
    summaryText += ` in Category: ${categoryName}`;
  }
  if (browseResultsSummaryText) browseResultsSummaryText.textContent = summaryText;

  // 1. FILTER USERS
  let matchedUsers = [];
  if (searchType !== 'book') {
    const allUsers = getAllUsers();
    matchedUsers = allUsers.filter(u => {
      const q = query.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q);
    });
  }

  // Helper to map category filter values to book genre substrings
  function matchesCategory(bookGenre, catFilter) {
    if (catFilter === 'all') return true;
    const genreLower = bookGenre.toLowerCase();
    if (catFilter === 'romance') return genreLower.includes('romance');
    if (catFilter === 'fantasy') return genreLower.includes('fantasy');
    if (catFilter === 'thriller') return genreLower.includes('thriller') || genreLower.includes('mystery');
    if (catFilter === 'fiction') return genreLower.includes('fiction');
    if (catFilter === 'dystopian') return genreLower.includes('dystopian') || genreLower.includes('young adult') || genreLower.includes('ya');
    if (catFilter === 'classics') return genreLower.includes('classic');
    return false;
  }

  // 2. FILTER LOCAL BOOKS
  let matchedBooksMap = new Map();
  if (searchType !== 'account') {
    const allBooks = getAllBooks();
    allBooks.forEach(b => {
      const q = query.toLowerCase();
      const matchesText = !query || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      const matchesCat = matchesCategory(b.genre || '', category);
      if (matchesText && matchesCat) {
        matchedBooksMap.set(b.title.toLowerCase(), b);
      }
    });
  }

  // Calculate rating helper
  function getBookAvgRating(bookTitle) {
    const posts = getPosts();
    const reviews = posts.filter(p => p.book.title.toLowerCase() === bookTitle.toLowerCase());
    const finished = reviews.filter(p => p.status === 'finished' && p.rating > 0);
    if (finished.length === 0) return 0;
    return finished.reduce((sum, p) => sum + p.rating, 0) / finished.length;
  }

  // Helper to sort matching books list
  function sortBooks(booksList) {
    if (sortBy === 'title') {
      return booksList.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === 'rating') {
      return booksList.sort((a, b) => getBookAvgRating(b.title) - getBookAvgRating(a.title));
    }
    if (sortBy === 'pages') {
      return booksList.sort((a, b) => (b.pages || 300) - (a.pages || 300));
    }
    return booksList; // relevance (default preseeded order)
  }

  // Render initial local results
  renderBrowseResultsPage(matchedUsers, sortBooks(Array.from(matchedBooksMap.values())));

  // 3. FETCH ONLINE MATCHES IF BOOKS ARE EXPECTED
  if (searchType !== 'account') {
    // Determine subject search prefix or text query
    let onlineQuery = query;
    if (category !== 'all') {
      let subjectTerm = category;
      if (category === 'thriller') subjectTerm = 'mystery';
      if (category === 'dystopian') subjectTerm = 'young_adult';
      
      onlineQuery = query ? `${query} subject:${subjectTerm}` : `subject:${subjectTerm}`;
    }

    if (onlineQuery) {
      searchOnlineLibrary(onlineQuery).then(onlineBooks => {
        // Ensure query state hasn't changed during execution
        if (browseSearchQuery !== query || browseCategorySelected !== category) return;

        onlineBooks.forEach(b => {
          const key = b.title.toLowerCase();
          const matchesCat = matchesCategory(b.genre || '', category);
          if (matchesCat && !matchedBooksMap.has(key)) {
            matchedBooksMap.set(key, b);
          }
        });

        renderBrowseResultsPage(matchedUsers, sortBooks(Array.from(matchedBooksMap.values())));
      }).catch(err => {
        console.error('Online category search failed:', err);
      });
    }
  }
}

// Reset browse search and show categories explorer grid
function resetBrowseSearch() {
  browseSearchInput.value = '';
  browseFilterType.value = 'all';
  browseFilterCategory.value = 'all';
  browseFilterSort.value = 'relevance';
  
  browseSearchQuery = '';
  browseCategorySelected = 'all';

  if (browseCategoriesSection) browseCategoriesSection.style.display = 'block';
  if (browseResultsContainer) browseResultsContainer.style.display = 'none';
}

// Render users and books browse matches
function renderBrowseResultsPage(users, books) {
  const hasUsers = users.length > 0;
  const hasBooks = books.length > 0;

  if (browseResultsUsersSection) {
    browseResultsUsersSection.style.display = hasUsers ? 'block' : 'none';
  }
  if (browseResultsBooksSection) {
    browseResultsBooksSection.style.display = hasBooks ? 'block' : 'none';
  }
  if (browseResultsEmpty) {
    browseResultsEmpty.style.display = (!hasUsers && !hasBooks) ? 'block' : 'none';
  }

  // Render users
  if (hasUsers && browseResultsUsersList) {
    browseResultsUsersList.innerHTML = '';
    users.forEach(user => {
      const userCard = document.createElement('div');
      userCard.className = 'search-user-card';
      userCard.innerHTML = `
        <img class="search-user-avatar" src="${user.avatar}" alt="${user.name}" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'">
        <div class="search-user-info">
          <span class="search-user-name">${user.name}</span>
          <span class="search-user-handle">@${user.username}</span>
        </div>
      `;
      userCard.addEventListener('click', () => {
        switchView('profile', user.username);
      });
      browseResultsUsersList.appendChild(userCard);
    });
  }

  // Render books
  if (hasBooks && browseResultsBooksGrid) {
    browseResultsBooksGrid.innerHTML = '';
    books.forEach(book => {
      const bookCard = document.createElement('div');
      bookCard.className = 'search-book-card';
      
      // Calculate dynamic average rating
      const posts = getPosts();
      const bookReviews = posts.filter(p => p.book.title.toLowerCase() === book.title.toLowerCase());
      const finishedRatings = bookReviews.filter(p => p.status === 'finished' && p.rating > 0);
      
      let ratingHtml = '';
      if (finishedRatings.length > 0) {
        const totalRating = finishedRatings.reduce((sum, p) => sum + p.rating, 0);
        const avg = (totalRating / finishedRatings.length).toFixed(1);
        ratingHtml = `<div class="search-book-rating">★ ${avg}</div>`;
      } else {
        ratingHtml = `<div class="search-book-rating" style="color: var(--color-text-muted);">★ 0.0</div>`;
      }

      bookCard.innerHTML = `
        <img class="search-book-cover" src="${book.cover}" alt="${book.title}" onerror="this.src='https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80'">
        <span class="search-book-title" title="${book.title}">${book.title}</span>
        <span class="search-book-author">by ${book.author}</span>
        ${ratingHtml}
        <span class="search-book-genre">${book.genre || 'General'}</span>
      `;
      bookCard.addEventListener('click', () => {
        switchView('book_details', book);
      });
      browseResultsBooksGrid.appendChild(bookCard);
    });
  }
}

// Render full page details for a selected book
function renderBookDetailsPage(book) {
  selectedBookForPost = book; // Cache for the "Post Update" button
  
  if (bookPageCover) bookPageCover.src = book.cover;
  if (bookPageTitle) bookPageTitle.textContent = book.title;
  if (bookPageAuthor) bookPageAuthor.textContent = `by ${book.author}`;
  if (bookPageGenre) bookPageGenre.textContent = book.genre || 'General';
  if (bookPagePages) bookPagePages.textContent = book.pages || 300;
  if (bookPageDescription) {
    bookPageDescription.textContent = book.description || 
      `An exciting and deeply moving selection from our library collection, "${book.title}" explores themes of love, personal growth, and self-discovery.`;
  }

  // Fetch reviews from feed posts
  const posts = getPosts();
  const bookReviews = posts.filter(p => p.book.title.toLowerCase() === book.title.toLowerCase());

  // Calculate Average Rating
  const finishedRatings = bookReviews.filter(p => p.status === 'finished' && p.rating > 0);
  if (finishedRatings.length > 0) {
    const totalRating = finishedRatings.reduce((sum, p) => sum + p.rating, 0);
    const avg = (totalRating / finishedRatings.length).toFixed(1);
    if (bookPageAvgRating) bookPageAvgRating.textContent = `${avg} ★`;
  } else {
    if (bookPageAvgRating) bookPageAvgRating.textContent = '0.0';
  }

  // Populate Reviews List
  if (bookPageReviews) {
    bookPageReviews.innerHTML = '';
    const validReviews = bookReviews.filter(p => p.comment || p.rating > 0);

    if (validReviews.length === 0) {
      bookPageReviews.innerHTML = `
        <div style="text-align: center; padding: 32px; color: var(--color-text-muted); font-size: 0.85rem;">
          No reviews for this book yet. Be the first to share your thoughts!
        </div>
      `;
    } else {
      validReviews.forEach(rev => {
        const reviewEl = document.createElement('div');
        reviewEl.className = 'book-review-item';

        let starsHtml = '';
        if (rev.status === 'finished' && rev.rating > 0) {
          starsHtml = '<div class="review-rating">';
          for (let s = 1; s <= 5; s++) {
            starsHtml += `<span class="star ${s <= rev.rating ? 'filled' : ''}">★</span>`;
          }
          starsHtml += '</div>';
        }

        const badgeLabel = rev.status === 'reading' ? 'Reading' : 'Finished';
        const badgeClass = rev.status === 'reading' ? 'reading' : 'finished';

        reviewEl.innerHTML = `
          <div class="review-header">
            <img class="review-avatar" src="${rev.user.avatar}" alt="${rev.user.name}">
            <div style="display: flex; flex-direction: column;">
              <span class="review-user-name">${rev.user.name}</span>
              <span style="font-size: 0.7rem; color: var(--color-text-muted);">@${rev.user.username}</span>
            </div>
            <span class="review-badge ${badgeClass}" style="margin-left: 10px;">${badgeLabel}</span>
            <span class="review-meta">${rev.timestamp || 'Recent'}</span>
          </div>
          ${starsHtml}
          <p class="review-text">${escapeHTML(rev.comment || 'No comment written.')}</p>
        `;
        bookPageReviews.appendChild(reviewEl);
      });
    }
  }

  // Configure back button text
  if (btnBookDetailsBack) {
    if (previousView === 'browse') {
      btnBookDetailsBack.textContent = '← Back to Browse Results';
    } else if (previousView === 'library') {
      btnBookDetailsBack.textContent = '← Back to My Library';
    } else if (previousView === 'profile') {
      btnBookDetailsBack.textContent = '← Back to Profile';
    } else {
      btnBookDetailsBack.textContent = '← Back to Feed';
    }
  }
}


// Helper to generate a consistent premium color palette style for book spines
function getSpineStyles(title) {
  const spineColors = [
    { bg: '#8C2E3C', text: '#FFFFFF', accent: '#E295A2' }, // Deep Burgundy
    { bg: '#3E5E4E', text: '#FFFFFF', accent: '#A3B899' }, // Sage Olive
    { bg: '#2B4C5E', text: '#FFFFFF', accent: '#8FA9C4' }, // Prussian Blue
    { bg: '#D9A05B', text: '#1E1214', accent: '#8C2E3C' }, // Terracotta Gold
    { bg: '#B57C8A', text: '#FFFFFF', accent: '#FFECEF' }, // Muted Rose
    { bg: '#5C4A42', text: '#FFFFFF', accent: '#D9C3B0' }, // Charcoal Brown
    { bg: '#E6D7C3', text: '#1E1214', accent: '#8C2E3C' }  // Oatmeal Cream
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % spineColors.length;
  return spineColors[index];
}

// Render My Library View (Interactive wood bookshelf with expandable book spines)
function renderLibrary() {
  const posts = getPosts();
  const userPosts = userProfile ? posts.filter(p => p.user.username === userProfile.username) : [];
  
  // Extract unique books from posts
  const uniqueBooksMap = new Map();
  userPosts.forEach(post => {
    const key = post.book.title.toLowerCase();
    if (!uniqueBooksMap.has(key)) {
      uniqueBooksMap.set(key, post.book);
    }
  });

  libraryGrid.innerHTML = '';

  // Toggle Zoom Out button visibility and Grid zoomed-active status
  if (btnLibraryZoomOut) {
    btnLibraryZoomOut.style.display = zoomedShelfIndex !== null ? 'block' : 'none';
  }
  if (zoomedShelfIndex !== null) {
    libraryGrid.classList.add('zoomed-active');
  } else {
    libraryGrid.classList.remove('zoomed-active');
  }

  const books = Array.from(uniqueBooksMap.values());

  if (zoomedShelfIndex !== null) {
    // Zoomed-In View: A single long horizontal shelf of large books that scrolls
    const booksPerShelf = Math.max(1, Math.ceil(books.length / 4));
    const startIdx = zoomedShelfIndex * booksPerShelf;
    const shelfBooks = books.slice(startIdx, startIdx + booksPerShelf);

    // Create shelf container
    const shelfContainer = document.createElement('div');
    shelfContainer.className = 'bookshelf-container zoomed';
    
    // Create row for books
    const bookRow = document.createElement('div');
    bookRow.className = 'bookshelf-row';
    
    shelfBooks.forEach(book => {
      const bookStyles = getSpineStyles(book.title);
      const bookEl = document.createElement('div');
      bookEl.className = 'bookshelf-book';
      bookEl.style.backgroundColor = bookStyles.bg;
      bookEl.style.color = bookStyles.text;
      bookEl.style.borderLeft = `3px solid ${bookStyles.accent}`;
      
      const pages = book.pages || 300;
      const thickness = Math.min(55, Math.max(35, Math.round(pages / 10 + 15)));
      bookEl.style.setProperty('--book-thickness', `${thickness}px`);
      
      bookEl.innerHTML = `
        <div class="book-spine">
          <div class="book-spine-accent-line" style="background-color: ${bookStyles.accent};"></div>
          <div class="book-spine-title-container">
            <span class="book-spine-title">${book.title}</span>
          </div>
          <div class="book-spine-author" style="color: ${bookStyles.text === '#FFFFFF' ? 'rgba(255,255,255,0.75)' : 'rgba(30,18,20,0.75)'};">
            ${book.author}
          </div>
        </div>
        
        <div class="book-cover-overlay">
          <img class="book-cover-img" src="${book.cover}" alt="${book.title} Cover" onerror="this.src='https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80'">
          <div class="book-cover-details">
            <div class="book-cover-title">${book.title}</div>
            <div class="book-cover-author">by ${book.author}</div>
          </div>
        </div>
      `;
      
      bookEl.addEventListener('click', (e) => {
        e.stopPropagation();
        openBookDetailsModal(book);
      });
      
      bookRow.appendChild(bookEl);
    });

    // Drag-to-scroll implementation for bookRow (when zoomed in)
    let isDown = false;
    let startX;
    let scrollLeft;
    
    bookRow.addEventListener('mousedown', (e) => {
      isDown = true;
      bookRow.classList.add('active-dragging');
      startX = e.pageX - bookRow.offsetLeft;
      scrollLeft = bookRow.scrollLeft;
    });
    
    bookRow.addEventListener('mouseleave', () => {
      isDown = false;
      bookRow.classList.remove('active-dragging');
    });
    
    bookRow.addEventListener('mouseup', () => {
      isDown = false;
      bookRow.classList.remove('active-dragging');
    });
    
    bookRow.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - bookRow.offsetLeft;
      const walk = (x - startX) * 2;
      bookRow.scrollLeft = scrollLeft - walk;
    });

    // Create navigation buttons
    const btnLeft = document.createElement('button');
    btnLeft.className = 'shelf-nav-btn left';
    btnLeft.type = 'button';
    btnLeft.setAttribute('aria-label', 'Scroll shelf left');
    btnLeft.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
    
    const btnRight = document.createElement('button');
    btnRight.className = 'shelf-nav-btn right';
    btnRight.type = 'button';
    btnRight.setAttribute('aria-label', 'Scroll shelf right');
    btnRight.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
    
    btnLeft.addEventListener('click', (e) => {
      e.stopPropagation();
      const scrollAmount = Math.min(bookRow.clientWidth * 0.75, 400);
      bookRow.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    
    btnRight.addEventListener('click', (e) => {
      e.stopPropagation();
      const scrollAmount = Math.min(bookRow.clientWidth * 0.75, 400);
      bookRow.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    shelfContainer.addEventListener('mouseenter', () => {
      const canScroll = bookRow.scrollWidth > bookRow.clientWidth;
      btnLeft.style.display = canScroll ? 'flex' : 'none';
      btnRight.style.display = canScroll ? 'flex' : 'none';
    });

    const woodLedge = document.createElement('div');
    woodLedge.className = 'bookshelf-wood';
    
    shelfContainer.appendChild(btnLeft);
    shelfContainer.appendChild(bookRow);
    shelfContainer.appendChild(btnRight);
    shelfContainer.appendChild(woodLedge);
    libraryGrid.appendChild(shelfContainer);

  } else {
    // Zoomed-Out View: Entire library is a horizontal corridor of 4 shelves that scroll together
    const booksPerShelf = Math.ceil(books.length / 4);
    
    // Slice books into 4 shelves
    const shelvesBooks = [
      books.slice(0, booksPerShelf),
      books.slice(booksPerShelf, booksPerShelf * 2),
      books.slice(booksPerShelf * 2, booksPerShelf * 3),
      books.slice(booksPerShelf * 3)
    ];

    const booksPerBay = 6;
    const numBays = Math.max(1, Math.ceil(booksPerShelf / booksPerBay)); // Keep at least 1 bay

    // Create the library wall container
    const libraryWall = document.createElement('div');
    libraryWall.className = 'library-wall';

    // Render 4 shelves stacked vertically
    for (let shelfIdx = 0; shelfIdx < 4; shelfIdx++) {
      const shelfContainer = document.createElement('div');
      shelfContainer.className = 'bookshelf-container';
      
      const bookRow = document.createElement('div');
      bookRow.className = 'bookshelf-row';
      bookRow.dataset.shelfIndex = shelfIdx;

      // Group books into bays horizontally
      for (let bayIdx = 0; bayIdx < numBays; bayIdx++) {
        const baySegment = document.createElement('div');
        baySegment.className = 'shelf-bay-segment';

        // Get books for this shelf in this bay
        const start = bayIdx * booksPerBay;
        const bayBooks = shelvesBooks[shelfIdx].slice(start, start + booksPerBay);

        bayBooks.forEach(book => {
          const bookStyles = getSpineStyles(book.title);
          const bookEl = document.createElement('div');
          bookEl.className = 'bookshelf-book';
          bookEl.style.backgroundColor = bookStyles.bg;
          bookEl.style.color = bookStyles.text;
          bookEl.style.borderLeft = `3px solid ${bookStyles.accent}`;
          
          const pages = book.pages || 300;
          const thickness = Math.min(55, Math.max(35, Math.round(pages / 10 + 15)));
          bookEl.style.setProperty('--book-thickness', `${thickness}px`);
          
          bookEl.innerHTML = `
            <div class="book-spine">
              <div class="book-spine-accent-line" style="background-color: ${bookStyles.accent};"></div>
              <div class="book-spine-title-container">
                <span class="book-spine-title">${book.title}</span>
              </div>
            </div>
          `;
          
          bookEl.addEventListener('click', (e) => {
            e.stopPropagation();
            openBookDetailsModal(book);
          });
          
          baySegment.appendChild(bookEl);
        });

        bookRow.appendChild(baySegment);

        // Add spacer segment where the upright pillar sits
        const spacer = document.createElement('div');
        spacer.className = 'upright-spacer';
        bookRow.appendChild(spacer);
      }

      // Zoom-in click handler on the row (excluding drag actions)
      let shelfMousedownX = 0;
      let shelfMousedownY = 0;
      
      bookRow.addEventListener('mousedown', (e) => {
        shelfMousedownX = e.clientX;
        shelfMousedownY = e.clientY;
      });
      
      bookRow.addEventListener('click', (e) => {
        const deltaX = Math.abs(e.clientX - shelfMousedownX);
        const deltaY = Math.abs(e.clientY - shelfMousedownY);
        if (deltaX > 10 || deltaY > 10) return; // Dragging, don't zoom
        
        zoomedShelfIndex = shelfIdx;
        renderLibrary();
      });

      const woodLedge = document.createElement('div');
      woodLedge.className = 'bookshelf-wood';

      shelfContainer.appendChild(bookRow);
      shelfContainer.appendChild(woodLedge);
      libraryWall.appendChild(shelfContainer);
    }

    // Render vertical upright pillars absolutely positioned over spacers
    // We place one starting upright and one after each bay segment
    for (let bayIdx = 0; bayIdx <= numBays; bayIdx++) {
      const upright = document.createElement('div');
      upright.className = 'bookshelf-upright';
      // Each bay is 282px wide, and spacers are 18px wide.
      // So the left position is bayIdx * (282 + 18) = bayIdx * 300px
      upright.style.left = `${bayIdx * 300}px`;
      libraryWall.appendChild(upright);
    }

    libraryGrid.appendChild(libraryWall);

    // Drag-to-scroll implementation for libraryGrid itself (zoomed out)
    let isDown = false;
    let startX;
    let scrollLeft;
    
    libraryGrid.addEventListener('mousedown', (e) => {
      if (zoomedShelfIndex !== null) return;
      if (e.target.closest('.shelf-nav-btn')) return;
      isDown = true;
      libraryGrid.classList.add('active-dragging');
      startX = e.pageX - libraryGrid.offsetLeft;
      scrollLeft = libraryGrid.scrollLeft;
    });
    
    libraryGrid.addEventListener('mouseleave', () => {
      isDown = false;
      libraryGrid.classList.remove('active-dragging');
    });
    
    libraryGrid.addEventListener('mouseup', () => {
      isDown = false;
      libraryGrid.classList.remove('active-dragging');
    });
    
    libraryGrid.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - libraryGrid.offsetLeft;
      const walk = (x - startX) * 2;
      libraryGrid.scrollLeft = scrollLeft - walk;
    });

    // Create navigation buttons for the entire library grid
    const btnLeft = document.createElement('button');
    btnLeft.className = 'shelf-nav-btn left';
    btnLeft.type = 'button';
    btnLeft.setAttribute('aria-label', 'Scroll library left');
    btnLeft.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
    
    const btnRight = document.createElement('button');
    btnRight.className = 'shelf-nav-btn right';
    btnRight.type = 'button';
    btnRight.setAttribute('aria-label', 'Scroll library right');
    btnRight.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
    
    btnLeft.addEventListener('click', (e) => {
      e.stopPropagation();
      const scrollAmount = Math.min(libraryGrid.clientWidth * 0.75, 500);
      libraryGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    
    btnRight.addEventListener('click', (e) => {
      e.stopPropagation();
      const scrollAmount = Math.min(libraryGrid.clientWidth * 0.75, 500);
      libraryGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    libraryGrid.addEventListener('mouseenter', () => {
      if (zoomedShelfIndex !== null) return;
      const canScroll = libraryGrid.scrollWidth > libraryGrid.clientWidth;
      btnLeft.style.display = canScroll ? 'flex' : 'none';
      btnRight.style.display = canScroll ? 'flex' : 'none';
    });

    libraryGrid.appendChild(btnLeft);
    libraryGrid.appendChild(btnRight);
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
  loadProfileDashboard();
  switchProfileTab(currentProfileTab);
}

// Render User Bookshelf grid (derived from user's posts)
function renderProfileBookshelf() {
  const loggedInProfile = getProfile();
  const targetUsername = viewedProfileUser || loggedInProfile.username;
  const posts = getPosts();
  const userPosts = posts.filter(p => p.user.username === targetUsername);
  
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
    const emptyMsg = targetUsername === loggedInProfile.username 
      ? 'No books on your shelf yet. Update what you are reading or finished to see them here!'
      : `@${targetUsername} has not added any books to their shelf yet.`;
    bookshelfGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: var(--color-text-muted);">
        <span style="font-size: 2.5rem; display: block; margin-bottom: 8px;">📚</span>
        <p style="font-weight: 500;">Shelf is empty</p>
        <p style="font-size: 0.85rem; margin-top: 4px;">${emptyMsg}</p>
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
      openBookDetailsModal(book);
    });
    bookshelfGrid.appendChild(item);
  });
}

// Calculate and render reading stats/goals
function renderProfileStats() {
  const loggedInProfile = getProfile();
  const targetUsername = viewedProfileUser || loggedInProfile.username;
  
  let targetProfile = loggedInProfile;
  if (viewedProfileUser && viewedProfileUser !== loggedInProfile.username) {
    const allUsers = getAllUsers();
    targetProfile = allUsers.find(u => u.username === viewedProfileUser) || loggedInProfile;
  }
  
  const posts = getPosts();
  const userPosts = posts.filter(p => p.user.username === targetUsername);
  
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
  const goal = targetProfile.readingGoal || 50;
  const percentage = Math.min(100, Math.round((totalRead / goal) * 100));
  
  const progressFill = document.getElementById('goal-progress-fill');
  const progressText = document.getElementById('goal-progress-text');
  
  if (progressFill) progressFill.style.width = `${percentage}%`;
  if (progressText) {
    const profileNameStr = targetUsername === loggedInProfile.username ? 'My' : `${targetProfile.name}'s`;
    progressText.textContent = `${totalRead} of ${goal} books read (${percentage}% completed for ${profileNameStr} Challenge)`;
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
  const loggedInProfile = getProfile();
  const targetUsername = viewedProfileUser || loggedInProfile.username;
  const friends = getFriendsList();
  
  friendsDashboardGrid.innerHTML = '';
  
  // If viewing other user's profile, let's show a simulated friends list using other users from posts
  let displayFriends = friends;
  if (viewedProfileUser && viewedProfileUser !== loggedInProfile.username) {
    const allUsers = getAllUsers();
    // Exclude the viewed user themselves and map to friend format
    const otherUsers = allUsers.filter(u => u.username !== viewedProfileUser);
    displayFriends = otherUsers.slice(0, 4).map(u => {
      const posts = getPosts();
      const userPost = posts.find(p => p.user.username === u.username);
      return {
        name: u.name,
        username: u.username,
        avatar: u.avatar,
        status: userPost ? userPost.status : 'finished',
        bookTitle: userPost ? userPost.book.title : 'The Seven Husbands of Evelyn Hugo',
        bookAuthor: userPost ? userPost.book.author : 'Taylor Jenkins Reid'
      };
    });
  }
  
  displayFriends.forEach(f => {
    const card = document.createElement('div');
    card.className = 'friend-dashboard-card';
    card.style.cursor = 'pointer';
    const statusText = f.status === 'reading' ? `📖 Reading <em>${f.bookTitle}</em>` : `🏆 Finished <em>${f.bookTitle}</em>`;
    
    card.innerHTML = `
      <img class="friend-dashboard-avatar" src="${f.avatar}" alt="${f.name}">
      <div class="friend-dashboard-info">
        <span class="friend-dashboard-name">${f.name}</span>
        <span class="friend-dashboard-username">@${f.username}</span>
        <span class="friend-dashboard-status">${statusText}</span>
      </div>
    `;
    
    // Clicking friend card navigates to their profile
    card.addEventListener('click', () => {
      switchView('profile', f.username);
    });
    
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

  // Book Details Modal Listeners
  if (btnCloseBookDetails) {
    btnCloseBookDetails.addEventListener('click', closeBookDetailsModal);
  }
  if (bookDetailsModalOverlay) {
    bookDetailsModalOverlay.addEventListener('click', (e) => {
      if (e.target === bookDetailsModalOverlay) closeBookDetailsModal();
    });
  }
  if (btnDetLogProgress) {
    btnDetLogProgress.addEventListener('click', () => {
      const bookToPost = selectedBookForPost;
      closeBookDetailsModal();
      openPostModal(bookToPost);
    });
  }

  // Details page back button and progress logger
  if (btnBookDetailsBack) {
    btnBookDetailsBack.addEventListener('click', () => {
      if (previousView === 'browse') {
        switchView('browse', true);
      } else {
        switchView(previousView || 'feed');
      }
    });
  }
  if (btnPageLogProgress) {
    btnPageLogProgress.addEventListener('click', () => {
      openPostModal(selectedBookForPost);
    });
  }

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
      if (bookSearchInput.value.toLowerCase().trim() !== val) return;

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
  btnSubmitPost.addEventListener('click', async () => {
    if (!selectedBookForPost) {
      alert('Please select or search for a book first!');
      bookSearchInput.focus();
      return;
    }

    const comment = postCommentTextarea.value.trim();
    const status = document.querySelector('input[name="reading-status"]:checked').value;
    const rating = status === 'finished' ? currentRatingSelection : 0;

    if (editingPostId) {
      await updatePost(editingPostId, {
        status: status,
        rating: rating,
        comment: comment
      });
    } else {
      const newPost = {
        id: `post_${Date.now()}`,
        user: {
          name: userProfile ? userProfile.name : "Me",
          username: userProfile ? userProfile.username : "me",
          avatar: userProfile ? userProfile.avatar : ""
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
      await addPost(newPost);
    }

    closeModal();
    loadProfile(); // Updates count stats and currently reading card
    if (!isFirebaseConfigured) {
      renderFeed();
    }
  });

  // Feed Event Delegation: Likes, profile link clicks, and Comment Forms
  feedContainer.addEventListener('click', (e) => {
    // Profile Links (click avatar or username in feed)
    const profileLink = e.target.closest('.user-profile-link');
    if (profileLink) {
      const username = profileLink.dataset.username;
      switchView('profile', username);
      return;
    }

    // Click on book subcard
    const bookSubcard = e.target.closest('.post-book-subcard');
    if (bookSubcard) {
      const postCard = bookSubcard.closest('.post-card');
      if (postCard) {
        const postId = postCard.dataset.id;
        const posts = getPosts();
        const post = posts.find(p => p.id === postId);
        if (post && post.book) {
          openBookDetailsModal(post.book);
        }
      }
      return;
    }

    // Likes Button
    const likeBtn = e.target.closest('.like-btn');
    if (likeBtn) {
      const postId = likeBtn.dataset.postId;
      toggleLikePost(postId).then(updatedPosts => {
        if (!isFirebaseConfigured) {
          const post = updatedPosts.find(p => p.id === postId);
          likeBtn.classList.toggle('active', post.likedByUser);
          likeBtn.querySelector('.like-count').textContent = post.likes;
        }
      });
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
  feedContainer.addEventListener('submit', async (e) => {
    const form = e.target.closest('.comment-input-form');
    if (form) {
      e.preventDefault();
      const postId = form.dataset.postId;
      const inputField = form.querySelector('.comment-input');
      const val = inputField.value.trim();
      
      if (!val) return;

      await addCommentToPost(postId, val, userProfile);
      inputField.value = '';
      
      if (!isFirebaseConfigured) {
        renderFeed();
      }
    }
  });

  // Custom Book Form Submission (Right Sidebar)
  customBookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = customTitleInput.value.trim();
    const author = customAuthorInput.value.trim();
    const genre = customGenreInput.value.trim() || 'Fiction';

    if (!title || !author) return;

    // Show visual feedback or loading state on button
    const submitBtn = customBookForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Searching cover...';
    submitBtn.disabled = true;

    let coverUrl = '';
    try {
      const matches = await searchOnlineLibrary(`${title} ${author}`);
      if (matches && matches.length > 0) {
        coverUrl = matches[0].cover;
      }
    } catch (err) {
      console.error('Failed to fetch cover online:', err);
    }

    if (!coverUrl) {
      // Fallback: use a premium Unsplash placeholder
      const randomCovers = [
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80",
        "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=300&q=80"
      ];
      coverUrl = randomCovers[Math.floor(Math.random() * randomCovers.length)];
    }

    const customBook = {
      id: `custom_${Date.now()}`,
      title: title,
      author: author,
      cover: coverUrl,
      genre: genre,
      pages: 300,
      description: "A wonderful custom added book."
    };

    saveCustomBook(customBook).then(() => {
      // Reset button
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }

      // Clear Form inputs
      customTitleInput.value = '';
      customAuthorInput.value = '';
      customGenreInput.value = '';

      alert(`"${title}" has been successfully added to your database! You can now search for it when creating a post.`);
      renderTrendingBooks();
    });
  });

  // Library Zoom Out Button Click Handler
  if (btnLibraryZoomOut) {
    btnLibraryZoomOut.addEventListener('click', () => {
      zoomedShelfIndex = null;
      renderLibrary();
    });
  }

  // Browse Page Navigation Reset & Action Submission
  if (btnBrowseReset) {
    btnBrowseReset.addEventListener('click', resetBrowseSearch);
  }

  if (btnBrowseSearchSubmit) {
    btnBrowseSearchSubmit.addEventListener('click', () => executeBrowseSearch());
  }

    if (browseSearchInput) {
      browseSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          executeBrowseSearch();
        }
      });
    }

    // Login Form Submission
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const submitBtn = document.getElementById('btn-login-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = submitBtn.querySelector('.spinner-mini');
        
        submitBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (spinner) spinner.style.display = 'inline-block';
        loginError.style.display = 'none';
        
        try {
          await signInUser(email, password);
        } catch (err) {
          console.error("Sign in error:", err);
          loginError.textContent = formatAuthError(err.code || err.message);
          loginError.style.display = 'block';
        } finally {
          submitBtn.disabled = false;
          if (btnText) btnText.style.display = 'inline';
          if (spinner) spinner.style.display = 'none';
        }
      });
    }


  // Signup Form Submission
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const username = document.getElementById('signup-username').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      const submitBtn = document.getElementById('btn-signup-submit');
      const btnText = submitBtn.querySelector('.btn-text');
      const spinner = submitBtn.querySelector('.spinner-mini');
      
      submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (spinner) spinner.style.display = 'inline-block';
      signupError.style.display = 'none';
      
      try {
        await signUpUser(email, password, name, username);
      } catch (err) {
        console.error("Sign up error:", err);
        signupError.textContent = formatAuthError(err.code || err.message);
        signupError.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (spinner) spinner.style.display = 'none';
      }
    });
  }

  // Category card triggers
  const categoryCards = document.querySelectorAll('.category-explore-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      executeBrowseSearch(category);
    });
  });

  // Dynamic filter change updates
  if (browseFilterType) {
    browseFilterType.addEventListener('change', () => {
      if (browseResultsContainer && browseResultsContainer.style.display !== 'none') {
        executeBrowseSearch();
      }
    });
  }
  if (browseFilterCategory) {
    browseFilterCategory.addEventListener('change', () => {
      if (browseResultsContainer && browseResultsContainer.style.display !== 'none') {
        executeBrowseSearch();
      }
    });
  }
  if (browseFilterSort) {
    browseFilterSort.addEventListener('change', () => {
      if (browseResultsContainer && browseResultsContainer.style.display !== 'none') {
        executeBrowseSearch();
      }
    });
  }

  // Header Navigation Tab Triggers
  if (btnTabFeed) btnTabFeed.addEventListener('click', () => switchView('feed'));
  if (btnTabLibrary) btnTabLibrary.addEventListener('click', () => switchView('library'));
  if (btnTabBrowse) btnTabBrowse.addEventListener('click', () => switchView('browse'));

  // Toggle Login/Signup Modes
  if (btnToggleAuth) {
    btnToggleAuth.addEventListener('click', toggleAuthMode);
  }

  // Sign Out Header Button
  if (btnSignoutNav) {
    btnSignoutNav.addEventListener('click', async () => {
      if (confirm("Are you sure you want to sign out of HotGirlsRead?")) {
        await signOutUser();
      }
    });
  }

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
