var Rule = require('./rule.js');

function RuleParser(){

}

RuleParser.init = function(){
  return new RuleParser();
};

/**
 * Parse a one-domain-per-line file
 *
 * @api
 * @param body {String}
 * @return {Array}
 */
RuleParser.prototype.parse = function (body){
  return (body+'').split(/\n/m).filter(RuleParser.filterRow).map(RuleParser.domainBuilder);
};

/**
 * Returns a rule based on string analysis
 *
 * @static
 * @param rule {PublicSuffixRule}
 */
RuleParser.domainBuilder = function (row){
  var rule = Object.seal(new Rule());

  //setting initial rule
  rule.source = row;

  //exception
  row = row.replace(/^!(.+)$/, function(m, tld){
    rule.exception = true;

    return tld;
  });

  //wildcard
  row = row.replace(/^(\*\.)(.+)$/, function(m, dummy, tld){
    rule.wildcard = true;

    return tld;
  });

  //splitting domains
  row.replace(/^((.+)\.)?([^\.]+)$/, function(m, dummy, secondLevel, firstLevel){
    rule.firstLevel = firstLevel;
    rule.secondLevel = secondLevel || null;
  });

  return rule;
};

/**
 * Filters a commented or empty line
 *
 * @static
 * @param row {String}
 * @return {String|null}
 */
RuleParser.filterRow = function (row) {
  return /^\/\//.test(row) ? null : row;
};

module.exports = RuleParser;