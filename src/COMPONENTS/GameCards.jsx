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
import gta from '../assets/Games/gta.jpg'
import minecraft from '../assets/Games/craft.jpg'
import fortnite from '../assets/Games/fortnite.jpeg'
import valorant from '../assets/Games/valorant.jpeg'
import ets2 from '../assets/Games/ets2.jpeg'

const games = [
  {
    title: 'Forza Horizon 5',
    description: 'Experience the thrill of racing in the most immersive open-world driving game.',
    rating: 4.5,
    image: forza,
    action: 'Experience the Thrill',
  },
  {
    title: 'Red Dead Redemption',
    description: 'Embark on a journey through the American frontier in this epic western adventure.',
    rating: 4.8,
    image: rdr,
    action: 'Experience the West',
  },
  {
    title: 'CYBERPUNK 2077',
    description: 'Dive into the neon-lit streets of Night City, where you can customize your character, engage in intense combat, and explore a sprawling open world filled with danger and intrigue.',
    rating: 4.7,
    image: cyber,
    action: 'Explore Night City',
  },
  {
    title: 'PUBG',
    description: 'JDrop onto the island, scavenge for elite gear, outsmart intense enemies, survive the shrinking zone, and secure that elusive chicken dinner.',
    rating: 4.3,
    image: pubg,
    action: 'Start battleground',
  },
   {
    title: 'Gta V',
    description: 'Experience the sprawling city of Los Santos, where you can engage in high-stakes heists, intense shootouts, and a gripping storyline that immerses you in the criminal underworld.',
    rating: 4.5,
    image: gta,
    action: 'Roleplay game',
  },
{
    title: 'Minecraft',
    description: 'Build, explore, and survive in your own 3D world.',
    rating: 4.8,
    image: minecraft,
    action: 'Enjoy world',
  },
  {
    title: 'Fortnite',
    description: 'Drop into the island, gather loot, outlast all opponents, and secure that epic Victory Royale today..',
    rating: 4.6,
    image: fortnite,
    action: 'Enjoy world',
  },
{
    title: 'Valorant',
    description: 'Engage in tactical team-based combat with unique agents and abilities.',
    rating: 4.4,
    image: valorant,
    action: 'Enjoy world',
  },
  {
    title: 'Ets2',
    description: 'Experience the thrill of realistic truck driving in the most immersive simulation game.',
    rating: 4.5,
    image: ets2,
    action: 'Enjoy world',
  },
]

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
    <Container className="py-5">
      <h2 className="game-title mb-4 text-center">Featured Games</h2>
      <Row xs={1} md={3} className="g-4">
        {games.map((game) => (
          <Col key={game.title}>
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
