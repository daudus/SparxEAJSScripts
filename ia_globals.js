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
//SELECTED_PACKAGE: selected package in the eaRepository
function Config() {
  this.MAXIMUM_DEPTH = 10;
  this.DIAGRAM_PREFIX = "iagen_";
}

// global context
//var ctx = {CONFIG:configuration, eaRepository:"", SELECTED_PACKAGE:""};
function Context(config, eaRepository) {
  this.config = config;
  this.eaRepository = eaRepository;
}


//object definition for wrapper of Sparx EA Element
// var element = {eaElement:"",stereoType:"",depth:"", name: function() {return this.eaElement.Name + " [" + this.stereoType+"]";}};
function EaElement(name, stereoType) {
  this.name = name;
  this.stereoType = stereoType;
}