;(function(){
  "use strict";

  /**
   * tld library
   *
   * Useable methods are those documented with an @api in JSDoc
   * See README.md for more explainations on how to use this stuff.
   */
  function tld (){
    this.rules = [];
  }

  tld.init = function () {
    return new tld();
  };

  tld.getNormalXld = function(rule){
    return (rule.sld ? '.' + rule.sld : '') + '.' + rule.tld;
  };

  tld.getNormalPattern = function(rule){
    return (rule.sld ? '\\.' + rule.sld : '') + '\\.' + rule.tld;
  };

  tld.getWildcardPattern = function(rule){
    return '\\.[^\\.]+' + tld.getNormalXld(rule);
  };

  tld.getExceptionPattern = function(rule){
    return (rule.sld || '') + '\\.' + rule.tld;
  };

  /**
   * Dummy method used to inline rules loader
   *
   * The build script generates some stuff in `src/tld.rules.js`
   *
   * @api
   * @beta
   */
  tld.prototype.augment = function (){};

  /**
   * Returns the best rule for a given host based on candidates
   *
   * @static
   * @param host {String} Hostname to check rules against
   * @param rules {Array} List of rules used to work on
   * @return {Object} Candidate object, with a normal and exception state
   */
  tld.getCandidateRule = function (host, rules) {
    var rule = {'normal': null, 'exception': null};

    rules.reverse().some(function(r){
      var pattern;

      //sld matching? escape the loop immediatly (except if it's an exception)
      if ('.'+host === tld.getNormalXld(r)){
        if (r.exception === true){
          rule.normal = r;
        }

        return true;
      }

      //otherwise check as a complete host
      //if it's an exception, we want to loop a bit more to a normal rule
      pattern = '.+' + tld.getNormalPattern(r) + '$';

      if ((new RegExp(pattern)).test(host)){
        rule[r.exception ? 'exception' : 'normal'] = r;
        return !r.exception;
      }

      return false;
    });

    return rule;
  };

  /**
   * Retrieve a subset of rules for a Top-Level-Domain string
   *
   * @param tld {String} Top-Level-Domain string
   * @return {Array} Rules subset
   */
  tld.prototype.getRulesForTld = function(tld){
    return this.rules.filter(function(rule){
      return rule.tld === tld ? rule : null;
    });
  };

  /**
   * Detects the domain based on rules and upon and a host string
   *
   * @api
   * @param uri
   * @return {String}
   */
  tld.prototype.getDomain = function (hostname) {
    var pattern, hostTld, rules, rule;
    var domain = null;

    if (this.isValid(hostname) === false){
      return null;
    }

    hostname = hostname.toLowerCase();
    hostTld = hostname.split('.').pop();
    rules = this.getRulesForTld(hostTld);
    rule = tld.getCandidateRule(hostname, rules);

    if (rule.normal === null){
      return null;
    }

    //if there is an exception, we challenge its rules without changing pattern
    if (rule.normal && rule.exception) {
      rule.normal.wildcard = rule.exception.wildcard;
    }

    if (rule.normal.exception === true){
      pattern = '(' + tld.getExceptionPattern(rule.normal) + ')$';
    }
    else if (rule.normal.wildcard === true){
      pattern = '([^\.]+' + tld.getWildcardPattern(rule.normal) + ')$';
    }
    else{
      pattern = '([^\.]+' + tld.getNormalPattern(rule.normal) + ')$';
    }

    hostname.replace(new RegExp(pattern), function(m, d){
      domain = d;
    });

    return domain;
  };

  /**
   * Checking if a host is valid
   *
   * @api
   * @todo handle localhost, local etc.
   * @param host {String}
   * @return {Boolean}
   */
  tld.prototype.isValid = function (host){
    return !(typeof host !== 'string' || host.indexOf('.') === -1 || host[0] === '.');
  };

  if (typeof module !== "undefined" && typeof require !== "undefined") {
    module.exports = tld;
  } else {
    window["tld"] = tld;
  }
})();