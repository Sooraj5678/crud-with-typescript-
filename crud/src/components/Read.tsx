import React, { useState, useEffect, Suspense,  } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Modal, ModalBody, ModalHeader } from "reactstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Read() {
  const [data, setData] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [order, setOrder] = useState<"ASC" | "DSC">("ASC");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = data.slice(firstIndex, lastIndex);
  const npage = Math.ceil(data.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);
  const [modal, setmodal] = useState<boolean>(false);
  const [name, setname] = useState<string>("");
  const [email, setemail] = useState<string>("");
  const [Course, setCourse] = useState<string>("");
  const [inputPage, setInputPage] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [Response, setResponse] = useState<ApiResponse>();
  const [limit, setLimit] = useState<number>(5);
  const [existingUsers, setExistingUsers] = useState<User[]>([]);
  const[hasMore,setHasMore] = useState(true);
  interface User {
    id: string;
    name: string;
    email: string;
    Course?: string;
  }

  interface ApiResponse{
    results : User[]
  }

  function handleDelete(id: number) {
     axios.post("http://localhost:1337/books/soft/book", {
      id: id,
      
    })
    
  
      .then(() => {
        getData();
      });
  }



  useEffect(() => {
   
    getData();
  }, [currentPage]);


  function getData() {
    axios
        .get(`http://localhost:1337/books/get/books`)
        .then((res) => {
            const responseData = res.data;

            if (Array.isArray(responseData)) {
                setData(responseData);
                setExistingUsers(responseData);
            } else if (
                typeof responseData === 'object' &&
                responseData !== null && 
                'results' in responseData // Check if 'results' property exists
            ) {
                setData(responseData.results);
                setExistingUsers(responseData.results);
            } else {
                console.error("API response format is unexpected:", responseData);
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
        
}
    
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
    

    console.log("Type of existingUsers:", Array.isArray(existingUsers)); // Debugging statement
    if (!Array.isArray(existingUsers)) {
      console.error("existingUsers is not an array:", existingUsers);
      return;
    }

    const isDuplicate = existingUsers.some(
      (user) =>
        user.name.toLowerCase() === name.toLowerCase() ||
        user.email.toLowerCase() === email.toLowerCase() 
       


    );

    if (isDuplicate) {
      Swal.fire("Error", "Name or email already exists", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ email: "Invalid email format" });
      return;
    }

    try {
      const response = await axios.post("http://localhost:1337/books/create/books", {
        name: name,
        email: email,
        course: Course,
      });
      console.log("Form submitted successfully:", response.data);
      Swal.fire("Success!", "Form submitted successfully!", "success");
      history("/read");
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("warning", "Failed to submit form", "error");
    }
  };

  const setToLocalStorage = (id: string, name: string, email: string) => {
    localStorage.setItem("id", id);
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("Course",  Course );
  };

  const sorting = (col: keyof User) => {
    if (order === "ASC") {
      const sortedData = [...data].sort((a, b) => {
        const aValue = a[col];
        const bValue = b[col];

        if (aValue === undefined || bValue === undefined) {
          return 0;
        }

        return aValue.toLowerCase() > bValue.toLowerCase() ? 1 : -1;
      });
      setData(sortedData);
      setOrder("DSC");
    } else if (order === "DSC") {
      const sortedData = [...data].sort((a, b) => {
        const aValue = a[col];
        const bValue = b[col];

        if (aValue === undefined || bValue === undefined) {
          return 0;
        }

        return aValue.toLowerCase() < bValue.toLowerCase() ? 1 : -1;
      });
      setData(sortedData);
      setOrder("ASC");
    }
  };

  const filteredData = data.filter((eachData) => {
    return (
      searchTerm === "" ||
      
      eachData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eachData.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const history = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const handleGoToPage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pageNumber = parseInt(inputPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= npage) {
      setCurrentPage(pageNumber);
    } else {
      alert(`Please enter a valid page number between 1 and ${npage}`);
    }
  };

  interface FormErrors {
    name?: string;
    email?: string;
  }


 
    const handleDeletelist =() => {
   
  
    
        
        history("/delete");
    }
    <br></br>
    const handlelogout =() =>{
      history("/")
    }

  return (


   <div >
      <Navbar expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand href="#home">Crud-Operation</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
          <Nav className="me-auto">
            <Nav.Link href="#home" onClick={() => setmodal(true)}>Add</Nav.Link>
            <Nav.Link href="#link" onClick={handleDeletelist}>Deleted List</Nav.Link>
          </Nav>
          <Nav>
            <Button variant="outlined" color="error">
            <Nav.Link href="#link" onClick={handlelogout} className="me-2">Logout</Nav.Link>
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <br/>

      <label htmlFor="exampleDataList" className="form-label">
        <div className="container">
          
              <Modal size="lg" isOpen={modal} toggle={() => setmodal(!modal)}>
                <ModalHeader toggle={() => setmodal(!modal)}>
                  Add Records
                </ModalHeader>
                <ModalBody>
                 
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="exampleInputEmail1" className="form-label">
                        Name
                      </label>
                      <input
                        type="name"
                        className="form-control"
                        id="name"
                        aria-describedby="namehelp"
                        onChange={(e) => setname(e.target.value)}
                      />
                      {errors.name && (
                        <p style={{ color: "red" }}> {errors.name}</p>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="exampleInputPassword1" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        onChange={(e) => setemail(e.target.value)}
                      />
                      {errors.email && (
                        <p style={{ color: "red" }}> {errors.email}</p>
                      )}
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

                    <div className="container my-2">
                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                    </div>
                  </form>
                </ModalBody>
              </Modal>
              {/* <pre>
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={() => setmodal(true)}
                >
                  ADD
                </button>
              </pre> */}
          
        </div>
        {/* <Stack spacing={2} direction="row">
          <Button variant="contained" onClick={handlelogout}>Log Out</Button>
        </Stack>
        <br/>
        <Stack spacing={2} direction="row">
          <Button variant="contained" onClick={handleDeletelist}>Delete list</Button>
        </Stack> */}
        <div className="container"></div>
      </label>
      <input
        className="form-control"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        list="datalistOptions"
        id="exampleDataList"
        placeholder="Type to search..."
      />



      <table className="table">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col" onClick={() => sorting("email")}>
              Email
            </th>
            <th scope="col" onClick={() => sorting("name")}>
              Name
            </th>
            <th scope="col">Course</th>

            <th scope="col">Actions</th>
          </tr>
        </thead>
      
        <tbody>
        

          {filteredData
            .slice(firstIndex, firstIndex + limit)
            .map((eachData,index) => (
              <tr key={eachData.id } >
                <th scope="row">{ firstIndex + index + 1 }</th>
                <td>{eachData.name}</td>
                <td>{eachData.email}</td>
                <td>{eachData.Course}</td>
               
                <td>
                 
                  <Link to="/update">
                    <Button
                   style={{marginRight : '5px'}}
                   variant="outlined"
                    color="success"
                    
                    className="btn-underline"
                    type="button"
                 
                      onClick={() =>
                        setToLocalStorage(
                          eachData.id,  
                          eachData.name,
                          eachData.email,
                          
                        )
                      }
                    >
                      Edit 
                     
                    </Button>
                   
                   
                  </Link>
                     
                  <Button
                   
                   variant="outlined" color="error"
                   type="button"
                    onClick={() => handleDelete(parseInt(eachData.id))}
                  >
                    Delete
                  </Button>

                </td>
              </tr>
            ))}
       
        </tbody>
      
      </table>
      
 
      
      <nav>
        <ul className="pagination">
          <li className="page-link">
            <a href="#" className="prev-item" onClick={prepage}>
              Prev
            </a>
          </li>

          {numbers.map((n, i) => (
            <li
              className={`page-item ${currentPage === n ? "active" : ""}`}
              key={i}
            >
              <a href="#" className="page-link" onClick={() => changeCPage(n)}>
                {n}
              </a>
            </li>
          ))}
          <li className="page-item">
            <a href="#" className="page-link" onClick={nextPage}>
              Next
            </a>
          </li>
          <li className="page-item">
            <form className="input-group" onSubmit={handleGoToPage}>
              <input
                type="number"
                className="form-control"
                value={inputPage}
                onChange={handleInputChange}
                min={1}
                max={npage}
                placeholder={`Go to page (1 - ${npage})`}
              />
              <button type="submit" className="btn btn-outline-secondary">
                Go
              </button>

              <select
                className="form-select"
                onChange={(e) => setLimit(parseInt(e.target.value))}
                value={limit}
              >
                <option selected>Record</option>
                <option value="5">5</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="50">50</option>
              </select>
            </form>
          </li>
        </ul>
      </nav>
     
    </div>
  );
  function prepage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  function changeCPage(id: number) {
    setCurrentPage(id);
  }
  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }
}

export default Read;
