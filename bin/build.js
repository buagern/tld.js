#!/usr/bin/env node

"use strict";

var request = require('request');
var parser = require('../lib/rule-parser.js').init();
require('shelljs/global');

//@todo put that in a default optimist value
var dataUri = 'http://mxr.mozilla.org/mozilla-central/source/netwerk/dns/effective_tld_names.dat?raw=1';

/*
 * Builds a new static file containing public suffix rules
 * The kind of feature missing in other TLDs projects
 */
request(dataUri, function (err, response, body) {
  if (err) {
    throw Error(err);
  }

  var rules = parser.parse(body);

  JSON.stringify(rules).to('src/rules.json');
});