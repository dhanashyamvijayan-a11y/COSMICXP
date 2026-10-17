
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import { useNavigate } from 'react-router-dom'

import rdr from '../assets/Games/rdr.jpeg'
import forza from '../assets/Games/forza.jpeg'
import cyber from '../assets/Games/cyber.jpeg'
import pubg from '../assets/Games/pubg.jpg'
import Gta from '../assets/Games/Gta.jpg'
import minecraft from '../assets/Games/craft.jpg'
import fortnite from '../assets/Games/fortnite.jpeg'
import valorant from '../assets/Games/valorant.jpeg'
import ets2 from '../assets/Games/ets2.jpeg'

const games = [
  {
    title: 'Forza Horizon 5',
    description: 'Experience the thrill of racing in an immersive open-world driving adventure.',
    rating: 4.5,
    image: forza,
    action: 'Explore Game',
    genre: 'RACING',
  },
  {
    title: 'Red Dead Redemption',
    description: 'Embark on an unforgettable journey through the American frontier.',
    rating: 4.8,
    image: rdr,
    action: 'Explore Game',
    genre: 'ADVENTURE',
  },
  {
    title: 'Cyberpunk 2077',
    description: 'Enter Night City, customize your character, and explore a neon-lit world.',
    rating: 4.7,
    image: cyber,
    action: 'Explore Night City',
    genre: 'RPG',
  },
  {
    title: 'PUBG',
    description: 'Gear up, outsmart rivals, and fight to survive the ultimate battleground.',
    rating: 4.3,
    image: pubg,
    action: 'Enter Battleground',
    genre: 'BATTLE ROYALE',
  },
  {
    title: 'GTA V',
    description: 'Explore Los Santos, pull off daring heists, and dive into the criminal underworld.',
    rating: 4.5,
    image: Gta,
    action: 'Explore Game',
    genre: 'ACTION',
  },
  {
    title: 'Minecraft',
    description: 'Build, explore, and survive in a world limited only by your imagination.',
    rating: 4.8,
    image: minecraft,
    action: 'Enter World',
    genre: 'SANDBOX',
  },
  {
    title: 'Fortnite',
    description: 'Collect loot, outlast your opponents, and chase that Victory Royale.',
    rating: 4.6,
    image: fortnite,
    action: 'Explore Game',
    genre: 'BATTLE ROYALE',
  },
  {
    title: 'Valorant',
    description: 'Master unique agents and compete in tactical team-based combat.',
    rating: 4.4,
    image: valorant,
    action: 'Explore Game',
    genre: 'TACTICAL FPS',
  },
  {
    title: 'Euro Truck Simulator 2',
    description: 'Travel across Europe in a realistic and immersive trucking simulation.',
    rating: 4.5,
    image: ets2,
    action: 'Start Driving',
    genre: 'SIMULATION',
  },
]

const gameMap = {
  'Forza Horizon 5': 'racing',
  'Red Dead Redemption': 'runner',
  'Cyberpunk 2077': 'alien',
  PUBG: 'alien',
  'GTA V': 'runner',
  Minecraft: 'maze',
  Fortnite: 'brick',
  Valorant: 'alien',
  'Euro Truck Simulator 2': 'racing',
}

function GameCards() {
  const navigate = useNavigate()

  const handleActionClick = (game) => {
    navigate('/arcade', {
      state: {
        selectedGame: gameMap[game.title] || 'snake',
      },
    })
  }

  return (
    <Container id="featured-games" className="cosmic-games-section py-5">
      <div id="fea">
        <div className="cosmic-section-heading text-center mb-5">
          <span className="cosmic-eyebrow">
            YOUR NEXT ADVENTURE STARTS HERE
          </span>

          <h2 className="game-title mt-2 mb-3">
            Featured <span>Games</span>
          </h2>

          <p className="cosmic-section-subtitle">
            Discover your next world. Choose your game. Make it legendary.
          </p>
        </div>

        <Row xs={1} sm={2} lg={3} className="g-4">
          {games.map((game) => (
            <Col key={game.title}>
              <Card className="cosmic-game-card h-100">
                <div className="cosmic-game-image-wrap">
                  <Card.Img
                    variant="top"
                    src={game.image}
                    alt={game.title}
                    className="cosmic-game-image"
                    loading="lazy"
                  />

                  <span className="cosmic-game-genre">
                    {game.genre}
                  </span>

                  <span className="cosmic-game-rating">
                    <span aria-hidden="true">★</span>{' '}
                    {game.rating.toFixed(1)}
                  </span>
                </div>

                <Card.Body className="cosmic-game-body d-flex flex-column">
                  <Card.Title className="cosmic-game-title">
                    {game.title}
                  </Card.Title>

                  <Card.Text className="cosmic-game-description flex-grow-1">
                    {game.description}
                  </Card.Text>

                  <Button
                    className="cosmic-game-button w-100"
                    onClick={() => handleActionClick(game)}
                  >
                    {game.action}
                    <span className="cosmic-button-arrow" aria-hidden="true">
                      {' '}↗
                    </span>
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  )
}

export default GameCards
