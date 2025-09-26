import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

interface LoginProps {
  setUserName: (name: string | null) => void;
}

const Login: React.FC<LoginProps> = ({ setUserName }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // backend message
  const [isError, setIsError] = useState(false); // track if message is an error

  const handleSubmit = async () => {
    const endpoint = isLogin ? "login" : "register";
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(`http://localhost:3000/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.error) {
        setMessage(data.error);
        setIsError(true);
      } else {
        setMessage(isLogin ? "Logged in successfully" : "Account created successfully");
        setIsError(false);

        // Store JWT on login
        if (isLogin && data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("name", data.name);
          setUserName(data.name);
          navigate("/products");
        }
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error. Check console for details.");
      setIsError(true);
    }
  };

  return (
    <div className="Login-container">
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      
      <button
        className="switch-button"
        onClick={() => setIsLogin(!isLogin)}
      >
        Switch to {isLogin ? "Sign Up" : "Login"}
      </button>

      <div className="Login-form">
        {!isLogin && (
          <input
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        )}
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="submit-button" onClick={handleSubmit}>
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </div>

      {/* Display backend message */}
      {message && (
        <p className={`backend-message ${isError ? "error" : "success"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Login;
function setUserName(name: any) {
  throw new Error("Function not implemented.");
}

