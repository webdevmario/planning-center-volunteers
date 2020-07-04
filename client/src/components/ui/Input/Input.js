import React from 'react'

import './Input.scss';

function Input({ searchEntry, setSearchEntry }) {
  return (
    <input type="text" className="input" value={searchEntry} onChange={e => setSearchEntry(e.target.value)} />
  )
}

export default Input
