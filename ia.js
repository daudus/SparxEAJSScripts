/*
 * Script Name: ia
 * Author: David Skarka, Jiri Luzny, ©HuMaInn
 * Purpose: Impact analysis in Archimate models
 * Usage: Select element in Technology layer, invoke sript and obtain all impacted elements in Application layer in newly creeated diagram
 * Date: 1.6.2017
 * version 2
 */

"use strict";

//!INC .......
//NEEDS TO BE COMMENTED MANUALLY
//STANDALONE ENVIRONMENT
///*
var ActiveXObject, GetObject;
eval(new ActiveXObject("Scripting.FileSystemObject").OpenTextFile("ea_utils.js", 1).ReadAll());
eval(new ActiveXObject("Scripting.FileSystemObject").OpenTextFile("ia_globals.js", 1).ReadAll());

//do not distribute this file. It is standard part of Sparx EA
eval(new ActiveXObject("Scripting.FileSystemObject").OpenTextFile("EAConstants-JScript.js", 1).ReadAll());
//*/

//EMBEDED SPARX EA ENVIRONMENT
/*
!INC HuMaInn.ea_utils
!INC HuMaInn.ia_globals
!INC Local Scripts.EAConstants-JScript

*/

/*
GLOBAL VARIABLES
*/
var context = null;
DEBUG = false;
//array for impacted elements. Should be filled by array.push(...) method
var impactedElements = new Array();

//INITIALIZING
function init() {
  info("ia initialization started");
  //has to be selected Archimate_* element and from technology layer
  
  var context = null;
  var eaRepo = GetObject("", "EA.App").repository
  //Show the script output window
  eaRepo.EnsureOutputVisible("Script");
  var eaElement = null;
  var eaPackage = null;
  var treeSelectedType = eaRepo.GetTreeSelectedItemType();
  debug("treeSelectedType: " + treeSelectedType + " (4 for EA.otElement)");

  switch ( treeSelectedType )
  {
      case otElement /*otElement*/ :
      {
          eaElement = eaRepo.GetTreeSelectedObject();
          eaPackage = eaRepo.GetPackageByID(eaElement.PackageID);     
          info("selected element: " + eaElement.Name);
          info("  in package: " + eaPackage.Name);
          break;
      }
  default :
      {
          // no element is selected
          error("No element is selected. Script is finishing.");
          break;
      }
  }
  if (eaElement != null) 
      {
          context = new Context(new Config(), eaRepo,eaPackage,eaElement);

      }
  debug(xlog(context,"CONTEXT"));    
  info("ia initialization finished");
  return context;
}

function getImpactedElements(context, impactedElements) {
  info("getImpactedElements started")
  var eaElement = context.getElement();

// TODO: Disfunction. Why?
//  var elements = eaElement.getAllRelatedElements();
  var elements = findAllRelatedElements(context.getRepository(), eaElement, context.getConfig().MAXIMUM_DEPTH);
  for (i = 0; i < elements.length; i += 1) {
    eaElement = new Element(elements[i]);
    impactedElements.push(eaElement);
  }
  info(impactedElements.length + " impacted elements were added");
  info("getImpactedElements finished");
  return impactedElements;
}

function addDiagram(context, elements) {
  var eaDiagram =  null;
  var eaDiagramObject = null;
  var eaElement = null;
  var diagramLayout = 0; //long
  var diagramName = context.getConfig().DIAGRAM_PREFIX + context.getPackage().Name;
  var projectInterface = null;

  // ConstLayoutStyles http://www.sparxsystems.com/enterprise_architect_user_guide/9.3/automation/constlayoutstylesenum.html
  //Digraph  - directed graph. http://www.sparxsystems.com/enterprise_architect_user_guide/9.3/modeling_basics/digraph_layout.html
  //The Digraph attempts to highlight the hierarchy of the elements while keeping the direction of all connectors pointing to the same edge of the diagram.


  //position of the element. absolute coordinates. t has to be negative number
  var left  = 10;
  var top = -10;

  //absolute position but (l-r)=110 and (t-b)=60 represents for example default dimensions width and height for ApplicationComponent element
  var right = 0;
  var bottom = 0;

  info("createDiagram started creating diagram " + diagramName);
  diagramLayout = lsCycleRemoveDFS;
  diagramLayout = diagramLayout + lsLayeringOptimalLinkLength;
  diagramLayout = diagramLayout + lsInitializeDFSOut;
  diagramLayout = diagramLayout + lsLayoutDirectionUp;

  debug("#diagrams: " + context.getPackage().Diagrams.Count);
  projectInterface = context.getRepository().GetProjectInterface();
  eaDiagram = context.getPackage().Diagrams.AddNew(diagramName, "Logical");
  if (!eaDiagram.Update()) {
    error(eaDiagram.GetLastError);
  }
  eaDiagram.Notes = "--automatically generated--";
  eaDiagram.Update();
  debug("Adding elements into the diagram");
  for (index = 0; index < elements.length; ++index) {
    eaElement = elements[index].getElement();
    eaDiagramObject = eaDiagram.DiagramObjects.AddNew("", "");
    eaDiagramObject.ElementID = eaElement.ElementID;
    eaDiagramObject.Update();
  };
  debug("Adding elements into the diagram finished")
  projectInterface.LayoutDiagramEx(eaDiagram.DiagramGUID, diagramLayout, 4, 20, 20, true);
  eaDiagram.Update();
  eaDiagram.DiagramObjects.Refresh();
  context.getRepository().ReloadDiagram(eaDiagram.DiagramID);
  info("Create Diagram: " + diagramName + " is finished");

  return eaDiagram;
}

function finish(context, impactedElements) {
  info("finish started");
  //push something to clean here
  info("finish finished");
  //success
  return 0;
}

//-- START -----------------------------------------------------------------------
info( "=======================================" );
info( "JScript PROJECT IMPACT ANALYSIS: STARTED" );
info( "=======================================" );
context = init();
if (context != null) {
  impactedElements = getImpactedElements(context, impactedElements);
  var eaDiagram = addDiagram(context, impactedElements);
  //eaDiagram.show();
} else {
  error("something was/is wrong. Script is finishing.")
}
finish();
//-- END ----------------------------------------------------------------------
info( "=======================================" );
info( "JScript PROJECT IMPACT ANALYSIS: FINISHED" );
info( "=======================================" );

