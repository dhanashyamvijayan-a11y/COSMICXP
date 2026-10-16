
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './profile.css'

function Profile() {
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

  const handleLogout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  if (!user) return null

  const name = user.name || 'Cosmic Gamer'
  const email = user.email || 'No email available'
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  // Demo gaming level. Connect real gameplay data later.
  const level = 12
  const currentXP = 720
  const nextLevelXP = 1000
  const progress = Math.min((currentXP / nextLevelXP) * 100, 100)

  return (
    <main className="xp-profile-page">
      <div className="xp-profile-container">
        <header className="xp-profile-heading">
          <div>
            <span className="xp-eyebrow">PLAYER CONTROL CENTER</span>
            <h1>Your <span>Profile</span></h1>
            <p>Welcome back to your gaming universe.</p>
          </div>

          <button
            className="xp-outline-button"
            onClick={() => navigate('/')}
          >
            ← Home
          </button>
        </header>

        <section className="xp-profile-hero">
          <div className="xp-avatar" aria-label={`Avatar for ${name}`}>
            {initials || 'CG'}
            <span className="xp-online-dot" />
          </div>

          <div className="xp-player-info">
            <span className="xp-member-tag">✦ COSMIC MEMBER</span>
            <h2>{name}</h2>
            <p>{email}</p>
            <div className="xp-player-badges">
              <span>🎮 Gamer</span>
              <span>⚡ Level {level}</span>
            </div>
          </div>

          <div className="xp-level-badge">
            <span>PLAYER LEVEL</span>
            <strong>{level}</strong>
            <small>SPACE EXPLORER</small>
          </div>
        </section>

        <section className="xp-stats-grid" aria-label="Gaming statistics">
          <article className="xp-stat-card">
            <span className="xp-stat-icon">🎮</span>
            <p>Games in Library</p>
            <h3>09</h3>
            <span className="xp-stat-note">Explore your collection</span>
          </article>

          <article className="xp-stat-card">
            <span className="xp-stat-icon">⚡</span>
            <p>Total XP</p>
            <h3>{currentXP.toLocaleString()}</h3>
            <span className="xp-stat-note">Keep earning XP</span>
          </article>

          <article className="xp-stat-card">
            <span className="xp-stat-icon">🏆</span>
            <p>Achievements</p>
            <h3>03</h3>
            <span className="xp-stat-note">Your milestones</span>
          </article>
        </section>

        <section className="xp-panel">
          <div className="xp-panel-heading">
            <div>
              <span className="xp-eyebrow">KEEP GOING</span>
              <h2>Level Progress</h2>
            </div>
            <span className="xp-progress-label">
              {currentXP} / {nextLevelXP} XP
            </span>
          </div>

          <div
            className="xp-progress-track"
            role="progressbar"
            aria-label="Level progress"
            aria-valuenow={currentXP}
            aria-valuemin={0}
            aria-valuemax={nextLevelXP}
          >
            <div
              className="xp-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="xp-progress-footer">
            <span>Level {level}</span>
            <span>{nextLevelXP - currentXP} XP to next level</span>
            <span>Level {level + 1}</span>
          </div>
        </section>

        <section className="xp-panel xp-achievements">
          <div className="xp-panel-heading">
            <div>
              <span className="xp-eyebrow">YOUR COLLECTION</span>
              <h2>Achievements</h2>
            </div>
          </div>

          <div className="xp-achievement-list">
            <article className="xp-achievement">
              <span>🚀</span>
              <div>
                <h3>First Launch</h3>
                <p>Your journey into CosmicXP begins.</p>
              </div>
              <span className="xp-unlocked">UNLOCKED</span>
            </article>

            <article className="xp-achievement">
              <span>🌌</span>
              <div>
                <h3>Space Explorer</h3>
                <p>Discover your gaming universe.</p>
              </div>
              <span className="xp-unlocked">UNLOCKED</span>
            </article>

            <article className="xp-achievement">
              <span>⚡</span>
              <div>
                <h3>XP Hunter</h3>
                <p>Keep playing to reach new levels.</p>
              </div>
              <span className="xp-locked">IN PROGRESS</span>
            </article>
          </div>
        </section>

        <div className="xp-profile-footer">
          <p>READY FOR YOUR NEXT ADVENTURE?</p>
          <button
            className="xp-primary-button"
            onClick={() => navigate('/library')}
          >
            Open Game Library ↗
          </button>
          <button
            className="xp-logout-button"
            onClick={handleLogout}
          >
            ↪ Log Out
          </button>
        </div>
      </div>
    </main>
  )
}

export default Profile

