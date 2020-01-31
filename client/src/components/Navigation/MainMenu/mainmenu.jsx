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
        <Nav navbar className="ml-auto">
          <NavItem>
            <NavLink tag={Link} to="/">
              Главная
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/">
              О проекте
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/">
              Контакты
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/">
              Сотрудничество
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/">
              Войти
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default MainMenu;
