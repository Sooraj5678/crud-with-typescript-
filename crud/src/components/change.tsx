import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from '@mui/material/Button';
import { Container } from "reactstrap";
import Swal from "sweetalert2";


function Change() {

  const [password, setPassword] = useState<string>("");
  const [email, setemail] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});

  const navigate = useNavigate();

  interface FormErrors {
    name?: string;
    email?: string;
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    

    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }
    
    if (!password.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: "Invalid email format" });
      return;
    }

    try {
      const response = await axios.post("http://localhost:1337/books/forget/books", {
       
        email: email,
      

       
      });
      console.log("Form submitted successfully:", response.data);
      Swal.fire("Success!", "Form submitted successfully!", "success");
      navigate("/read");
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("warning", "Failed to submit form", "error");
    }
  };


  return (
    <div>
       <Navbar expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand href="#home">NEW PASSWORD</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
      
      </Container>
    </Navbar>

      <div className="container">
     
      <div className="container my-4"></div>
      <form onSubmit={handleSubmit}>
        
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputPassword1"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
       
        <div className="container mx-1 my-2">
          <button type="submit" className="btn btn-primary"
       >
            Update
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}

export default Change;
