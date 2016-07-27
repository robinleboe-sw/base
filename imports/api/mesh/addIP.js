import React from 'react';
import { Button } from 'react-bootstrap';
import { setMeshIP } from './methods';

const ips = [
  { ip: '192.168.0.1', port: '3001', userId: Meteor.userId() },
  { ip: '192.168.0.2', port: '3002', userId: Meteor.userId() },
  { ip: '192.168.0.3', port: '3003', userId: Meteor.userId() }
];

const getRandomIP = () => ips[Math.floor(Math.random() * ips.length)];

// const handleAddIP = () => {
//   const ip = getRandomIP();
//   setMeshIP.call(ip, (error) => {
//     if (error) {
//       alert(error.reason);
//     }
//   });
// };

const handleAddIP = (event) => {
  const ip = getRandomIP();

  setMeshIP.call({
    ip,
  }, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('IP added!', 'success');
    }
  });
};

export const AddIP = () => (
  <Button bsStyle="success" onClick={handleAddIP}>Add a Random IP</Button>
);
