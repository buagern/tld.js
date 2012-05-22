
function Rule (){
  //mandatory properties
  this.tld = '';
  //optional properties
  //this.sld = null;
  //this.type = undefined|exception|wildcard;
};

if (typeof module !== "undefined" && typeof require !== "undefined") {
  module.exports = Rule;
} else {
  window["rule"] = Rule;
}
