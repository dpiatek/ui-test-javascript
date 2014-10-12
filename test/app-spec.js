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
          result = app.track(location + "?app=foo&affil=ppc_foo" , referrer);
          expect(result).toEqual({
            "campaignName": "ppc_foo",
            "campaignMedium": "sem",
            "campaignSource": "www.bar.com"
          });
        });

      });

      describe("Does not set the campaign", function() {
        it("just returns if medium is seo", function() {
          spyOn(app, "getCampaignMedium").and.returnValue("seo");
          result = app.track(location + "?app=foo&affil=seo-bar", referrer);
          expect(result).not.toBeDefined();
        });

        it("just returns if medium is direct", function() {
          spyOn(app, "getCampaignMedium").and.returnValue("direct");
          result = app.track(location + "?app=foo&affil=direct:bar", "");
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
    describe("with campaign code", function() {
      it("returns the channels value", function() {
        result = app.getCampaignMedium({}, "eml|Foo|bar", "foo-bar-baz.nk");
        expect(result).toEqual("email");
      });

      it("defaults to the other channel", function() {
        result = app.getCampaignMedium({ queryKey: {} }, "foo-bar-baz", "foo-bar-baz.nk");
        expect(result).toEqual("unknown-paid");
      });
    });

    describe("url containing s_kwicid or mckv params", function() {
      it("returns the dem channel for mckv param with the value prefixed with dem", function() {
        result = app.getCampaignMedium({ queryKey: { mckv: "dem,foo,bar" } }, "foonando", "foo-bar-baz.nk");
        expect(result).toEqual("dem");
      });

      it("returns the sem channel for s_kwicid param", function() {
        result = app.getCampaignMedium({ queryKey: { s_kwcid: "foo" } }, "foonando", "foo-bar-baz.nk");
        expect(result).toEqual("sem");
      });
    });

    describe("with no campaign code but a referrer uri", function() {
      it("returns the seo channel for a search engine", function() {
        result = app.getCampaignMedium(location, "", "google.de");
        expect(result).toEqual("seo");
      });

      it("returns the social channel for a key social network", function() {
        result = app.getCampaignMedium(location, "", "twitter.com");
        expect(result).toEqual("social");
      });

      it("returns the social other channel for other social networks", function() {
        result = app.getCampaignMedium(location, "", "hi5.com");
        expect(result).toEqual("social");
      });

      it("returns the other referrer channel if there are no matches", function() {
        result = app.getCampaignMedium(location, "", "foo-bar-baz.ik");
        expect(result).toEqual("other-referring-domain");
      });
    });

    describe("with no campaign code and internal referrer", function() {
      it("returns the direct channel", function() {
        result = app.getCampaignMedium(location, "", "lonelyplanet.com");
        expect(result).toEqual("direct");
      });
    });

    describe("with no campaign code and no referrer uri", function() {
      it("returns the direct channel", function() {
        result = app.getCampaignMedium(location, "", "");
        expect(result).toEqual("direct");
      });
    });

  });

});
