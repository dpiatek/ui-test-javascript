module.exports = (function() {

  "use strict";

  var parseUri = require("./parseUri");

  return {
    getCampaignMedium: getCampaignMedium,
    track: track
  };

  function track(currentUrl, referrerUrl) {

    var parsedUrl = parseUri(currentUrl),
        params = parsedUrl.queryKey,
        referrerHost = parseUri(referrerUrl).host;

    // IMPORTANT NOTE
    // all dimension and campaign tracking must be set before the pageview is sent

    //make sure there is a query params and not gclid - we won't touch campaign overrides where a gclid is present

    if (params.query != "" && !params.gclid) {

      //is there an affil query parameter?
      if (params.affil) {

        //yes
        //get the campaign medium (channel)
        var campmedium = getCampaignMedium(parsedUrl, params.affil, referrerHost);

        //if the campaign medium is not seo or direct
        if (campmedium != "seo"  && campmedium != "direct") {

          return {
            'campaignName': params.affil,
            'campaignMedium': campmedium,
            'campaignSource': referrerHost
          }
        }

      } else if (params.lpaffil) {

        //no but there is a lpaffil parameter
        //so set the custom dimension 10
        return { 'dimension10': params.lpaffil };

      } else if (params.intaffil) {

        //no but there is a intaffil parameter
        //so set the custom dimension 11
        return { 'dimension11': params.intaffil };
      }

    }

  }

  function getCampaignMedium(parsedUrl, campcode, referrerHost) {

    /**********Campaign management plugin *********************/

    //setup the different campaign channels available
    var channels = {
        "seo":"seo",
        "ppc":"sem",
        "sem":"sem",
        "soc":"social",
        "soc_other":"social",
        "eml":"email",
        "pns":"partnership",
        "aff":"affiliate",
        "qr":"qr-code",
        "pdf":"pdf-code",
        "pub":"publishing-code",
        "cs":"cs-microsite-code",
        "us":"us-paid-other",
        "uk":"uk-paid-other",
        "au":"au-paid-other",
        "other_ref":"other-referring-domain",
        "other":"unknown-paid",
        "dem":"dem",
        "direct":"direct"
    };

    //is there a campaign code?
    if (campcode) {

      //yes there is
      //derive channel from campcode
      var ccparts = [], i=0;

      //define all possible campaign code separators
      var separators = ["|", "-", "_", ":"];

      //find out which separator is being used and split by it
      while (ccparts.length < 2 && i < separators.length) {
        ccparts = campcode.toLowerCase().split(separators[i]);
        i++;
      }

      //check if the first part of the camp code defines the channel
      if (channels[ccparts[0]]) {

        //it does so just return its value
        return channels[ccparts[0]];

      } else if (parsedUrl.queryKey.s_kwcid || parsedUrl.queryKey.mckv) {
        //the url contains a paid campaign name
        //covers the anomoly of mckv starting with dem
        if (parsedUrl.queryKey.mckv && parsedUrl.queryKey.mckv.match(/^dem/i)) {

          return channels.dem;

        } else{
          return channels.sem;
        }


      } else{
        //is another unknown paid campaign
        return channels.other;
      }


    } else if (referrerHost && !referrerHost.match(/lonelyplanet./i)) {

      //no campaign code so derive channel from referrer etc
      //look at referrer etc
      //is this natural search?
      if (referrerHost.match(/google\.|bing\.|yahoo\.|ask\.|aol\./i)) {

        //yes
        return channels.seo;

      } else if (referrerHost.match(/facebook\.|linkedin\.|twitter\.|myspace\.|youtube\.|ning\.|^t\.co|xanga\./i)) {

        //no - its social from a key social network
        return channels.soc;

      } else if (referrerHost.match(/orkut\.|friendster\.|vimeo\.com|bebo\.com|hi5\.com|yuku\.com|cafemom\.com|xanga\.com|livejournal\.com|blogspot\.com|wordpress\.com|myspace\.com|digg\.com|reddit\.com|stumbleupon\.com|twine\.com|yelp\.com|mixx\.com|chime\.in|delicious\.com|tumblr\.com|disqus\.com|intensedebate\.com|plurk\.com|slideshare\.net|backtype\.com|netvibes\.com|mister-wong\.com|diigo\.com|flixster\.com|12seconds\.tv|zooomr\.com|identi\.ca|jaiku\.com|flickr\.com|imeem\.com|dailymotion\.com|photobucket\.com|fotolog\.com|smugmug\.com|classmates\.com|myyearbook\.com|mylife\.com|tagged\.com|brightkite\.com|hi5\.com|yuku\.com|cafemom\.com|plus\.google\.com|instagram\.com|prezi\.com|newsvine\.com|pinterest\.com|wiebo\.com|nevkontakte\.com|qzone\.qq\.com|cloob\.com/i)) {

        //no - its social from another social network
        return channels.soc_other

      } else{
        //no matching referrer but it is a referred visitor
        return channels.other_ref;
      }

    } else{
      //no camp code nor ref uri
      return channels.direct;
    }
  }

}());
