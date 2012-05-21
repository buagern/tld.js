
function Rule (){
  this.exception = false;
  this.firstLevel = '';
  this.secondLevel = null;
  this.source = '';
  this.wildcard = false;
};

if (typeof module !== "undefined" && typeof require !== "undefined") {
  module.exports = Rule;
} else {
  window["rule"] = Rule;
}
