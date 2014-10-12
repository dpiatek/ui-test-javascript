describe("app", function() {

  "use strict";

  var location = "http://www.foo.com",
      referrer = "http://www.bar.com",
      app = require("../src/app.js"),
      querystring, result;


  describe("track", function() {

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

    describe("With app tags", function() {

      describe("Sets the campaign", function() {

        it("returns a campaign object", function() {
          var campaignName = "baz";
          var campaignMedium = "foo";

          spyOn(app, "getCampaignMedium").and.returnValue(campaignMedium);
          result = app.track(location + "?app=foo&affil=" + campaignName, referrer);
          expect(result).toEqual({
            "campaignName": campaignName,
            "campaignMedium": campaignMedium,
            "campaignSource": "bar.com"
          });
        });

      });

      describe("Does not set the campaign", function() {
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

      describe("Sets dimensions", function() {

        describe("an lpaffil querystring parameter is present", function() {
          it("sets a variable on dimension 10", function() {
            result = app.track(location + "?app=foo&lpaffil=bar", referrer);
            expect(result).toEqual({"dimension10": "bar"});
          });
        });

        describe("an an intaffil querystring parameter is present", function() {
          it("sets a variable on dimension11", function() {
            result = app.track(location + "?app=foo&intaffil=bar", referrer);
            expect(result).toEqual({"dimension11": "bar"});
          });
        });

      });

    });

  });



  describe("getCampaignMedium", function() {

  });

});
