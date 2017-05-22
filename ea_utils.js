/*
 * Script Name: ea_utils
 * Author: luzny
 * Purpose: library for other scripts
 * Date: 10.10.2014
 * version 1
 */


/*jslint node: true */
"use strict";

//-- cscript import ------------------------------------------------------------------
//var ActiveXObject, GetObject;
//eval(new ActiveXObject("Scripting.FileSystemObject").OpenTextFile("ea_utils.js", 1).ReadAll());
//-- or node import ---------------------------------------------------------------------------
//var info = require('./utils').info;
//info("test");
// ---------------------------------
var DEBUG = true;

function log(msg) {
  if (typeof WScript === 'object') {
    return WScript.Echo(msg);
  } else {
    return Session.Output(msg);
  }
}
//---------------------------------

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


//------------
function queryElementsByName(eaRep, query, type) {
  var i, foundElements = [],
    result, element;
  result = eaRep.GetElementsByQuery("Element Name", query);
  for (i = 0; i < result.Count; i += 1) {
    element = result.GetAt(i);
    if (element.Type === type) {
      debug("Found element: '" + element.Name + "'");
      foundElements.push(eaRep.GetPackageByGuid(element.ElementGUID));
    }
  }
  return foundElements;
}


function findPackageByName(root, name, deep) {
  var returnPackage, packages, i, package_name;
  packages = root.Packages;
  for (i = 0; i < packages.Count; i += 1) {
    package_name = packages.GetAt(i).name;
    debug("Traversing: '" + package_name + "'");
    if (package_name === name) {
      returnPackage = packages.GetAt(i);
      log("Found package: '" + returnPackage.Name + "'");
    } else {
      if (deep) {
        returnPackage = findPackageByName(packages.GetAt(i), name, true);
      }
    }
    if (returnPackage) {
      break;
    }
  }
  return returnPackage;
}

//- Elements ------------------------------------------------------------------------------------
function findElementByName(root, name, type, deep) {
  var returnElement, elements, i, currentElement, packages, currentPackage;
  elements = root.Elements;
  for (i = 0; i < elements.Count; i += 1) {
    currentElement = elements.GetAt(i);
    if (currentElement.Name === name && currentElement.Type === type) {
      returnElement = currentElement;
      log("Found element: '" + returnElement.Name + "'");
      break;
    }
  }
  if (!returnElement && deep) {
    packages = root.Packages;
    for (i = 0; i < packages.Count; i += 1) {
      currentPackage = packages.GetAt(i);
      debug("Traversing in: '" + currentPackage.Name + "'");
      if (deep) {
        returnElement = findElementByName(currentPackage, name, type, true);
      }
    }
  }
  return returnElement;
}


function findAllElementsByType(root, type, deep) {
  var currentElement, currentPackage, elements, foundElement, foundElements, i, packages;
  if (!isPackageWritable(root)) {
    warn("Package " + root.Name + " is not writable");
    return false;
  }
  elements = root.Elements;
  foundElements = [];
  if (elements) {
    i = 0;
    while (i < elements.Count) {
      currentElement = elements.GetAt(i);
      if (currentElement.Type === type) {
        foundElement = currentElement;
        foundElements.push(foundElement);
        debug("Adding element: '" + foundElement.Name + "'");
        foundElements = foundElements.concat(findAllElementsByType(currentElement, type, deep));
      }
      i += 1;
    }
    if (deep) {
      packages = root.Packages;
      if (packages) {
        i = 0;
        while (i < packages.Count) {
          currentPackage = packages.GetAt(i);
          if (isPackageWritable(currentPackage)) {
            debug("Traversing in: '" + currentPackage.Name + "'");
            foundElements = foundElements.concat(findAllElementsByType(currentPackage, type, deep));
            i += 1;
          } else {
            warn("Package " + root.Name + " is not writable");
          }
        }
      }
    }
  }
  return foundElements;
}


