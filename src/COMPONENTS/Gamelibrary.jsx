
import React, { useEffect, useRef, useState } from 'react'

function Gamelibrary() {
  const canvasRef = useRef(null)
  const keysRef = useRef({})
  const [playing, setPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (!playing) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let active = true
    let frame = 0
    let points = 0
    let player = { x: 175, y: 340, w: 30, h: 30 }
    let bullets = []
    let enemies = []
    let lastShot = 0
    let animationId

    const keyDown = (event) => {
      keysRef.current[event.key.toLowerCase()] = true

      if (
        ['arrowleft', 'arrowright', ' '].includes(
          event.key.toLowerCase()
        )
      ) {
        event.preventDefault()
      }
    }

    const keyUp = (event) => {
      keysRef.current[event.key.toLowerCase()] = false
    }

    const draw = () => {
      if (!active) return

      ctx.fillStyle = '#070b1c'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Animated stars
      for (let i = 0; i < 65; i++) {
        const x = (i * 83) % canvas.width
        const y = (i * 47 + frame * 2) % canvas.height

        ctx.fillStyle = '#9aaaff'
        ctx.fillRect(x, y, 2, 2)
      }

      const keys = keysRef.current

      if (keys.arrowleft || keys.a) player.x -= 5
      if (keys.arrowright || keys.d) player.x += 5

      player.x = Math.max(
        0,
        Math.min(canvas.width - player.w, player.x)
      )

      // Shoot with space
      if (keys[' '] && frame - lastShot > 10) {
        bullets.push({
          x: player.x + 13,
          y: player.y
        })
        lastShot = frame
      }

      // Spaceship
      ctx.fillStyle = '#45eaff'
      ctx.beginPath()
      ctx.moveTo(player.x + 15, player.y)
      ctx.lineTo(player.x, player.y + 30)
      ctx.lineTo(player.x + 30, player.y + 30)
      ctx.closePath()
      ctx.fill()

      // Bullets
      ctx.fillStyle = '#ffe66d'

      bullets.forEach((bullet) => {
        bullet.y -= 7
        ctx.fillRect(bullet.x, bullet.y, 4, 12)
      })

      bullets = bullets.filter((bullet) => bullet.y > -15)

      // Enemies
      frame++

      if (frame % 45 === 0) {
        enemies.push({
          x: Math.random() * (canvas.width - 28),
          y: -30,
          size: 26
        })
      }

      for (const enemy of enemies) {
        enemy.y += 2

        ctx.fillStyle = '#ff477e'
        ctx.fillRect(
          enemy.x,
          enemy.y,
          enemy.size,
          enemy.size
        )

        // Collision with spaceship
        if (
          enemy.x < player.x + player.w &&
          enemy.x + enemy.size > player.x &&
          enemy.y < player.y + player.h &&
          enemy.y + enemy.size > player.y
        ) {
          active = false
          setGameOver(true)
          setPlaying(false)
          return
        }

        // Collision with bullets
        for (const bullet of bullets) {
          if (
            bullet.x >= enemy.x &&
            bullet.x <= enemy.x + enemy.size &&
            bullet.y <= enemy.y + enemy.size &&
            bullet.y >= enemy.y
          ) {
            points += 10
            setScore(points)
            enemy.y = canvas.height + 100
            bullet.y = -100
            break
          }
        }
      }

      enemies = enemies.filter(
        (enemy) => enemy.y < canvas.height + 40
      )

      animationId = requestAnimationFrame(draw)
    }

    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)

    draw()

    return () => {
      active = false
      cancelAnimationFrame(animationId)
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
      keysRef.current = {}
    }
  }, [playing])

  const startGame = () => {
    keysRef.current = {}
    setScore(0)
    setGameOver(false)
    setPlaying(true)
  }

  return (
    <main className="space-game">
      <div className="space-game-header">
        <p className="space-eyebrow">COSMICXP ARCADE</p>
        <h1>SPACE SHOOTER</h1>
        <p>Survive the galaxy. Destroy the enemies.</p>
      </div>

      <div className="space-score">
        <span>SCORE</span>
        <strong>{score}</strong>
      </div>

      <div className="space-game-board">
        <canvas
          ref={canvasRef}
          width={360}
          height={400}
          aria-label="Space Shooter game"
        />

        {(!playing || gameOver) && (
          <div className="space-overlay">
            <div className="space-overlay-icon">
              {gameOver ? '💥' : '🚀'}
            </div>

            <h2>
              {gameOver ? 'GAME OVER' : 'READY, PILOT?'}
            </h2>

            <p>
              {gameOver
                ? `Your final score: ${score}`
                : 'Enter the galaxy and start your mission.'}
            </p>

            <button
              className="space-play-button"
              onClick={startGame}
            >
              {gameOver ? 'PLAY AGAIN' : 'START GAME'}
            </button>
          </div>
        )}
      </div>

      <div className="space-controls">
        <p><strong>MOVE</strong> ← → or A / D</p>
        <p><strong>SHOOT</strong> Spacebar</p>
      </div>
    </main>
  )
}

export default Gamelibrary
