
import React from 'react'
import { useNavigate } from 'react-router-dom'
import ArcadeGames from './ArcadeGames'
import './ArcadeGames.css'

const games = [
  { id: 'snake', name: 'Snake Game', icon: '🐍', description: 'Eat, grow and survive.' },
  { id: 'alien', name: 'Alien Invaders', icon: '👾', description: 'Defend the galaxy.' },
  { id: 'runner', name: 'Neon Runner', icon: '🏃', description: 'Jump over obstacles.' },
  { id: 'brick', name: 'Brick Breaker', icon: '🧱', description: 'Break every brick.' },
  { id: 'tetris', name: 'Neon Tetris', icon: '🟪', description: 'Stack blocks and clear lines.' },
  { id: 'racing', name: 'Neon Racing', icon: '🏎️', description: 'Race and dodge traffic.' },
  { id: 'maze', name: 'Cosmic Maze', icon: '🌀', description: 'Find your way to the exit.' },
  { id: 'space', name: 'Space Shooter', icon: '🚀', description: 'Shoot enemies and survive.' },
]

function Gamelibrary() {
  const navigate = useNavigate()

  return (
    <main className="cosmic-arcade">
      <header className="arcade-header">
        <p>COSMICXP GAME LIBRARY</p>
        <h1>EXPLORE THE UNIVERSE</h1>
        <span>8 games. Endless fun. Choose your mission.</span>
      </header>

      <section className="library-grid">
        {games.map((game) => (
          <article
            key={game.id}
            className="library-card"
            onClick={() => navigate('/arcade', { state: { selectedGame: game.id } })}
          >
            <div className="library-card-icon">{game.icon}</div>
            <h2>{game.name}</h2>
            <p>{game.description}</p>
            <button className="arcade-play">
              PLAY NOW →
            </button>
          </article>
        ))}
      </section>
    </main>
  )
}

export default Gamelibrary
