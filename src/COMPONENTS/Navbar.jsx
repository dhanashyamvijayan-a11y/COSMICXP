import React from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Link } from "react-router-dom";

function AppNavbar() {
  return (

    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="app-navbar py-3">
      <Container fluid>
        <Navbar.Brand href="#" className="navbar-brand fw-bold text-uppercase">
           🎮 cosmicXP
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      
        <Navbar.Collapse id="responsive-navbar-nav">

          <Form className="d-flex mx-auto my-2 app-navbar-search" style={{ maxWidth: '520px', width: '100%' }}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-light" type="submit">
              Search
            </Button>
          </Form>
            <Link to="/login" className="login-nav-link">
  Login
</Link>
          <Nav className="ms-auto align-items-lg-center app-navbar-links">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#browse">Browse</Nav.Link>
            <Nav.Link href="#details">Details</Nav.Link>
            <Nav.Link href="#streams">Streams</Nav.Link>
            <Link
  to="/profile"
  className="btn btn-outline-light ms-3 mt-2 mt-lg-0 nav-profile-button"
>
  Profile
</Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar
