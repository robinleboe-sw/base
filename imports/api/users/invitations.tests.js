/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'meteor/practicalmeteor:chai';
import { Invitations } from './invitations.js';

describe('Invitations collection', function () {
  it('registers the collection with Mongo properly', function () {
    assert.equal(typeof Invitations, 'object');
  });
});
