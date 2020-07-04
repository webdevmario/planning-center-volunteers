/**
 * TODO: on load - retrieve collection data for service times, service teams
 * on submit, perform a search of leads based on ids for those two items
 * create another collection that stores template info with placeholders, replace with relevant info and return
 */

// import { clearSearchEntry } from '../modules/search.js';
// import { returnHi } from '../modules/email.js';

const volunteer = document.getElementById('volunteer-name');
const volunteerPhone = document.getElementById('volunteer-phone');
const volunteerEmail = document.getElementById('volunteer-email');
const selectTeam = document.getElementById('select-team');
const btnSubmit = document.getElementById('btn-submit');
const txtOutput = document.getElementById('txt-output');
const txtEmailOutput = document.getElementById('txt-email-output');
const btnFinalEmail = document.getElementById('btn-final-email');

// search
const btnSearch = document.getElementById('btn-search');
const inputSearch = document.getElementById('input-search');
const tblResults = document.getElementById('tbl-results');
const tblAssignments = document.getElementById('tbl-assignments');

// email
const emailPreview = document.getElementById('email-preview'); // html preview of email to send
const leaderPreview = document.getElementById('txt-leader-email-output');

// resets
const btnResetForm = document.getElementById('btn-reset-form');

let leads;
let teams;
let templates;

let selectedTeam;
let selectedLead;
let selectedTemplate;

let results = [];

const assignments = [];

init();

function init () {
  const promises = [];

  promises.push(getTeams(), getLeads(), getTemplates());

  Promise.all(promises)
    .then(res => {
      teams = res[0].data;
      leads = res[1].data;
      templates = res[2].data;

      console.log('teams', teams);
      console.log('leads', leads);
      console.log('templates', templates);

      teams.sort(sortTime).sort(sortColor).sort(sortName);

      // set teams drop-down
      teams.forEach(team => {
        const option = document.createElement('option');
        // var m = moment.utc(team.time);
        // m.tz('America/Chicago');

        // console.log('time', moment.tz(team.time, 'h:mm:ss a', 'America/Chicago'));

        var stillUtc = moment.utc('2020-01-01 ' + team.time).toDate();
        var local = moment(stillUtc).local().format('H:mm A');

        console.log(local); // 2015-09-13 09:39:27

        team.time = local; // update to cst time

        option.setAttribute('value', team._id);
        option.innerHTML = `${team.name} - ${team.color} - ${team.time}`;

        selectTeam.appendChild(option);
      });
    });

  btnSubmit.addEventListener('click', submitForm);
  btnSearch.addEventListener('click', searchPeople);
  btnFinalEmail.addEventListener('click', sendEmail);

  // const email = new Email('Johnny');
  // console.log('email get', email.getName());

  // console.log(returnHi('Johnny'));

  // set up handlers
  // btnResetForm.addEventListener('click', clearSearchEntry);
}

function getApi (params) {
  let url = 'http://localhost:4000/church';

  if (params) {
    const { firstName, lastName } = params;
    url += `?where[first_name]=${firstName}&where[last_name]=${lastName}`;
  }

  return axios.get(url);
}

function getTeams () {
  return axios.get('http://localhost:4000/teams');
}

function getLeads () {
  return axios.get('http://localhost:4000/leads');
}

function getTemplates () {
  return axios.get('http://localhost:4000/templates');
}

