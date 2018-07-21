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
    var elems = json.slice(1, -1).split(',').map(cleanElem);
    console.log(elems)

    // check for nested elem
    elems = checkNesting(elems);

    // populate array
    if (elems.length > 1) {
      for (var elem of elems) {
        elems.push(getVal(elem));
      }
    }

    return arr;
  }
  
  var parseObj = function(json) {
    console.log('obj-- ' + json)
    var obj = {};
    var prop, val;

    // seperate prop and val by ":
    var propsAndVals = json.slice(1, -1).split('":').map(cleanElem);

    if (propsAndVals.length > 1) {
      // seperate prop and val sets by ,
      propsAndVals = findPropValPair(propsAndVals);
      console.log('1--')
      console.log(propsAndVals)

      // check for nested elem
      propsAndVals = checkNesting(propsAndVals);
      console.log('2--')
      console.log(propsAndVals)

      // populate the object
      for (var i = 0; i < propsAndVals.length; i += 2) {
        obj[propsAndVals[i]] = getVal(propsAndVals[i + 1]);
      }
    }

    return obj;
  }

  var checkNesting = function(array) {
    console.log('nest- ' + array)
    var brackCount = 0;

    // search for open bracks
    for (var i = 0; i < json.length; i++) {
      
    }

    return json;
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
