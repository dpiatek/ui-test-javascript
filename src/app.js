module.exports = (function() {

  "use strict";

  var parseUri = require("./parseUri");
  var channels = require("./channels");

  return {
    getCampaignMedium: getCampaignMedium,
    track: track
  };

  function track(currentUrl, referrerUrl) {
    var parsedUrl = parseUri(currentUrl),
        params = parsedUrl.queryKey,
        referrerHost = parseUri(referrerUrl).host,
        campaignMedium = getCampaignMedium(parsedUrl, params.affil, referrerHost);

    // IMPORTANT NOTE
    // all dimension and campaign tracking must be set before the pageview is sent

    // do not track
    if (params.gclid) {
      return;
    }

    // affil, lpaffil and intaffil are exclusive
    if (params.affil && validCampaignMedium(campaignMedium)) {
      return {
        "campaignName": params.affil,
        "campaignMedium": campaignMedium,
        "campaignSource": referrerHost
      };
    } else if (params.lpaffil) {
      return {
        "dimension10": params.lpaffil
      };
    } else if (params.intaffil) {
      return {
        "dimension11": params.intaffil
      };
    }

    function validCampaignMedium(medium) {
      return (medium !== "seo") && (medium !== "direct");
    }
  }

  function getCampaignMedium(parsedUrl, campcode, referrerHost) {

    /**********Campaign management plugin *********************/

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
        return channels.soc_other;

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
