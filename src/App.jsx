import './App.css'
import { Routes, Route } from 'react-router-dom'
import AppNavbar from './COMPONENTS/Navbar.jsx'
import Hero from './COMPONENTS/Hero.jsx'
import GameCards from './COMPONENTS/GameCards.jsx'
import Gamelibrary from './COMPONENTS/Gamelibrary.jsx'
import Footer from './COMPONENTS/Footer.jsx'

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
      </Routes>
    </>
  )
}

export default App
