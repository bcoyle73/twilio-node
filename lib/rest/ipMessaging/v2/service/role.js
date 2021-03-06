'use strict';

var Q = require('q');  /* jshint ignore:line */
var _ = require('lodash');  /* jshint ignore:line */
var Page = require('../../../../base/Page');  /* jshint ignore:line */
var deserialize = require(
    '../../../../base/deserialize');  /* jshint ignore:line */
var values = require('../../../../base/values');  /* jshint ignore:line */

var RoleList;
var RolePage;
var RoleInstance;
var RoleContext;

/* jshint ignore:start */
/**
 * @constructor Twilio.IpMessaging.V2.ServiceContext.RoleList
 * @description Initialize the RoleList
 *
 * @param {Twilio.IpMessaging.V2} version - Version of the resource
 * @param {string} serviceSid - The service_sid
 */
/* jshint ignore:end */
RoleList = function RoleList(version, serviceSid) {
  /* jshint ignore:start */
  /**
   * @function roles
   * @memberof Twilio.IpMessaging.V2.ServiceContext
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.IpMessaging.V2.ServiceContext.RoleContext}
   */
  /* jshint ignore:end */
  function RoleListInstance(sid) {
    return RoleListInstance.get(sid);
  }

  RoleListInstance._version = version;
  // Path Solution
  RoleListInstance._solution = {
    serviceSid: serviceSid
  };
  RoleListInstance._uri = _.template(
    '/Services/<%= serviceSid %>/Roles' // jshint ignore:line
  )(RoleListInstance._solution);
  /* jshint ignore:start */
  /**
   * create a RoleInstance
   *
   * @function create
   * @memberof Twilio.IpMessaging.V2.ServiceContext.RoleList
   * @instance
   *
   * @param {object} opts - ...
   * @param {string} opts.friendlyName - The friendly_name
   * @param {role.role_type} opts.type - The type
   * @param {string|list} opts.permission - The permission
   * @param {function} [callback] - Callback to handle processed record
   *
   * @returns {Promise} Resolves to processed RoleInstance
   */
  /* jshint ignore:end */
  RoleListInstance.create = function create(opts, callback) {
    if (_.isUndefined(opts)) {
      throw new Error('Required parameter "opts" missing.');
    }
    if (_.isUndefined(opts.friendlyName)) {
      throw new Error('Required parameter "opts.friendlyName" missing.');
    }
    if (_.isUndefined(opts.type)) {
      throw new Error('Required parameter "opts.type" missing.');
    }
    if (_.isUndefined(opts.permission)) {
      throw new Error('Required parameter "opts.permission" missing.');
    }

    var deferred = Q.defer();
    var data = values.of({
      'FriendlyName': _.get(opts, 'friendlyName'),
      'Type': _.get(opts, 'type'),
      'Permission': _.get(opts, 'permission')
    });

    var promise = this._version.create({
      uri: this._uri,
      method: 'POST',
      data: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new RoleInstance(
        this._version,
        payload,
        this._solution.serviceSid,
        this._solution.sid
      ));
    }.bind(this));

    promise.catch(function(error) {
      deferred.reject(error);
    });

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    return deferred.promise;
  };

  /* jshint ignore:start */
  /**
   * Streams RoleInstance records from the API.
   *
   * This operation lazily loads records as efficiently as possible until the limit
   * is reached.
   *
   * The results are passed into the callback function, so this operation is memory efficient.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function each
   * @memberof Twilio.IpMessaging.V2.ServiceContext.RoleList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         each() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize=50] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no pageSize is defined but a limit is defined,
   *         each() will attempt to read the limit with the most efficient
   *         page size, i.e. min(limit, 1000)
   * @param {Function} [opts.callback] -
   *         Function to process each record. If this and a positional
   * callback are passed, this one will be used
   * @param {Function} [opts.done] -
   *          Function to be called upon completion of streaming
   * @param {Function} [callback] - Function to process each record
   */
  /* jshint ignore:end */
  RoleListInstance.each = function each(opts, callback) {
    opts = opts || {};
    if (_.isFunction(opts)) {
      opts = { callback: opts };
    } else if (_.isFunction(callback) && !_.isFunction(opts.callback)) {
      opts.callback = callback;
    }

    if (_.isUndefined(opts.callback)) {
      throw new Error('Callback function must be provided');
    }

    var done = false;
    var currentPage = 1;
    var currentResource = 0;
    var limits = this._version.readLimits({
      limit: opts.limit,
      pageSize: opts.pageSize
    });

    function onComplete(error) {
      done = true;
      if (_.isFunction(opts.done)) {
        opts.done(error);
      }
    }

    function fetchNextPage(fn) {
      var promise = fn();
      if (_.isUndefined(promise)) {
        onComplete();
        return;
      }

      promise.then(function(page) {
        _.each(page.instances, function(instance) {
          if (done || (!_.isUndefined(opts.limit) && currentResource >= opts.limit)) {
            done = true;
            return false;
          }

          currentResource++;
          opts.callback(instance, onComplete);
        });

        if ((limits.pageLimit && limits.pageLimit <= currentPage)) {
          onComplete();
        } else if (!done) {
          currentPage++;
          fetchNextPage(_.bind(page.nextPage, page));
        }
      });

      promise.catch(onComplete);
    }

    fetchNextPage(_.bind(this.page, this, _.merge(opts, limits)));
  };

  /* jshint ignore:start */
  /**
   * @description Lists RoleInstance records from the API as a list.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function list
   * @memberof Twilio.IpMessaging.V2.ServiceContext.RoleList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         list() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no page_size is defined but a limit is defined,
   *         list() will attempt to read the limit with the most
   *         efficient page size, i.e. min(limit, 1000)
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  RoleListInstance.list = function list(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};
    var deferred = Q.defer();
    var allResources = [];
    opts.callback = function(resource, done) {
      allResources.push(resource);

      if (!_.isUndefined(opts.limit) && allResources.length === opts.limit) {
        done();
      }
    };

    opts.done = function(error) {
      if (_.isUndefined(error)) {
        deferred.resolve(allResources);
      } else {
        deferred.reject(error);
      }
    };

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    this.each(opts);
    return deferred.promise;
  };

  /* jshint ignore:start */
  /**
   * Retrieve a single page of RoleInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function page
   * @memberof Twilio.IpMessaging.V2.ServiceContext.RoleList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.pageToken] - PageToken provided by the API
   * @param {number} [opts.pageNumber] -
   *          Page Number, this value is simply for client state
   * @param {number} [opts.pageSize] - Number of records to return, defaults to 50
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  RoleListInstance.page = function page(opts, callback) {
    opts = opts || {};

    var deferred = Q.defer();
    var data = values.of({
      'PageToken': opts.pageToken,
      'Page': opts.pageNumber,
      'PageSize': opts.pageSize
    });

    var promise = this._version.page({
      uri: this._uri,
      method: 'GET',
      params: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new RolePage(
        this._version,
        payload,
        this._solution
      ));
    }.bind(this));

    promise.catch(function(error) {
      deferred.reject(error);
    });

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    return deferred.promise;
  };

  /* jshint ignore:start */
  /**
   * Constructs a role
   *
   * @function get
   * @memberof Twilio.IpMessaging.V2.ServiceContext.RoleList
   * @instance
   *
   * @param {string} sid - The sid
   *
   * @returns {Twilio.IpMessaging.V2.ServiceContext.RoleContext}
   */
  /* jshint ignore:end */
  RoleListInstance.get = function get(sid) {
    return new RoleContext(
      this._version,
      this._solution.serviceSid,
      sid
    );
  };

  return RoleListInstance;
};


