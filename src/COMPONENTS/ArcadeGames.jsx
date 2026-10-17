
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ArcadeGames.css'

const GAMES = [
  { id: 'snake', name: 'Snake Game', icon: '🐍', color: '#48ff9b' },
  { id: 'alien', name: 'Alien Invaders', icon: '👾', color: '#45eaff' },
  { id: 'runner', name: 'Neon Runner', icon: '🏃', color: '#ff4fd8' },
  { id: 'brick', name: 'Brick Breaker', icon: '🧱', color: '#ffd166' },
  { id: 'tetris', name: 'Neon Tetris', icon: '🟪', color: '#a855f7' },
  { id: 'racing', name: 'Neon Racing', icon: '🏎️', color: '#ff4d6d' },
  { id: 'maze', name: 'Cosmic Maze', icon: '🌀', color: '#48ff9b' },
  { id: 'space', name: 'Space Shooter', icon: '🚀', color: '#45eaff' },
]

const SHAPES = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
]

const MAZE = [
  '1111111111111111',
  '1000001000000001',
  '1011101011110101',
  '1000100000010001',
  '1110101111011101',
  '1000001000000001',
  '1011101011110101',
  '1000000000000001',
  '1011110111011101',
  '1000010001000001',
  '1111011101110101',
  '1000000000000001',
  '1011101110111101',
  '1000001000000001',
  '1000000000000001',
  '1111111111111111',
]