function findAllPackages(root, deep) {
  if (!isPackageWritable(root)) {
    warn("Package " + root.Name + " is not writable");
    return null;
  }
  var packages = root.Packages;
  var foundPackages = [];
  if (packages) {
    var i = 0;
    while (i < packages.Count) {
      var currentPackage = packages.GetAt(i);
      var foundPackage = currentPackage;
      if (isPackageWritable(currentPackage)) {
        foundPackages.push(foundPackage);
        debug("Added package: '" + foundPackage.Name + "'");
        if (deep) {
          foundPackages = foundPackages.concat(findAllPackages(currentPackage, deep));
        }
      } else {
        warn("Package " + currentPackage + " is not writable");
      }
      i += 1;
    }
  }
  return foundPackages;
}


function findAllElements(root, deep) {
  var currentElement, currentPackage, elements, foundElement, foundElements, i, packages;
  if (!isPackageWritable(root)) {
    warn("Package " + root.Name + " is not writable");
    return false;
  }
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
          if (isPackageWritable(currentPackage)) {
            debug("Traversing in: '" + currentPackage.Name + "'");
            foundElements = foundElements.concat(findAllElements(currentPackage, deep));
            i += 1;
          } else {
            warn("Package " + root.Name + " is not writable");
          }
        }
      }
    }
  }
  return foundElements;
}


//-- Diagrams -----------------------------------------------------------------
function findDiagramByName(root, name, deep) {
  var returnDiagram, diagrams, i, packages, currentPackage;
  diagrams = root.Diagrams;
  for (i = 0; i < diagrams.Count; i += 1) {
    if (diagrams.GetAt(i).Name === name) {
      returnDiagram = diagrams.GetAt(i);
      log("Found diagram: '" + returnDiagram.Name + "'");
      break;
    }
  }
  if (!returnDiagram && deep) {
    packages = root.Packages;
    for (i = 0; i < packages.Count; i += 1) {
      currentPackage = packages.GetAt(i);
      debug("Traversing in: '" + currentPackage.Name + "'");
      if (deep) {
        returnDiagram = findDiagramByName(currentPackage, name, true);
      }
    }
  }
  return returnDiagram;
}


//-- Connectors -----------------------------------------------------------------
function deleteConnectorsByType(element, connectorType) {
  var i, connectors, connector;
  connectors = element.Connectors;
  for (i = 0; i < connectors.Count; i += 1) {
    connector = connectors.GetAt(i);
    if (connector.Type === connectorType) {
      debug("Deleting connector: " + connector.ClientId + " -> " + connector.SupplierId + " (" + connector.Type + ")");
      connectors.Delete(i);
    }
  }
}


//-----------------------------------------------------------------------------
function deleteConnectorsBySupplier(element, supplierId) {
  var i, connectors, connector;
  var result = false;
  connectors = element.Connectors;
  for (i = 0; i < connectors.Count; i += 1) {
    connector = connectors.GetAt(i);
    if (connector.SupplierId === supplierId) {
      debug("Deleting connector: " + connector.ClientId + " -> " + connector.SupplierId + " (" + connector.Type + ")");
      connectors.Delete(i);
      result = true;
    }
  }
  debug("Connector for supplier ID " + supplierId + " not found!");
  return result;
}


//-----------------------------------------------------------------------------
function deleteConnectorsByClientIDandType(element, clientId, type) {
  var i, connectors, connector;
  var result = false;
  connectors = element.Connectors;
  for (i = 0; i < connectors.Count; i += 1) {
    connector = connectors.GetAt(i);
    if (connector.ClientId === clientId && connector.Type == type) {
      debug("Deleting connector: " + connector.ClientId + " -> " + connector.SupplierId + " (" + connector.Type + ")");
      connectors.Delete(i);
      result = true;
    }
  }
  //debug("Connector for supplier ID " + supplierId + " not found!");
  return result;
}



