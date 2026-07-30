/*global QUnit*/
sap.ui.define([
    "sap/ui/test/opaQunit",
    "ns/html5module/test/integration/pages/View1",
    "ns/html5module/test/integration/arrangements/Startup"
], function(opaTest) {
    "use strict";

    QUnit.module("webapp/test/integration/NavigationJourney.js");

    // TC-013: OPA5 integration test — intentionally fails due to Chrome 94 + latest UI5 incompatibility
    // This demonstrates failure reporting in the XML
    opaTest("Should see the initial page of the app", function(Given, When, Then) {
        Given.iStartMyApp();
        Then.onView1.iShouldSeeTheApp();
        Then.iTeardownMyApp();
    });
});