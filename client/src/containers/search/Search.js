import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Input from './../../components/ui/Input/Input';
import Button from './../../components/ui/Button/Button';

import './Search.scss';

function getApi (params) {
  let url = 'http://localhost:4000/church';

  if (params) {
    const { firstName, lastName } = params;
    url += `?where[first_name]=${firstName}&where[last_name]=${lastName}`;
  }

  return axios.get(url);
}

function Search () {
  const [results, setResults] = useState([]);
  const [searchEntry, setSearchEntry] = useState('');

  function searchVolunteers () {
    console.log('search volunteers', searchEntry);

    const nameArr = searchEntry.split(' ');
    const nameObj = {
      firstName: nameArr[0],
      lastName: nameArr[1]
    };

    getApi(nameObj)
      .then(response => {
        // res.json(response.data);
        console.log('search response', response);

        const { data, included } = response.data;

        // results = [];

        console.log('data 1', data);

        // data.forEach(person => {
        //   const record = {
        //     id: person.id,
        //     link: person.links.self,
        //     firstName: person.attributes.first_name,
        //     lastName: person.attributes.last_name,
        //     status: person.attributes.status,
        //     email: person.relationships.emails.data.map(email => email.id),
        //     phoneNumber: person.relationships.phone_numbers.data.map(number => number.id)
        //   };

        //   console.log('record', record);

        //   // record.emails.map(emailId => included.find(item => item.id === emailId).attributes.address);

        //   record.email = record.email.map(
        //     emailId => included.find(item => item.id === emailId).attributes
        //   ).filter(email => email.primary)
        //     .map(email => email.address)[0];

        //   record.phoneNumber = record.phoneNumber.map(
        //     phoneId => included.find(item => item.id === phoneId).attributes
        //   ).filter(phone => phone.primary)
        //     .map(phone => phone.number)[0];

        //   results.push(record);
        // });

        // console.log('results', results);

        // // tblResults
        // const tableRef = tblResults.getElementsByTagName('tbody')[0];

        // results.forEach(result => {
        //   var newRow = tableRef.insertRow();

        //   // Insert a cell in the row at index 0
        //   var newCell1 = newRow.insertCell();

        //   // Append a text node to the cell
        //   var newText1 = document.createTextNode(result.firstName + ' ' + result.lastName);
        //   newCell1.appendChild(newText1);

        //   // Insert a cell in the row at index 0
        //   var newCell2 = newRow.insertCell();

        //   // Append a text node to the cell
        //   var newText2 = document.createTextNode(result.email);
        //   newCell2.appendChild(newText2);

        //   // Insert a cell in the row at index 0
        //   var newCell3 = newRow.insertCell();

        //   // Append a text node to the cell
        //   var newText3 = document.createTextNode(result.phoneNumber);
        //   newCell3.appendChild(newText3);

        //   // Insert a cell in the row at index 0
        //   var newCell4 = newRow.insertCell();

        //   // Append a text node to the cell
        //   var newText4 = document.createElement('input');
        //   newText4.setAttribute('type', 'checkbox');
        //   newText4.setAttribute('id', 'inputChk');
        //   newText4.setAttribute('value', result.id);
        //   newText4.onclick = function () {
        //   // console.log(this.value);

        //     const selectedVal = this.value;
        //     const selectedPerson = results.find(person => person.id === selectedVal);

        //     console.log(selectedPerson);

        //     volunteer.value = selectedPerson.firstName + ' ' + selectedPerson.lastName;
        //     volunteerPhone.value = selectedPerson.phoneNumber;
        //     volunteerEmail.value = selectedPerson.email;
        //   };
        //   newCell4.appendChild(newText4);
        // });
      })
      .catch(err => {
        console.error('err', err.message);
      });
  }

  return (
    <div className="search-container">
      <Input searchEntry={searchEntry} setSearchEntry={setSearchEntry} />
      <div className="options-container">
        <Button name={'Search'} action={searchVolunteers} />
        <Button name={'Reset'} action={() => {}} />
      </div>
      <div className="results-container"></div>
    </div>
  );
}

export default Search;
