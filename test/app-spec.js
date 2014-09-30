describe("app", function() {

  "use strict";

  var location = "http://www.foo.com",
      referrer = "http://www.bar.com",
      app = require("../src/app.js"),
      module, spy, result;

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

  describe("Set Dimensions", function() {

    describe("With an app tag", function() {

      beforeEach(function() {
        spyOn(app, "getCampaignMedium").and.returnValue(undefined)
      })

      it("it sets a variable on dimension 9", function() {
        result = app.track(location + "?app=foo", referrer);
        expect(result).toEqual({'dimension9': 'foo'});
      });

    });

  })

});
