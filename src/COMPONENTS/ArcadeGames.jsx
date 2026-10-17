
import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './ArcadeGames.css'

const GAMES = [
  { id: 'snake', name: 'Neon Snake', icon: '🐍' },
  { id: 'alien', name: 'Alien Invaders', icon: '👾' },
  { id: 'runner', name: 'Neon Runner', icon: '🏃' },
  { id: 'brick', name: 'Brick Breaker', icon: '🧱' },
  { id: 'tetris', name: 'Neon Tetris', icon: '🟪' },
  { id: 'racing', name: 'Neon Racing', icon: '🏎️' },
  { id: 'maze', name: 'Cosmic Maze', icon: '🌀' },
  { id: 'space', name: 'Space Shooter', icon: '🚀' },
]

const WIDTH = 600
const HEIGHT = 400

function createGame(id) {
  const game = {
    id,
    score: 0,
    over: false,
    started: false,
    tick: 0,
    snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
    direction: { x: 1, y: 0 },
    food: { x: 15, y: 10 },
    bullets: [],
    enemies: [],
    particles: [],
    player: { x: 280, y: 340, vx: 0, vy: 0 },
    ball: { x: 300, y: 300, vx: 3, vy: -3 },
    paddle: { x: 250, width: 100 },
    bricks: [],
    blocks: [],
    roadOffset: 0,
    lane: 1,
    obstacles: [],
    mazePlayer: { x: 1, y: 1 },
  }

  if (id === 'alien' || id === 'space') {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        game.enemies.push({
          x: 65 + col * 60,
          y: 55 + row * 40,
          alive: true,
        })
      }
    }
  }

  if (id === 'brick') {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 10; col++) {
        game.bricks.push({
          x: 12 + col * 58,
          y: 35 + row * 24,
          alive: true,
        })
      }
    }
  }

  if (id === 'tetris') {
    game.blocks = Array.from({ length: 20 }, () =>
      Array(10).fill(0)
    )
    game.falling = {
      x: 4,
      y: 0,
      shape: [
        [1, 1],
        [1, 1],
      ],
    }
  }

  if (id === 'maze') {
    game.maze = [
      '111111111111111',
      '100000100000001',
      '101110101110101',
      '101000000010101',
      '101011111010101',
      '100010001000001',
      '111010101011101',
      '100000101000001',
      '101110101110101',
      '100000000000001',
      '111111111111111',
    ]
    game.mazePlayer = { x: 1, y: 1 }
    game.mazeFood = { x: 13, y: 9 }
  }

  return game
}