function searchPeople () {
  // get name provided
  console.log('name', inputSearch.value);

  const nameArr = inputSearch.value.split(' ');
  const obj = {
    firstName: nameArr[0],
    lastName: nameArr[1]
  };

  getApi(obj)
    .then(response => {
      // res.json(response.data);
      console.log('search response', response);

      const { data, included } = response.data;

      results = [];

      console.log('data 1', data);

      data.forEach(person => {
        const record = {
          id: person.id,
          link: person.links.self,
          firstName: person.attributes.first_name,
          lastName: person.attributes.last_name,
          status: person.attributes.status,
          email: person.relationships.emails.data.map(email => email.id),
          phoneNumber: person.relationships.phone_numbers.data.map(number => number.id)
        };

        console.log('record', record);

        // record.emails.map(emailId => included.find(item => item.id === emailId).attributes.address);

        record.email = record.email.map(
          emailId => included.find(item => item.id === emailId).attributes
        ).filter(email => email.primary)
          .map(email => email.address)[0];

        record.phoneNumber = record.phoneNumber.map(
          phoneId => included.find(item => item.id === phoneId).attributes
        ).filter(phone => phone.primary)
          .map(phone => phone.number)[0];

        results.push(record);
      });

      console.log('results', results);

      // tblResults
      const tableRef = tblResults.getElementsByTagName('tbody')[0];

      results.forEach(result => {
        var newRow = tableRef.insertRow();

        // Insert a cell in the row at index 0
        var newCell1 = newRow.insertCell();

        // Append a text node to the cell
        var newText1 = document.createTextNode(result.firstName + ' ' + result.lastName);
        newCell1.appendChild(newText1);

        // Insert a cell in the row at index 0
        var newCell2 = newRow.insertCell();

        // Append a text node to the cell
        var newText2 = document.createTextNode(result.email);
        newCell2.appendChild(newText2);

        // Insert a cell in the row at index 0
        var newCell3 = newRow.insertCell();

        // Append a text node to the cell
        var newText3 = document.createTextNode(result.phoneNumber);
        newCell3.appendChild(newText3);

        // Insert a cell in the row at index 0
        var newCell4 = newRow.insertCell();

        // Append a text node to the cell
        var newText4 = document.createElement('input');
        newText4.setAttribute('type', 'checkbox');
        newText4.setAttribute('id', 'inputChk');
        newText4.setAttribute('value', result.id);
        newText4.onclick = function () {
        // console.log(this.value);

          const selectedVal = this.value;
          const selectedPerson = results.find(person => person.id === selectedVal);

          console.log(selectedPerson);

          volunteer.value = selectedPerson.firstName + ' ' + selectedPerson.lastName;
          volunteerPhone.value = selectedPerson.phoneNumber;
          volunteerEmail.value = selectedPerson.email;
        };
        newCell4.appendChild(newText4);
      });
    })
    .catch(err => {
      console.error('err', err.message);
    });
}

/**
 * submitForm
 * submit initial form to create assigment email snippet (step 1)
 */

function submitForm () {
  // get name and get dd selection

  console.log('volunteer name', volunteer.value);
  console.log('dd select', selectTeam.value);

  selectedTeam = teams.find(team => team._id === selectTeam.value);
  selectedLead = leads.find(lead => lead._id === selectedTeam.lead);

  console.log('selected team', selectedTeam);
  console.log('selected lead', selectedLead);

  selectedTemplate = templates[0].copy;

  console.log('selected template', selectedTemplate);

  // alert(selectedTemplate.copy);

  while (selectedTemplate.includes('{{') || selectedTemplate.includes('}}')) {
    const startIdx = selectedTemplate.indexOf('{{');
    const endIdx = selectedTemplate.indexOf('}}');

    console.log('start idx', startIdx);
    console.log('end idx', endIdx);

    const tag = replaceTag(selectedTemplate.slice(startIdx + 2, endIdx));

    console.log('tag', tag);

    selectedTemplate = replaceAt(tag, selectedTemplate, startIdx, endIdx + 2);

    console.log('curr template', selectedTemplate);
  }

  console.log('new template', selectedTemplate);
  console.log('start email');

  var items = 'Hi Frank, here are the latest workflows added:';

  // window.open('mailto:franke@gmail.com?subject=Latest Workflows&body=' + items);

  assignments.push({
    volunteerName: volunteer.value,
    teamName: selectedTeam.name,
    color: selectedTeam.color,
    time: selectedTeam.time,
    campus: 'South'
  });

  // var entry = volunteer.value + ' ' + selectedTeam.name + ' ' + selectedTeam.color + ' ' + selectedTeam.time + ' ' + 'South'

  // console.log(entry);

  txtOutput.value = selectedTemplate;

  // txtEmailOutput.value = items + entry;

  updateTemplate();

  updateTeamLeadEmail(volunteer.value, selectedTeam, 'South', selectedLead);
}

