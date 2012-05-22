#!/usr/bin/env node

"use strict";

var request = require('request');
var ruleParser = require('../lib/rule-parser.js');
require('shelljs/make');

/**
 * Builds the whole stuff. Sorry, you won't have time to take a coffee
 */
target.build = function(){
  target.download();
  target.buildRules();
  target.package();
};

/**
 * Download a fresh copy of data from the cloud (aka Internet in the ancient times)
 */
target.download = function(){
  //@todo move that in a cli/argument
  var dataUri = 'http://mxr.mozilla.org/mozilla-central/source/netwerk/dns/effective_tld_names.dat?raw=1';

  request(dataUri, function (err, response, body) {
    if (err) {
      throw Error(err);
    }

    body.to('data/effective_tld_names.dat');
  });
};

/**
 * Build the rules from a dataset from publicsuffix.org
 */
target.buildRules = function(){
  var parser, rules;

  parser = (new ruleParser()).parse(cat('data/effective_tld_names.dat'));
  parser.toString().to('src/rules.json');
};

/**
 * Packages the rules to an optimized frontend build
 */
target.package = function(){
  var rules = require('src/rules.json');

  wrapRules(rules).to('src/tld.rules.js');
};

function wrapRules(rules){
  return 'tld.prototype.augment = function(){' +
    'this.rules = '+ JSON.stringify(rules) +';' +
  '};';
}