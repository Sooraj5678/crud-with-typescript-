import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface User {
  name: string;
  email: string;
  password: string;
  Course: string;
}

const Page1: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [existingUsers, setExistingUsers] = useState<User[]>([]);
  const history = useNavigate();
  const [Course, setCourse] = useState<string>("");

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<User[]>(
        "http://localhost:1337/books/get/books"
      );
      setExistingUsers(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrors({ name: "Name is required" });
      return;
    }

    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }
    if (!password.trim()) {
      setErrors({ password: "password is required" });
      return;
    }

    const trimmedName = name.trim().toLowerCase();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedpassword = password.trim().toLowerCase();

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      const isDuplicate = existingUsers.some(
        (user) =>
          user.name.toLowerCase() === trimmedName &&
          user.email.toLowerCase() === trimmedEmail &&
          user.password.toLowerCase() === trimmedpassword
      );

      if (isDuplicate) {
        Swal.fire("warning", "Name or email already exists", "error");
        return;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: "Invalid email format" });
      return;
    }

    try {
      const response = await axios.post<User>(
        "http://localhost:1337/books/create/books ",
        {
          name: name,
          email: email,
          password: password,
          course : Course,
        }
      );
      console.log("Form submitted successfully:", response.data);
      Swal.fire("Success!", "Form submitted successfully!", "success");
      history("/read");
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("Error", "Failed to submit form", "error");
    }
  };

  return (
    <div>
      <div className="container my-4">
        
      <h1>
        <i>Crud project</i>
      </h1>
      <div className="container my-4"></div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Name
          </label>
          <input
            type="name"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p style={{ color: "red" }}> {errors.name}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputPassword1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p style={{ color: "red" }}> {errors.email}</p>}
        </div>

        <label htmlFor="exampleInputPassword1" className="form-label">
            Course
          </label>
              <select
                    className="form-select"
                    aria-label="Default select example"
                    value={Course}
                    onChange={(e) => setCourse(e.target.value)}
                  >
                    <option value="">Course</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    <option value="Btech">Btech</option>
                  </select>
                  <br/>
        <form>
          <div>
            <label htmlFor="pass" className="form-label">
              Password
            </label>
            <input
              id="pass"
              className="form-control"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />

            <label htmlFor="check">Show Password <span>-</span></label>
            
            <input
              id="check"
              type="checkbox"
              value={password}
              onChange={() => setShowPassword((prev) => !prev)}
            />
                 
            <br />
          </div>
          <br />
        </form>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      </div>
    </div>
  );
};

export default Page1;
