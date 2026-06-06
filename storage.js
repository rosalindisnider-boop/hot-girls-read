import { PRESEEDED_BOOKS } from './books.js?v=5';

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
  readingGoal: 100,
  booksRead: 80
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
      name: "Seraphina Vance", // Matches the default user profile
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
    id: "post_user_1",
    user: {
      name: "Seraphina Vance",
      username: "seraphinareads",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    book: PRESEEDED_BOOKS.find(b => b.id === "1"), // It Ends With Us
    status: "finished",
    rating: 4,
    comment: "Colleen Hoover knows how to pull at your heartstrings. A heavy but beautiful story about resilience and making difficult choices. 🌸",
    likes: 31,
    likedByUser: false,
    comments: [],
    timestamp: "1 day ago"
  },
  {
    id: "post_user_4",
    user: {
      name: "Seraphina Vance",
      username: "seraphinareads",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    book: PRESEEDED_BOOKS.find(b => b.id === "4"), // Normal People
    status: "finished",
    rating: 5,
    comment: "I've never read a book that portrays intimacy and vulnerability so accurately. Connell and Marianne are forever in my heart. 😭❤️",
    likes: 45,
    likedByUser: false,
    comments: [],
    timestamp: "2 days ago"
  },
  {
    id: "post_user_5",
    user: {
      name: "Seraphina Vance",
      username: "seraphinareads",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    book: PRESEEDED_BOOKS.find(b => b.id === "5"), // Happy Place
    status: "finished",
    rating: 4,
    comment: "Emily Henry does it again! The banter was top-tier, and the second-chance romance aspect was so emotional. Perfect vacation read! ☀️🌊",
    likes: 27,
    likedByUser: false,
    comments: [],
    timestamp: "3 days ago"
  },
  {
    id: "post_user_6",
    user: {
      name: "Seraphina Vance",
      username: "seraphinareads",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    book: PRESEEDED_BOOKS.find(b => b.id === "6"), // Fourth Wing
    status: "reading",
    rating: 0,
    comment: "Oh my gosh, I am officially obsessed with Xaden Riorson. Dragon military academy is brutal but I cannot put this down! 🐉✨",
    likes: 56,
    likedByUser: false,
    comments: [],
    timestamp: "4 days ago"
  },
  {
    id: "post_user_7",
    user: {
      name: "Seraphina Vance",
      username: "seraphinareads",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    book: PRESEEDED_BOOKS.find(b => b.id === "7"), // The Silent Patient
    status: "finished",
    rating: 5,
    comment: "THAT PLOT TWIST. I literally stared at the wall in silence for 15 minutes. Absolute masterpiece of psychological suspense. 🔍👀",
    likes: 62,
    likedByUser: false,
    comments: [],
    timestamp: "5 days ago"
  },
  {
    id: "post_user_8",
    user: {
      name: "Seraphina Vance",
      username: "seraphinareads",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    book: PRESEEDED_BOOKS.find(b => b.id === "8"), // Book Lovers
    status: "finished",
    rating: 4,
    comment: "Nora and Charlie are my absolute favorites. The chemistry, the rival-to-lovers dynamic, the small-town setting... Emily Henry, take all my money. 📖💕",
    likes: 38,
    likedByUser: false,
    comments: [],
    timestamp: "6 days ago"
  },
  {
    id: "post_user_9",
    user: {
      name: "Seraphina Vance",
      username: "seraphinareads",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    book: PRESEEDED_BOOKS.find(b => b.id === "9"), // Verity
    status: "finished",
    rating: 4,
    comment: "Creepy, dark, and completely addictive. I couldn't sleep until I finished it. That ending still has me questioning everything. 💀🖊️",
    likes: 49,
    likedByUser: false,
    comments: [],
    timestamp: "1 week ago"
  },
  {
    id: "post_user_11",
    user: {
      name: "Seraphina Vance",
      username: "seraphinareads",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    book: PRESEEDED_BOOKS.find(b => b.id === "11"), // The Midnight Library
    status: "finished",
    rating: 5,
    comment: "Between life and death there is a library... Such a comforting and beautiful exploration of regret, choices, and what truly makes life worth living. 🌌✨",
    likes: 53,
    likedByUser: false,
    comments: [],
    timestamp: "1 week ago"
  },
  {
    id: "post_user_12",
    user: {
      name: "Seraphina Vance",
      username: "seraphinareads",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    book: PRESEEDED_BOOKS.find(b => b.id === "12"), // Pride and Prejudice
    status: "finished",
    rating: 5,
    comment: "Mr. Darcy is the blueprint. Re-reading this classic and it's just as witty and romantic as ever. Elizabeth Bennet is an absolute icon. ✒️🎩",
    likes: 67,
    likedByUser: false,
    comments: [],
    timestamp: "2 weeks ago"
  },
  {
    id: "post_user_13",
    user: {
      name: "Seraphina Vance",
      username: "seraphinareads",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    book: PRESEEDED_BOOKS.find(b => b.id === "13"), // The Love Hypothesis
    status: "finished",
    rating: 4,
    comment: "Fake dating in STEM? Yes, a thousand times yes! Olive and Adam are adorable, and the science jokes were a perfect addition. 🔬🧪❤️",
    likes: 41,
    likedByUser: false,
    comments: [],
    timestamp: "2 weeks ago"
  },
  {
    id: "post_user_14",
    user: {
      name: "Seraphina Vance",
      username: "seraphinareads",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    book: PRESEEDED_BOOKS.find(b => b.id === "14"), // Tomorrow, and Tomorrow, and Tomorrow
    status: "finished",
    rating: 5,
    comment: "This is not just about video game design; it's a profound exploration of friendship, creative partnership, grief, and love over 30 years. Exquisite. 🎮👾❤️",
    likes: 72,
    likedByUser: false,
    comments: [],
    timestamp: "3 weeks ago"
  },
  {
    id: "post_user_15",
    user: {
      name: "Seraphina Vance",
      username: "seraphinareads",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    book: PRESEEDED_BOOKS.find(b => b.id === "15"), // The Hunger Games
    status: "finished",
    rating: 5,
    comment: "Katniss Everdeen, the girl on fire. Rereading this trilogy and it is still a masterclass in pacing, tension, and survival. 🏹🔥🌲",
    likes: 83,
    likedByUser: false,
    comments: [],
    timestamp: "1 month ago"
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

export function getProfile() {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  }
  return JSON.parse(data);
}

export function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}

export function getCustomBooks() {
  const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_BOOKS);
  return data ? JSON.parse(data) : [];
}

export function saveCustomBook(book) {
  const books = getCustomBooks();
  books.unshift(book);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_BOOKS, JSON.stringify(books));
  return book;
}

export function getAllBooks() {
  return [...getCustomBooks(), ...PRESEEDED_BOOKS];
}
// Search Open Library by title
export async function searchOpenLibrary(query) {
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const data = await resp.json();
  // Map Open Library docs to our book format
  return data.docs.map(doc => ({
    id: `ol_${doc.key}`,
    title: doc.title,
    author: (doc.author_name && doc.author_name[0]) || 'Unknown',
    cover: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : 'https://via.placeholder.com/150x220?text=No+Cover',
    genre: doc.subject ? doc.subject[0] : 'Book'
  }));
}

// Search online library (Google Books API with Open Library fallback)
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


export function getPosts() {
  const data = localStorage.getItem(STORAGE_KEYS.POSTS);
  let posts = [];
  if (!data) {
    posts = SEED_POSTS;
  } else {
    try {
      posts = JSON.parse(data);
    } catch (e) {
      posts = SEED_POSTS;
    }
  }

  // Count unique books for the user 'seraphinareads'
  const ownPosts = posts.filter(p => p.user && p.user.username === 'seraphinareads');
  const uniqueBookIds = new Set(ownPosts.map(p => p.book.id));

  // If user has less than 95 books of the preseeded ones, force-add posts for all 100 books
  if (uniqueBookIds.size < 95) {
    const injectedPosts = [...posts];
    PRESEEDED_BOOKS.forEach((book, idx) => {
      if (!uniqueBookIds.has(book.id)) {
        const isFinished = idx % 5 !== 0; // Make some reading, most finished
        const rating = isFinished ? (3 + (idx % 3)) : 0; // rating 3, 4, or 5
        const comment = isFinished 
          ? `I absolutely loved reading "${book.title}"! High-fidelity wood shelf zoom testing looks fantastic.` 
          : `Currently reading "${book.title}" on my beautiful scrolling library shelf!`;
        
        injectedPosts.push({
          id: `injected_${book.id}_${Date.now()}`,
          user: {
            name: "Seraphina Vance",
            username: "seraphinareads",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
          },
          book: book,
          status: isFinished ? "finished" : "reading",
          rating: rating,
          comment: comment,
          likes: Math.floor(Math.random() * 50) + 10,
          likedByUser: Math.random() > 0.5,
          comments: [],
          timestamp: `${idx + 1} day${idx !== 0 ? 's' : ''} ago`
        });
      }
    });
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(injectedPosts));
    
    // Dynamically update user profile booksRead and readingGoal to match the new database size
    const profile = getProfile();
    const ownFinishedCount = injectedPosts.filter(p => p.user && p.user.username === 'seraphinareads' && p.status === 'finished').length;
    profile.booksRead = ownFinishedCount;
    profile.readingGoal = 100;
    saveProfile(profile);
    
    return injectedPosts;
  }
  
  return posts;
}

export function savePosts(posts) {
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
}

export function addPost(post) {
  const posts = getPosts();
  posts.unshift(post);
  savePosts(posts);

  // If the post is 'finished', let's increment the user's books read count in profile
  if (post.status === 'finished') {
    const profile = getProfile();
    profile.booksRead += 1;
    saveProfile(profile);
  }
  return posts;
}

export function toggleLikePost(postId) {
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

export function addCommentToPost(postId, commentText, userProfile) {
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

export function updatePost(postId, updatedFields) {
  const posts = getPosts();
  const index = posts.findIndex(p => p.id === postId);
  if (index !== -1) {
    const post = posts[index];
    const oldStatus = post.status;
    const newStatus = updatedFields.status;

    // Apply updates
    posts[index] = { ...post, ...updatedFields };
    savePosts(posts);

    // If transitioned from reading to finished, increment books read count
    if (oldStatus === 'reading' && newStatus === 'finished') {
      const profile = getProfile();
      profile.booksRead += 1;
      saveProfile(profile);
    }
  }
  return posts;
}

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

export function getFriendsList() {
  return SEED_FRIENDS;
}

export function getAllUsers() {
  const posts = getPosts();
  const friends = getFriendsList();
  const currentUser = getProfile();
  
  const usersMap = new Map();
  
  // Add current user
  usersMap.set(currentUser.username, {
    name: currentUser.name,
    username: currentUser.username,
    avatar: currentUser.avatar,
    bio: currentUser.bio || "No bio yet.",
    isCurrentUser: true
  });
  
  // Add friends
  friends.forEach(f => {
    if (!usersMap.has(f.username)) {
      usersMap.set(f.username, {
        name: f.name,
        username: f.username,
        avatar: f.avatar,
        bio: `${f.name} loves reading spicy romance and fantasy novels! ✨`,
        isCurrentUser: false
      });
    }
  });
  
  // Add users from posts
  posts.forEach(p => {
    if (!usersMap.has(p.user.username)) {
      usersMap.set(p.user.username, {
        name: p.user.name,
        username: p.user.username,
        avatar: p.user.avatar,
        bio: `${p.user.name} is a proud member of the Hot Girls Read book club! 📖✨`,
        isCurrentUser: false
      });
    }
  });
  
  return Array.from(usersMap.values());
}


