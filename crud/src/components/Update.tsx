import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Update() {
  const [id, setid] = useState<number | null>(null);
  const [name, setname] = useState<string>("");
  const [email, setemail] = useState<string>("");
  const [Course, setCourse] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem("id");
    const storedName = localStorage.getItem("name");
    const storedEmail = localStorage.getItem("email");
    const storedCourse = localStorage.getItem("Course");

    if (storedId !== null) {
      setid(parseInt(storedId, 10));
    } else {
      setid(null);
    }

    if (storedName !== null) {
      setname(storedName);
    }
    if (storedEmail !== null) {
      setemail(storedEmail);
    }
    if (storedCourse !== null) {
      setCourse(storedCourse);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (id !== null) {
        try {
            const response = await axios.post(`http://localhost:1337/books/replace/books`, {
            id : id,
            name: name,
                email: email,
                course: Course,
            });
            console.log("Update Successful:", response.data);
            navigate("/read");
        } catch (error: Error | any) {
            console.error("Update Error:", error.message);
        }
    } else {
        console.error("ID is null or undefined");
    }
};

  return (
    <div>
      <div className="container my-4"></div>
      <h1>
        <i>Update project</i>
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
            onChange={(e) => setname(e.target.value)}
          />
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
            onChange={(e) => setemail(e.target.value)}
          />
        </div>
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
        <div className="container mx-1 my-2">
          <button type="submit" className="btn btn-primary"
       >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default Update;
