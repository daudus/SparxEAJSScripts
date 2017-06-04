/*jslint node: true */
"use strict";
DEBUG = true;

//!INC *.*
var ActiveXObject, GetObject;
var fso = new ActiveXObject("Scripting.FileSystemObject");
 eval(fso.OpenTextFile(fso.getFolder(".")  + "\\ea_utils.js", 1).ReadAll());


//global vars
DEBUG = false;

//-----------------------------------------------------------------------------
function test(eaRepository) {
  var elements = findAllElements(eaRepository.GetTreeSelectedPackage(), true);
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


//-- START -----------------------------------------------------------------------
var start = new Date();
var result;

// or use already opened
var eaRepository = GetObject("", "EA.App").repository;
info("Invoking script on selected package: " + eaRepository.GetTreeSelectedPackage().Name);
result = test(eaRepository);
//-- END ----------------------------------------------------------------------

info(result + " in " + ((new Date() - start) / 1000) + " seconds!");