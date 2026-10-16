
import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { games as allGames } from './gameData'

function Gamelibrary() {
  const [games, setGames] = useState(allGames)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [status, setStatus] = useState('All Statuses')
  const [sortBy, setSortBy] = useState('default')

  const navigate = useNavigate()
  const location = useLocation()

  // Library-ilekku navigation vazhi varunna game add cheyyuka
  useEffect(() => {
    const newGame = location.state?.newGame

    if (!newGame) return

    setGames(previousGames => {
      const exists = previousGames.some(
        game => game.title === newGame.title
      )

      return exists ? previousGames : [...previousGames, newGame]
    })

    navigate(location.pathname, {
      replace: true,
      state: null
    })
  }, [location.state, location.pathname, navigate])

  const handleRemoveGame = (gameId) => {
    setGames(previousGames =>
      previousGames.filter(game => game.id !== gameId)
    )
  }

  const handleBackClick = () => {
    navigate('/')
  }

  const getStatusBadgeVariant = (gameStatus) => {
    switch (gameStatus) {
      case 'Installed':
        return 'success'
      case 'Update Available':
        return 'warning'
      case 'Downloading':
        return 'info'
      default:
        return 'secondary'
    }
  }

  // Game category / genre list automatic aayi create cheyyunnu
  const categories = useMemo(() => {
    const uniqueCategories = games
      .map(game => game.category || game.genre)
      .filter(Boolean)

    return [
      'All Categories',
      ...new Set(uniqueCategories)
    ]
  }, [games])

  // Search + category + status + sorting
  const filteredGames = useMemo(() => {
    let result = games.filter(game => {
      const title = (game.title || '').toLowerCase()
      const description = (game.description || '').toLowerCase()
      const gameCategory = game.category || game.genre || ''
      const gameStatus = game.status || 'Not Installed'

      const matchesSearch =
        title.includes(search.toLowerCase()) ||
        description.includes(search.toLowerCase())

      const matchesCategory =
        category === 'All Categories' ||
        gameCategory === category

      const matchesStatus =
        status === 'All Statuses' ||
        gameStatus === status

      return matchesSearch && matchesCategory && matchesStatus
    })

    if (sortBy === 'rating') {
      result.sort(
        (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0)
      )
    } else if (sortBy === 'name') {
      result.sort((a, b) =>
        (a.title || '').localeCompare(b.title || '')
      )
    }

    return result
  }, [games, search, category, status, sortBy])

  const totalPlaytime = games.reduce((total, game) => {
    const playtime = String(game.playtime || '0')
    const hours = parseInt(playtime.replace(/\D/g, ''), 10) || 0
    return total + hours
  }, 0)

  const clearFilters = () => {
    setSearch('')
    setCategory('All Categories')
    setStatus('All Statuses')
    setSortBy('default')
  }

  return (
    <Container className="py-5 cosmic-library">

      {/* Header */}
      <div className="text-center mb-5">
        <p className="text-info fw-bold text-uppercase">
          YOUR GAMING COLLECTION
        </p>

        <h1 className="game-title mb-3">
          My Game Library
        </h1>

        <p className="text-muted">
          Discover, search and manage your favourite games.
        </p>

        <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
          <Badge bg="primary" className="p-2">
            {games.length} Total Games
          </Badge>

          <Badge bg="success" className="p-2">
            {games.filter(game => game.status === 'Installed').length} Installed
          </Badge>

          <Badge bg="dark" className="p-2">
            {totalPlaytime}+ Hours Played
          </Badge>
        </div>
      </div>

      {/* Search and filters */}
      <Card className="library-filter-panel mb-5">
        <Card.Body className="p-3 p-md-4">
          <Row className="g-3">

            <Col xs={12} md={6}>
              <Form.Label>Search Games</Form.Label>

              <InputGroup>
                <InputGroup.Text>🔍</InputGroup.Text>

                <Form.Control
                  type="search"
                  placeholder="Search by game name or description..."
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                />

                {search && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => setSearch('')}
                  >
                    Clear
                  </Button>
                )}
              </InputGroup>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <Form.Label>Category</Form.Label>

              <Form.Select
                value={category}
                onChange={event => setCategory(event.target.value)}
              >
                {categories.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <Form.Label>Installation Status</Form.Label>

              <Form.Select
                value={status}
                onChange={event => setStatus(event.target.value)}
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Installed">Installed</option>
                <option value="Not Installed">Not Installed</option>
                <option value="Downloading">Downloading</option>
                <option value="Update Available">Update Available</option>
              </Form.Select>
            </Col>

            <Col xs={12} sm={6}>
              <Form.Label>Sort Games</Form.Label>

              <Form.Select
                value={sortBy}
                onChange={event => setSortBy(event.target.value)}
              >
                <option value="default">Default Order</option>
                <option value="name">Name: A to Z</option>
                <option value="rating">Highest Rated</option>
              </Form.Select>
            </Col>

            <Col xs={12} sm={6} className="d-flex align-items-end">
              <Button
                variant="outline-info"
                className="w-100"
                onClick={clearFilters}
              >
                Reset All Filters
              </Button>
            </Col>

          </Row>
        </Card.Body>
      </Card>

      {/* Results heading */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <h4 className="mb-0">
          Explore Games
        </h4>

        <span className="text-muted">
          Showing {filteredGames.length} of {games.length} games
        </span>
      </div>

      {/* Game cards */}
      {filteredGames.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">

          {filteredGames.map((game, index) => (
            <Col key={game.id ?? game.title ?? index}>

              <Card className="h-100 shadow-sm library-card">

                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={game.image}
                    alt={game.title || 'Game cover'}
                    style={{
                      height: '220px',
                      objectFit: 'cover'
                    }}
                  />

                  <Badge
                    bg={getStatusBadgeVariant(
                      game.status || 'Not Installed'
                    )}
                    className="position-absolute top-0 end-0 m-3"
                  >
                    {game.status || 'Not Installed'}
                  </Badge>
                </div>

                <Card.Body className="d-flex flex-column">

                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <Card.Title className="mb-2">
                      {game.title}
                    </Card.Title>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      title="Remove from library"
                      aria-label={`Remove ${game.title}`}
                      onClick={() => handleRemoveGame(game.id)}
                    >
                      <i className="bi bi-trash" />
                    </Button>
                  </div>

                  {(game.category || game.genre) && (
                    <div className="mb-2">
                      <Badge bg="secondary">
                        {game.category || game.genre}
                      </Badge>
                    </div>
                  )}

                  <Card.Text className="flex-grow-1">
                    {game.description || 'No description available.'}
                  </Card.Text>

                  <div className="d-flex justify-content-between gap-2 mb-2">
                    <small>
                      ⏱️ {game.playtime || '0 hours'}
                    </small>

                    <small>
                      ⭐ {game.rating ?? 'N/A'}
                    </small>
                  </div>

                  <small className="text-muted mb-3">
                    Last played: {game.lastPlayed || 'Never'}
                  </small>

                  <div className="d-flex gap-2 mt-auto">
                    <Button
                      variant="success"
                      className="flex-fill"
                      onClick={() => {
                        if (game.status === 'Installed') {
                          alert(`Ready to play: ${game.title}`)
                        } else {
                          alert(
                            `${game.title} is not installed yet.`
                          )
                        }
                      }}
                    >
                      <i className="bi bi-play-fill me-1" />
                      Play
                    </Button>

                    <Button
                      variant="outline-info"
                      title="Game information"
                      onClick={() => {
                        alert(
                          `${game.title}\n\n${game.description || 'No description available.'}`
                        )
                      }}
                    >
                      <i className="bi bi-info-circle" />
                    </Button>
                  </div>

                </Card.Body>
              </Card>

            </Col>
          ))}

        </Row>
      ) : (
        <div className="text-center py-5">
          <div className="display-1 mb-3">🎮</div>

          <h4>No games found</h4>

          <p className="text-muted">
            Try another search term or change your filters.
          </p>

          <Button variant="info" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Bottom buttons */}
      <div className="d-flex justify-content-center gap-3 flex-wrap mt-5">
        <Button
          variant="outline-secondary"
          size="lg"
          onClick={handleBackClick}
        >
          <i className="bi bi-arrow-left me-2" />
          Back to Games
        </Button>

        {games.length === 0 && (
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/')}
          >
            Browse Games
          </Button>
        )}
      </div>

    </Container>
  )
}

export default Gamelibrary
