import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface User {
  name: string;
  email: string;
  password: string;
 
}

export function SignUpOne() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [existingUsers, setExistingUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<User[]>('http://localhost:1337/books/getbhai/books');
      setExistingUsers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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

    if (Array.isArray(existingUsers)) {
      const isDuplicate = existingUsers.some(
        (user) => 
          user.name.toLowerCase() === name.toLowerCase() ||
           user.email.toLowerCase() === email.toLowerCase() 
       
      );

      if (isDuplicate) {
        console.log('Duplicate detected:', { trimmedName, trimmedEmail, existingUsers });

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
        "http://localhost:1337/books/createaccount/books ",
        {
          name: name,
          email: email,
          password: password,
        
        }
      );
      console.log("Form submitted successfully:", response.data);
      Swal.fire("Success!", "Login successfully!", "success");
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire("Warning", "Login Already Exists", "error");
    }
  };
  const history = useNavigate();

  const handleclick =() =>{

    navigate('./loginpage')
  }


  
  const checkEmail = async (email: string) => {
    if (email) {
      try {
        const response = await axios.post('http://localhost:1337/books/checkemail/book', { email });
        const data = response.data;
        if (data.exists) {
          setEmailStatus('Email already exists');
        } else {
          setEmailStatus('Email is available');
        }
      } catch (error) {
        setEmailStatus('Error checking email');
      }
    } else {
      setEmailStatus('');
    }
  };

  const handleEmailChange = (event : React.ChangeEvent<HTMLInputElement>) =>{
    const email = event.target.value;
    setEmail(email);
    checkEmail(email);
  }
  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">Sign up</h2>
            <p className="mt-2 text-base text-gray-600">
              Already have an account?{' '}
              <a
                href="/"
                title=""
                className="font-medium text-black transition-all duration-200 hover:underline"
                  onClick={handleclick}  >
                Sign In
              </a>
            </p>
            <form onSubmit={handleSubmit} className="mt-8">
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="text-base font-medium text-gray-900">
                    {' '}
                    Full Name{' '}
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      placeholder="Full Name"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <span className="text-red-500">{errors.name}</span>}
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="text-base font-medium text-gray-900">
                    {' '}
                    Email address{' '}
                  </label>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="email"
                      placeholder="Email"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                    />
                    <p>{emailStatus}</p>
                    {errors.email && <span className="text-red-500">{errors.email}</span>}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-base font-medium text-gray-900">
                      {' '}
                      Password{' '}
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="password"
                      placeholder="Password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <span className="text-red-500">{errors.password}</span>}
                  </div>
                </div>
              
                <div>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                  >
                    Create Account <ArrowRight className="ml-2" size={16} />
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-3 space-y-3">
              
            </div>
          </div>
        </div>
        <div className="h-full w-full">
          <img
            className="mx-auto h-full w-full rounded-md object-cover"
            src="https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1000&h=350&dpr=1"
            
          />
        </div>
      </div>
    </section>
  )
}
