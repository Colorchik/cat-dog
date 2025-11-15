import React from 'react';
import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink to="/" end>Главная</NavLink>
        </li>
        <li>
          <NavLink to="/cats">Котики</NavLink>
        </li>
        <li>
          <NavLink to="/dogs">Собачки</NavLink>
        </li>
        <li>
          <NavLink to="/fox">Лисички</NavLink>
        </li>
        <li>
          <NavLink to="/favorites">Избранное</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;