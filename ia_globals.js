/*
 * Script Name: ia
 * Author: Jiri Luzny, David Skarka ©HuMaInn
 * Purpose: global variables definition
 * Date: 4.6.2017
 * version 1
 */


/*jslint node: true */
"use strict";


//MAXIMUM_DEPTH: limit for Breadth-first traversal
//DIAGRAM_PREFIX: diagram will be created with this name: DIAGRAM_PREFIX+<name of selected package>
function Config() {
  this.MAXIMUM_DEPTH = 10;
  this.DIAGRAM_PREFIX = "iagen_";
}

// global context
// config:configuration
// eaRepository: sparxEA current repository
// eaElement: sparxEA selected element
// eaPackage: sparxEA package of selected element
function Context(config, eaRepository,eaPackage,eaElement) {
  this.config = config;
  this.eaRepository = eaRepository;
  this.eaPackage = eaPackage;
  this.eaElement = eaElement;
}


// object definition for wrapper of Sparx EA Element
// eaElement: reference to original EA Element
// name: name of EA Element
// stereoType: stereotype of EA Element
// fullName: function returns string "[streotype]:name"
function EaElement(eaElement,name, stereoType) {
  this.eaElement = eaElement;
  this.name = name;
  this.stereoType = stereoType;
  this.fullName = function() {return "[" + this.stereoType+"]:" + this.name;};
}