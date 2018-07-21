// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  console.log('--- ' + json)
  var parsed;

  var parseArray = function(json) {
    console.log('arr-- ' + json)
    var arr = [];

    // seperate elems by ,
    json = json.split(',').map(cleanElem);
    console.log(json)

    // populate array
    if (json.length > 1) {
      for (var elem of json) {
        arr.push(getVal(elem));
      }
    }

    return arr;
  }
  
  var parseObj = function(json) {
    console.log('obj-- ' + json)
    var obj = {};
    var prop, val;

    // seperate prop and val by ":
    json = json.split('":').map(cleanElem);
    console.log('1-- ' + json)

    // seperate prop and val sets by ,
    for (var i = 1; i < json.length; i++) {
      if (json[i].includes(',')) {
        
      }
    }
    console.log('2-- ' + json)

    // populate the object
    if (json.length > 1) {
      for (var i = 0; i < json.length; i += 2) {
        obj[json[i]] = getVal(json[i + 1]);
      }
    }

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
    // console.log('bef- ' + elem)
    if (typeof elem === 'string') {
      // remove starting brackets and quots
      elem = elem.split(/^{"|"}$|^\s"|^\["|"$|"]$/g).join('');
    }
    // console.log('aft- ' + elem)
    return elem;
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
