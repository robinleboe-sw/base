import React from 'react';
import { ListGroup, Alert, FormControl, ControlLabel } from 'react-bootstrap';
// import { Document } from './document.js';

export const ConnectedMembers = () => (
  <div>
    <ControlLabel>Select member to call</ControlLabel>
    <FormControl componentClass="select" placeholder="select...">
      <option value="select">select</option>
      <option value="other">...</option>
    </FormControl>
  </div>
);