//-----------------------------------------------------------------------------
function splitBiDirectionalConnectors(eaRepository, element) {
  var i, connectors, connector;
  var result = false;
  connectors = element.Connectors;
  for (i = 0; i < connectors.Count; i += 1) {
    connector = connectors.GetAt(i);
    if (connector.Direction === "Bi-Directional" && element.ElementID === connector.ClientID) {
      var reversedElement = eaRepository.GetElementByID(connector.SupplierID);
      connector.Direction = "Source -> Destination";
      connector.Update();
      info("Split Bi-Directional '" + connector.Type + "' connector between: '" + element.Name + "' -> '" + reversedElement.Name + "'");

      var reversedConnector = reversedElement.Connectors.AddNew("", connector.Stereotype);
      reversedConnector.SupplierID = element.ElementID;
      reversedConnector.Direction = connector.Direction;
      reversedConnector.Color = connector.Color;
      reversedConnector.Name = connector.Name;
      reversedConnector.Notes = connector.Notes;
      reversedConnector.Update();
      result = true;
      info("Added connector '" + connector.Type + "' between: '" + reversedElement.Name + "' -> '" + element.Name + "'");
    }
  }
  return result;
}


//-----------------------------------------------------------------------------
function transformStereotypeOfConnectors(eaRepository, element, oldStereotypes, newStereotype, textToNotes) {
  var i, connectors;
  var result = false;
  connectors = element.Connectors;
  for (i = 0; i < connectors.Count; i += 1) {
    var connector = connectors.GetAt(i);
    if (connector.ClientID === element.ElementID) {
      var stereotype = connector.Stereotype;
      if (stereotype.length > 0 && oldStereotypes.indexOf(stereotype) > 0) {
        var notes = connector.Notes;
        if (notes.length > 0) notes = notes + "\r\n\r\n";
        connector.Notes = notes + textToNotes;
        connector.Stereotype = newStereotype;
        connector.Update();
        info("Transfromed stereotype '" + stereotype + "' of '" + connector.Type + "' connector in '" + element.Name + "' element into notes.");
      }
    }
  }
  return result;
}


//-----------------------------------------------------------------------------
function changeParentForElementsInPackage(eaRepository, pckg, oldParentId, newParentId) {
  var pckg, i, elements, element, connection;
  info("Processing package: " + pckg.Name);

  elements = findAllElementsByType(pckg, "Component", true);
  for (i = 0; i < elements.length; i += 1) {
    element = elements[i];
    info("Processing element: " + element.Name);
    if (deleteConnectorsBySupplier(element, oldParentId)) {
      connection = element.Connectors.AddNew("", "Generalization");
      connection.SupplierID = newParentId;
      connection.Update();
    }
  }
  return "FINISHED";
}

//-----------------------------------------------------------------------------
function addParentForElementsInPackage(eaRepository, pckg, newParentId) {
  var pckg, i, elements, element, connection;
  info("Processing package: " + pckg.Name);

  elements = findAllElementsByType(pckg, "Component", true);
  for (i = 0; i < elements.length; i += 1) {
    element = elements[i];
    info("Processing element: " + element.Name);

    connection = element.Connectors.AddNew("", "Generalization");
    connection.SupplierID = newParentId;
    connection.Update();

  }
  return "FINISHED";
}

//-----------------------------------------------------------------------------
function removeParentForElementsInPackage(eaRepository, pckg, oldParentId) {
  var elements, element, connection;
  info("Processing package: " + pckg.Name);

  elements = findAllElementsByType(pckg, "Component", true);
  for (i = 0; i < elements.length; i += 1) {
    element = elements[i];
    info("Processing element: " + element.Name);
    deleteConnectorsBySupplier(element, oldParentId);
  }
  return "FINISHED";
}


//-----------------------------------------------------------------------------
function removeChildForElementsInPackage(eaRepository, pckg) {
  var i, elements, element, connection;
  info("Processing package: " + pckg.Name);

  elements = findAllElementsByType(pckg, "Component", true);
  for (i = 0; i < elements.length; i += 1) {
    element = elements[i];
    info("Processing element: " + element.Name);
    deleteConnectorsBySupplier(element, element.elementID);
  }
  return "FINISHED";
}

