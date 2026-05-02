import { useState, useRef, useEffect, useContext } from "react";
import { supabase } from "./SupabaseClient.js";
import "../Styles/LogInPage.css";
import { useNavigate } from "react-router-dom";
import { DataContext } from "./DataContext.jsx";
import emailIcon from "../Icons/message.png";
import passwordIcon from "../Icons/padlock.png";
import seePasswordIcon from "../Icons/visual.png";

function LogInPage() {
  const { setUserProfile } = useContext(DataContext);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loginWarning, setLoginWarning] = useState("");
  const [passwordWarning, setPasswordWarning] = useState("");

  const passwordInputRef = useRef(null);

  async function handleLogIn(e) {
    e.preventDefault();
    let trimmedLogin = login.trim();
    let trimmedPassword = password.trim();
    
    if (!checkInputedData(trimmedLogin, trimmedPassword)) {
      return;
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedLogin,
      password: trimmedPassword,
    });
    if (error) {
      console.error("Login error:", error.message);
      alert("Login error: " + error.message);
      return;
    }
    if (!error) {
      console.log("User logged in successfully:", data.user.id);
      const userId = data.user.id;

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        alert(profileError.message);
        return;
      }

      if (profileData) {
        setUserProfile(profileData);
        navigate(
         "/Home"
        );
      }
    }
  }
  function seeThePassword() {
    const passwordInput = passwordInputRef.current;
    password.type =  passwordInput.type === "password" ? passwordInput.type = "text" : passwordInput.type = "password";
   
  }
  function handleLoginChange(e) {
    setLogin(e);
  }
  function handlePasswordChange(e) {
    setPassword(e);
  }

  function checkInputedData(trimmedLogin,trimmedPassword) {

    const isLogin = isValidLogin(trimmedLogin);
    const isPassword = trimmedPassword.length >= 8;
    
    if (!isPassword) {
      setPasswordWarning("Password must be at least 8 characters long");
    }

    return isLogin && isPassword;
  }
  function isValidLogin(login) {
    const value = login.trim();

    if(value === "" ) {
      setLoginWarning("Email is requered!");
      return false;
    }

    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
      if (!re.test(login) ) {
        setLoginWarning("Email is invalid!");
        return false;
      }

    
    setLoginWarning("");
    return true;
  }

  return (
 
    <form className="LogInPageContainer" onSubmit={(e) => {handleLogIn(e)}}>

      <h1>Welcome here!</h1>
      <p>Fill the fields, to log in.</p>
      <div className="inputLine">
        <img src={emailIcon} alt="mail" />
        <input
          placeholder="Login"
          onChange={(e) => {
            handleLoginChange(e.target.value);
          }}
          type="text"
        />
      </div>
      <div className="inputLine">
        <img src={passwordIcon} alt="password" />
        <input
          ref={passwordInputRef}
          placeholder="Password"
          onChange={(e) => {
            handlePasswordChange(e.target.value);
          }}
          type="password"
        />
        <img
          onClick={() => {
            seeThePassword();
          }}
          className="seeBtn"
          src={seePasswordIcon}
          alt="see"
        />
      </div>
      <p className="warningText">
        {loginWarning} <br />
        {passwordWarning}
      </p>
      <p className="ForgottenDataText">
        Forgot your login data?
        <br />
        Contact your leader.
      </p>
      <button type="submit">Log In</button>
    </form>

  );
}

export default LogInPage;
