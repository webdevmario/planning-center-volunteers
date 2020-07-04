import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation } from 'react-router-dom';

import './Card.scss';

import Search from '../../containers/search/Search';
import VolunteerEmails from '../../containers/volunteer-emails/VolunteerEmails';
import OtherEmails from '../../containers/other-emails/OtherEmails';

function Card ({ currSection }) {
  const location = useLocation();
  const backButton = <div><i className="fa fa-chevron-circle-left fa-2x" aria-hidden="true"></i></div>;
  const nextButton = <div><i className="fa fa-chevron-circle-right fa-2x" aria-hidden="true"></i></div>;

  return (
    <section className="card-wrapper">
      <div className="card-container">
        <section className="card-title">
          {currSection}
        </section>
        <hr/>
        <section className="card-content">
          <Switch>
            <Route exact path="/" component={Search}></Route>
            <Route exact path="/search" component={Search}></Route>
            <Route exact path="/volunteer-emails" component={VolunteerEmails}></Route>
            <Route exact path="/other-emails" component={OtherEmails}></Route>
          </Switch>
        </section>
        <section className="card-footer">
          {!location.pathname.toLowerCase().includes('search') && location.pathname !== ('/') && backButton}
          {nextButton}
        </section>
      </div>
    </section>
  );
}

export default Card;