//-----------------------------------------------------------------------------
function hasParent(element) {

  var connectors, connector, parent;
  parent = false;
  connectors = element.Connectors;
  for (var i = 0; i < connectors.Count; i += 1) {
    connector = connectors.GetAt(i);
    if ((connector.Type === "Generalization") && (connector.ClientID === element.ElementID)) {
      parent = true;
      info("Parent found");
    }
  }
  return parent;
}

//-----------------------------------------------------------------------------
function getParent(eaRepository, element) {

  var connectors, connector, parent;
  connectors = element.Connectors;
  for (var i = 0; i < connectors.Count; i += 1) {
    connector = connectors.GetAt(i);
    if ((connector.Type === "Generalization") && (connector.ClientID === element.ElementID)) {
      parent = eaRepository.GetElementByID(connector.SupplierID);
    }
  }
  return parent;
}


//-----------------------------------------------------------------------------
function moveTaggedValues(child, parent) {
  var i, taggedValue;
  var taggedValues = parent.TaggedValues;
  for (i = 0; i < taggedValues.Count; i++) {
    taggedValue = taggedValues.GetAt(i);
    debug("Tagged value: " + taggedValue.Name);
    taggedValue.ElementID = child.elementID;
    taggedValue.Update();
  }
}


//-----------------------------------------------------------------------------
function renameTVName(element, originTagName, newTagName) {
  debug("Going to replace tag name in element: " + element.Name + " - " + originTagName + " -> " + newTagName);
  var i, taggedValue, ret;
  var taggedValues = element.TaggedValues;
  for (i = 0; i < taggedValues.Count; i++) {
    taggedValue = taggedValues.GetAt(i);
    debug("Checking Tag name: " + taggedValue.Name + " with value: " + taggedValue.Value);
    if (taggedValue.Name === originTagName) {
      taggedValue.Name = newTagName;
      ret = taggedValue.Update();
      element.TaggedValues.Refresh();
      info("Renamed tagged value name in element " + element.Name + ": " + originTagName + " -> " + newTagName);
    }
  }
  return ret;
}


//-----------------------------------------------------------------------------
function changeTVValue(element, tvName, originTagValue, newTagValue) {
  debug("Going to replace tag value in element: " + element.Name + " - " + originTagValue + " -> " + newTagValue);
  if (originTagValue !== newTagValue) {
    var i, ret;
    var tags = element.TaggedValues;
    for (i = 0; i < tags.Count; i++) {
      var tag = tags.GetAt(i);
      if (tag.Name === tvName) {
        if (tag.Value === originTagValue) {
          tag.Value = newTagValue;
          ret = tag.Update();
          info("Renamed tagged value " + tvName + " of element " + element.Name + ": " + originTagValue + " -> " + newTagValue);
        }
      }
    }
    return ret;
  } else {
    return -1;
  }
}


//-----------------------------------------------------------------------------
function addTV(element, tvName, tvValue) {
  debug("Adding TV in element name :" + element.Name + " a new tag " + tvName + " with value " + tvValue);
  var i, taggedValue, ret;

  var taggedValues = element.TaggedValues;
  for (i = 0; i < taggedValues.Count; i++) {
    taggedValue = taggedValues.GetAt(i);
    if (taggedValue.Name === tvName) {
      debug("Element has contained the same tag. No adding.");
      return 0;
    }
  }
  var t = taggedValues.AddNew(tvName, tvValue);
  ret = t.Update;
  info("Added new tagged value in element " + element.Name + ": " + tvName + "=" + tvValue);
  return ret;
}


//-----------------------------------------------------------------------------
function createOrChangeTV(element, tvName, tvValue) {
  debug("Setting tagged value in element: " + element.Name + ": " + tvName + ":" + tvValue);
  var i, ret = 0;
  var tvs = element.TaggedValues;
  for (i = 0; i < tvs.Count; i++) {
    tv = tvs.GetAt(i);
    if (tv.Name === tvName) {
      return changeTVValue(element, tvName, tv.Value, tvValue);
    }
  }
  if (ret === 0) {
    return addTV(element, tvName, tvValue);
  }
}



