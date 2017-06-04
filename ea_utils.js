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

function _main()
{
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
      if (!currentElement.Locked()) {
        foundElements.push(foundElement);
        debug("Added element: '" + foundElement.Name + "'");
        foundElements = foundElements.concat(findAllElements(currentElement, deep));
      }
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


_main();