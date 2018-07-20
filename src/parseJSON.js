// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  console.log('--- ' + json)
  var parsed = 'default';
  
  var iterator = function(elem) {
    return elem.length > 0;
  }

  var parseArray = function(str) {
    var array = [];
    var separators = ['", "', '", ', ', "', ', ', ',', '"'];
    var elems = str.slice(1, -1);
    if (elems.length > 0) {
      elems = elems.split(new RegExp(separators.join('|'),'g')).filter(iterator);
      for (var elem of elems) {
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
      // separate by :
      string = string.split(':');
      string = string.map(cleanUpElem);

      // split for additional prop in object
      for (var i = 0; i < string.length; i++) {
        var commaIdx = string[i].indexOf(',');
        var quotIdx = string[i].lastIndexOf('"');
        if (quotIdx > commaIdx && commaIdx > 0){
          string.splice(i, 1, string[i].slice(0, commaIdx), string[i].slice(commaIdx + 1));
          i++;
        }
      }
      console.log(string)

      // check for nested objects
      var isNested = false;
      for (var elem of string) {
        if (elem.includes('{') || elem.includes('[')) {
          isNested = true;
        }
      }
      if (isNested) {
      // run nested search
        var start = 0;
        var end = string.length;
        var nestedString = '';
        for (var i = 0; i < string.length; i++) {
          if (string[i].includes('{') || string[i].includes('[')) {
            start = i;
          }
        }
        for (var i = string.length - 1; i >= 0 ; i--) {
          if (string[i].includes('}') || string[i].includes(']')) {
            end = i;
          }
        }
        for (var i = start; i <= end; i++) {
          nestedString += cleanUpElem(string[i]);
          if (i < end) {
            nestedString += '":"';
          }
        }
        if (nestedString.includes('{')) {
          string.splice(start, end - start + 1, parseObj(nestedString));
        } else {
          nestedString = nestedString.replace(':', ',')
          string.splice(start, end - start + 1, parseArray(nestedString));
        }
      }
      
      // find prop/val and add to obj
      for (var i = 0; i < string.length; i += 2) {
        prop = cleanUpElem(string[i])
        val = cleanUpVal(cleanUpElem(string[i+1]));
        obj[prop] = val;
      }

    }

    return obj;
  }

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
