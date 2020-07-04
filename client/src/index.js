import React, { useState, useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { render } from 'react-dom';

import '@fortawesome/fontawesome-free/css/all.css';

import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Card from './components/layout/Card';

function Main () {
  const sections = [
    'Search',
    'Volunteer Emails',
    'Other Emails'
  ];
  const [currSection, setCurrSection] = useState(sections[0]);

  function changeSection (newSection) {
    setCurrSection(newSection);
  }

  return (
    <Fragment>
      <Router>
        <Header />
        <Navigation sections={sections} changeSection={changeSection} />
        <Card currSection={currSection} />
      </Router>
    </Fragment>
  );
}

const app = (
  <Main />
);

render(app, document.getElementById('root'));
