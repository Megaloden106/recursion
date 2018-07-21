// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  console.log('--- ' + json)
  var parsed;

  var parseArray = function(json) {
    console.log('arr-- ' + json)
    var arr = [];

    return arr;
  }
  
  var parseObj = function(json) {
    console.log('obj-- ' + json)
    var obj = {};

    json = json.split(':').map(cleanElem);
    console.log(json)

    return obj;
  }

  var nesting = function(objOrArray) {
  }

  var getVal = function(value) {
    if (typeof value === 'string') {
      if (value === undefined) {
        value = '';
      } else if (value.includes('true')) {
        value = true;
      } else if (value.includes('false')) {
        value = false;
      } else if (value.includes('null')) {
        value = null;
      } else if (value.search(/\d/) >= 0) {
        value = Number(value);
      } else if (value.includes('\\')) {
        value = removeBackslash(value);
      }
    }
    return value;
  }

  var cleanElem = function(elem) {
    var seperators = ['{', '}', '"', '[', ']'];
    console.log(elem)
    return elem.split('').filter(function(char) {
      return char.includes(new RegExp(seperators.join('|') + 'g'));
    }).join('');
  }

  var removeBackslash = function(elem) {
    chars = elem.split('')
    for (var i = 0; i < chars.length; i++) {
      if (chars[i] === '\\') {
        chars.splice(i, 1);
      }
    }
    return chars.join('');
  }

  if (json.indexOf('[') < json.indexOf('{') && json.includes('[') || !json.includes('{')) {
    parsed = parseArray(json);
  } else {
    parsed = parseObj(json);
  }

  return parsed;
};
