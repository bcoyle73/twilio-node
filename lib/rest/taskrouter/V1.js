'use strict';

var _ = require('lodash');
var Version = require('../../base/Version');
var WorkspaceList = require('./v1/workspace').WorkspaceList;


/**
 * Initialize the V1 version of Taskrouter
 *
 * @constructor
 *
 * @param {Domain} domain - The twilio domain
 *
 * @returns V1 version of Taskrouter
 */
function V1(domain) {
  Version.constructor.call(this, domain, 'v1');

  // Resources
  this._workspaces = undefined;
}

Object.defineProperty(V1.prototype,
  'workspaces', {
  get: function() {
    this._workspaces = this._workspaces || new WorkspaceList();
    return this._workspaces;
  },
});

module.exports = V1;