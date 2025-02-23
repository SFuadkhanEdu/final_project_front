import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import { toast, ToastContainer } from "react-toastify";

function LoginPage() {
  const [isEyesClosed, setIsEyesClosed] = useState(false);
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const pupilsRef = useRef([]);

  // Function to get the caret position
  function getCaretPosition(input) {
    let caretPos = 0;
    if (document.selection) {
      input.focus();
      let sel = document.selection.createRange();
      sel.moveStart("character", -input.value.length);
      caretPos = sel.text.length;
    } else if (input.selectionStart || input.selectionStart === "0") {
      caretPos = input.selectionStart;
    }
    return caretPos;
  }

  // Function to move the pupils
  function movePupils(input) {
    const pupils = pupilsRef.current;
    const inputs = [usernameInputRef.current, passwordInputRef.current];
    pupils.forEach((pupil) => {
      const inputElement = inputs.find((inputEl) => inputEl === input);
      if (!inputElement) return;

      const caretPos = getCaretPosition(inputElement);
      const charWidth = 10; // Estimated character width (in px)
      const inputRect = inputElement.getBoundingClientRect();
      const caretX = inputRect.left + caretPos * charWidth;
      const caretY = inputRect.top + inputRect.height / 2;

      const eye = pupil.parentElement;
      const eyeRect = eye.getBoundingClientRect();
      const eyeCenterX = eyeRect.left + eyeRect.width / 2;
      const eyeCenterY = eyeRect.top + eyeRect.height / 2;

      if (inputElement.value.length === 0) {
        pupil.style.transform = "translate(-50%, -50%)"; // Center the pupils
      } else {
        const angle = Math.atan2(caretY - eyeCenterY, caretX - eyeCenterX);
        const distance = Math.min(eyeRect.width / 4, eyeRect.height / 4);
        const pupilX = distance * Math.cos(angle);
        const pupilY = distance * Math.sin(angle);
        pupil.style.transform = `translate(-50%, -50%) translate(${pupilX}px, ${pupilY}px)`;
      }
    });
  }

  // ✅ Updated submit handler
  async function submitHandle(e) {
    e.preventDefault();

    const email = usernameInputRef.current.value;
    const password = passwordInputRef.current.value;

    if (!email || !password) {
      toast("Please enter both username and password.");
      return;
    }

    try {
        const response = await fetch("http://localhost:5001/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: "include", // Include cookies with the request
        });
        

      const data = await response.json();

      if (response.ok) {
        toast("Login successful!");
        // Optionally, redirect user or save token in localStorage
      } else {
        toast(data.message || "Login failed. Try again.");
      }
    } catch (error) {
      toast("An error occurred. Please try again.");
      console.error("Login error:", error);
    }
  }

  useEffect(() => {
    // Event listeners to open/close eyes
    const handleFocus = (e) => {
      if (e.target.type === "password") {
        setIsEyesClosed(true); // Close eyes when focusing on password
      } else {
        setIsEyesClosed(false); // Open eyes when focusing on username
      }
    };

    const handleBlur = () => {
      setIsEyesClosed(false); // Reopen eyes when focus is lost
    };

    const handleInput = (e) => {
      movePupils(e.target);
    };

    const inputs = [usernameInputRef.current, passwordInputRef.current];
    inputs.forEach((input) => {
      input.addEventListener("focus", handleFocus);
      input.addEventListener("blur", handleBlur);
      input.addEventListener("input", handleInput);
    });

    // Cleanup event listeners on component unmount
    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("focus", handleFocus);
        input.removeEventListener("blur", handleBlur);
        input.removeEventListener("input", handleInput);
      });
    };
  }, []);

  return (
    <>
    <ToastContainer></ToastContainer>

<div id="login-page-container">

  <div className="eyes-container">
    <div className={`eye ${isEyesClosed ? "closed" : ""}`}>
      <div className="pupil" ref={(el) => (pupilsRef.current[0] = el)}></div>
    </div>
    <div className={`eye ${isEyesClosed ? "closed" : ""}`}>
      <div className="pupil" ref={(el) => (pupilsRef.current[1] = el)}></div>
    </div>
  </div>

  <form onSubmit={submitHandle} className="login-container">
    <h2 className="text-xl text-center mb-4">Login</h2>
    <input type="text" placeholder="Username" id="username" ref={usernameInputRef} />
    <input type="password" placeholder="Password" id="password" ref={passwordInputRef} />
    <button type="submit">Login</button>
  </form>
</div>
    </>
  );
}

export default LoginPage;
