// ==UserScript==
// @name         E*Trade UI tweaks
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.etrade.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=etrade.com
// @grant        none
// ==/UserScript==

/* eslint-env jquery */
/* eslint no-multi-spaces:0 */

(function() {
    'use strict';

    //$("#security-code-chk").prop("checked", true);
    $("#security-code-chk").trigger('click');
    $("#security_code_chk").trigger('click');

})();
