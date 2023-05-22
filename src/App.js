import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import About from './components/About';
import Home from './components/Home';
import Navbar from './components/Navbar';
import NoteState from './context/NoteState';
import Alert  from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';
import { useState } from 'react';


function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })

    setTimeout(() => {
      setAlert(null)
    }, 1500);

  }

  return (
    <>
      <NoteState>
      <Router>
      
        <Routes>
        
          <Route path="/" element={
            
            <>
              <Navbar />
              <Alert alert={alert}/>
              <div className='container'>
                <h1>This is iNotebook</h1>
                <Home showAlert={showAlert} />
              </div>
            </>
          } />
          <Route path="/login" element={
            <>
              <Navbar />
              <Alert alert={alert}/>
              <Login showAlert={showAlert}/>
            </>
          } />
          <Route path="/signup" element={
            <>
              <Navbar />
             
              <Signup showAlert={showAlert}/>
            </>
          } />
          <Route path="/about" element={
            <>
              <Navbar />
              
              <Alert alert={alert}/>
              <h1>This is iNotebook</h1>
              <About />
            </>
          } />
        </Routes>
      </Router>
      </NoteState>
    </>
  );
}

export default App;
