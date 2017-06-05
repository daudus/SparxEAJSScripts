/*
 * Script Name: diagram.js
 * Author: Jiri Luzny, David Skarka ©HuMaInn
 * Purpose: diagram generation functionality
 * Date: 5.6.2017
 * version 1
 */


/*jslint node: true */
"use strict";


function _diagram(context, impactedElements) {
    var eaDiagram =  null;
    var eaDiagramObject = null;
    var eaElement = null;
    var diagramLayout = 0; //long
    
    //position of the element. absolute coordinates. t has to be negative number
    var left  = 10;
    var top = -10;
 
    //absolute position but (l-r)=110 and (t-b)=60 represents for example default dimensions width and height for ApplicationComponent element
    var right = 0;
    var bottom = 0;

    info("creating diagram " + context);
    return eaDiagram;
}

 +        lLOG.Info("CreateDiagram: " + Name + " is started")
 +        'ConstLayoutStyles http://www.sparxsystems.com/enterprise_architect_user_guide/9.3/automation/constlayoutstylesenum.html
 +        'Digraph  - directed graph. http://www.sparxsystems.com/enterprise_architect_user_guide/9.3/modeling_basics/digraph_layout.html
 +        'The Digraph attempts to highlight the hierarchy of the elements while keeping the direction of all connectors pointing to the same edge of the diagram.
 +        diagramLayout = EA.ConstLayoutStyles.lsCycleRemoveDFS
 +        diagramLayout = diagramLayout + EA.ConstLayoutStyles.lsLayeringOptimalLinkLength
 +        diagramLayout = diagramLayout + EA.ConstLayoutStyles.lsInitializeDFSOut
 +        diagramLayout = diagramLayout + EA.ConstLayoutStyles.lsLayoutDirectionUp
 +
 +        project = repository.GetProjectInterface()
 +        diagram = package.Diagrams.AddNew(Name, "Logical")
 +        If Not diagram.Update Then
 +            lLOG.Error(diagram.GetLastError)
 +        End If
 +
 +        diagram.Notes = Notes
 +        diagram.Update()
 +        lLOG.Info("Adding elements into the diagram")
 +        spin = New ConsoleSpiner(package.Elements.Count, 1)
 +        For Each o In package.Elements
 +            v = diagram.DiagramObjects.AddNew("", "")
 +            v.ElementID = o.ElementID
 +            v.Update()
 +            spin.Turn()
 +        Next o
 +        spin.Finish()
 +        lLOG.Info("Adding elements into the diagram finished")
 +        project.LayoutDiagramEx(diagram.DiagramGUID, diagramLayout, 4, 20, 20, True)
 +        diagram.Update()
 +        diagram.DiagramObjects.Refresh()
 +        repository.ReloadDiagram(diagram.DiagramID)
 +        lLOG.Info("CreateDiagram: " + Name + " is finished")
 +    End Sub