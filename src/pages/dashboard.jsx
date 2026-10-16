
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './dashboard.css'

import forza from '../assets/Games/forza.jpeg'
import rdr from '../assets/Games/rdr.jpeg'
import cyber from '../assets/Games/cyber.jpeg'
import valorant from '../assets/Games/valorant.jpeg'

const recentGames = [
  {
    title: 'Forza Horizon 5',
    genre: 'RACING',
    image: forza,
    rating: '4.5',
  },
  {
    title: 'Red Dead Redemption',
    genre: 'ADVENTURE',
    image: rdr,
    rating: '4.8',
  },
  {
    title: 'Cyberpunk 2077',
    genre: 'RPG',
    image: cyber,
    rating: '4.7',
  },
  {
    title: 'Valorant',
    genre: 'TACTICAL FPS',
    image: valorant,
    rating: '4.4',
  },
]

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user')

    if (!savedUser) {
      navigate('/login', { replace: true })
      return
    }

    try {
      setUser(JSON.parse(savedUser))
    } catch {
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('token')
      navigate('/login', { replace: true })
    }
  }, [navigate])

  if (!user) return null

  const name = user.name || 'Gamer'
  const firstName = name.trim().split(/\s+/)[0]

  const handleOpenLibrary = (game) => {
    const libraryGame = {
      id: `${game.title}-${Date.now()}`,
      title: game.title,
      description: `${game.title} — discover your next gaming adventure.`,
      rating: Number(game.rating),
      image: game.image,
      playtime: '0 hours',
      lastPlayed: 'Never',
      status: 'Installed',
    }

    navigate('/library', { state: { newGame: libraryGame } })
  }

  return (
    <main className="xp-dashboard">
      <div className="xp-dashboard-container">
        <header className="xp-dashboard-header">
          <div className="xp-dashboard-brand">
            <span className="xp-brand-icon">✦</span>
            <span>COSMIC<span className="xp-brand-accent">XP</span></span>
          </div>

          <nav className="xp-dashboard-nav">
            <button onClick={() => navigate('/')}>Home</button>
            <button onClick={() => navigate('/library')}>Library</button>
            <button onClick={() => navigate('/profile')}>Profile</button>
          </nav>

          <button
            className="xp-dashboard-avatar"
            onClick={() => navigate('/profile')}
            aria-label="Open profile"
          >
            {name.trim().slice(0, 1).toUpperCase()}
          </button>
        </header>

        <section className="xp-welcome-banner">
          <div className="xp-welcome-content">
            <span className="xp-dashboard-eyebrow">
              YOUR GAMING UNIVERSE
            </span>

            <h1>
              Welcome back,<br />
              <span>{firstName}.</span>
            </h1>

            <p>
              Your next adventure is waiting. Jump in and make
              every session legendary.
            </p>

            <div className="xp-welcome-actions">
              <button
                className="xp-dashboard-primary"
                onClick={() => navigate('/library')}
              >
                Explore Library <span>↗</span>
              </button>

              <button
                className="xp-dashboard-secondary"
                onClick={() => navigate('/profile')}
              >
                View Profile
              </button>
            </div>
          </div>

          <div className="xp-welcome-art" aria-hidden="true">
            <div className="xp-orbit xp-orbit-one" />
            <div className="xp-orbit xp-orbit-two" />
            <div className="xp-planet">✦</div>
            <span className="xp-art-star xp-star-one">✧</span>
            <span className="xp-art-star xp-star-two">✦</span>
            <span className="xp-art-star xp-star-three">✧</span>
          </div>
        </section>

        <section className="xp-dashboard-section">
          <div className="xp-dashboard-section-heading">
            <div>
              <span className="xp-dashboard-eyebrow">YOUR PROGRESS</span>
              <h2>Gaming Overview</h2>
            </div>
            <button
              className="xp-dashboard-text-button"
              onClick={() => navigate('/profile')}
            >
              View profile ↗
            </button>
          </div>

          <div className="xp-dashboard-stats">
            <article className="xp-dashboard-stat">
              <div className="xp-stat-top">
                <span className="xp-dashboard-stat-icon">🎮</span>
                <span className="xp-stat-caption">COLLECTION</span>
              </div>
              <h3>09</h3>
              <p>Games in Library</p>
              <div className="xp-stat-bottom">Your gaming collection</div>
            </article>

            <article className="xp-dashboard-stat">
              <div className="xp-stat-top">
                <span className="xp-dashboard-stat-icon">⚡</span>
                <span className="xp-stat-caption">EXPERIENCE</span>
              </div>
              <h3>720 <small>XP</small></h3>
              <p>Total Experience</p>
              <div className="xp-stat-bottom">Level 12 · Space Explorer</div>
            </article>

            <article className="xp-dashboard-stat">
              <div className="xp-stat-top">
                <span className="xp-dashboard-stat-icon">🏆</span>
                <span className="xp-stat-caption">MILESTONES</span>
              </div>
              <h3>03</h3>
              <p>Achievements</p>
              <div className="xp-stat-bottom">Keep up the progress</div>
            </article>
          </div>
        </section>

        <section className="xp-dashboard-section xp-recent-section">
          <div className="xp-dashboard-section-heading">
            <div>
              <span className="xp-dashboard-eyebrow">PICK UP THE CONTROLLER</span>
              <h2>Discover Games</h2>
            </div>

            <button
              className="xp-dashboard-text-button"
              onClick={() => navigate('/library')}
            >
              View all games ↗
            </button>
          </div>

          <div className="xp-recent-grid">
            {recentGames.map((game) => (
              <article className="xp-recent-card" key={game.title}>
                <div className="xp-recent-image-wrap">
                  <img src={game.image} alt={game.title} loading="lazy" />
                  <span className="xp-recent-genre">{game.genre}</span>
                </div>

                <div className="xp-recent-info">
                  <div className="xp-recent-title-row">
                    <h3>{game.title}</h3>
                    <span className="xp-recent-rating">
                      ★ {game.rating}
                    </span>
                  </div>

                  <button
                    className="xp-recent-button"
                    onClick={() => handleOpenLibrary(game)}
                  >
                    Open in Library ↗
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="xp-dashboard-footer">
          <span>✦ COSMICXP</span>
          <p>Explore worlds. Create legends.</p>
        </footer>
      </div>
    </main>
  )
}

export default Dashboard
