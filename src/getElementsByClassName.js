// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className) {
  var elementsByClassName = [];
  var bodyClass = document.body.classList;
  var childNodes = document.body.childNodes;

  var pushElementsFromNodeList = function(nodeList) {
  	for (var elem of nodeList) {
  	  if (elem.classList !== undefined && elem.classList.contains(className)) {
  	  	elementsByClassName.push(elem);
  	  }
  	  pushElementsFromNodeList(elem.childNodes);
  	}
  }

  if (bodyClass.contains(className)) {
  	elementsByClassName.push($('body').addClass(className)[0]);
  }
  pushElementsFromNodeList(childNodes);

  return elementsByClassName;
};
