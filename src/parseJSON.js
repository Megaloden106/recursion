// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  console.log('--- ' + json)
  var parsed = 'default';
  
  var iterator = function(elem) {
    return elem.length > 0;
  }

  var parseArray = function(string) {
    var array = [];

    // get rid of array brackets
    string = string.slice(1, -1);

    // check for emply array
    if (string.length > 0) {

      // separate by , and clean up entries
      string = string.split(',').map(cleanUpElem);

      // check for nested objects or arrays
      string = nestedObjOrArray(string);

      // add to output array
      for (var elem of string) {
        array.push(cleanUpVal(elem));
      }
    }
    // console.log('a-')
    // console.log(array)
    return array;
  }
  
  var parseObj = function(string) {
    var obj = {};
    var prop, val;

    // get rid of object brackets
    string = string.slice(1, -1);

    // check for empty object
    if (string.length > 0) {
      // separate by : and clean up entries
      string = string.split(':').map(cleanUpElem);

      // split for additional prop in object
      for (var i = 0; i < string.length; i++) {
        var commaIdx = string[i].indexOf(',');
        var quotIdx = string[i].lastIndexOf('"');
        if (quotIdx > commaIdx && commaIdx > 0){
          string.splice(i, 1, string[i].slice(0, commaIdx), string[i].slice(commaIdx + 1));
          i++;
        }
      }

      // check for nested objects or arrays
      string = nestedObjOrArray(string).map(cleanUpElem);
      
      // find prop/val and add to obj
      for (var i = 0; i < string.length; i += 2) {
        prop = string[i];
        val = cleanUpVal(string[i+1]);
        obj[prop] = val;
      }
    }
    // console.log('o-')
    // console.log(obj)
    return obj;
  }

  var nestedObjOrArray = function(objOrArray) {
    var nestedElems = 0;
    var isFindingEnd = false;
    var openBrack = '';
    var closeBrack = '';
    var brackCount = 0;
    for (var char of String(objOrArray)) {
      if (char === '{' && !isFindingEnd) {
        openBrack = '{';
        closeBrack = '}';
        isFindingEnd = true;
        brackCount++;
      } else if (char === '[' && !isFindingEnd) {
        openBrack = '[';
        closeBrack = ']';
        isFindingEnd = true;
        brackCount++;
      } else if (char === openBrack) {
        brackCount++;
      } else if (char === closeBrack) {
        brackCount--;
      }
      if (char === closeBrack && isFindingEnd && brackCount === 0) {
        nestedElems++;
        isFindingEnd = false;
      }
    }
    // console.log('--')
    // console.log(objOrArray)
    // console.log('n1-- ' + nestedElems)

    while (nestedElems > 0) {
      // run nested search
      var start = 0;
      var end = 0;
      var nestedString = '';
      openBrack = '';
      closeBrack = '';
      brackCount = 1;
      isEndFound = false;

      // find start and end
      // cycle through each element of the obj/array
      for (var i = 0; i < objOrArray.length; i++) {
        // check starting elem is not an object or array
        if (typeof objOrArray[i] !== 'object') {
          // find first opening instance of array or object brackets
          for (var char of objOrArray[i]) {
            if (openBrack.length < 1 && (char ==='{' || char === '[')) {
              // set open/close brackets and starting index
              openBrack = char;
              start = i;
              if (char ==='{') {
                closeBrack = '}';
              } else {
                closeBrack = ']';                
              }
            } else if (char === openBrack) {
              // count brackets
              brackCount++;
            } else if (char === closeBrack) {
              brackCount--;
            }

            // look for corresponding closing brackets
            if (brackCount === 0 && !isEndFound) {
              end = i;
              isEndFound = true;
            }
          }
        }
      }

      // concat start to end entries into a new string
      if (openBrack === '{') {
        for (var i = start; i <= end; i++) {
          nestedString += objOrArray[i];
          if (i < end) {
            nestedString += '":"';
          }
        }
      } else {
        for (var i = start; i <= end; i++) {
          nestedString += objOrArray[i];
          if (i < end) {
            nestedString += '","';
          }
        }
      }
      // console.log('ns-- ' + start)
      // console.log('ne-- ' + end)
      // console.log('nstr-- ' + nestedString)
      // console.log('pnstr-- ' + parseArray(nestedString))

      // run new sting into the object or array parser
      if (nestedString.indexOf('}') > nestedString.indexOf(']') && nestedString.indexOf('{') >= 0) {
        objOrArray.splice(start, end - start + 1, parseObj(nestedString));
      } else {
        objOrArray.splice(start, end - start + 1, parseArray(nestedString));
      }
      nestedElems--;
    // console.log('n2-- ' + nestedElems)
    }
    return objOrArray;
  }

  // clean up elems from all the splits
  var cleanUpElem = function(string) {
    if(typeof string === 'string' && !string.includes('\\')) {
      var start = 0;
      var end = string.length;
      while (string[start] === '"' || string[start] === ' ') {
        start++;
      }
      while ((string[end] === '"' || string[end] === ' ' || string[end] === undefined) && end > start) {
        end--;
      }
      string = string.slice(start, end + 1);
    } 
    return string;
  }

  // clean up values that are non-string
  var cleanUpVal = function(elem) {
    if (typeof elem === 'string') {
      if (elem === undefined) {
        elem = '';
      } else if (elem.includes('true')) {
        elem = true;
      } else if (elem.includes('false')) {
        elem = false;
      } else if (elem.includes('null')) {
        elem = null;
      } else if (elem.search(/[1234567890]/) >= 0) {
        elem = Number(elem);
      } else if (elem.includes('\\')) {
        elem = cleanBackslash(elem);
      }
    }
    return elem;
  }

  var cleanBackslash = function(elem) {
    chars = String(elem).split('');
    for (var i = 0; i < chars.length; i++) {
      if (chars[i] === '\\') {
        chars.splice(i, 1);
      }
    }
    return chars.join('').slice(1, -1);
  }

  if (json.indexOf('[') < json.indexOf('{') && json.includes('[') || !json.includes('{')) {
    parsed = parseArray(json);
  } else {
    parsed = parseObj(json);
  }

  return parsed;
};
