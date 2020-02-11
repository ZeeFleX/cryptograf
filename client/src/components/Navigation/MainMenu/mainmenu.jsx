import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar, NavItem, NavLink } from "shards-react";
import { observer, inject } from "mobx-react";
import { ROOT } from "config/config";

// Styles
import "./mainmenu.sass";

@inject("User")
@observer
class MainMenu extends Component {
  render() {
    const { Navigation } = this.props;
    return (
      <Navbar
        type="dark"
        theme="primary"
        expand="md"
        fixed="top"
        className="mainmenu"
      >
        <Link to={ROOT} className="navbar-brand">
          Cryptograf
        </Link>
        <Nav navbar>
          <NavItem>
            <NavLink tag={Link} to="/">
              Главная
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/dashboard/tests">
              Тестер
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/dashboard/charts" disabled>
              Графики
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default MainMenu;
