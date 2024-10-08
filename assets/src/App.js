import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import Card from './Card';
import Home from './Home';
import Header from './Header';
import AboutMe from './AboutMe';
import './App.css';
import Request from './Request';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import Cookies from 'universal-cookie';
//import axios from 'axios';

function App() {
  const [user, setUser] = useState();
  const [profile, setProfile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useGoogleLogin({
      onSuccess: (codeResponse) => setUser(codeResponse), 
      //onError: (error) => setUser({"access_token":"hi"})
      onError: (error) => console.log('Login Failed:', error)
  });
  const login1 = () => { setUser({"access_token":"hi"}) }

  const createGame = () => {
    
  }

  useEffect( () => {
    if (user) {
      const authenticate = async () => {
        setIsLoading(true);
        setError(null);
        try {
          var url = `http://localhost:8080/api/auth?access_token=${user.access_token}`;
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Could not authenticate ${response.status}`);
          }
          const userInfo = await response.json();
          const cookies = new Cookies();
          console.log(response.headers.get("Session-id"));
          console.log(Array.from(response.headers.entries()));
          cookies.set('X-Auth-Session-Id', response.headers.get("Session-id"), { path: '/' });
          setProfile(userInfo);
          console.log(userInfo);
        } catch(error) {
          setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    console.log("authenticate");
    authenticate();
      //const responseData = await response.json();
      //console.log(responseData);
      //console.log(user);
      //console.log(url);
      //axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
      //axios.get(url, {
      //  headers: {
      //    Authorization: `Bearer ${user.access_token}`,
      //    Accept: 'application/json'
      
      //}).then((res) => {
      //  setProfile(res.data);
      //  console.log(res.data);
      //}).catch((err) => console.log(err));
    }
  }, [ user ] );

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <Home />
    </div>
  );
}

export default App;
