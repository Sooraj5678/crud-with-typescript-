import './App.css';
import Page1 from "./components/Page1"

import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Read from './components/Read';
import Update from './components/Update';
import AuthStatus from "./components/AuthStatus";
import DeleteList from "./components/DeletedList";
import  {SignInThree} from "./components/Loginpage";

import { SignUpOne } from './components/Signup';
import Read from './components/Read';
import Password from './components/change';



function App() {
  
  return (
    <div>
     
      <BrowserRouter>
        <Routes>
        
          <Route path="/" element={<SignInThree />} />
      
          <Route path="/read" element={<Read/>} />
         
          <Route path="/update" element={<Update />} />
          <Route path="/delete" element={< DeleteList />} />
          <Route path="/signup" element={< SignUpOne />} />
          <Route path="/pass" element={< Password />} />
          

          <Route path="/loginpage" element={< Page1 />} />
        
           </Routes>
           
      </BrowserRouter>
      
      <AuthStatus />

      
    </div>
  );
}

export default App;
