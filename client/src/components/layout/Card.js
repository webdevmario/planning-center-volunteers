import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import './Card.scss';

import Search from '../../../containers/search/Search';
import VolunteerEmails from '../../../containers/volunteer-emails/VolunteerEmails';
import OtherEmails from '../../../containers/other-emails/OtherEmails';

function Card ({ currSection }) {

  return (
    <section className="card-wrapper">
      <div className="card-container">
        <section className="card-title">
          {currSection}
        </section>
        <hr/>
        <section className="card-content">
          <Switch>
            <Route exact path="/search" component={Search}></Route>
            <Route exact path="/volunteer-emails" component={VolunteerEmails}></Route>
            <Route exact path="/other-emails" component={OtherEmails}></Route>
          </Switch>
        </section>
        <section className="card-footer">
          <button>BACK</button>
          <button>NEXT</button>
        </section>
      </div>
    </section>
  );
}

export default Card;
