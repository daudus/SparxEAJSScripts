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
// repository: sparxEA current repository
// eaElement: sparxEA selected element
// eaPackage: sparxEA package of selected element
function Context(config, repository, pckg, element) {
  var config = config;
  var repository = repository;
  var pckg = pckg;
  var element = element;

  this.getRepository = function () { return repository;};
  this.getPackage = function () { return pckg;};
  this.getElement = function () { return element;};
}


// object definition for wrapper of Sparx EA Element
// element: reference to original EA Element
function Package(pckg) {
  this.package = pckg;
  this.name = this.package.Name;
}


// object definition for wrapper of Sparx EA Element
// element: reference to original EA Element
// fullName: function returns string "[streotype]:name"
function Element(element) {
  var element = element;

  this.getName = function () { element.Name;};
  this.getStereotype = function () { element.Stereotype;};
  this.getFullName = function () {
    return "[" + element.Stereotype + "]:" + element.Name;
  };

  // relationships  
  this.getAllRelatedElements = function (depth) {
    relatedElements = [];
    relatedElements = findAllRelatedElements(repository, element, depth, 0);
    return relatedElements;
  }
}