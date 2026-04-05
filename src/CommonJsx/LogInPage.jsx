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

  async function handleLogIn() {
    if (!checkInputedData()) {
      return;
    }

    let trimmedLogin = login.trim();
    let trimmedPassword = password.trim();
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
          profileData.Role === "Owner"
            ? "/adminHome"
            : profileData.Role === "Admin"
              ? "/adminHome"
              : "/workerHome",
        );
      }
    }
  }
  function seeThePassword() {
    const passwordInput = passwordInputRef.current;
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  }
  function handleLoginChange(e) {
    setLogin(e);
    isValidLogin(e);
  }
  function handlePasswordChange(e) {
    const newPassword = e;
    setPassword(newPassword);

    setPasswordWarning(
      newPassword.length >= 8
        ? ""
        : "Password must be at least 8 characters long",
    );
  }

  function checkInputedData() {
    if (isValidLogin(login)) {
      if (password.length >= 8) {
        return true;
      } else {
        setPasswordWarning("Password must be at least 8 characters long");
      }
    }
  }
  function isValidLogin(login) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (re.test(login)) {
      setLoginWarning("");
      return true;
    }
    setLoginWarning("Enter a valid email");
    return false;
  }

  return (
    <div className="LogInPageContainer">
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
      <button onClick={handleLogIn}>Log In</button>
    </div>
  );
}

export default LogInPage;
