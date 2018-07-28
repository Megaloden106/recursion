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
      } else if ( value.search(/\\/g) >= 0 ) {
        
      } else {
        value = value.replace(/^"|"$/g, '');      
      }
    }
    return value;
  }

  var combineNests = function(array) {
    var result = [];
    // for each element in array, look for brackets
    for ( var i = 0; i < array.length; i++ ) {
      if ( typeof array[i] === 'string' && array[i].search(/{|\[/g) >= 0 ) {
        var count = 0, end = -1, close;
        var open = array[i][array[i].search(/{|\[/g)];
        open === '{' ? close = '}' : close = ']';

        // if brackets, start is current index and find end
        for ( var j = i; j < array.length; j++ ) {
          for ( var char of array[j] ) {
            if ( char === open ) {
              count++;
            } else if ( char === close ) {
              count--;
              if ( count === 0 && end < 0 ) {
                end = j;
                break;
              }
            }
          }
          if ( end > 0 ) {
            break;
          }
        }

        // splice start to end with the parsed nested element
        if ( open === '{' ) {
          array.splice(i, end-i+1, parseJSON( array.slice(i, end+1).join(':') ) );
        } else if ( open === '[' ) {
          array.splice(i, end-i+1, parseJSON( array.slice(i, end+1).join(',') ) );
        }

        // stay on current index for nested loops
        i--;
      } else {
        // push element to result
        result.push(array[i]);
      }
    }

    return result;
  }

  json = json.trim();
  if ( json[0] === '[' ) {
    var result = [];
    if ( json.length > 2 ) {
      var vals = json.slice(1,-1).split(',');

      if ( json.slice(1,-1).search(/{|\[/g) >= 0 ) {
        vals = combineNests(vals);
      }

      for ( var elem of vals ) {
        result.push( eval(elem) )
      }
    }
    return result;
  }

  if ( json[0] === '{' ) {
    var result = {};
    if ( json.length > 2 ) {
      var props = json.slice(1,-1).split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)|:(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/g);

      if ( json.slice(1,-1).search(/{|\[/g) >= 0 ) {
        props = combineNests(props);
      }

      for ( var i = 0; i < props.length; i+=2 ) {
        result[eval(props[i])] = eval(props[i+1]);
      }
    }
    return result;
  }

};