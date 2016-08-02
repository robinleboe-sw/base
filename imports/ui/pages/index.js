import React from 'react';
import { Jumbotron } from 'react-bootstrap';

export const Index = () => (
  <p className="text-center">
    <h2>Sessionwire Studio - Live Recording on the Web</h2>
    <p>Login for the new collaboration experience.</p>
    <p><a className="btn btn-success" href="/login" role="button">Login</a></p>
    <p style={ { fontSize: '16px', color: '#aaa' } }>Currently at v0.1.0-alpha</p>
  </p>
);
