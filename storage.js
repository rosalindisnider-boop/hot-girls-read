import { PRESEEDED_BOOKS } from './books.js';

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
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(SEED_POSTS));
    return SEED_POSTS;
  }
  return JSON.parse(data);
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


