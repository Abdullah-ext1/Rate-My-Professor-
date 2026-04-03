import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../components/AuthContext.jsx'
import ChatSidebar from '../components/ChatSidebar';
import PostCard from '../components/PostCard';
import Compose from '../components/Compose';
import '../styles/Feed.css';
import { api } from '../Api/api.js';
  
const Feed = () => {
  
  const { user } = useContext(AuthContext)
  console.log(user)
  const [loading, setLoading] = useState(true);


  const [posts, setPosts] = useState([
    // { id: 1, avatar: '👻', handle: 'Anonymous panda', tag: 'confession', tagClass: 'tag-confession', time: '14 min ago', body: 'I have 61% attendance in Prof Rao\'s OS class and the exam is in 3 weeks. I have attended exactly 0 classes this month. I am not okay.', likes: 47, replies: 12, views: 234 },
  ]);

  useEffect(() => {
    const fetchedPosts = async() => {
      try {
        setLoading(true)
        const response = await api.get("/posts")
        setPosts(response.data.data)
        console.log(response.data.data)
      } catch (error) {
        console.log("Error while fetching Posts", error)
      } finally {
        setLoading(false)
      }
    }
    fetchedPosts()
  }, [])

  const [selectedTab, setSelectedTab] = useState('All');

  const handleNewPost = (postText, selectedTag) => {
    console.log('New post:', postText, selectedTag);
    // You'll implement the logic here
  };

  useEffect(() => {
    try {
      
    } catch (error) {
      console.log("Error while creating post", error)
    }
  })

  return (
    <div className="app-layout">
      <ChatSidebar activeView="feed" />
      <div className="main">
        <div className="topbar">
          <div className="page-title">Feed</div>
          <button className="post-btn">+ Post anonymously</button>
        </div>

        <div className="feed-tabs">
          {['All', 'Confessions', 'Attendance', 'Questions', 'Rants'].map((tab) => (
            <div
              key={tab}
              className={`tab ${selectedTab === tab ? 'active' : ''}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className="feed-content">
          <Compose onPost={handleNewPost} />

          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;



  // { id: 2, avatar: '🦋', handle: 'Anonymous butterfly', tag: 'attendance', tagClass: 'tag-attendance', time: '32 min ago', body: 'DS lab attendance taken today at 9:05am sharp. Sir was checking faces — proxy not possible. 3 people got marked absent who were literally sitting there lol', likes: 89, replies: 28 },
  // { id: 3, avatar: '🐧', handle: 'Anonymous penguin', tag: 'question', tagClass: 'tag-question', time: '1 hr ago', body: 'Does anyone have Prof Mehta\'s DBMS notes from last semester? The ones with ER diagrams? I missed 2 weeks and the exam pattern changed', likes: 23, replies: 7 },
  // { id: 4, avatar: '🦁', handle: 'Anonymous lion', tag: 'rant', tagClass: 'tag-rant', time: '2 hrs ago', body: 'Why does the college WiFi work perfectly in the canteen but literally not exist in the CS lab. We are a computer science department. I am going to cry.', likes: 134, replies: 41 },