function ArcadeGame({ game }) {
  const canvasRef = useRef(null)
  const keys = useRef({})
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [over, setOver] = useState(false)

  useEffect(() => {
    if (!running) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height

    let active = true
    let frame = 0
    let points = 0
    let raf
    let lastShot = 0
    let lastMove = 0
    let lastDrop = 0
    let lastMazeMove = 0
    let lastRaceMove = 0
    let lastRunnerJump = false
    let mazePos = { x: 1, y: 1 }
    let mazeCoins = new Set()
    let mazeWon = false

    const player = { x: W / 2 - 15, y: H - 55, w: 30, h: 30, vy: 0 }
    let bullets = []
    let enemies = []
    let food = { x: 10, y: 10 }
    let snake = [{ x: 8, y: 8 }]
    let direction = { x: 1, y: 0 }
    let nextDirection = { x: 1, y: 0 }

    let ball = { x: W / 2, y: H - 70, vx: 3, vy: -3, r: 7 }
    let paddle = { x: W / 2 - 45, y: H - 30, w: 90, h: 10 }
    let bricks = []

    const blockColors = [
      '#45eaff', '#a855f7', '#ff4fd8',
      '#ffd166', '#48ff9b',
    ]

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 8; col++) {
        bricks.push({
          x: 10 + col * 43,
          y: 35 + row * 23,
          w: 37,
          h: 15,
          alive: true,
          color: blockColors[row],
        })
      }
    }

    let grid = Array.from({ length: 20 }, () => Array(10).fill(0))
    let piece = null

    const newPiece = () => {
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)]
      return {
        shape: shape.map(row => [...row]),
        x: 3,
        y: 0,
        color: blockColors[Math.floor(Math.random() * blockColors.length)],
      }
    }

    if (game.id === 'tetris') piece = newPiece()

    const randomFood = () => ({
      x: Math.floor(Math.random() * 17) + 1,
      y: Math.floor(Math.random() * 17) + 1,
    })

    food = randomFood()

    function endGame() {
      if (!active) return
      active = false
      setOver(true)
      setRunning(false)
    }

    function keyDown(e) {
      const k = e.key.toLowerCase()
      if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' '].includes(k)) {
        e.preventDefault()
      }
      keys.current[k] = true

      if (game.id === 'snake') {
        if (k === 'arrowleft' || k === 'a') nextDirection = { x: -1, y: 0 }
        if (k === 'arrowright' || k === 'd') nextDirection = { x: 1, y: 0 }
        if (k === 'arrowup' || k === 'w') nextDirection = { x: 0, y: -1 }
        if (k === 'arrowdown' || k === 's') nextDirection = { x: 0, y: 1 }
      }

      if (game.id === 'tetris' && piece) {
        if (k === 'arrowleft' || k === 'a') {
          if (validPiece(piece, piece.x - 1, piece.y)) piece.x--
        }
        if (k === 'arrowright' || k === 'd') {
          if (validPiece(piece, piece.x + 1, piece.y)) piece.x++
        }
        if (k === 'arrowup' || k === 'w') {
          const rotated = piece.shape[0].map((_, i) =>
            piece.shape.map(row => row[i]).reverse()
          )
          if (validPiece({ ...piece, shape: rotated }, piece.x, piece.y)) {
            piece.shape = rotated
          }
        }
        if (k === 'arrowdown') lastDrop = 0
      }
    }

    function keyUp(e) {
      keys.current[e.key.toLowerCase()] = false
    }

    function validPiece(p, x, y) {
      return p.shape.every((row, dy) =>
        row.every((cell, dx) => {
          if (!cell) return true
          const gx = x + dx
          const gy = y + dy
          return gx >= 0 && gx < 10 && gy < 20 && grid[gy][gx] === 0
        })
      )
    }

    function lockPiece() {
      piece.shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
          if (cell && piece.y + dy >= 0) {
            grid[piece.y + dy][piece.x + dx] = piece.color
          }
        })
      })

      const remaining = grid.filter(row => row.some(cell => !cell))
      const cleared = 20 - remaining.length
      if (cleared > 0) {
        points += cleared * 100
        setScore(points)
      }
      grid = [
        ...Array.from({ length: cleared }, () => Array(10).fill(0)),
        ...remaining,
      ]

      piece = newPiece()
      if (!validPiece(piece, piece.x, piece.y)) endGame()
    }

    function drawBackground() {
      ctx.fillStyle = '#070b1c'
      ctx.fillRect(0, 0, W, H)
      for (let i = 0; i < 45; i++) {
        ctx.fillStyle = '#6476a8'
        ctx.fillRect((i * 83) % W, (i * 47 + frame) % H, 2, 2)
      }
    }

    function drawSnake() {
      if (frame % 8 === 0) {
        direction = nextDirection
        const head = {
          x: snake[0].x + direction.x,
          y: snake[0].y + direction.y,
        }
        if (
          head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 ||
          snake.some(s => s.x === head.x && s.y === head.y)
        ) {
          endGame()
          return
        }
        snake.unshift(head)
        if (head.x === food.x && head.y === food.y) {
          points += 10
          setScore(points)
          food = randomFood()
        } else snake.pop()
      }

      ctx.fillStyle = '#ff4fd8'
      ctx.fillRect(food.x * 18, food.y * 18, 14, 14)
      snake.forEach((part, i) => {
        ctx.fillStyle = i === 0 ? '#48ff9b' : '#168c65'
        ctx.fillRect(part.x * 18 + 1, part.y * 18 + 1, 15, 15)
      })
    }

    function drawAlien() {
      if (keys.current.arrowleft || keys.current.a) player.x -= 5
      if (keys.current.arrowright || keys.current.d) player.x += 5
      player.x = Math.max(0, Math.min(W - player.w, player.x))

      if (keys.current[' '] && frame - lastShot > 12) {
        bullets.push({ x: player.x + 13, y: player.y })
        lastShot = frame
      }

      ctx.fillStyle = '#45eaff'
      ctx.beginPath()
      ctx.moveTo(player.x + 15, player.y)
      ctx.lineTo(player.x, player.y + 30)
      ctx.lineTo(player.x + 30, player.y + 30)
      ctx.fill()

      if (frame % 40 === 0) enemies.push({ x: Math.random() * (W - 24), y: -25, size: 23 })
      ctx.fillStyle = '#ffe66d'

      bullets.forEach(b => {
        b.y -= 7
        ctx.fillRect(b.x, b.y, 4, 12)
      })
      bullets = bullets.filter(b => b.y > -15)

      enemies.forEach(enemy => {
        enemy.y += 1.8
        ctx.fillStyle = '#a855f7'
        ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size)

        if (
          enemy.x < player.x + player.w &&
          enemy.x + enemy.size > player.x &&
          enemy.y < player.y + player.h &&
          enemy.y + enemy.size > player.y
        ) endGame()

        bullets.forEach(b => {
          if (b.y >= enemy.y && b.y <= enemy.y + enemy.size &&
              b.x >= enemy.x && b.x <= enemy.x + enemy.size) {
            points += 10
            setScore(points)
            enemy.y = H + 100
            b.y = -100
          }
        })
        if (enemy.y > H) endGame()
      })
      enemies = enemies.filter(e => e.y < H + 30)
    }

    function drawRunner() {
      const ground = H - 48
      const jumping = keys.current.arrowup || keys.current.w || keys.current[' ']
      if (jumping && !lastRunnerJump && player.y >= ground - player.h) player.vy = -11
      lastRunnerJump = jumping

      player.vy += 0.55
      player.y += player.vy
      if (player.y > ground - player.h) {
        player.y = ground - player.h
        player.vy = 0
      }

      ctx.fillStyle = '#ff4fd8'
      ctx.fillRect(player.x, player.y, player.w, player.h)
      ctx.fillStyle = '#6476a8'
      ctx.fillRect(0, ground, W, 2)

      if (frame % 65 === 0) enemies.push({ x: W + 20, y: ground - 25, size: 25 })
      enemies.forEach(e => {
        e.x -= 4
        ctx.fillStyle = '#ff4d6d'
        ctx.fillRect(e.x, e.y, e.size, e.size)
        if (e.x < player.x + player.w && e.x + e.size > player.x &&
            e.y < player.y + player.h && e.y + e.size > player.y) endGame()
      })
      enemies = enemies.filter(e => e.x > -40)
      if (frame % 10 === 0) {
        points++
        setScore(points)
      }
    }

    function drawBrickBreaker() {
      if (keys.current.arrowleft || keys.current.a) paddle.x -= 6
      if (keys.current.arrowright || keys.current.d) paddle.x += 6
      paddle.x = Math.max(0, Math.min(W - paddle.w, paddle.x))

      ctx.fillStyle = '#45eaff'
      ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h)
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
      ctx.fillStyle = '#ffe66d'
      ctx.fill()

      bricks.forEach(b => {
        if (b.alive) {
          ctx.fillStyle = b.color
          ctx.fillRect(b.x, b.y, b.w, b.h)
        }
      })

      ball.x += ball.vx
      ball.y += ball.vy
      if (ball.x < ball.r || ball.x > W - ball.r) ball.vx *= -1
      if (ball.y < ball.r) ball.vy *= -1

      if (ball.vy > 0 && ball.y + ball.r >= paddle.y &&
          ball.x >= paddle.x && ball.x <= paddle.x + paddle.w) ball.vy *= -1

      bricks.forEach(b => {
        if (b.alive && ball.x >= b.x && ball.x <= b.x + b.w &&
            ball.y >= b.y && ball.y <= b.y + b.h) {
          b.alive = false
          ball.vy *= -1
          points += 10
          setScore(points)
        }
      })

      if (ball.y > H) endGame()
      if (bricks.every(b => !b.alive)) {
        points += 100
        setScore(points)
        endGame()
      }
    }

    function drawTetris() {
      const cell = 18
      const ox = (W - 10 * cell) / 2
      const oy = 15

      if (frame - lastDrop > (keys.current.arrowdown ? 70 : 450)) {
        lastDrop = frame
        if (piece && validPiece(piece, piece.x, piece.y + 1)) piece.y++
        else if (piece) lockPiece()
      }

      grid.forEach((row, y) => row.forEach((color, x) => {
        if (!color) return
        ctx.fillStyle = color
        ctx.fillRect(ox + x * cell, oy + y * cell, cell - 1, cell - 1)
      }))

      if (piece) {
        piece.shape.forEach((row, y) => row.forEach((v, x) => {
          if (!v) return
          ctx.fillStyle = piece.color
          ctx.fillRect(ox + (piece.x + x) * cell, oy + (piece.y + y) * cell, cell - 1, cell - 1)
        }))
      }
    }

    function drawRacing() {
      ctx.fillStyle = '#171a2e'
      ctx.fillRect(45, 0, W - 90, H)

      for (let y = (frame * 6) % 60 - 60; y < H; y += 60) {
        ctx.fillStyle = '#e6e6e6'
        ctx.fillRect(W / 2 - 3, y, 6, 30)
      }

      if (keys.current.arrowleft || keys.current.a) player.x -= 4
      if (keys.current.arrowright || keys.current.d) player.x += 4
      player.x = Math.max(52, Math.min(W - 82, player.x))

      if (frame % 45 === 0) enemies.push({
        x: 55 + Math.random() * (W - 105), y: -50, size: 30,
      })

      ctx.fillStyle = '#45eaff'
      ctx.fillRect(player.x, H - 75, 30, 48)

      enemies.forEach(e => {
        e.y += 4
        ctx.fillStyle = '#ff4d6d'
        ctx.fillRect(e.x, e.y, e.size, e.size + 15)
        if (e.x < player.x + 30 && e.x + e.size > player.x &&
            e.y < H - 27 && e.y + e.size + 15 > H - 75) endGame()
        if (e.y > H) {
          e.y = H + 100
          points += 5
          setScore(points)
        }
      })
      enemies = enemies.filter(e => e.y < H + 120)

      if (frame % 12 === 0) {
        points++
        setScore(points)
      }
    }

    function drawMaze() {
      const size = 22
      const ox = (W - 16 * size) / 2
      const oy = 20

      if (frame - lastMazeMove > 7) {
        let dx = 0
        let dy = 0
        if (keys.current.arrowleft || keys.current.a) dx = -1
        if (keys.current.arrowright || keys.current.d) dx = 1
        if (keys.current.arrowup || keys.current.w) dy = -1
        if (keys.current.arrowdown || keys.current.s) dy = 1

        if (dx || dy) {
          const nx = mazePos.x + dx
          const ny = mazePos.y + dy
          if (MAZE[ny] && MAZE[ny][nx] === '0') {
            mazePos = { x: nx, y: ny }
            const key = `${nx},${ny}`
            if (!mazeCoins.has(key)) {
              mazeCoins.add(key)
              points += 5
              setScore(points)
            }
            if (nx === 14 && ny === 14) {
              mazeWon = true
              points += 100
              setScore(points)
              endGame()
            }
          }
          lastMazeMove = frame
        }
      }

      MAZE.forEach((row, y) => [...row].forEach((v, x) => {
        ctx.fillStyle = v === '1' ? '#168c65' : '#10172b'
        ctx.fillRect(ox + x * size, oy + y * size, size - 1, size - 1)
        if (v === '0' && !mazeCoins.has(`${x},${y}`)) {
          ctx.fillStyle = '#ffe66d'
          ctx.beginPath()
          ctx.arc(ox + x * size + size / 2, oy + y * size + size / 2, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }))

      ctx.fillStyle = '#45eaff'
      ctx.beginPath()
      ctx.arc(ox + mazePos.x * size + size / 2, oy + mazePos.y * size + size / 2, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.font = '12px sans-serif'
      ctx.fillText('FIND THE EXIT', 125, 390)
    }

    function drawSpace() {
      if (keys.current.arrowleft || keys.current.a) player.x -= 5
      if (keys.current.arrowright || keys.current.d) player.x += 5
      if (keys.current.arrowup || keys.current.w) player.y -= 4
      if (keys.current.arrowdown || keys.current.s) player.y += 4

      player.x = Math.max(0, Math.min(W - player.w, player.x))
      player.y = Math.max(0, Math.min(H - player.h, player.y))

      if (keys.current[' '] && frame - lastShot > 10) {
        bullets.push({ x: player.x + 13, y: player.y })
        lastShot = frame
      }

      ctx.fillStyle = '#45eaff'
      ctx.beginPath()
      ctx.moveTo(player.x + 15, player.y)
      ctx.lineTo(player.x, player.y + 30)
      ctx.lineTo(player.x + 30, player.y + 30)
      ctx.fill()

      if (frame % 35 === 0) enemies.push({
        x: Math.random() * (W - 25), y: -25, size: 22,
      })

      bullets.forEach(b => {
        b.y -= 8
        ctx.fillStyle = '#ffe66d'
        ctx.fillRect(b.x, b.y, 4, 12)
      })
      bullets = bullets.filter(b => b.y > -15)

      enemies.forEach(e => {
        e.y += 2
        ctx.fillStyle = '#ff4fd8'
        ctx.fillRect(e.x, e.y, e.size, e.size)

        if (e.x < player.x + player.w && e.x + e.size > player.x &&
            e.y < player.y + player.h && e.y + e.size > player.y) endGame()

        bullets.forEach(b => {
          if (b.x >= e.x && b.x <= e.x + e.size &&
              b.y >= e.y && b.y <= e.y + e.size) {
            e.y = H + 100
            b.y = -100
            points += 10
            setScore(points)
          }
        })
        if (e.y > H) endGame()
      })
      enemies = enemies.filter(e => e.y < H + 30)
    }

    function loop() {
      if (!active) return
      drawBackground()
      frame++

      if (game.id === 'snake') drawSnake()
      if (game.id === 'alien') drawAlien()
      if (game.id === 'runner') drawRunner()
      if (game.id === 'brick') drawBrickBreaker()
      if (game.id === 'tetris') drawTetris()
      if (game.id === 'racing') drawRacing()
      if (game.id === 'maze') drawMaze()
      if (game.id === 'space') drawSpace()

      if (active) raf = requestAnimationFrame(loop)
    }

    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)
    loop()

    return () => {
      active = false
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
      keys.current = {}
    }
  }, [running, game.id])

  function start() {
    keys.current = {}
    setScore(0)
    setOver(false)
    setRunning(true)
  }

  return (
    <section className="arcade-panel" style={{ '--game-color': game.color }}>
      <div className="arcade-game-title">
        <span>{game.icon}</span>
        <h2>{game.name}</h2>
      </div>

      <div className="arcade-score">
        SCORE <strong>{score}</strong>
      </div>

      <div className="arcade-canvas-wrap">
        <canvas ref={canvasRef} width="360" height="440" />

        {(!running || over) && (
          <div className="arcade-overlay">
            <span className="arcade-big-icon">{over ? '💥' : game.icon}</span>
            <h3>{over ? 'GAME OVER' : 'READY TO PLAY?'}</h3>
            <p>{over ? `Final score: ${score}` : 'Start your mission.'}</p>
            <button className="arcade-play" onClick={start}>
              {over ? '↻ RESTART' : '▶ PLAY NOW'}
            </button>
          </div>
        )}
      </div>

      <p className="arcade-hint">
        {game.id === 'snake' && 'Move: Arrow keys or W A S D'}
        {game.id === 'alien' && 'Move: ← → or A / D · Shoot: Space'}
        {game.id === 'runner' && 'Jump: ↑ or W or Space'}
        {game.id === 'brick' && 'Move paddle: ← → or A / D'}
        {game.id === 'tetris' && 'Move: ← → · Rotate: ↑ · Drop: ↓'}
        {game.id === 'racing' && 'Steer: ← → or A / D'}
        {game.id === 'maze' && 'Explore: Arrow keys or W A S D · Reach the exit'}
        {game.id === 'space' && 'Move: Arrow keys or W A S D · Shoot: Space'}
      </p>
    </section>
  )
}

export default function ArcadeGames() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('snake')
  const game = GAMES.find(g => g.id === selected)

  return (
    <main className="cosmic-arcade">
      <button
        className="arcade-play"
        onClick={() => navigate('/library')}
        style={{ marginBottom: '20px' }}
      >
        🚀 SPACE SHOOTER
      </button>

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
