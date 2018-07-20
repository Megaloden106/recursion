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
      string = nestedObjOrArray(string);
      
      // find prop/val and add to obj
      for (var i = 0; i < string.length; i += 2) {
        prop = cleanUpElem(string[i]);
        val = cleanUpVal(cleanUpElem(string[i+1]));
        obj[prop] = val;
      }
    }
    return obj;
  }

  var nestedObjOrArray = function(string) {
    var nestedElems = 0;
    for (var elem of string) {
      if (elem.includes('{') || elem.includes('[')) {
        nestedElems++;
      }
    }

    while (nestedElems > 0) {
      // run nested search
      var start = 0;
      var end = string.length;
      var nestedString = '';

      // find start and end
      for (var i = 0; i < string.length; i++) {
        if (typeof string[i] !== 'object' && (string[i].includes('{') || string[i].includes('['))) {
          start = i;
        }
      }
      for (var i = 0; i < string.length ; i++) {
        if (typeof string[i] !== 'object' && (string[i].includes('}') || string[i].includes(']'))) {
          end = i;
        }
      }

      // concat start to end entries into a new string
      for (var i = start; i <= end; i++) {
        nestedString += cleanUpElem(string[i]);
        if (i < end) {
          nestedString += '":"';
        }
      }

      // run new sting into the object or array parser
      if (nestedString.includes('{')) {
        string.splice(start, end - start + 1, parseObj(nestedString));
      } else {
        nestedString = nestedString.replace(':', ',')
        string.splice(start, end - start + 1, parseArray(nestedString));
      }
      nestedElems--;
    }
    return string;
  }

  // clean up elems from all the splits
  var cleanUpElem = function(string) {
    if(typeof string === 'string') {
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
      } 
    }
    return elem;
  }

  if (json.indexOf('[') < json.indexOf('{') && json.includes('[') || !json.includes('{')) {
    parsed = parseArray(json);
  } else {
    parsed = parseObj(json);
  }

  return parsed;
};