//-----------------------------------------------------------------------------
function getTVValue(element, tvName) {
  var value = null;
  var taggedValues = element.TaggedValues;
  for (var i = 0; i < taggedValues.Count; i++) {
    var taggedValue = taggedValues.GetAt(i);
    debug("Checking Tag name: " + taggedValue.Name + " with value: " + taggedValue.Value);
    if (taggedValue.Name === tvName) {
      value = taggedValue.Value;
      debug("Reading Tag name: " + taggedValue.Name + " with value: " + taggedValue.Value);
      break;
    }
  }
  return value;
}


//-----------------------------------------------------------------------------
function moveTVValueToNotes(element, tvName) {
  var value = null;
  var taggedValues = element.TaggedValues;
  for (var i = 0; i < taggedValues.Count; i++) {
    var taggedValue = taggedValues.GetAt(i);
    debug("moveTVValueToNotes checking  element: " + element.Name + ", : tag name: " + taggedValue.Name + " with value: " + taggedValue.Value);
    if (taggedValue.Name === tvName) {
      value = taggedValue.Value;
      if (value.length > 0 && value != "<memo>") {
        taggedValue.Value = "<memo>";
        taggedValue.Notes = value;
        taggedValue.Update();
        info("Moved value to notes of element:" + element.Name + ", tag name: " + taggedValue.Name + " with value: " + taggedValue.Notes);  
      }
      break;
    }
  }
  return "SUCCESS";
}


//-----------------------------------------------------------------------------
function deleteTaggedValues(element, tvNames) {
  var ret = 0;
  var tvs = element.TaggedValues;
  for (var i = 0; i < tvs.Count; i += 1) {
    tv = tvs.GetAt(i);
    tvName = tv.Name;
    debug(tvName + ":" + i + ":" + tvNames.indexOf(tvName));
    if (tvNames.indexOf(tvName) >= 0) {
      info("Deleting tagged value in element: " + element.Name + ": " + tvName);
      element.TaggedValues.DeleteAt(i, false);
      ret += 1;
    }
  }
  if (ret > 0) element.Update();
  return ret;
}


//-----------------------------------------------------------------------------
function validateTVValues(element, validationFile, removeInvalid) {
  var xmlDoc = new ActiveXObject("Msxml2.DOMDocument.6.0");
  xmlDoc.async = false;
  xmlDoc.load(validationFile);
  if (xmlDoc.parseError.errorCode !== 0) {
    var myErr = xmlDoc.parseError;
    error("You have error: " + myErr.reason);
  }

  var taggedValue;
  var taggedValues = element.TaggedValues;
  for (var i = 0; i < taggedValues.Count; i++) {
    var valid = true;
    taggedValue = taggedValues.GetAt(i);
    var rows = xmlDoc.getElementsByTagName("DataRow");
    var values;
    for (var y = 0; y < rows.length; y++) {
      var row = rows.item(y);
      var name = row.childNodes.item(0).attributes.item(1).nodeValue;
      if (taggedValue.Name === name) {
        values = row.childNodes.item(1).attributes.item(1).nodeValue;
        debug("Validating tagged value of element '" + element.Name + "': '" + taggedValue.Name + "=" + taggedValue.Value + "', using TV definition: '" + values + "'");
        if (values.indexOf("Type=Enum") >= 0) {
          valid = (values.indexOf(taggedValue.Value + ',') >= 0);
        } else if (values.indexOf("Type=Integer") >= 0 || values.indexOf("Type=Spin") >= 0) {
          valid = (/^\+?(0|[1-9]\d*)$/.test(taggedValue.Value));
        }
      }
    }
    if (valid) {
      debug("Sucesfull validation of tagged value in element '" + element.Name + "': '" + taggedValue.Name + "=" + taggedValue.Value + "'");
    } else {
      warn("Failed validation of tagged value in element '" + element.Name + "': '" + taggedValue.Name + "=" + taggedValue.Value + "', using TV definition: '" + values + "'");
      if (removeInvalid) {
        element.TaggedValues.DeleteAt(i, false);
        warn("Deleted invalid tagged value in element '" + element.Name + "': '" + taggedValue.Name + "=" + taggedValue.Value + "'");
        element.Update();
      }
    }
  }
}


