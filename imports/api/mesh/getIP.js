import React from 'react';
import { Button } from 'react-bootstrap';
import { getMeshIP } from './methods';
import { Mesh } from './mesh';


const handleGetIP = (event) => {

  let userIP = Mesh.find({ 'ip.userId': Meteor.userId() }).fetch()
  console.log(userIP);
};

export const GetIP = () => (
  <Button bsStyle="success" onClick={handleGetIP}>Get User IPs</Button>
);
