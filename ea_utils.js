/*
 * Script Name: ea_utils
 * Author: Jiri Luzny
 * Purpose: library for other scripts
 * Date: 1.6.2017
 * version 2
 */

"use strict";

var DEBUG = false;
var ENV_SPARX = false;

//-- Language patches -------------
if (typeof (Array.prototype.indexOf) === 'undefined') {
  Array.prototype.indexOf = function (item, start) {
    var length = this.length;
    start = typeof (start) !== 'undefined' ? start : 0;
    for (var i = start; i < length; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  }
}

function _ea_utils() {
  info("ea_utils initialization started");
  if (typeof WScript === 'object') {
    ENV_SPARX = false;
    info("Running Environment: Standalone, CScript");
  } else {
    ENV_SPARX = true;
    info("Running Environment: Sparx EA embedded");
  }
  debug("ENV_SPARX=" + ENV_SPARX);
  info("ea_utils initiated");
}

function getActualISODate() {
  var date = new Date();
  return date
}

function log(msg) {
  msg = "[" + getActualISODate() + "] " + msg;
  if (typeof WScript === 'object') {
    return WScript.Echo(msg);
  } else {
    return Session.Output(msg);
  }
}

function debug(msg) {
  if (DEBUG) {
    log("[DEBUG] " + msg);
  }
}

var info = function (msg) {
  log("[INFO] " + msg);
};


function warn(msg) {
  log("[WARN] " + msg);
}


function error(msg) {
  log("[ERROR] " + msg);
}


function findAllElements(root, deep) {
  var currentElement, currentPackage, elements, foundElement, foundElements, i, packages;
  elements = root.Elements;
  foundElements = [];
  if (elements) {
    i = 0;
    while (i < elements.Count) {
      currentElement = elements.GetAt(i);
      foundElement = currentElement;
      foundElements.push(foundElement);
      debug("Added element: '" + foundElement.Name + "'");
      foundElements = foundElements.concat(findAllElements(currentElement, deep));
      i += 1;
    }
    if (deep) {
      packages = root.Packages;
      if (packages) {
        i = 0;
        while (i < packages.Count) {
          currentPackage = packages.GetAt(i);
          debug("Traversing in: '" + currentPackage.Name + "'");
          foundElements = foundElements.concat(findAllElements(currentPackage, deep));
          i += 1;
        }
      }
    }
  }
  return foundElements;
}

/** 
 * Dump function. Textual representation of objects and array. 
 * TODO: Issue with nested objects. Are not displayed ....
 */
String.prototype.repeat = function (num) {
  if (num < 0) {
    return '';
  } else {
    return new Array(num + 1).join(this);
  }
};

function is_defined(x) {
  return typeof x !== 'undefined';
}

function is_object(x) {
  return Object.prototype.toString.call(x) === "[object Object]";
}

function is_array(x) {
  return Object.prototype.toString.call(x) === "[object Array]";
}

//Main
function xlog(v, label) {
  var tab = 0;

  var rt = function () {
    return '    '.repeat(tab);
  };

  // Log Fn
  var lg = function (x) {
    // Limit
    if (tab > 10) return '[...]';
    var r = '';
    if (!is_defined(x)) {
      r = '[VAR: UNDEFINED]';
    } else if (x === '') {
      r = '[VAR: EMPTY STRING]';
    } else if (is_array(x)) {
      r = '[\n';
      tab++;
      for (var k in x) {
        r += rt() + k + ' : ' + lg(x[k]) + ',\n';
      }
      tab--;
      r += rt() + ']';
    } else if (is_object(x)) {
      r = '{\n';
      tab++;
      for (var k in x) {
        r += rt() + k + ' : ' + lg(x[k]) + ',\n';
      }
      tab--;
      r += rt() + '}';
    } else {
      r = x;
    }
    return r;
  };

  // Space
  return label + ':\n' + lg(v);
};


function findAllRelatedElements(eaRepository, element, maxDepth, foundElements, currentDepth) {
  var connectors, currentConnector, foundElement, i;
  debug("Finding related elements for: '" + element.Name + "'. Current depth =" + currentDepth);

  if (!currentDepth) {
    currentDepth = 1;
  } else if (currentDepth >= maxDepth) {
    return foundElements;
  } else {
    currentDepth = currentDepth + 1;
  }

  connectors = element.Connectors;
  if (!foundElements) foundElements = [];
  if (connectors) {
    debug("Number of connectors=" + connectors.Count)
    i = 0;
    while (i < connectors.Count) {
      currentConnector = connectors.GetAt(i);
      foundElements = findAllRelatedElements_add(eaRepository, element, eaRepository.GetElementByID(currentConnector.SupplierID), foundElements, maxDepth, currentDepth);
      foundElements = findAllRelatedElements_add(eaRepository, element, eaRepository.GetElementByID(currentConnector.ClientId), foundElements, maxDepth, currentDepth);
      i += 1;
    }
  }
  return foundElements;
}


function findAllRelatedElements_add(eaRepository, element, foundElement, foundElements, maxDepth, currentDepth) {
  if (!isElementInArray(foundElement, foundElements)) {
    foundElements.push(foundElement);
    debug("Added element: '" + foundElement.Name + "'");
    foundElements = findAllRelatedElements(eaRepository, foundElement, maxDepth, foundElements, currentDepth);
  }
  return foundElements;
}


function isElementInArray(element, elements) {
  for (i = 0; i < elements.length; i += 1) {
    currentElement = elements[i];
    if (element.ElementID === currentElement.ElementID) {
      return true;
    }
  }
  return false;
}


_ea_utils();