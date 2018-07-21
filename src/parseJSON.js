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
    json = json.slice(1, -1).split(',').map(cleanElem);
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
    json = json.slice(1, -1).split('":').map(cleanElem);

    if (json.length > 1) {
      // seperate prop and val sets by ,
      json = findPropValPair(json);
      console.log('1--')
      console.log(json)

      // populate the object
      for (var i = 0; i < json.length; i += 2) {
        obj[json[i]] = getVal(json[i + 1]);
      }
    }

    return obj;
  }

  var findNesting = function(objOrArray) {
    console.log('nest- ' + objOrArray)
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
      } else if (value.search(/\d/) >= 0 && Number(value) !== NaN) {
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
      elem = elem.split(/^"|"$|^\s"/g).join('');
    }
    // console.log('aft- ' + elem)
    return elem;
  }

  var removeBackslash = function(elem) {
    // chars = elem.split('')
    for (var i = 0; i < chars.length; i++) {
      if (chars[i] === '\\') {
        chars.splice(i, 1);
      }
    }
    // return chars.join('');
  }

  var findPropValPair = function(json) {
    for (var i = 1; i < json.length; i++) {
      var commaIdx = json[i].indexOf(',');
      var quotIdx = json[i].lastIndexOf('"');
      if (quotIdx > commaIdx && commaIdx > 0){
        json.splice(i, 1, json[i].slice(0, commaIdx), json[i].slice(commaIdx + 1));
        i++;
      }
    }
    return json.map(cleanElem);
  }

  if (json.indexOf('[') < json.indexOf('{') && json.includes('[') || !json.includes('{')) {
    parsed = parseArray(json);
  } else {
    parsed = parseObj(json);
  }

  return parsed;
};
