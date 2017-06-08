/*
 * Script Name: diagram.js
 * Author: Jiri Luzny, David Skarka ©HuMaInn
 * Purpose: diagram generation functionality
 * Date: 5.6.2017
 * version 1
 */


/*jslint node: true */
"use strict";

function _diagram() {
  info("diagram initialization started");
  info("diagram initiated");
}


function addDiagram(context, elements) {
  var eaDiagram =  null;
  var eaDiagramObject = null;
  var eaElement = null;
  var diagramLayout = 0; //long
  var diagramName = context.config.DIAGRAM_PREFIX + context.eaPackage.Name;
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

  info("Creating diagram " + diagramName);
  diagramLayout = lsCycleRemoveDFS;
  diagramLayout = diagramLayout + lsLayeringOptimalLinkLength;
  diagramLayout = diagramLayout + lsInitializeDFSOut;
  diagramLayout = diagramLayout + lsLayoutDirectionUp;

  debug("#diagrams: " + context.eaPackage.Diagrams.Count);
  projectInterface = context.eaRepository.GetProjectInterface();
  debug(xlog(projectInterface,"projectInterface"));
  eaDiagram = context.eaPackage.Diagrams.AddNew(diagramName, "Logical");
  debug(xlog(eaDiagram,"diagram"));
  if (!eaDiagram.Update()) {
    error(eaDiagram.GetLastError);
  }
  eaDiagram.Notes = "--automatically generated--";
  eaDiagram.Update();
  debug("Adding elements into the diagram");
  for (index = 0; index < elements.length; ++index) {
    eaElement = elements[index].eaElement;
    eaDiagramObject = eaDiagram.DiagramObjects.AddNew("", "");
    eaDiagramObject.ElementID = eaElement.ElementID;
    eaDiagramObject.Update();
  };
  debug("Adding elements into the diagram finished")
  //TODO: projectInterface.LayoutDiagramEx(eaDiagram.DiagramGUID, diagramLayout, 4, 20, 20, True);
  eaDiagram.Update();
  eaDiagram.DiagramObjects.Refresh();
  context.eaRepository.ReloadDiagram(eaDiagram.DiagramID);
  info("Create Diagram: " + diagramName + " is finished");

  return eaDiagram;
}

_diagram();