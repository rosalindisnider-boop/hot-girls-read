import { PRESEEDED_BOOKS } from './books.js';
import { firebaseConfig } from './firebase-config.js';

// Import Firebase modules from CDN (Modular SDK)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot, 
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  writeBatch
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Keys for localStorage fallback
const STORAGE_KEYS = {
  POSTS: 'hotgirlsread_posts',
  CUSTOM_BOOKS: 'hotgirlsread_custom_books',
  USER_PROFILE: 'hotgirlsread_profile'
};

const DEFAULT_PROFILE = {
  name: "Seraphina Vance",
  username: "seraphinareads",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80",
  bio: "Spicy romance enthusiast. Always reading past my bedtime. ☕️✨",
  readingGoal: 50,
  booksRead: 18
};

const SEED_POSTS = [
  {
    id: "post_1",
    user: {
      name: "Elara Thorne",
      username: "elaralovesbooks",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
    },
    book: PRESEEDED_BOOKS.find(b => b.id === "2"), // A Court of Thorns and Roses
    status: "reading",
    rating: 0,
    comment: "Re-reading ACOTAR for the third time because Rhysand owns my soul. Just started Chapter 55. If you know, you know! 😭💖",
    likes: 42,
    likedByUser: false,
    comments: [
      {
        id: "c_1_1",
        user: {
          name: "Maeve Sinclair",
          username: "maeve_reads",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80"
        },
        text: "Chapter 55 is absolute poetry! I am jealous you're reading it again.",
        timestamp: "2 hours ago"
      }
    ],
    timestamp: "3 hours ago"
  },
  {
    id: "post_2",
    user: {
      name: "Seraphina Vance",
      username: "seraphinareads",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    book: PRESEEDED_BOOKS.find(b => b.id === "3"), // The Seven Husbands of Evelyn Hugo
    status: "finished",
    rating: 5,
    comment: "Evelyn Hugo is the blueprint. This book completely shattered me into a million pieces. The writing is hypnotic, the plot twists are immaculate, and the emotional payoff is devastating. 10/10 stars, will never recover.",
    likes: 128,
    likedByUser: true,
    comments: [
      {
        id: "c_2_1",
        user: {
          name: "Oliver Blackwood",
          username: "oliver_reads",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
        },
        text: "The ending caught me completely off guard. Best book of the year for sure.",
        timestamp: "5 hours ago"
      },
      {
        id: "c_2_2",
        user: {
          name: "Daisy Bloom",
          username: "daisybooks",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
        },
        text: "Agree 100%! I recommend reading Daisy Jones & The Six next!",
        timestamp: "4 hours ago"
      }
    ],
    timestamp: "6 hours ago"
  },
  {
    id: "post_3",
    user: {
      name: "Amara Cole",
      username: "amaracreads",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80"
    },
    book: PRESEEDED_BOOKS.find(b => b.id === "10"), // Yellowface
    status: "reading",
    rating: 0,
    comment: "This book is so chaotic and stressful but I literally cannot put it down. June Hayward is the most unhinged narrator I have ever encountered. Send help! 😳☕️",
    likes: 19,
    likedByUser: false,
    comments: [],
    timestamp: "Yesterday"
  }
];

const SEED_FRIENDS = [
  {
    name: "Elara Thorne",
    username: "elaralovesbooks",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    status: "reading",
    bookTitle: "A Court of Thorns and Roses",
    bookAuthor: "Sarah J. Maas"
  },
  {
    name: "Maeve Sinclair",
    username: "maeve_reads",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    status: "finished",
    bookTitle: "Iron Flame",
    bookAuthor: "Rebecca Yarros"
  },
  {
    name: "Oliver Blackwood",
    username: "oliver_reads",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    status: "reading",
    bookTitle: "The Hobbit",
    bookAuthor: "J.R.R. Tolkien"
  },
  {
    name: "Daisy Bloom",
    username: "daisybooks",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    status: "finished",
    bookTitle: "Daisy Jones & The Six",
    bookAuthor: "Taylor Jenkins Reid"
  }
];

// Determine if Firebase is configured
export const isFirebaseConfigured = firebaseConfig && 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.apiKey.trim() !== "";

// Global Firebase service instances
export let auth = null;
export let db = null;

let cachedProfile = null;
let cachedPosts = [];
let cachedCustomBooks = [];
let cachedFriends = [];
let onPostsUpdatedCallback = null;

if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Subscribe to Firestore collections in real-time
    subscribeToCollections();
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
} else {
  console.warn("Firebase is not configured. Falling back to localStorage mock mode.");
}

