import React,{useEffect, useState} from 'react'
import Login from '../components/Login'
import Signup from '../components/Signup'
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [activeTab, setActiveTab] = useState('login'); 
  const navigate = useNavigate();
  useEffect(()=>{
    const token = JSON.parse(localStorage.getItem('token'));
    if(token){
      navigate('/chats');
    }
  },[])

  const switchTab = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-lg">
      <div className="flex justify-around mb-4">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'login' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => switchTab('login')}
        >
          Login
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'signup' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => switchTab('signup')}
        >
          Sign Up
        </button>
      </div>

      <div>
        {activeTab === 'login' && <Login />}
        {activeTab === 'signup' && <Signup />}
      </div>
    </div>
  );
}

export default HomePage