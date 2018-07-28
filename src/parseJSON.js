// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  console.log('--- ' + json)

  var eval = function(value) {
    if ( value && typeof value !== 'object' ) {
      value = value.trim();
      if ( value === 'null' ) {
        value = null;
      } else if ( value === 'true' ) {
        value = true;
      } else if ( value === 'false' ) {
        value = false;
      } else if ( value.search(/\d/g) >= 0 && !isNaN( Number(value) ) ) {
        value = Number(value);
      } else {
        value = value.replace(/^"|"$/g, '');      
      }
    }
    return value;
  }

  var combineNests = function(array) {
    var result = [];
    var end = 0, count = 0;
    console.log(array);
    // for each element in array, look for brackets
    for ( var i = 0; i < array.length; i++ ) {
      if ( array[i].search(/{|\[/g) >= 0 ) {
        // if brackets, start is current index and find end
        for ( var j = i; j < array.length; j++ ) {
          for ( var char of array[j] ) {
            if ( char === '[' || char === '{' ) {
              count++;
            } else if ( char === ']' || char === '}' ) {
              count--;
              if ( count === 0 ) {
                end = j;
                break;
              }
            }
          }
        }
        // concat nested elements
        var nestedJSON = '';
        console.log(i)
        console.log(end)

        // splice start to end with the parsed nested element
        // array.splice(i, end-i+1, parseJSON());

        // stay on current index for nested loops
        // i--;
      } else {
        // push element to result
        result.push(elem);
      }
    }

    return array;
  }

  json = json.trim();
  if ( json[0] === '[' ) {
    var result = [];
    if ( json.length > 2 ) {
      var vals = json.slice(1,-1).split(',');
      for ( var elem of vals ) {
        result.push( eval(elem) )
      }
    }
    return result;
  }

  if ( json[0] === '{' ) {
    var result = {};
    if ( json.length > 2 ) {
      var props = json.slice(1,-1).split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)|:/g);

      if ( json.search(/{|\[/g) >= 0 ) {
        props = combineNests(props);
      }

      for ( var i = 0; i < props.length; i+=2 ) {
        result[eval(props[i])] = eval(props[i+1]);
      }
    }
    return result;
  }

};


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