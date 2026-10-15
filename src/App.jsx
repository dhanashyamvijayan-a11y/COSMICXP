import './App.css'
import { Routes, Route } from 'react-router-dom'
import AppNavbar from './COMPONENTS/Navbar.jsx'
import Hero from './COMPONENTS/Hero.jsx'
import GameCards from './COMPONENTS/GameCards.jsx'
import Gamelibrary from './COMPONENTS/Gamelibrary.jsx'
import Footer from './COMPONENTS/Footer.jsx'
import Login from './pages/login';
import Signup from "./pages/signup";
import Profile from './pages/profile';

function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <GameCards />
            <Footer />
          </>
        } />
        <Route path="/library" element={<Gamelibrary />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </>
  )
}

export default App
