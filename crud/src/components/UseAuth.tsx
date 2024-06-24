import {useState, useEffect} from 'react'
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';


interface DecodedToken{
    exp: number;
    iat: number;
   } 

   const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
    useEffect(() => {
      const token = Cookies.get('token');
      console.log('Retrieved token from cookie:', token);

     
      if (token) {
        try {
          const decodedToken: DecodedToken = jwtDecode(token);
          console.log('Decoded token:', decodedToken);

          if (decodedToken.exp * 1000 > Date.now()) {
            setIsAuthenticated(true);
          } else {
            console.log('Token expired');
            Cookies.remove('token');
          }
        } catch (error) {
          console.error('Invalid token', error);
          Cookies.remove('token');
        }
      }
    }, []);
    return isAuthenticated;
  };


export default useAuth;