//-----------------------------------------------------------------------------
function mergeParentsTaggedValues(element, eaRepository) {
  var parent = getParent(eaRepository, element);
  if (parent) {
    var parentsTaggedValues = getTraversedTaggedValues(eaRepository, parent);
    for (var parentsTaggedValue in parentsTaggedValues) {
      addTV(element, parentsTaggedValue, parentsTaggedValues[parentsTaggedValue]);
    }
  }
}


function getTraversedTaggedValues(eaRepository, element) {
  debug("getTravesedTaggedValues: element " + element.Name);
  var traversedTaggedValues = {};
  var taggedValues = element.TaggedValues;
  for (var y = 0; y < taggedValues.Count; y++) {
    var taggedValue = taggedValues.GetAt(y);
    if (!traversedTaggedValues.hasOwnProperty(taggedValue.Name)) {
      traversedTaggedValues[taggedValue.Name] = taggedValue.Value;
    }
  }
  var parent = getParent(eaRepository, element);
  if (parent) {
    var parentTraversedTaggedValues = getTraversedTaggedValues(eaRepository, parent);
    for (var parentTraversedTaggedValue in parentTraversedTaggedValues) {
      if (!traversedTaggedValues.hasOwnProperty(parentTraversedTaggedValue)) {
        if (parentTraversedTaggedValues[parentTraversedTaggedValue].length > 0) {
          traversedTaggedValues[parentTraversedTaggedValue] = parentTraversedTaggedValues[parentTraversedTaggedValue];
        }
      }
    }
  }
  return traversedTaggedValues;
}


//-----------------------------------------------------------------------------
function getColor(eaRepository, xelement, diagramID) {
  var select = "Select ObjectStyle from t_diagramobjects where Object_ID=" + xelement.elementID + "AND Diagram_ID=" + diagramID;
  var response = eaRepository.SQLQuery(select);
  //debug (response);

  var position = response.indexOf("BCol");
  var xcolor;
  if (position > 0) {
    var preresult = response.substr(position);
    //debug(preresult);
    var result = preresult.split(";");
    //debug(result[0]);
    xcolor = result[0].substr(5);
  } else xcolor = 0;
  debug(xelement.Name + ";" + xcolor);

  return xcolor;
}


//-----------------------------------------------------------------------------
function updateStereoTypeOnLocalApp(eaRepository, element, stereotype) {
  debug('################################################');
  debug('#');
  debug('# Try to update stereotype on this element: ' + element.ElementGUID + " : " + element.Name);
  debug('# Actual Sterotype: ' + element.Stereotype);

  // get parrent to distinguish local application
  // it gets ID of local application parent 
  var parent = getParent(eaRepository, element);
  var ret;
  debug("# Parent GUID: " + parent.ElementGUID);
  if (parent.ElementGUID === '{2F1E955A-63DE-4bff-8A52-AA033717FD51}') {
    debug("# Updating: " + parent.ElementGUID);
    //debug(element.Phase);
    element.Stereotype = stereotype;
    debug("# New stereotype: " + element.Stereotype);
    ret = element.Update;
  }
  return ret;
}

//-----------------------------------------------------------------------------
function updatePhaseOnApp(eaRepository, element, phase) {
  debug('################################################');
  debug('#');
  debug('# Try to update phase on this element: ' + element.ElementGUID + " : " + element.Name);
  debug('# Actual Phase: ' + element.Phase);

  var ret;
  debug("# Updating ...");
  //debug(element.Phase);
  element.Phase = phase;
  debug("# New phase: " + element.Phase);
  ret = element.Update;
  return ret;
}


