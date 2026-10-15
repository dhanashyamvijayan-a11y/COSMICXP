import React from 'react'

function Hero() {
  return (
    <section className="hero-section bg-primary text-white py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold mb-4">
              Welcome to CosmicXP - Your Ultimate Gaming Destination
            </h1>
            <p className="lead mb-4">
              Discover and explore an amazing collection of games. From action-packed adventures to mind-bending puzzles, find your next favorite game here.
            </p>
            <a href="#featured-games" className="btn btn-light btn-lg me-3">
              Explore Games
            </a>
            <button className="btn btn-outline-light btn-lg">
              Learn More
            </button>
          </div>
          <div className="col-lg-6">
            <div className="hero-image">
              {/* You can add an image or illustration here */}
              <div className="bg-white bg-opacity-10 rounded-3 p-4 text-center">
                <h3 className="text-white">🎮</h3>
                <p className="text-white-50">Your Gaming Journey Starts Here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero