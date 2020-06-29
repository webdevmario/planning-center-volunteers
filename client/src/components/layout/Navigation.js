import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import './Navigation.scss';

function Navigation ({ sections, changeSection }) {
  function setClasses(newClass) {
    const classes = ['nav-item'];
    const location = useLocation();

    if (location.pathname.includes(newClass)) {
      classes.push('active');
    }

    return classes.join(' ');
  }

  return (
    <section className="nav-section">
      <Link to="/search" className={setClasses('search')}>
        <div onClick={() => changeSection(sections[0])}>{sections[0]}</div>
      </Link>
      <Link to="/volunteer-emails" className={setClasses('volunteer-emails')}>
        <div onClick={() => changeSection(sections[1])}>{sections[1]}</div>
      </Link>
      <Link to="/other-emails" className={setClasses('other-emails')}>
        <div onClick={() => changeSection(sections[2])}>{sections[2]}</div>
      </Link>
    </section>
  );
}

export default Navigation;
