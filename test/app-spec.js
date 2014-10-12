describe("app", function() {

  "use strict";

  var location = "http://www.foo.com",
      referrer = "http://www.bar.com",
      app = require("../src/app.js"),
      querystring, result;

  describe("With no app tags", function() {

    it("it just returns", function() {
      querystring = "?foo=bar";
      expect(app.track(location + querystring, referrer)).not.toBeDefined();
    });

  });

  describe("With a gclid querystring parameter", function() {

    it("it returns even if there is an app value", function() {
      querystring = "?app=true&gclid=foo";
      expect(app.track(location + querystring, referrer)).not.toBeDefined();
    });

  });

  describe("Does not set the campaign", function() {

    describe("when campaign medium is an ignored value", function() {

      it("just returns if medium is seo", function() {
        spyOn(app, "getCampaignMedium").and.returnValue("seo");
        result = app.track(location + "?app=foo&affil=bar", referrer);
        expect(result).not.toBeDefined();
      });

      it("just returns if medium is direct", function() {
        spyOn(app, "getCampaignMedium").and.returnValue("direct");
        result = app.track(location + "?app=foo&affil=bar", referrer);
        expect(result).not.toBeDefined();
      });

    });

  });

  describe("Set Dimensions", function() {

    describe("With an app tag", function() {

      beforeEach(function() {
        spyOn(app, "getCampaignMedium").and.returnValue(undefined);
      });

      describe("and an lpaffil querystring parameter", function() {
        it("sets a variable on dimension 10", function() {
          result = app.track(location + "?app=foo&lpaffil=bar", referrer);
          expect(result).toEqual({"dimension10": "bar"});
        });
      });

      describe("and an intaffil querystring parameter", function() {
        it("sets a variable on dimension11", function() {
          result = app.track(location + "?app=foo&intaffil=bar", referrer);
          expect(result).toEqual({"dimension11": "bar"});
        });
      });
    });

  });

});
