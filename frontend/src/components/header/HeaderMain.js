/*import React from "react";
import Post from "../Post";
import "./HeaderMain.css"
import {Navbar, Nav, Container} from 'react-bootstrap';

export default function HeaderMain () {
  return(<>
  <Navbar id="Header" bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <br />
  </>);
}*/

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
//import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import { Switch } from 'react-router-dom';
import { Router } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';


import MainHisorial from '../historial/MainHistorial';
import MainTrueque from '../trueque/MainTrueque';

export default function HeaderMain() {
  return (
    <>
    <Navbar  collapseOnSelect fixed='top' expand="lg" className="bg-body-tertiary">
      <Container id='Header'>
        <Navbar.Brand href="#home">Prueba</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="trueque">Trueques</Nav.Link>
            <Nav.Link href="historial">Historial</Nav.Link>
            <NavDropdown title="Dropdown" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link href="#deets">Perfil</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
              Log Out
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <Router>

    <Switch>
      <Route path='/trueques'>
        <MainTrueque/>
      </Route>
      <Route path='/historial'>
        <MainHisorial/>
      </Route>
    </Switch>
    </Router>






    </>
  );
}
