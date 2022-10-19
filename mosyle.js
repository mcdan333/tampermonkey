// ==UserScript==
// @name         mosyle.com: Remove annoying UI features
// @namespace    http://tampermonkey.net/
// @version      0.30
// @description  Remove annoying Mosyle UI elements
// @author       Eric McDaniel <mcdaniel_eric@cusdk8.org>
// @match        https://myschool.mosyle.com/
// @icon         https://myschool.mosyle.com/images/logos/favicon.ico
// @grant        none
// ==/UserScript==

/* eslint-env jquery */

// Annoying (but harmless) "alert overdue invoices" banner
$("div.alert-overdue-invoices").remove ();

// Annoying logo (annoying since I can't figure out how to change it)
$("div.dash-box.vertical-logo").remove ();
