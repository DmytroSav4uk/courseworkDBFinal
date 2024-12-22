const baseUrl = 'http://localhost:5000/api/'

const urls = {

  users: {
    users: `${baseUrl}Users`
  },

  comments: {
    comments: `${baseUrl}Comments`,
    commentsByPost: `${baseUrl}Comments/ByPost`
  },

  posts: {
    posts: `${baseUrl}Posts`
  },

  messages: {
    writeMessage: `${baseUrl}Messages`,
    getConversation: `${baseUrl}Messages/Conversation`
  },

  likes: {
    likes:`${baseUrl}Likes`,
    getLikedPosts: `${baseUrl}Likes/User`,
    addLike:`${baseUrl}Likes`,
    remove:`${baseUrl}Likes/remove`
  },

  friendships: {
    friendships:`${baseUrl}Friendships`,
    byUser:`${baseUrl}Friendships/user/`
  },

  statistics:{
    users:`${baseUrl}Statistics/UserRegistrations/`,
    posts:`${baseUrl}Statistics/PostCounts/`,
    likes:`${baseUrl}Statistics/LikeCounts/`,
    mostLiked:`${baseUrl}Statistics/MostLikedPost/`
  }
}

export {urls}
