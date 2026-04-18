import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { useNavigate } from 'react-router-dom'
import { games } from './gameData'

function GameCards() {
  const navigate = useNavigate()

  const handleActionClick = (game) => {
    // Convert the game data to library format
    const libraryGame = {
      id: Date.now(), // Generate unique ID
      title: game.title,
      description: game.description,
      rating: game.rating,
      image: game.image,
      playtime: '0 hours',
      lastPlayed: 'Never',
      status: 'Installed'
    }
    
    navigate('/library', { state: { newGame: libraryGame } })
  }

  return (
    <Container id="featured-games" className="py-5">
      
      <h2 className="game-title mb-4 text-center">Featured Games</h2>
      <Row xs={1} md={3} className="g-4">
        {games.map((game) => (
          <Col key={game.id}>
            <Card className="h-100 shadow-sm">
              <Card.Img src={game.image} alt={game.title} className="rounded-top" />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{game.title}</Card.Title>
                <Card.Text className="flex-grow-1">{game.description}</Card.Text>
                <div className='text-accent fw-bold mb-2'>
                  <span className="badge bg-success"> ★</span>{game.rating}
                </div>
                <Button variant="primary" onClick={() => handleActionClick(game)}>{game.action}</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
    </Container>
  )
}

export default GameCards;
