import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from './NavList.module.css';

export const NavList = () => {
  return (
    <div className={styles.nav_list_wrapper}>
      <nav>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <NavLink
              to="/"
              exact="true"
              className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
            >
              Home
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink
              to="/catalog"
              className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
            >
              Catalog
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink
              to="/favorites"
              className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
            >
              Favorites
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};
