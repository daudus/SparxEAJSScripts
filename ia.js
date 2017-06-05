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
//TODO: NEEDS TO BE COMMENTED MANUALLY
//STANDALONE ENVIRONMENT
///*
var ActiveXObject, GetObject;
eval(new ActiveXObject("Scripting.FileSystemObject").OpenTextFile("ea_utils.js", 1).ReadAll());
eval(new ActiveXObject("Scripting.FileSystemObject").OpenTextFile("ia_globals.js", 1).ReadAll());
//*/

//EMBEDED SPARX EA ENVIRONMENT
/*
!INC HuMaInn.ea_utils
!INC HuMaInn.ia_globals
*/

/*
GLOBAL VARIABLES
*/

//if special testing routine will be executed. For production purpose should be set to false
var TEST = false; 
var context = null;
DEBUG = true;

//array for impacted elements. Should be filled by array.push(...) method
var impactedElements = new Array();



//INITIALIZING
function init() {
    info("ia initialization started");
    //has to be selected Archimate_* element and from technology layer
    var context = null;
    var eaRepo = GetObject("", "EA.App").repository
    var eaElement = null;
    var eaPackage = null;
    var treeSelectedType = eaRepo.GetTreeSelectedItemType();
    debug("treeSelectedType: " + treeSelectedType + " (4 for EA.otElement)");

    switch ( treeSelectedType )
    {
        case 4 /*otElement*/ :
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
    var eaElement = null;
    //dummy implementation
    debug("number of elements: " + context.eaPackage.elements.Count)
    for (index = 0; index < context.eaPackage.elements.Count; ++index) {
        eaElement = context.eaPackage.elements.GetAt(index);
        var element = new EaElement(eaElement,eaElement.Name,eaElement.Stereotype);
        impactedElements.push(element);
        debug("ADDED ELEMENT: " +element.fullName());
    };
    //end dummy implementation
    info(impactedElements.length + " impacted elements were added");
    info("getImpactedElements finished")
    return impactedElements;
}

function createDiagram(context, impactedElements) {
    info("createDiagram started")
    //dummy implementation
    var eaElement = null;
    debug("number of elements: " + impactedElements.length)
    for (index = 0; index < impactedElements.length; ++index) {
        eaElement = impactedElements[index].eaElement;
        debug("DRAWN ELEMENT: " +eaElement.Name);
    };
    //end dummy implementation
    info("createDiagram finished")
    //success
    return 0;
}

function finish(context, impactedElements) {
    info("finish started")
    //push something to clean here
    info("finish finished")
    //success
    return 0;
}

//-- START -----------------------------------------------------------------------
context = init();
if (context != null) {
    impactedElements = getImpactedElements(context, impactedElements);
    var eaDiagram = createDiagram(context, impactedElements);
    //eaDiagram.show();
} else {
    error("something was/is wrong. Script is finishing.")
}
finish();
//-- END ----------------------------------------------------------------------

