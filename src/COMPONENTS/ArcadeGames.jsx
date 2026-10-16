
import React, { useEffect, useRef, useState } from 'react'
import './ArcadeGames.css'

const GAMES = [
  { id: 'snake', name: 'Snake Game', icon: '🐍', color: '#48ff9b' },
  { id: 'alien', name: 'Alien Invaders', icon: '👾', color: '#45eaff' },
  { id: 'runner', name: 'Neon Runner', icon: '🏃', color: '#ff4fd8' },
  { id: 'brick', name: 'Brick Breaker', icon: '🧱', color: '#ffd166' },
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

    const player = { x: W / 2 - 15, y: H - 55, w: 30, h: 30 }
    let bullets = []
    let enemies = []
    let food = { x: 10, y: 10 }
    let snake = [{ x: 8, y: 8 }]
    let direction = { x: 1, y: 0 }
    let nextDirection = { x: 1, y: 0 }
    let ball = { x: W / 2, y: H - 70, vx: 3, vy: -3, r: 7 }
    let paddle = { x: W / 2 - 45, y: H - 30, w: 90, h: 10 }
    let bricks = []

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 8; col++) {
        bricks.push({
          x: 10 + col * 43,
          y: 35 + row * 23,
          w: 37,
          h: 15,
          alive: true,
          color: ['#45eaff', '#a855f7', '#ff4fd8', '#ffd166', '#48ff9b'][row]
        })
      }
    }

    const randomFood = () => ({
      x: Math.floor(Math.random() * 17) + 1,
      y: Math.floor(Math.random() * 17) + 1
    })

    food = randomFood()

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
    }

    function keyUp(e) {
      keys.current[e.key.toLowerCase()] = false
    }

    function endGame() {
      active = false
      setOver(true)
      setRunning(false)
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
          y: snake[0].y + direction.y
        }

        if (
          head.x < 0 || head.x >= 20 ||
          head.y < 0 || head.y >= 20 ||
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
        } else {
          snake.pop()
        }
      }

      ctx.fillStyle = '#ff4fd8'
      ctx.fillRect(food.x * 20, food.y * 20, 16, 16)

      snake.forEach((part, i) => {
        ctx.fillStyle = i === 0 ? '#48ff9b' : '#168c65'
        ctx.fillRect(part.x * 20 + 1, part.y * 20 + 1, 17, 17)
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

      if (frame % 40 === 0) {
        enemies.push({
          x: Math.random() * (W - 24),
          y: -25,
          size: 23
        })
      }

      ctx.fillStyle = '#ffe66d'
      bullets.forEach(b => {
        b.y -= 7
        ctx.fillRect(b.x, b.y, 4, 12)
      })
      bullets = bullets.filter(b => b.y > -15)

      for (const enemy of enemies) {
        enemy.y += 1.8
        ctx.fillStyle = '#a855f7'
        ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size)

        if (
          enemy.x < player.x + player.w &&
          enemy.x + enemy.size > player.x &&
          enemy.y < player.y + player.h &&
          enemy.y + enemy.size > player.y
        ) {
          endGame()
          return
        }

        for (const b of bullets) {
          if (
            b.x >= enemy.x && b.x <= enemy.x + enemy.size &&
            b.y >= enemy.y && b.y <= enemy.y + enemy.size
          ) {
            points += 10
            setScore(points)
            enemy.y = H + 100
            b.y = -100
            break
          }
        }

        if (enemy.y > H) {
          endGame()
          return
        }
      }

      enemies = enemies.filter(e => e.y < H + 30)
    }

    function drawRunner() {
      const ground = H - 48

      if (keys.current.arrowup || keys.current.w || keys.current[' ']) {
        if (player.y >= ground - player.h) player.vy = -11
      }

      player.vy = (player.vy || 0) + 0.55
      player.y += player.vy || 0

      if (player.y > ground - player.h) {
        player.y = ground - player.h
        player.vy = 0
      }

      ctx.fillStyle = '#ff4fd8'
      ctx.fillRect(player.x, player.y, player.w, player.h)

      ctx.fillStyle = '#6476a8'
      ctx.fillRect(0, ground, W, 2)

      if (frame % 65 === 0) {
        enemies.push({ x: W + 20, y: ground - 25, size: 25 })
      }

      enemies.forEach(e => {
        e.x -= 4
        ctx.fillStyle = '#ff4d6d'
        ctx.fillRect(e.x, e.y, e.size, e.size)

        if (
          e.x < player.x + player.w &&
          e.x + e.size > player.x &&
          e.y < player.y + player.h &&
          e.y + e.size > player.y
        ) {
          endGame()
          return
        }
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

      bricks.forEach(brick => {
        if (!brick.alive) return
        ctx.fillStyle = brick.color
        ctx.fillRect(brick.x, brick.y, brick.w, brick.h)
      })

      ball.x += ball.vx
      ball.y += ball.vy

      if (ball.x < ball.r || ball.x > W - ball.r) ball.vx *= -1
      if (ball.y < ball.r) ball.vy *= -1

      if (
        ball.vy > 0 &&
        ball.y + ball.r >= paddle.y &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.w
      ) {
        ball.vy = -Math.abs(ball.vy)
      }

      for (const brick of bricks) {
        if (
          brick.alive &&
          ball.x >= brick.x && ball.x <= brick.x + brick.w &&
          ball.y >= brick.y && ball.y <= brick.y + brick.h
        ) {
          brick.alive = false
          ball.vy *= -1
          points += 10
          setScore(points)
          break
        }
      }

      if (ball.y > H) {
        endGame()
        return
      }

      if (bricks.every(b => !b.alive)) {
        points += 100
        setScore(points)
        endGame()
      }
    }

    function loop() {
      if (!active) return

      drawBackground()
      frame++

      if (game.id === 'snake') drawSnake()
      if (game.id === 'alien') drawAlien()
      if (game.id === 'runner') drawRunner()
      if (game.id === 'brick') drawBrickBreaker()

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

      <div className="arcade-score">SCORE <strong>{score}</strong></div>

      <div className="arcade-canvas-wrap">
        <canvas ref={canvasRef} width="360" height="400" />

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
      </p>
    </section>
  )
}

export default function ArcadeGames() {
  const [selected, setSelected] = useState('snake')
  const game = GAMES.find(g => g.id === selected)

  return (
    <main className="cosmic-arcade">
      <header className="arcade-header">
        <p>THE COSMICXP ARCADE</p>
        <h1>CHOOSE YOUR GAME</h1>
        <span>Four missions. One universe.</span>
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
