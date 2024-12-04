import './App.css'
// import Login from './components/Login'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import PaymentPage from './components/PaymentPgae';
function App() {

  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path='/paymentpage' element={<PaymentPage />}></Route>
        {/* <Route path='/logout' element={}></Route> */}
      </Routes>
    </Router>
  )
}

export default App