//-----------------------------------------------------------------------------
function isPackageWritable(pckg) {
  debug("Package " + pckg.Name + " version control status: " + pckg.VersionControlGetStatus);
  if ((_ref = pckg.VersionControlGetStatus) !== 1 && _ref !== 5) {
    return true;
  } else {
    return false;
  }
}


//-----------------------------------------------------------------------------
function changeStereotype(element, newStereotype) {
  debug('Updating stereotype on element: ' + element.Name + ' from ' + element.Stereotype + ' to ' + newStereotype);
  element.Stereotype = newStereotype;
  element.StereotypeEx = newStereotype;
  debug('Updated stereotype on element: ' + element.Name + ' from ' + element.Stereotype + ' to ' + newStereotype);
  element.Update();
}


//-----------------------------------------------------------------------------
function synchroStereotypeEx(elements) {
  if (elements) {
    var i = 0;
    while (i < elements.length) {
      var element = elements[i];
      element.StereotypeEx = element.Stereotype;
      info("Sychronized stereotypeEx: " + element.Stereotype);
      element.Update();
      i += 1;
    }
  }
}


//-----------------------------------------------------------------------------
function changeElementConnectors(element, oldType, oldStereotypes, newType, newStereotype, additionalProperties) {
  debug("changeElementConnectorsStereoType: " + element.Name + ", from " + oldType + "[" + oldStereotypes + "] to " + newType + "[" + newStereotype + "]");
  var i, connectors, connector, originalStereotype;
  var count = 0;
  connectors = element.Connectors;
  for (i = 0; i < connectors.Count; i += 1) {
    try {
      connector = connectors.GetAt(i);
      originalStereotype = connector.Stereotype;
      debug("Connector: " + connector.Type + "[" + originalStereotype + "]");
      if (connector.Type === oldType) {
        if (oldStereotypes) {
          if (oldStereotypes.indexOf(originalStereotype) < 0) continue;
        }
        connector.Type = newType;
        connector.Stereotype = newStereotype;
        connector.StereotypeEx = newStereotype;
        eval(additionalProperties);
        connector.Update();
        info("Changed type of connector on element '" + element.Name + "': from " + oldType + "[" + originalStereotype + "] to " + newType + "[" + newStereotype + "]");
      }
    } catch (error) {
      if (error.message.indexOf("the necessary security is not available") > 0) {
        warn("'" + element.name + "': " + error.message + " - probably cannot access the target element");
      } else {
        throw error;
      }
    }
    count++;
  }
  return count;
}


//-----------------------------------------------------------------------------
function addElementConnector(element, stereotype, supplierID, additionalProperties) {
  debug("addElementConnector: " + element.Name + ", [" + stereotype + "] " + "supplierID: " + supplierID);
  var i, connectors, connector;
  connectors = element.Connectors;
  for (i = 0; i < connectors.Count; i += 1) {
    connector = connectors.GetAt(i);
    if ((connector.Stereotype === stereotype) && (connector.SupplierID === supplierID)) {
      debug("Connector already exists, exiting!");
      return -1;
    }
  }
  info("Adding relation " + stereotype + " for: " + element.Name + " with supplierID: " + supplierID);
  connector = element.Connectors.AddNew("", stereotype);
  connector.SupplierID = supplierID;
  eval(additionalProperties);
  connector.Update();
  return 0;
}


function deleteDiagram(eaRepository, diagGUID) {
  debug("deleteDiagram: " + diagGUID);
  try {
    var diag = eaRepository.GetDiagramByGUID(diagGUID);
    debug(diag);
    eaRepository.Execute("delete from t_diagram where EA_GUID = '" + diagGUID + "'");
    info("Deleted diagram with ID " + diagGUID + " name: " + diag.Name);
  } catch (error) {
    warn("Cannot found diagram with ID " + diagGUID);
  }
}