function ArcadeGame({ game }) {
  const canvasRef = useRef(null)
  const stateRef = useRef(createGame(game.id))
  const [score, setScore] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [round, setRound] = useState(0)

  useEffect(() => {
    stateRef.current = createGame(game.id)
    setScore(0)
    setPlaying(false)
  }, [game.id, round])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animation
    let lastTime = 0
    let elapsed = 0

    const s = stateRef.current

    function rect(x, y, w, h, color) {
      ctx.fillStyle = color
      ctx.fillRect(x, y, w, h)
    }

    function text(value, x, y, size = 18, color = '#ffffff') {
      ctx.fillStyle = color
      ctx.font = `bold ${size}px Arial`
      ctx.fillText(value, x, y)
    }

    function background() {
      rect(0, 0, WIDTH, HEIGHT, '#080b1b')

      for (let i = 0; i < 65; i++) {
        const x = (i * 97) % WIDTH
        const y = (i * 53) % HEIGHT
        rect(x, y, 2, 2, '#273657')
      }
    }

    function drawSnake() {
      const cell = 20

      s.snake.forEach((part, index) => {
        rect(
          part.x * cell,
          part.y * cell,
          cell - 2,
          cell - 2,
          index === 0 ? '#ffffff' : '#00f5d4'
        )
      })

      rect(
        s.food.x * cell,
        s.food.y * cell,
        cell - 3,
        cell - 3,
        '#ff3d81'
      )
    }

    function updateSnake() {
      const head = {
        x: s.snake[0].x + s.direction.x,
        y: s.snake[0].y + s.direction.y,
      }

      if (
        head.x < 0 || head.x >= 30 ||
        head.y < 0 || head.y >= 20 ||
        s.snake.some(p => p.x === head.x && p.y === head.y)
      ) {
        s.over = true
        return
      }

      s.snake.unshift(head)

      if (head.x === s.food.x && head.y === s.food.y) {
        s.score += 10
        s.food = {
          x: Math.floor(Math.random() * 28) + 1,
          y: Math.floor(Math.random() * 18) + 1,
        }
      } else {
        s.snake.pop()
      }
    }

    function drawInvaders() {
      rect(s.player.x, 350, 40, 18, '#00f5d4')

      s.enemies.forEach(enemy => {
        if (enemy.alive) {
          text('👾', enemy.x, enemy.y, 22)
        }
      })

      s.bullets.forEach(b => {
        rect(b.x, b.y, 4, 12, '#ffe66d')
      })
    }

    function updateInvaders() {
      s.bullets.forEach(b => {
        b.y -= 6
      })

      s.bullets = s.bullets.filter(b => b.y > 0)

      s.enemies.forEach(enemy => {
        if (!enemy.alive) return

        enemy.x += Math.sin(s.tick / 30) * 1.5

        s.bullets.forEach(b => {
          if (
            b.x > enemy.x - 15 &&
            b.x < enemy.x + 25 &&
            b.y > enemy.y - 20 &&
            b.y < enemy.y + 10
          ) {
            enemy.alive = false
            b.y = -100
            s.score += 10
          }
        })
      })

      s.bullets = s.bullets.filter(b => b.y > -50)

      if (s.enemies.every(e => !e.alive)) {
        s.score += 100
        s.enemies = []
        for (let i = 0; i < 24; i++) {
          s.enemies.push({
            x: 40 + (i % 8) * 65,
            y: 40 + Math.floor(i / 8) * 38,
            alive: true,
          })
        }
      }
    }

    function drawRunner() {
      rect(0, 340, WIDTH, 60, '#151d35')
      rect(0, 340, WIDTH, 3, '#00f5d4')

      rect(
        s.player.x,
        s.player.y,
        28,
        35,
        '#00f5d4'
      )

      s.obstacles.forEach(o => {
        rect(o.x, o.y, o.w, o.h, '#ff3d81')
      })

      text('SPACE = JUMP', 20, 30, 13, '#8ea7ff')
    }

    function updateRunner() {
      s.player.vy += 0.55
      s.player.y += s.player.vy

      if (s.player.y > 305) {
        s.player.y = 305
        s.player.vy = 0
      }

      if (s.tick % 65 === 0) {
        s.obstacles.push({
          x: WIDTH,
          y: 305,
          w: 25,
          h: 35,
        })
      }

      s.obstacles.forEach(o => {
        o.x -= 5

        if (
          s.player.x + 28 > o.x &&
          s.player.x < o.x + o.w &&
          s.player.y + 35 > o.y
        ) {
          s.over = true
        }
      })

      s.obstacles = s.obstacles.filter(o => o.x > -40)

      if (s.tick % 10 === 0) s.score += 1
    }

    function drawBrick() {
      s.bricks.forEach((b, i) => {
        if (b.alive) {
          rect(
            b.x,
            b.y,
            52,
            17,
            ['#ff3d81', '#9b5de5', '#00bbf9'][i % 3]
          )
        }
      })

      rect(s.paddle.x, 365, s.paddle.width, 12, '#00f5d4')

      rect(s.ball.x, s.ball.y, 12, 12, '#ffffff')
    }

    function updateBrick() {
      s.ball.x += s.ball.vx
      s.ball.y += s.ball.vy

      if (s.ball.x < 0 || s.ball.x > WIDTH - 12) {
        s.ball.vx *= -1
      }

      if (s.ball.y < 0) s.ball.vy *= -1

      if (s.ball.y > 350 && s.ball.y < 380 &&
          s.ball.x + 12 > s.paddle.x &&
          s.ball.x < s.paddle.x + s.paddle.width) {
        s.ball.vy = -Math.abs(s.ball.vy)
        s.ball.vx += (s.ball.x - s.paddle.x - 50) * 0.03
      }

      s.bricks.forEach(b => {
        if (
          b.alive &&
          s.ball.x + 12 > b.x &&
          s.ball.x < b.x + 52 &&
          s.ball.y < b.y + 17 &&
          s.ball.y + 12 > b.y
        ) {
          b.alive = false
          s.ball.vy *= -1
          s.score += 10
        }
      })

      if (s.ball.y > HEIGHT) s.over = true

      if (s.bricks.every(b => !b.alive)) s.over = true
    }

    function drawTetris() {
      const size = 25
      const colors = ['#00f5d4', '#ff3d81', '#9b5de5']

      s.blocks.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            rect(x * size + 175, y * size + 30, 23, 23, colors[value - 1])
          }
        })
      })

      s.falling.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            rect(
              (s.falling.x + x) * size + 175,
              (s.falling.y + y) * size + 30,
              23,
              23,
              '#ffe66d'
            )
          }
        })
      })

      text('← → MOVE   ↓ DROP', 185, 20, 13, '#8ea7ff')
    }

    function updateTetris() {
      if (s.tick % 25 !== 0) return

      s.falling.y += 1

      const shape = s.falling.shape

      const hit = shape.some((row, y) =>
        row.some((v, x) => {
          const bx = s.falling.x + x
          const by = s.falling.y + y
          return v && (
            bx < 0 || bx >= 10 || by >= 20 ||
            (by >= 0 && s.blocks[by][bx])
          )
        })
      )

      if (hit) {
        s.falling.y -= 1

        shape.forEach((row, y) => {
          row.forEach((v, x) => {
            if (v && s.falling.y + y >= 0) {
              s.blocks[s.falling.y + y][s.falling.x + x] = 1
            }
          })
        })

        s.blocks = s.blocks.filter(row => row.some(v => !v))

        while (s.blocks.length < 20) {
          s.blocks.unshift(Array(10).fill(0))
        }

        s.score += 10
        s.falling = {
          x: 4,
          y: 0,
          shape: Math.random() > 0.5
            ? [[1, 1], [1, 1]]
            : [[1, 0], [1, 1], [0, 1]],
        }

        if (s.blocks[0].some(v => v)) s.over = true
      }
    }

    function drawRacing() {
      rect(140, 0, 320, HEIGHT, '#151d35')
      rect(295, 0, 5, HEIGHT, '#ffe66d')
      rect(305, 0, 5, HEIGHT, '#ffe66d')

      for (let y = -40; y < HEIGHT; y += 80) {
        rect(220, (y + s.roadOffset) % HEIGHT, 5, 35, '#ffffff')
        rect(375, (y + s.roadOffset) % HEIGHT, 5, 35, '#ffffff')
      }

      rect(160 + s.lane * 90, 325, 35, 55, '#ff3d81')

      s.obstacles.forEach(o => {
        rect(o.x, o.y, 35, 50, '#ffe66d')
      })
    }

    function updateRacing() {
      s.roadOffset = (s.roadOffset + 5) % 80

      if (s.tick % 60 === 0) {
        s.obstacles.push({
          x: 160 + Math.floor(Math.random() * 3) * 90,
          y: -50,
        })
      }

      s.obstacles.forEach(o => {
        o.y += 5

        if (
          o.y > 280 &&
          o.y < 370 &&
          o.x === 160 + s.lane * 90
        ) {
          s.over = true
        }
      })

      s.obstacles = s.obstacles.filter(o => o.y < HEIGHT)

      if (s.tick % 10 === 0) s.score += 1
    }

    function drawMaze() {
      const size = 30
      s.maze.forEach((row, y) => {
        row.split('').forEach((cell, x) => {
          rect(
            x * size + 75,
            y * size + 25,
            size - 2,
            size - 2,
            cell === '1' ? '#573b9c' : '#111a34'
          )
        })
      })

      rect(
        s.mazeFood.x * size + 85,
        s.mazeFood.y * size + 35,
        10,
        10,
        '#ffe66d'
      )

      rect(
        s.mazePlayer.x * size + 82,
        s.mazePlayer.y * size + 32,
        16,
        16,
        '#00f5d4'
      )
    }

    function draw() {
      background()

      if (game.id === 'snake') drawSnake()
      if (game.id === 'alien' || game.id === 'space') drawInvaders()
      if (game.id === 'runner') drawRunner()
      if (game.id === 'brick') drawBrick()
      if (game.id === 'tetris') drawTetris()
      if (game.id === 'racing') drawRacing()
      if (game.id === 'maze') drawMaze()

      text(`SCORE: ${s.score}`, 15, HEIGHT - 12, 14, '#00f5d4')

      if (!playing && !s.over) {
        rect(130, 150, 340, 85, '#111a34')
        text('READY TO PLAY?', 205, 180, 24, '#00f5d4')
        text('Press START GAME below', 190, 210, 15)
      }

      if (s.over) {
        rect(100, 140, 400, 100, '#111a34')
        text('GAME OVER', 215, 180, 30, '#ff3d81')
        text('Press RESTART to play again', 165, 210, 16)
      }
    }

    function update() {
      if (!playing || s.over) return

      s.tick++

      if (game.id === 'snake' && s.tick % 8 === 0) updateSnake()

      if (game.id === 'alien' || game.id === 'space') {
        if (s.tick % 2 === 0) updateInvaders()
      }

      if (game.id === 'runner') updateRunner()
      if (game.id === 'brick') updateBrick()
      if (game.id === 'tetris') updateTetris()
      if (game.id === 'racing') updateRacing()

      if (game.id === 'maze') {
        if (
          s.mazePlayer.x === s.mazeFood.x &&
          s.mazePlayer.y === s.mazeFood.y
        ) {
          s.score += 100
          s.over = true
        }
      }

      setScore(s.score)
    }

    function loop(time) {
      if (time - lastTime > 16) {
        update()
        draw()
        lastTime = time
      }

      animation = requestAnimationFrame(loop)
    }

    function onKeyDown(e) {
      const keys = [
        'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '
      ]

      if (keys.includes(e.key)) e.preventDefault()

      if (game.id === 'snake') {
        if (e.key === 'ArrowUp' && s.direction.y !== 1) {
          s.direction = { x: 0, y: -1 }
        }
        if (e.key === 'ArrowDown' && s.direction.y !== -1) {
          s.direction = { x: 0, y: 1 }
        }
        if (e.key === 'ArrowLeft' && s.direction.x !== 1) {
          s.direction = { x: -1, y: 0 }
        }
        if (e.key === 'ArrowRight' && s.direction.x !== -1) {
          s.direction = { x: 1, y: 0 }
        }
      }

      if (game.id === 'alien' || game.id === 'space') {
        if (e.key === 'ArrowLeft') s.player.x = Math.max(0, s.player.x - 20)
        if (e.key === 'ArrowRight') s.player.x = Math.min(WIDTH - 40, s.player.x + 20)
        if (e.key === ' ' && playing) {
          s.bullets.push({ x: s.player.x + 18, y: 340 })
        }
      }

      if (game.id === 'runner' && e.key === ' ' && s.player.y >= 305) {
        s.player.vy = -12
      }

      if (game.id === 'brick') {
        if (e.key === 'ArrowLeft') s.paddle.x = Math.max(0, s.paddle.x - 25)
        if (e.key === 'ArrowRight') s.paddle.x = Math.min(WIDTH - s.paddle.width, s.paddle.x + 25)
      }

      if (game.id === 'tetris') {
        if (e.key === 'ArrowLeft') s.falling.x = Math.max(0, s.falling.x - 1)
        if (e.key === 'ArrowRight') s.falling.x = Math.min(8, s.falling.x + 1)
        if (e.key === 'ArrowDown') s.falling.y += 1
      }

      if (game.id === 'racing') {
        if (e.key === 'ArrowLeft') s.lane = Math.max(0, s.lane - 1)
        if (e.key === 'ArrowRight') s.lane = Math.min(2, s.lane + 1)
      }

      if (game.id === 'maze') {
        const next = { ...s.mazePlayer }

        if (e.key === 'ArrowUp') next.y--
        if (e.key === 'ArrowDown') next.y++
        if (e.key === 'ArrowLeft') next.x--
        if (e.key === 'ArrowRight') next.x++

        if (s.maze[next.y]?.[next.x] === '0') {
          s.mazePlayer = next
          s.score += 1
          setScore(s.score)
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    draw()
    animation = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animation)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [game.id, playing, round])

  function restartGame() {
    stateRef.current = createGame(game.id)
    setScore(0)
    setPlaying(true)
    setRound(r => r + 1)
  }

  return (
    <section className="arcade-game-container">
      <h2>{game.icon} {game.name}</h2>

      <div className="arcade-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          style={{
            width: '100%',
            maxWidth: '600px',
            display: 'block',
            margin: '0 auto',
            borderRadius: '12px',
            border: '1px solid #273657',
          }}
        />
      </div>

      <div className="arcade-score">
        ⭐ Score: {score}
      </div>

      <div className="arcade-controls">
        <button
          className="arcade-play"
          onClick={() => {
            if (stateRef.current.over) {
              restartGame()
            } else {
              setPlaying(true)
            }
          }}
        >
          ▶ START GAME
        </button>

        <button
          className="arcade-play"
          onClick={restartGame}
        >
          ↻ RESTART
        </button>
      </div>

      <p className="arcade-instructions">
        {game.id === 'snake' && 'Use arrow keys to move and eat the food.'}
        {(game.id === 'alien' || game.id === 'space') &&
          'Use ← → to move and SPACE to shoot aliens.'}
        {game.id === 'runner' && 'Press SPACE to jump over obstacles.'}
        {game.id === 'brick' && 'Use ← → to move the paddle and bounce the ball.'}
        {game.id === 'tetris' && 'Use ← → to move blocks and ↓ to drop.'}
        {game.id === 'racing' && 'Use ← → to change lanes and avoid traffic.'}
        {game.id === 'maze' && 'Use arrow keys to reach the yellow target.'}
      </p>
    </section>
  )
}

export default function ArcadeGames() {
  const location = useLocation()

  const [selected, setSelected] = useState(
    location.state?.selectedGame || 'snake'
  )

  useEffect(() => {
    if (location.state?.selectedGame) {
      setSelected(location.state.selectedGame)
    }
  }, [location.state])

  const game = GAMES.find(g => g.id === selected) || GAMES[0]

  return (
    <main className="cosmic-arcade">
      <header className="arcade-header">
        <p>THE COSMICXP ARCADE</p>
        <h1>CHOOSE YOUR GAME</h1>
        <span>Eight games. One universe.</span>
      </header>

      <nav className="arcade-game-tabs">
        {GAMES.map(g => (
          <button
            key={g.id}
            className={selected === g.id ? 'active' : ''}
            onClick={() => setSelected(g.id)}
          >
            {g.icon} {g.name}
          </button>
        ))}
      </nav>

      <ArcadeGame key={game.id} game={game} />
    </main>
  )
}