function replaceTag (tag) {
  switch (tag) {
    case 'TEAM_COLOR':
      return selectedTeam.color;
    case 'TEAM_TIME':
      return selectedTeam.time;
    case 'TEAM_NAME':
      return selectedTeam.name;
    case 'LEAD_NAME':
      return selectedLead.firstName + ' ' + selectedLead.lastName;
    case 'LEAD_PHONE':
      return selectedLead.phone;
    case 'LEAD_EMAIL':
      return selectedLead.email;
    case 'LEAD_FIRST_NAME':
      return selectedLead.firstName;
    case 'VOLUNTEER_FIRST_NAME':
      return volunteer.value;
    case 'VOLUNTEER_PHONE':
      return volunteerPhone.value;
    case 'VOLUNTEER_EMAIL':
      return volunteerEmail.value;
    default:
      'UNKNOWN';
  }
}

function replaceAt (tag, copy, startIdx, endIdx) {
  return copy.substr(0, startIdx) + tag + copy.substr(endIdx, copy.length);
}

function sortName (a, b) {
  var nameA = a.name.toUpperCase(); // ignore upper and lowercase
  var nameB = b.name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}

function sortColor (a, b) {
  var nameA = a.color.toUpperCase(); // ignore upper and lowercase
  var nameB = b.color.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}

function sortTime (a, b) {
  return a.time - b.time;
}

function sendEmail () {
  axios.post('http://localhost:4000/email');
}

// specify a table
// specify onclick handler
function setTableElement (elem, results, onclick) {
  const tableRef = elem.getElementsByTagName('tbody')[0];

  console.log('data results', results);

  results.forEach(result => {
    const newRow = tableRef.insertRow();

    // count how many attributes exist on object...
    for (const prop in result) {
      console.log('prop', prop);

      const newCell = newRow.insertCell();
      const newText = document.createTextNode(result[prop]);

      newCell.appendChild(newText);
    }

    // // Append a text node to the cell
    // var newText4 = document.createElement('input');
    // newText4.setAttribute('type', 'checkbox');
    // newText4.setAttribute('id', 'inputChk');
    // newText4.setAttribute('value', result.id);
    // newText4.onclick = function () {
    //   // const selectedVal = this.value;
    //   // const selectedPerson = results.find(person => person.id === selectedVal);

    //   // console.log(selectedPerson);

    //   // volunteer.value = selectedPerson.firstName + ' ' + selectedPerson.lastName;
    //   // volunteerPhone.value = selectedPerson.phoneNumber;
    //   // volunteerEmail.value = selectedPerson.email;
    // }

    // newCell4.appendChild(newText4);
  });
}

// check if template has anything, if not, add base
// loop through each volunteer and add to body
function updateTemplate () {
  setTableElement(tblAssignments, assignments);

  const base = 'Hi Frank,<br>Here are the latest workflows added:<br>';

  if (txtEmailOutput.value === '') {
    txtEmailOutput.value = base;
  }

  assignments.forEach(assignment => {
    var entry = assignment.volunteerName + ' ' + assignment.teamName + ' ' + assignment.color + ' ' + assignment.time + ' ' + assignment.campus;

    txtEmailOutput.value += entry;
  });

  emailPreview.innerHTML = txtEmailOutput.value;
}

// take assignment info and team lead and form template to send
function updateTeamLeadEmail (volunteer, selectedTeam, campus, selectedLead) {
  console.log('update team lead email');

  console.log('volunteer', volunteer);
  console.log('selected team', selectedTeam);
  console.log('campus', campus);
  console.log('selectedLead', selectedLead);

  const template = `
  Hi ${selectedLead.firstName},

  A new person has been assigned to the ${selectedTeam.name} team!

  ${volunteer}
  ${selectedTeam.name}
  ${selectedTeam.color}
  ${selectedTeam.time}
  ${campus}

  Thank you,

  Mario Portillo
  `;

  leaderPreview.innerHTML = template;
}
