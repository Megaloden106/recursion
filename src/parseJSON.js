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
    console.log(array);
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