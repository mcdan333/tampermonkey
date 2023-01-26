// ==UserScript==
// @name         mosyle.com: UI tweaks
// @namespace    http://tampermonkey.net/
// @version      0.30
// @description  Mosyle UI improvements
// @author       Eric McDaniel <mcdaniel_eric@cusdk8.org>
// @match        https://myschool.mosyle.com/
// @icon         https://myschool.mosyle.com/images/logos/favicon.ico
// @grant        none
// ==/UserScript==

/* eslint-env jquery */
/* eslint no-multi-spaces:0 */

// Annoying (but harmless) "alert overdue invoices" banner
$("div.alert-overdue-invoices").remove ();

// Annoying logo (annoying since I can't figure out how to change it)
$("div.dash-box.vertical-logo").remove ();

// Find date values in the table, and change bg color to green/yellow/red
// depending on how far back the date is
function listener() {
    var res = document.querySelectorAll("td[data-sort-value]");
    for (let i=0; i<res.length; i++) {
        var dataSortValue = res[i].getAttribute('data-sort-value');
        if (dataSortValue.match(/[\d]{10}/)) {
            var dateDiff = Date.now() - parseInt(dataSortValue)*1000;
            if (dateDiff < 24*3600*1000) {
                res[i].style.backgroundColor='lightgreen';
            } else if (dateDiff < 7*24*2600*1000) {
                res[i].style.backgroundColor='yellow';
            } else {
                res[i].style.backgroundColor='pink';
            }
        }
    }
}

waitForKeyElements("#table_devices > tbody > tr:nth-child(3)", listener);


/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.
    Usage example:
        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );
        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }
    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
