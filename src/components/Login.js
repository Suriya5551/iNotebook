import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
  const [credentials, setCredentials] = useState({email:"", password:""})
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
  
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email: credentials.email, password: credentials.password})

  });
  try {
    const json = await response.json();
    console.log(json)

    if (!json.success) {
      props.showAlert(json.error, "danger");
    } 
    else {
      // save the auth token and refirect
      localStorage.setItem('token', json.authtoken)
      props.showAlert("logged in successfully", "success");
      navigate("/")
      
    }
  } catch (error) {
      console.error(error.message);
      props.showAlert("An error occurred", "danger");
  }
  
    }
    const onChange = (e)=> {
      setCredentials({...credentials, [e.target.name]: e.target.value})
    }
  

  return (
    <div className='container my-5'>
      <h2>Login to continue to iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email1" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email1" name="email" value={credentials.email}  onChange={onChange} aria-describedby="emailHelp"/>
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name='password' value={credentials.password} onChange={onChange} />
        </div>
       
        <button type="submit" className="btn btn-primary" >Submit</button>
      </form>
    </div>
  )
}

export default Login
