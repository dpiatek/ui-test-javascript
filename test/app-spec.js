describe("app", function() {

  "use strict";

  var location = "http://www.foo.com",
      referrer = "http://www.bar.com",
      app = require("../src/app.js"),
      channels = require("../src/channels.js"),
      result;


  describe("track", function() {
    var querystring;

    beforeEach(function() {
      querystring = "";
    });

    describe("With no app tags", function() {

      it("it just returns", function() {
        querystring = "?foo=bar";
        expect(app.track(location + querystring, referrer)).not.toBeDefined();
      });

    });

    describe("With a gclid querystring parameter", function() {

      it("it returns even if there is an app value", function() {
        querystring = "?foo=bar&gclid=foo";
        expect(app.track(location + querystring, referrer)).not.toBeDefined();
      });

    });

    describe("With app tags", function() {

      describe("Sets the campaign", function() {

        it("returns a campaign object", function() {
          var referrerHost = referrer.slice(7);
          var campaignMedium = "ppc";
          var campaignName = [campaignMedium, "foo"].join("-");
          querystring = "?foo=bar&affil=" + campaignName;
          result = app.track(location + querystring, referrer);
          expect(result).toEqual({
            "campaignName": campaignName,
            "campaignMedium": channels[campaignMedium],
            "campaignSource": referrerHost
          });
        });

      });

      describe("Does not set the campaign", function() {

        it("just returns if medium is seo", function() {
          querystring = "?affil=seo-bar";
          result = app.track(location + querystring, referrer);
          expect(result).not.toBeDefined();
        });

        it("just returns if medium is direct", function() {
          querystring = "?app=foo&affil=direct:bar";
          result = app.track(location + querystring, referrer);
          expect(result).not.toBeDefined();
        });

      });

      describe("Sets dimensions", function() {

        describe("an lpaffil querystring parameter is present", function() {

          it("sets a variable on dimension 10", function() {
            querystring = "?lpaffil=bar";
            result = app.track(location + querystring, referrer);
            expect(result).toEqual({ "dimension10": "bar" });
          });

        });

        describe("an an intaffil querystring parameter is present", function() {
          it("sets a variable on dimension11", function() {
            querystring = "?intaffil=bar";
            result = app.track(location + querystring, referrer);
            expect(result).toEqual({ "dimension11": "bar" });
          });
        });

      });

    });

  });


  describe("getCampaignMedium", function() {
    var parsedUrl, campCode, referrerHost, campaignMedium;

    beforeEach(function() {
      parsedUrl = { queryKey: {} };
      campCode = "";
      referrerHost = "foo-bar-baz.nk";
      campaignMedium = "";
    });

    describe("with campaign code", function() {

      it("returns the channels value", function() {
        campaignMedium = "eml";
        parsedUrl.queryKey.affil = campCode = campaignMedium + "|Foo|bar";
        result = app.getCampaignMedium(parsedUrl, campCode, referrerHost);
        expect(result).toEqual(channels[campaignMedium]);
      });

      it("defaults to the other channel", function() {
        parsedUrl.queryKey.affil = campCode = "foo-bar-baz";
        result = app.getCampaignMedium(parsedUrl, campCode, referrerHost);
        expect(result).toEqual(channels.other);
      });

    });

    describe("url containing s_kwicid or mckv params", function() {

      beforeEach(function() {
        parsedUrl.queryKey.affil = campCode = "foo-bar-baz";
      });

      it("returns the dem channel for mckv param with the value prefixed with dem", function() {
        parsedUrl.queryKey.mckv = "dem,foo,bar";
        result = app.getCampaignMedium(parsedUrl, campCode, referrerHost);
        expect(result).toEqual(channels.dem);
      });

      it("returns the sem channel for s_kwicid param", function() {
        parsedUrl.queryKey.s_kwcid = "foo";
        result = app.getCampaignMedium(parsedUrl, campCode, referrerHost);
        expect(result).toEqual(channels.sem);
      });

    });

    describe("with no campaign code but a referrer uri", function() {

      it("returns the seo channel for a search engine", function() {
        referrerHost = "google.de";
        result = app.getCampaignMedium(parsedUrl, campCode, referrerHost);
        expect(result).toEqual(channels.seo);
      });

      it("returns the social channel for a key social network", function() {
        referrerHost = "twitter.com";
        result = app.getCampaignMedium(parsedUrl, campCode, referrerHost);
        expect(result).toEqual(channels.soc);
      });

      it("returns the social other channel for other social networks", function() {
        referrerHost = "hi5.com";
        result = app.getCampaignMedium(parsedUrl, campCode, referrerHost);
        expect(result).toEqual(channels.soc_other);
      });

      it("returns the other referrer channel if there are no matches", function() {
        referrerHost = "foo-bar-baz.ik";
        result = app.getCampaignMedium(parsedUrl, campCode, referrerHost);
        expect(result).toEqual(channels.other_ref);
      });

    });

    describe("with no campaign code and internal referrer", function() {

      it("returns the direct channel", function() {
        referrerHost = "lonelyplanet.com";
        result = app.getCampaignMedium(parsedUrl, campCode, referrerHost);
        expect(result).toEqual(channels.direct);
      });

    });

    describe("with no campaign code and no referrer uri", function() {

      it("returns the direct channel", function() {
        referrerHost = "";
        result = app.getCampaignMedium(parsedUrl, campCode, referrerHost);
        expect(result).toEqual(channels.direct);
      });

    });

  });

});
