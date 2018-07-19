// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {
  var stringify = '';

  var stringifyElem = function(elem) {
    var stringElem = '';
    if (Array.isArray(elem)) {
      stringElem += stringifyArray(elem);
    } else if (typeof elem === 'string') {
      stringElem += '"' + elem + '"';
    } else if (elem === null || typeof elem !== 'object') {
      stringElem += String(elem);
    } else {
      stringElem += stringifyObject(elem);
    }
    return stringElem;
  }

  var stringifyArray = function(array) {
  	var stringArray = '[';
  	for (var i = 0; i < array.length; i++){
  	  stringArray += stringifyElem(array[i]);
  	  if (i < array.length - 1) {
  	  	stringArray += ',';
  	  }
  	}
  	return stringArray += ']';
  }

  var stringifyObject = function(obj) {
  	var stringObj = '{';
    var idx = 0;
  	for (var prop in obj) {
      if (obj[prop] !== undefined && typeof obj[prop] !== 'function') {
      	stringObj += stringifyElem(prop) + ':' + stringifyElem(obj[prop]);
        idx++;
        if (idx < Object.keys(obj).length) {
          stringObj += ',';
        }
      }
  	}  	
  	return stringObj += '}';
  }

  stringify = stringifyElem(obj);

  return stringify;
};
