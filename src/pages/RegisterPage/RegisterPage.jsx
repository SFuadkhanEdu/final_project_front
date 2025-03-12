import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./index.css";
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  username: Yup.string()
    .min(4, "Username must be at least 4 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function RegisterPage() {
    const [APImessage, setAPImessage] = useState("")
    const navigate = useNavigate();
    const handleSubmit = (values) => {
        fetch("http://localhost:5001/api/register", {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(values),
        })
          .then((res) => res.json()) // Parse the JSON response
          .then((data) => {
            toast(data.message)
            console.log(data);
            if (data.message === "User Registered Successfully") {
              setTimeout(() => {
                navigate("/login")
              }, 2000);
            }
            
          })
          .catch((err) => console.log(err));


          
      };
      

  return (
    <div id="register-page-container">
        <ToastContainer></ToastContainer>
      <div className="register-container">
        <h2 className="text-xl text-center mb-4">Register</h2>
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="register-form">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <Field
                type="text"
                id="username"
                name="username"
                placeholder="Enter username"
                className="input-field"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="error-message"
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="Enter email"
                className="input-field"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="error-message"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <Field
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                className="input-field"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="error-message"
              />
            </div>
            <button type="submit" className="submit-btn">
              Register
            </button>
          </Form>
        </Formik>
        <p><Link to={"/login"}>if you have account login</Link></p>
      </div>
    </div>
  );
}

export default RegisterPage;
