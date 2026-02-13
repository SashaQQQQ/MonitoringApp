import { useState, useRef } from "react";
import { supabase } from "./SupabaseClient.js";
import "../Styles/LogInPage.css";

function LogInPage({ setUserProfile }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

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
        .eq("id", userId);

      if (profileError) {
        alert(profileError.message);
        return;
      }
      if (profileData.length === 0) {
        alert("No profile data found for this user.");
        return;
      }
      if (profileData.length > 0) {
        alert("User logged in successfully:", profileData);
        setUserProfile(profileData);
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
    isValidLogin(login);
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
      <h1>Please, log in the system</h1>
      <p>Fill the fields</p>
      <input
        placeholder="Login"
        onChange={(e) => {
          handleLoginChange(e.target.value);
        }}
        type="text"
      />
      <div className="passwordInputContainer">
        <input
          ref={passwordInputRef}
          placeholder="Password"
          onChange={(e) => {
            handlePasswordChange(e.target.value);
          }}
          type="password"
        />
        <button className="passwordEye" onClick={seeThePassword}>
          See
        </button>
      </div>
      <p
        style={{
          color: "rgb(217, 47, 47)",
          fontWeight: 700,
          fontSize: "clamp(0.8rem, 2vw, 1.2rem)",
          textAlign: "center",
        }}
      >
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
