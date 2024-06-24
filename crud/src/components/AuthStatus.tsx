import React from 'react'
import useAuth from './UseAuth'




    const AuthStatus: React.FC=()=> {
        const isAuthenticated = useAuth();

   
  return (
    <div>
        {isAuthenticated ? (
            <p></p>
        ):(
            <p></p>
        )}
    </div>
  );
};

export default AuthStatus