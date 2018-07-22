// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  console.log('--- ' + json)

  var parseArray = function(json) {
    console.log('arr-- ' + json)
    var arr = [];

    // remove bracket
    json = json.trim().slice(1, -1);
    // console.log(json)

    // populate array
    if (json.length > 0) {

      // seperate elems by ,
      var elems = json.split(',').map(cleanElem);
      // console.log(elems)

      // check for nested elem
      elems = checkNesting(elems);

      for (var elem of elems) {
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
    var propsAndVals = json.trim().slice(1, -1).split(/":|"\s:/g);
      console.log('0--')
      console.log(propsAndVals)

    if (propsAndVals.length > 1) {
      // seperate prop and val sets by ,
      propsAndVals = findPropValPair(propsAndVals);
      console.log('1--')
      console.log(propsAndVals)

      // check for nested elem
      propsAndVals = checkNesting(propsAndVals).map(cleanElem);
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
    var totalNests = findCurrLevNests(array);
    console.log('nest- ' + array + '/ tn- ' + totalNests)

    while (totalNests > 0) {
      var range = findNestIndices(array);
      // console.log(range);
      var nestedJSON = concatNestedJSON(range, array);
      // console.log('njs- ' + nestedJSON);

      if (range.bracket === '{') {
        array.splice(range.start, range.end - range.start + 1, parseObj(nestedJSON));
      } else {
        array.splice(range.start, range.end - range.start + 1, parseArray(nestedJSON));
      }

      totalNests--;
    }
    return array;
  }

  var getVal = function(value) {
    // console.log('v- ' + value)
    if (typeof value === 'string') {
      if (value === undefined) {
        value = '';
      } else if (value.includes('true')) {
        value = true;
      } else if (value.includes('false')) {
        value = false;
      } else if (value.includes('null')) {
        value = null;
      } else if (value.search(/\d/g) >= 0 && !isNaN(Number(value))) {
        value = Number(value);
      } else if (value.search(/\d/g) >= 0 && isNaN(Number(value))) {
        value = value.split(/^"|"$/g).join('');
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
      elem = elem.trim();
      if (elem.search(/^"\d|\d"$/g) < 0) {
        elem = elem.split(/^"|"$|"\s$/g).join('');
      }
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

  var findPropValPair = function(json) {
    console.log('---- ' + json)

    for (var i = 1; i < json.length; i++) {
      var isInQuots = false;
      var isFound = false;
      console.log('bef---- ' + json[i])
      for (var j = 0; j < json[i].length; j++) {
        if (json[i][j] === '\"' || json[i][j] === '\'') {
          isInQuots = !isInQuots;
        }
        if (!isInQuots && json[i][j] === ',' && !isFound) {
          json.splice(i, 1, json[i].slice(0, j), json[i].slice(j + 1));
          console.log('aft1---- ' + json[i])
          console.log('aft2---- ' + json[i+1])
          i++;
          isFound = true;
        }
      }
    }
    return json;
  }

  var findCurrLevNests = function(array) {
    var nestCount = 0;
    var totalNests = 0;
    var open = '';
    var close = '';
    var isOpen = false;
    // console.log('-')
    // console.log(array)

    // check for nested arrays or objects at this current level
    for (var char of String(array)) {
      if (char.search(/{|\[/g) === 0 && !isOpen) {
        open = char;
        if (open === '{') {
          close = '}';
        } else {
          close = ']';          
        }
        nestCount = 1;
        isOpen = true;
      } else if (char === open) {
        nestCount++;
      } else if (char === close) {
        nestCount--;
      }
      if (nestCount === 0 && isOpen && char === close) {
        totalNests++;
        isOpen = false;
      }
    }
    return totalNests;
  }

  var findNestIndices = function(array) {
    var nestCount = 0;
    var open = '';
    var close = '';
    var foundCurrNest = false;
    var start = 0;
    var end = 0;
    for (var i = 0; i < array.length; i++) {
      if (typeof array[i] !== 'object') {
        for (var char of array[i]) {
          if (char.search(/{|\[/g) === 0 && open.length === 0) {
            open = char;
            if (open === '{') {
              close = '}';
            } else {
              close = ']';          
            }
            nestCount = 1;
            start = i;
          } else if (char === open) {
            nestCount++;
          } else if (char === close) {
            nestCount--;
          }
          if (nestCount === 0 && open.length === 1 && !foundCurrNest) {
            end = i;
            foundCurrNest = true;
          }
        }
      }
    }
    return {start, end, bracket: open};
  }

  var concatNestedJSON = function(range, array) {
    var nestedJSON = '';
    for (var i = range.start; i <= range.end; i++) {
      nestedJSON += array[i];
      if (range.bracket === '{' && i < range.end) {
        nestedJSON += '":';
      } else if (range.bracket === '[' && i < range.end) {
        nestedJSON += ',';
      }
    }
    return nestedJSON;
  }

  var parsed;
  if (json.indexOf('[') < json.indexOf('{') && json.includes('[') || !json.includes('{')) {
    parsed = parseArray(json);
  } else {
    parsed = parseObj(json);
  }

  return parsed;
};
