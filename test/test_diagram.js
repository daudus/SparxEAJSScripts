/*
 * Script Name: ia
 * Author: Jiri Luzny, David Skarka ©HuMaInn
 * Purpose: unit tests for diagram generation functionality
 * Date: 9.6.2017
 * version 1
 */


/*jslint node: true */
"use strict";

//!INC .......
//NEEDS TO BE COMMENTED MANUALLY
//STANDALONE ENVIRONMENT
///*
var ActiveXObject, GetObject;
var fso = new ActiveXObject("Scripting.FileSystemObject");
eval(fso.OpenTextFile(fso.getFolder(".") + "\\ea_utils.js", 1).ReadAll());
eval(fso.OpenTextFile(fso.getFolder(".") + "\\ia_globals.js", 1).ReadAll());
//EMBEDED SPARX EA ENVIRONMENT
/*
!INC HuMaInn.ea_utils
!INC HuMaInn.ia_globals
!INC Local Scripts.EAConstants-JScript
*/

//global vars
DEBUG = true;
var context = null;


//-----------------------------------------------------------------------------
function setup() {
  var repository = GetObject("", "EA.App").repository;
  var selectedElement = repository.GetTreeSelectedObject();
  var element = new Element(selectedElement);
  var pckg = new Package(repository.GetPackageByID(selectedElement.PackageID));
  context = new Context(new Config(), repository, pckg, element);
}


//-----------------------------------------------------------------------------
//TODO: real diagram test is still missing
function testDiagram() {
  var elements = context.getElement().getAllRelatedElements();
  for (i = 0; i < elements.length; i += 1) {
    element = elements[i];
    info("Found element " + i + ": '" + element.Name + "'");
  }
  return "SUCCESS";
}


function tearDown() {
}


//-- START -----------------------------------------------------------------------
var start = new Date();
var result;

setup();
info("Invoking script on selected element '" + context.getElement().getFullName() + "' in package '" + context.getPackage().name + "'");
result = testDiagram();
//-- END ----------------------------------------------------------------------

info(result + " in " + ((new Date() - start) / 1000) + " seconds!");