// -------------------------------------------------------------
// Real-time Listeners
// -------------------------------------------------------------
function subscribeToCollections() {
  // Listen to posts
  const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  onSnapshot(postsQuery, (snapshot) => {
    cachedPosts = snapshot.docs.map(doc => {
      const data = doc.data();
      const currentUser = auth ? auth.currentUser : null;
      const likedByUser = currentUser ? (data.likedBy || []).includes(currentUser.uid) : false;
      return {
        id: doc.id,
        ...data,
        likedByUser: likedByUser,
        timestamp: data.timestamp ? formatFirestoreTimestamp(data.timestamp) : "Just now"
      };
    });
    
    // Auto-seed if database is completely empty
    if (snapshot.empty && cachedPosts.length === 0) {
      seedFirestoreDatabase();
    } else {
      if (onPostsUpdatedCallback) {
        onPostsUpdatedCallback(cachedPosts);
      }
    }
  }, (error) => {
    console.error("Error fetching realtime posts snapshot:", error);
  });

  // Listen to custom books
  onSnapshot(collection(db, "books"), (snapshot) => {
    cachedCustomBooks = snapshot.docs.map(doc => doc.data());
  }, (error) => {
    console.error("Error fetching realtime books snapshot:", error);
  });
}

// -------------------------------------------------------------
// Callback registration for UI updates
// -------------------------------------------------------------
export function registerPostsUpdateListener(callback) {
  onPostsUpdatedCallback = callback;
}

// -------------------------------------------------------------
// User Profile Logic
// -------------------------------------------------------------
export function getProfile() {
  if (!isFirebaseConfigured) {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return JSON.parse(data);
  }
  return cachedProfile || DEFAULT_PROFILE;
}

export async function saveProfile(profile) {
  if (!isFirebaseConfigured) {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    return;
  }
  
  const currentUser = auth.currentUser;
  if (!currentUser) return;
  
  const userDocRef = doc(db, "users", currentUser.uid);
  await setDoc(userDocRef, profile, { merge: true });
  cachedProfile = { ...cachedProfile, ...profile };
}

// -------------------------------------------------------------
// Posts, Likes and Comments Logic
// -------------------------------------------------------------
export function getPosts() {
  if (!isFirebaseConfigured) {
    const data = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(SEED_POSTS));
      return SEED_POSTS;
    }
    return JSON.parse(data);
  }
  return cachedPosts;
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
}

export async function addPost(post) {
  if (!isFirebaseConfigured) {
    const posts = getPosts();
    posts.unshift(post);
    savePosts(posts);

    if (post.status === 'finished') {
      const profile = getProfile();
      profile.booksRead += 1;
      saveProfile(profile);
    }
    return posts;
  }
  
  const currentUser = auth.currentUser;
  if (!currentUser || !cachedProfile) return;

  const newPostData = {
    user: {
      uid: currentUser.uid,
      name: cachedProfile.name,
      username: cachedProfile.username,
      avatar: cachedProfile.avatar
    },
    book: post.book,
    status: post.status,
    rating: post.rating,
    comment: post.comment,
    likes: 0,
    likedBy: [],
    comments: [],
    timestamp: new Date()
  };

  await addDoc(collection(db, "posts"), newPostData);

  if (post.status === 'finished') {
    const profile = getProfile();
    profile.booksRead += 1;
    await saveProfile(profile);
  }
}

export async function toggleLikePost(postId) {
  if (!isFirebaseConfigured) {
    const posts = getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      const post = posts[index];
      if (post.likedByUser) {
        post.likes = Math.max(0, post.likes - 1);
        post.likedByUser = false;
      } else {
        post.likes += 1;
        post.likedByUser = true;
      }
      savePosts(posts);
    }
    return posts;
  }

  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);

  if (postSnap.exists()) {
    const postData = postSnap.data();
    const likedBy = postData.likedBy || [];
    const isLiked = likedBy.includes(currentUser.uid);

    if (isLiked) {
      await updateDoc(postRef, {
        likes: increment(-1),
        likedBy: arrayRemove(currentUser.uid)
      });
    } else {
      await updateDoc(postRef, {
        likes: increment(1),
        likedBy: arrayUnion(currentUser.uid)
      });
    }
  }
}

