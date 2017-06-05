/*
 * Script Name: ia
 * Author: Jiri Luzny, David Skarka ©HuMaInn
 * Purpose: unit tests for graph generation functionality
 * Date: 4.6.2017
 * version 1
 */


/*jslint node: true */
"use strict";

//!INC *.*
var ActiveXObject, GetObject;
var fso = new ActiveXObject("Scripting.FileSystemObject");
eval(fso.OpenTextFile(fso.getFolder(".")  + "\\ea_utils.js", 1).ReadAll());
eval(fso.OpenTextFile(fso.getFolder(".")  + "\\ia_globals.js", 1).ReadAll());


//global vars
DEBUG = true;
var context = null;


//-----------------------------------------------------------------------------
function setup() {
  context = new Context(new Config(), GetObject("", "EA.App").repository);
}


//-----------------------------------------------------------------------------
function testGraph() {
  var elements = findAllElements(context.eaRepository.GetTreeSelectedPackage(), true);
  if (elements) {
    var i = 0;
    while (i < elements.length) {
      var element = elements[i];
      info("Testing " + element.Name);
      i += 1;
    }

  }
  return "SUCCESS";
}


function tearDown() {
}


//-- START -----------------------------------------------------------------------
var start = new Date();
var result;

setup();
info("Invoking script on selected package: " + context.eaRepository.GetTreeSelectedPackage().Name);
result = testGraph();
//-- END ----------------------------------------------------------------------

info(result + " in " + ((new Date() - start) / 1000) + " seconds!");