// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {

  var parseArray = function(json) {
    var arr = [];
    // remove bracket
    json = json.trim().slice(1, -1);

    // populate array
    if (json.length > 0) {
      // seperate elems by ,
      var elems = json.split(',').map(checkQuotSyntax).map(cleanElem);
      // check for nested elem
      elems = checkNesting(elems);
      for (var elem of elems) {
        arr.push(getVal(elem));
      }
    }
    return arr;
  }
  
  var parseObj = function(json) {
    var obj = {};
    var prop, val;
    // seperate prop and val by ":
    var propsAndVals = json.trim().slice(1, -1).split(/":|"\s:/g);

    if (propsAndVals.length > 1) {
      // seperate prop and val sets by ,
      propsAndVals = findPropValPair(propsAndVals);
      // check for nested elem
      propsAndVals = checkNesting(propsAndVals).map(checkQuotSyntax).map(cleanElem);
      // populate the object
      for (var i = 0; i < propsAndVals.length; i += 2) {
        obj[propsAndVals[i]] = getVal(propsAndVals[i + 1]);
      }
    }
    return obj;
  }

  var checkNesting = function(array) {
    var totalNests = findCurrLevNests(array);

    while (totalNests > 0) {
      var range = findNestIndices(array);
      var nestedJSON = concatNestedJSON(range, array);
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
    if (typeof elem === 'string') {
      // remove starting brackets and quots
      elem = elem.trim();
      if (elem.search(/^"\d|\d"$/g) < 0) {
        elem = elem.split(/^"|"$|"\s$/g).join('');
      }
    }
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
    for (var i = 1; i < json.length; i++) {
      var isInQuots = false;
      var isFound = false;
      for (var j = 0; j < json[i].length; j++) {
        if (json[i][j] === '\"' || json[i][j] === '\'') {
          isInQuots = !isInQuots;
        }
        if (!isInQuots && json[i][j] === ',' && !isFound) {
          json.splice(i, 1, json[i].slice(0, j), json[i].slice(j + 1));
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

  var checkQuotSyntax = function(elem) {
    if (typeof elem !== 'object' && elem.search(/\\"$/g) >= 0) {
      throw SyntaxError('SyntaxError');
    }
    return elem;
  }

  var parsed;
  var firstChar = json.trim()[0];
  var lastChar = json.trim()[json.length - 1];
  if ((firstChar === '[' && lastChar !== ']') || (firstChar !== '[' && lastChar === ']')) {
    throw SyntaxError('SyntaxError');
  } else if (json.indexOf('[') < json.indexOf('{') && json.includes('[') || !json.includes('{')) {
    parsed = parseArray(json);
  } else if (json.indexOf('{') < json.indexOf('[') && json.includes('{') || !json.includes('[')) {
    parsed = parseObj(json);
  }

  return parsed;
};