export async function addCommentToPost(postId, commentText, userProfile) {
  if (!isFirebaseConfigured) {
    const posts = getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      const post = posts[index];
      const newComment = {
        id: `c_${Date.now()}`,
        user: {
          name: userProfile.name,
          username: userProfile.username,
          avatar: userProfile.avatar
        },
        text: commentText,
        timestamp: "Just now"
      };
      post.comments.push(newComment);
      savePosts(posts);
    }
    return posts;
  }

  const currentUser = auth.currentUser;
  if (!currentUser || !cachedProfile) return;

  const postRef = doc(db, "posts", postId);
  const newComment = {
    id: `c_${Date.now()}`,
    userId: currentUser.uid,
    user: {
      name: cachedProfile.name,
      username: cachedProfile.username,
      avatar: cachedProfile.avatar
    },
    text: commentText,
    timestamp: "Just now"
  };

  await updateDoc(postRef, {
    comments: arrayUnion(newComment)
  });
}

export async function updatePost(postId, updatedFields) {
  if (!isFirebaseConfigured) {
    const posts = getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      const post = posts[index];
      const oldStatus = post.status;
      const newStatus = updatedFields.status;
      posts[index] = { ...post, ...updatedFields };
      savePosts(posts);

      if (oldStatus === 'reading' && newStatus === 'finished') {
        const profile = getProfile();
        profile.booksRead += 1;
        saveProfile(profile);
      }
    }
    return posts;
  }

  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);

  if (postSnap.exists()) {
    const oldStatus = postSnap.data().status;
    const newStatus = updatedFields.status;

    await updateDoc(postRef, updatedFields);

    if (oldStatus === 'reading' && newStatus === 'finished') {
      const profile = getProfile();
      profile.booksRead += 1;
      await saveProfile(profile);
    }
  }
}

// -------------------------------------------------------------
// Custom Books Database
// -------------------------------------------------------------
export function getCustomBooks() {
  if (!isFirebaseConfigured) {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_BOOKS);
    return data ? JSON.parse(data) : [];
  }
  return cachedCustomBooks;
}

export async function saveCustomBook(book) {
  if (!isFirebaseConfigured) {
    const books = getCustomBooks();
    books.unshift(book);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_BOOKS, JSON.stringify(books));
    return book;
  }

  await addDoc(collection(db, "books"), book);
  cachedCustomBooks.unshift(book);
  return book;
}

export function getAllBooks() {
  return [...getCustomBooks(), ...PRESEEDED_BOOKS];
}

// -------------------------------------------------------------
// Online Library Search Fallbacks
// -------------------------------------------------------------
export async function searchOpenLibrary(query) {
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const data = await resp.json();
  return data.docs.map(doc => ({
    id: `ol_${doc.key}`,
    title: doc.title,
    author: (doc.author_name && doc.author_name[0]) || 'Unknown',
    cover: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : 'https://via.placeholder.com/150x220?text=No+Cover',
    genre: doc.subject ? doc.subject[0] : 'Book'
  }));
}

export async function searchOnlineLibrary(query) {
  if (!query || query.trim().length === 0) return [];
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    if (!data.items) return [];
    
    return data.items.map(item => {
      const info = item.volumeInfo || {};
      let cover = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80';
      if (info.imageLinks) {
        const coverSrc = info.imageLinks.thumbnail || info.imageLinks.smallThumbnail;
        if (coverSrc) {
          cover = coverSrc.replace(/^http:\/\//i, 'https://');
        }
      }
      return {
        id: item.id || `google_${Math.random()}`,
        title: info.title || 'Untitled Book',
        author: (info.authors && info.authors[0]) || 'Unknown Author',
        cover: cover,
        genre: (info.categories && info.categories[0]) || 'Book',
        pages: info.pageCount || 300,
        description: info.description || 'No description available.'
      };
    });
  } catch (error) {
    console.error('Google Books API search failed, trying Open Library:', error);
    try {
      return await searchOpenLibrary(query);
    } catch (olError) {
      console.error('Open Library fallback failed:', olError);
      return [];
    }
  }
}

// -------------------------------------------------------------
// Friends List Logic
// -------------------------------------------------------------
export function getFriendsList() {
  if (!isFirebaseConfigured) return SEED_FRIENDS;
  return cachedFriends.length > 0 ? cachedFriends : SEED_FRIENDS;
}

