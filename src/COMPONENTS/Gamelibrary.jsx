import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import { games as allGames } from './gameData'


function Gamelibrary() {
  const [games, setGames] = useState(allGames)
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