/* jshint ignore:start */
/**
 * @constructor Twilio.IpMessaging.V2.ServiceContext.RolePage
 * @augments Page
 * @description Initialize the RolePage
 *
 * @param {Twilio.IpMessaging.V2} version - Version of the resource
 * @param {object} response - Response from the API
 * @param {object} solution - Path solution
 *
 * @returns RolePage
 */
/* jshint ignore:end */
RolePage = function RolePage(version, response, solution) {
  // Path Solution
  this._solution = solution;

  Page.prototype.constructor.call(this, version, response, this._solution);
};

_.extend(RolePage.prototype, Page.prototype);
RolePage.prototype.constructor = RolePage;

/* jshint ignore:start */
/**
 * Build an instance of RoleInstance
 *
 * @function getInstance
 * @memberof Twilio.IpMessaging.V2.ServiceContext.RolePage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns RoleInstance
 */
/* jshint ignore:end */
RolePage.prototype.getInstance = function getInstance(payload) {
  return new RoleInstance(
    this._version,
    payload,
    this._solution.serviceSid
  );
};


/* jshint ignore:start */
/**
 * @constructor Twilio.IpMessaging.V2.ServiceContext.RoleInstance
 * @description Initialize the RoleContext
 *
 * @property {string} sid - The sid
 * @property {string} accountSid - The account_sid
 * @property {string} serviceSid - The service_sid
 * @property {string} friendlyName - The friendly_name
 * @property {role.role_type} type - The type
 * @property {string} permissions - The permissions
 * @property {Date} dateCreated - The date_created
 * @property {Date} dateUpdated - The date_updated
 * @property {string} url - The url
 *
 * @param {Twilio.IpMessaging.V2} version - Version of the resource
 * @param {object} payload - The instance payload
 * @param {sid} serviceSid - The service_sid
 * @param {sid} sid - The sid
 */