export async function fetchFriends() {
  if (!isFirebaseConfigured) return SEED_FRIENDS;
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    
    const friends = [];
    const currentUser = auth.currentUser;
    
    snapshot.forEach(docSnap => {
      if (currentUser && docSnap.id === currentUser.uid) return;
      const u = docSnap.data();
      friends.push({
        name: u.name,
        username: u.username,
        avatar: u.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        status: u.booksRead > 0 ? "finished" : "reading",
        bookTitle: u.booksRead > 0 ? "A good book" : "Just started reading",
        bookAuthor: "Featured Author"
      });
    });
    
    cachedFriends = friends.length > 0 ? friends : SEED_FRIENDS;
    return cachedFriends;
  } catch (error) {
    console.error("Failed to fetch friends from Firestore:", error);
    return SEED_FRIENDS;
  }
}

// -------------------------------------------------------------
// Authentication API Operations
// -------------------------------------------------------------
export async function signUpUser(email, password, displayName, username) {
  if (!isFirebaseConfigured) {
    return { uid: "mock_user_123", email, displayName };
  }

  // 1. Create firebase user
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // 2. Set profile display name
  await updateProfile(user, { displayName });

  // 3. Set document in Firestore
  const cleanUsername = username.toLowerCase().replace(/\s+/g, '');
  const profile = {
    name: displayName,
    username: cleanUsername,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80",
    bio: "Spicy romance enthusiast. Always reading past my bedtime. ☕️✨",
    readingGoal: 50,
    booksRead: 0
  };

  await setDoc(doc(db, "users", user.uid), profile);
  cachedProfile = profile;

  return user;
}

export async function signInUser(email, password) {
  if (!isFirebaseConfigured) {
    return { uid: "mock_user_123", email, displayName: "Seraphina Vance" };
  }
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function signOutUser() {
  if (!isFirebaseConfigured) return;
  await signOut(auth);
}

export function subscribeToAuthChanges(callback) {
  if (!isFirebaseConfigured) {
    // Return a mock user for instant preview
    setTimeout(() => {
      callback({
        uid: "mock_user_123",
        email: "seraphina@example.com",
        displayName: "Seraphina Vance"
      });
    }, 200);
    return () => {};
  }

  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          cachedProfile = userDocSnap.data();
        } else {
          // Fallback doc creation
          const defaultProf = {
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            username: firebaseUser.email.split('@')[0].toLowerCase(),
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
            cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80",
            bio: "Spicy romance enthusiast. Always reading past my bedtime. ☕️✨",
            readingGoal: 50,
            booksRead: 0
          };
          await setDoc(userDocRef, defaultProf);
          cachedProfile = defaultProf;
        }
        
        // Fetch custom friends list async
        fetchFriends();
      } catch (err) {
        console.error("Error setting up authenticated user profile:", err);
      }
      callback(firebaseUser);
    } else {
      cachedProfile = null;
      callback(null);
    }
  });
}

// -------------------------------------------------------------
// Utilities
// -------------------------------------------------------------
function formatFirestoreTimestamp(ts) {
  if (!ts) return "Just now";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

async function seedFirestoreDatabase() {
  try {
    console.log("Firestore database is empty. Auto-seeding default content...");
    const batch = writeBatch(db);

    SEED_POSTS.forEach((post) => {
      let ts = new Date();
      if (post.timestamp.includes("3 hours")) {
        ts.setHours(ts.getHours() - 3);
      } else if (post.timestamp.includes("6 hours")) {
        ts.setHours(ts.getHours() - 6);
      } else if (post.timestamp.includes("Yesterday")) {
        ts.setDate(ts.getDate() - 1);
      }

      const postRef = doc(collection(db, "posts"));
      batch.set(postRef, {
        user: {
          uid: "seed_user_" + post.user.username,
          name: post.user.name,
          username: post.user.username,
          avatar: post.user.avatar
        },
        book: post.book,
        status: post.status,
        rating: post.rating,
        comment: post.comment,
        likes: post.likes,
        likedBy: [],
        comments: post.comments.map(c => ({
          id: c.id,
          user: {
            name: c.user.name,
            username: c.user.username,
            avatar: c.user.avatar
          },
          text: c.text,
          timestamp: c.timestamp
        })),
        timestamp: ts
      });
    });

    await batch.commit();
    console.log("Database successfully seeded!");
  } catch (err) {
    console.error("Failed to seed database:", err);
  }
}
