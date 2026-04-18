import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import rdr from '../assets/Games/rdr.jpeg'
import forza from '../assets/Games/forza.jpeg'
import cyber from '../assets/Games/cyber.jpeg'
import pubg from '../assets/Games/pubg.jpg'
import gta from '../assets/Games/Gta.jpg'
import minecraft from '../assets/Games/craft.jpg'

const libraryGames = [
  {
    id: 1,
    title: 'Forza Horizon 5',
    description: 'Experience the thrill of racing in the most immersive open-world driving game.',
    rating: 4.5,
    image: forza,
    playtime: '45 hours',
    lastPlayed: '2 days ago',
    status: 'Installed'
  },
  {
    id: 2,
    title: 'Red Dead Redemption',
    description: 'Embark on a journey through the American frontier in this epic western adventure.',
    rating: 4.8,
    image: rdr,
    playtime: '120 hours',
    lastPlayed: '1 week ago',
    status: 'Installed'
  },
  {
    id: 3,
    title: 'CYBERPUNK 2077',
    description: 'Dive into the neon-lit streets of Night City.',
    rating: 4.7,
    image: cyber,
    playtime: '85 hours',
    lastPlayed: '3 days ago',
    status: 'Update Available'
  },
  {
    id: 4,
    title: 'PUBG',
    description: 'Battle royale gaming at its finest.',
    rating: 4.3,
    image: pubg,
    playtime: '200 hours',
    lastPlayed: 'Yesterday',
    status: 'Installed'
  },
  {
    id: 5,
    title: 'GTA V',
    description: 'Experience the sprawling city of Los Santos.',
    rating: 4.5,
    image: gta,
    playtime: '150 hours',
    lastPlayed: '5 days ago',
    status: 'Installed'
  },
  {
    id: 6,
    title: 'Minecraft',
    description: 'Build, explore, and survive in your own 3D world.',
    rating: 4.8,
    image: minecraft,
    playtime: '300+ hours',
    lastPlayed: 'Today',
    status: 'Installed'
  }
]

function Gamelibrary() {
  const [games, setGames] = useState(libraryGames)
  const navigate = useNavigate()
  const location = useLocation()

  // Add new game from navigation state
  useEffect(() => {
    if (location.state?.newGame) {
      const newGame = location.state.newGame
      // Check if game already exists in library
      const gameExists = games.some(game => game.title === newGame.title)
      
      if (!gameExists) {
        setGames(prevGames => [...prevGames, newGame])
      }
      
      // Clear the state to prevent re-adding on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location.state, games])

  const handleRemoveGame = (gameId) => {
    setGames(games.filter(game => game.id !== gameId))
  }

  const handleBackClick = () => {
    navigate('/')
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Installed': return 'success'
      case 'Update Available': return 'warning'
      case 'Downloading': return 'info'
      default: return 'secondary'
    }
  }

  return (
    <Container className="py-5">
      <h2 className="game-title mb-4 text-center">My Game Library</h2>

      <div className="mb-4">
        <p className="text-muted mb-0">
          {games.length} games in your library • Total playtime: {games.reduce((total, game) => {
            const hours = parseInt(game.playtime.replace(/\D/g, '')) || 0
            return total + hours
          }, 0)}+ hours
        </p>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {games.map((game) => (
          <Col key={game.id}>
            <Card className="h-100 shadow-sm library-card">
              <div className="position-relative">
                <Card.Img src={game.image} alt={game.title} className="rounded-top" />
                <Badge
                  bg={getStatusBadgeVariant(game.status)}
                  className="position-absolute top-0 end-0 m-2"
                >
                  {game.status}
                </Badge>
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="d-flex justify-content-between align-items-start">
                  {game.title}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveGame(game.id)}
                    title="Remove from library"
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </Card.Title>
                <Card.Text className="flex-grow-1">{game.description}</Card.Text>

                <div className="mb-3">
                  <div className="d-flex justify-content-between text-sm mb-1">
                    <span>Playtime: {game.playtime}</span>
                    <span className="text-muted">★ {game.rating}</span>
                  </div>
                  <small className="text-muted">Last played: {game.lastPlayed}</small>
                </div>

                <div className="d-flex gap-2">
                  <Button variant="success" className="flex-fill">
                    <i className="bi bi-play-fill me-1"></i>Play
                  </Button>
                  <Button variant="outline-primary" size="sm">
                    <i className="bi bi-info-circle"></i>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-center mt-4 mb-4">
        <Button variant="outline-secondary" size="lg" onClick={handleBackClick}>
          <i className="bi bi-arrow-left me-2"></i> Back to Games
        </Button>
      </div>

      {games.length === 0 && (
        <div className="text-center py-5">
          <div className="mb-3">
            <i className="bi bi-collection display-1 text-muted"></i>
          </div>
          <h4 className="text-muted">Your game library is empty</h4>
          <p className="text-muted">Start building your collection by adding games from the store!</p>
          <Button variant="primary">Browse Games</Button>
        </div>
      )}
    </Container>
  )
}

export default Gamelibrary