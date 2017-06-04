/*
 * Script Name: ia
 * Author: David Skarka, Jiri Luzny, ©HuMaInn
 * Purpose: Impact analysis in Archimate models
 * Usage: Select element in Technology layer, invoke sript and obtain all impacted elements in Application layer in newly creeated diagram 
 * Date: 1.6.2017
 * version 2
 */

"use strict";

/*
GLOBAL VARIABLES
*/

//if special testing routine will be executed. For production purpose should be set to false
var TEST = false; 
var DEBUG = false;

//MAXIMUM_DEPTH: limit for Breadth-first traversal
//DIAGRAM_PREFIX: diagram will be created with this name: DIAGRAM_PREFIX+<name of selected package>
//REPOSITORY: current repository in Sparx EA 
//SELECTED_PACKAGE: selected package in the repository
var configuration ={MAXIMUM_DEPTH:10,DIAGRAM_PREFIX:"iagen_",REPOSITORY:"",SELECTED_PACKAGE:""};

//array for impacted elements. Should be filled by array.push(...) method
var impactedElements = new Array();


//!INC .......
//TODO: NEEDS TO BE COMMENTED MANUALLY
//STANDALONE ENVIRONMENT
///*
var ActiveXObject, GetObject;
eval(new ActiveXObject("Scripting.FileSystemObject").OpenTextFile("ea_utils.js", 1).ReadAll());
//*/

//EMBEDED SPARX EA ENVIRONMENT
/*
!INC HuMaInn.ea_utils
*/

//INITIALIZING
function init() {
    info("ia initialization started");
    //TODO: if not selected element then display ERROR and finish. Meanwhile implementation is dummy with package
    var ea_repo = GetObject("", "EA.App").repository;
    var ea_pckg =  ea_repo.GetTreeSelectedPackage();
    if (TEST) {
        test(ea_pckg);    
    }
    configuration["SELECTED_PACKAGE"]=ea_pckg;
    configuration["REPOSITORY"]=ea_repo;
    info("CURRENT REPOSITORY: [" + configuration.REPOSITORY.RepositoryType() + "]:" + configuration.REPOSITORY.ConnectionString);
    info("SELECTED PACKAGE: " + configuration.SELECTED_PACKAGE.Name);
    info("ia initialization finished");
}

/*
TESTING functions START-----------------------------------------------------------------------------
*/
function test(ea_pckg) {
    var start = new Date();
    var result;
    info("testing started");
    info("Invoking script on selected package: " + ea_pckg.Name);
    result = testPackage(ea_pckg);
    info(result + " in " + ((new Date() - start) / 1000) + " seconds!");
    info("testing finished");
}

function testPackage(eaPackage) {
  var elements = findAllElements(eaPackage, true);
  info("Testing " + elements.count);
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

/*
TESTING functions END-----------------------------------------------------------------------------
*/

/*
object element START-----------------------------------------------------------------------------
*/
function create_element(pEaElement,pStereotype,pDepth) {
    //object definition for wrapping Sparx EA Elements
    var element = {eaElement:pEaElement,stereoType:pStereotype,depth:pDepth, name: function() {return "[" + this.stereoType+"]:" + this.eaElement.Name;}};
    return element;
}

/*
object element END-----------------------------------------------------------------------------
*/

function prepareConfiguration(configuration) {
    info("prepareConfiguration started")
    info(xlog(configuration,"CONFIGURATION"));
    info("prepareConfiguration finished")
    return configuration;
}

function getImpactedElements(configuration, impactedElements) {
    info("getImpactedElements started")
    //dummy implementation
    debug("number of elements: " + configuration.SELECTED_PACKAGE.elements.Count)
    for (index = 0; index < configuration.SELECTED_PACKAGE.elements.Count; ++index) {
        var element = create_element(configuration.SELECTED_PACKAGE.elements.GetAt(index),configuration.SELECTED_PACKAGE.elements.GetAt(index).Stereotype,1);
        impactedElements.push(element);
        debug("ADDED ELEMENT: " +element.name())
    };
    //end dummy implementation
    info(impactedElements.length + " impacted elements were added");
    info("getImpactedElements finished")
    return impactedElements;
}

function createDiagram(configuration, impactedElements) {
    info("createDiagram started")

    //dummy implementation 
    for (index = 0; index < impactedElements.length; ++index) {
        debug("DRAWING ELEMENT: " +impactedElements[index].name())
    };
    //end dummy implementation
    info(impactedElements.length + " impacted elements were drawn");
    info("createDiagram finished")
    //success
    return 0;
}

function finish(configuration, impactedElements) {
    info("finish started")
    //push something to clean here
    info("finish finished")
    //success
    return 0;
}

//-- START -----------------------------------------------------------------------
init();
configuration = prepareConfiguration(configuration);
impactedElements = getImpactedElements(configuration,impactedElements);
createDiagram(configuration, impactedElements);
finish();
//-- END ----------------------------------------------------------------------

