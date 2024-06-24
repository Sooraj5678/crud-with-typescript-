import React, { useState, useEffect} from "react";
import axios from "axios";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Container } from "reactstrap";
import Button from '@mui/material/Button';

function Read() {
  const [data, setData] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [order, setOrder] = useState<"ASC" | "DSC">("ASC");
 

  
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
     axios.post("http://localhost:1337/books/delete/book", {
      id: id,
      
    })
      .then(() => {
        getData();
      });
  }



  useEffect(() => {
   
    getData();
  }, []);


  function getData() {
    axios
        .get(`http://localhost:1337/books/deletelist/books`)
        .then((res) => {
            const responseData = res.data;

            if (Array.isArray(responseData)) {
                setData(responseData);
              
            } else if (
                typeof responseData === 'object' &&
                responseData !== null && 
                'results' in responseData 
            ) {
                setData(responseData.results);
              
            } else {
                console.error("API response format is unexpected:", responseData);
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
        
        
}
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

  return (

   <div >
  
     
  <Navbar expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand href="#home">Delete-Operation</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
       
        </Navbar.Collapse>
      </Container>
    </Navbar>
        

      <table className="table">
        <thead>
          <tr>
            <th scope="col">id</th>
            <th scope="col" onClick={() => sorting("email")}>
              Name
            </th>
            <th scope="col" onClick={() => sorting("name")}>
              Email
            </th>
            <th scope="col">Course</th>

            <th scope="col">Actions</th>
          </tr>
        </thead>
      
        <tbody>
        
         
          {filteredData
          
            .map((eachData,index) => (
              <tr key={eachData.id } >
                <th scope="row">{ index + 1 }</th>
                <td>{eachData.name}</td>
                <td>{eachData.email}</td>
                <td>{eachData.Course}</td>
               
                <td>
                
                  <Button
                    variant="outlined" color="error"
                    onClick={() => handleDelete(parseInt(eachData.id))}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
       
        </tbody>
       
      </table>
   
     
    </div>
  );
}
export default Read;