/* jshint ignore:end */
RoleInstance = function RoleInstance(version, payload, serviceSid, sid) {
  this._version = version;

  // Marshaled Properties
  this.sid = payload.sid; // jshint ignore:line
  this.accountSid = payload.account_sid; // jshint ignore:line
  this.serviceSid = payload.service_sid; // jshint ignore:line
  this.friendlyName = payload.friendly_name; // jshint ignore:line
  this.type = payload.type; // jshint ignore:line
  this.permissions = payload.permissions; // jshint ignore:line
  this.dateCreated = deserialize.iso8601DateTime(payload.date_created); // jshint ignore:line
  this.dateUpdated = deserialize.iso8601DateTime(payload.date_updated); // jshint ignore:line
  this.url = payload.url; // jshint ignore:line

  // Context
  this._context = undefined;
  this._solution = {
    serviceSid: serviceSid,
    sid: sid || this.sid,
  };
};

Object.defineProperty(RoleInstance.prototype,
  '_proxy', {
  get: function() {
    if (!this._context) {
      this._context = new RoleContext(
        this._version,
        this._solution.serviceSid,
        this._solution.sid
      );
    }

    return this._context;
  }
});

/* jshint ignore:start */
/**
 * fetch a RoleInstance
 *
 * @function fetch
 * @memberof Twilio.IpMessaging.V2.ServiceContext.RoleInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed RoleInstance
 */
/* jshint ignore:end */
RoleInstance.prototype.fetch = function fetch(callback) {
  return this._proxy.fetch(callback);
};

/* jshint ignore:start */
/**
 * remove a RoleInstance
 *
 * @function remove
 * @memberof Twilio.IpMessaging.V2.ServiceContext.RoleInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed RoleInstance
 */
/* jshint ignore:end */
RoleInstance.prototype.remove = function remove(callback) {
  return this._proxy.remove(callback);
};

/* jshint ignore:start */
/**
 * update a RoleInstance
 *
 * @function update
 * @memberof Twilio.IpMessaging.V2.ServiceContext.RoleInstance
 * @instance
 *
 * @param {object} opts - ...
 * @param {string|list} opts.permission - The permission
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed RoleInstance
 */
/* jshint ignore:end */
RoleInstance.prototype.update = function update(opts, callback) {
  return this._proxy.update(opts, callback);
};


/* jshint ignore:start */
/**
 * @constructor Twilio.IpMessaging.V2.ServiceContext.RoleContext
 * @description Initialize the RoleContext
 *
 * @param {Twilio.IpMessaging.V2} version - Version of the resource
 * @param {sid} serviceSid - The service_sid
 * @param {sid} sid - The sid
 */
/* jshint ignore:end */
RoleContext = function RoleContext(version, serviceSid, sid) {
  this._version = version;

  // Path Solution
  this._solution = {
    serviceSid: serviceSid,
    sid: sid,
  };
  this._uri = _.template(
    '/Services/<%= serviceSid %>/Roles/<%= sid %>' // jshint ignore:line
  )(this._solution);
};

/* jshint ignore:start */
/**
 * fetch a RoleInstance
 *
 * @function fetch
 * @memberof Twilio.IpMessaging.V2.ServiceContext.RoleContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed RoleInstance
 */
/* jshint ignore:end */
RoleContext.prototype.fetch = function fetch(callback) {
  var deferred = Q.defer();
  var promise = this._version.fetch({
    uri: this._uri,
    method: 'GET'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new RoleInstance(
      this._version,
      payload,
      this._solution.serviceSid,
      this._solution.sid
    ));
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

/* jshint ignore:start */
/**
 * remove a RoleInstance
 *
 * @function remove
 * @memberof Twilio.IpMessaging.V2.ServiceContext.RoleContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed RoleInstance
 */
/* jshint ignore:end */
RoleContext.prototype.remove = function remove(callback) {
  var deferred = Q.defer();
  var promise = this._version.remove({
    uri: this._uri,
    method: 'DELETE'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(payload);
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

/* jshint ignore:start */
/**
 * update a RoleInstance
 *
 * @function update
 * @memberof Twilio.IpMessaging.V2.ServiceContext.RoleContext
 * @instance
 *
 * @param {object} opts - ...
 * @param {string|list} opts.permission - The permission
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed RoleInstance
 */
/* jshint ignore:end */
RoleContext.prototype.update = function update(opts, callback) {
  if (_.isUndefined(opts)) {
    throw new Error('Required parameter "opts" missing.');
  }
  if (_.isUndefined(opts.permission)) {
    throw new Error('Required parameter "opts.permission" missing.');
  }

  var deferred = Q.defer();
  var data = values.of({
    'Permission': _.get(opts, 'permission')
  });

  var promise = this._version.update({
    uri: this._uri,
    method: 'POST',
    data: data
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new RoleInstance(
      this._version,
      payload,
      this._solution.serviceSid,
      this._solution.sid
    ));
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

module.exports = {
  RoleList: RoleList,
  RolePage: RolePage,
  RoleInstance: RoleInstance,
  RoleContext: RoleContext
};
