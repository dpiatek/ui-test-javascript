module.exports = (function() {
  "use strict";

  var parseUri = require("./parseUri"),
      channels = require("./channels");

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

  function getCampaignMedium(parsedUrl, campaignCode, referrerHost) {
    if (campaignCode) {
      return getChannelFromCode(parsedUrl, campaignCode);
    } else if (referrerHost && isExternalReferrer(referrerHost)) {
      return getChannelFromReferrer(referrerHost);
    } else {
      return channels.direct;
    }
  }

  function getChannelFromCode(parsedUrl, campaignCode) {
    var channelKey = getChannelKeyFromCode(campaignCode),
        channel = channelKey && channels[channelKey];

    if (channel) {
      return channel;
    } else if (parsedUrl.queryKey.mckv && parsedUrl.queryKey.mckv.match(/^dem/i)) {
      return channels.dem;
    } else if (parsedUrl.queryKey.s_kwcid) {
      return channels.sem;
    } else {
      return channels.other;
    }
  }

  function getChannelKeyFromCode(campaignCode) {
    var ccparts = [], i = 0;

    //define all possible campaign code separators
    var separators = ["|", "-", "_", ":"];

    //find out which separator is being used and split by it
    while (ccparts.length < 2 && i < separators.length) {
      ccparts = campaignCode.toLowerCase().split(separators[i]);
      i++;
    }

    return ccparts[0];
  }

  function getChannelFromReferrer(referrerHost) {
    var naturalSearch = /google\.|bing\.|yahoo\.|ask\.|aol\./i;
    var socialNetworks = /facebook\.|linkedin\.|twitter\.|myspace\.|youtube\.|ning\.|^t\.co|xanga\./i;
    var socialNetworksOther = /orkut\.|friendster\.|vimeo\.com|bebo\.com|hi5\.com|yuku\.com|cafemom\.com|xanga\.com|livejournal\.com|blogspot\.com|wordpress\.com|myspace\.com|digg\.com|reddit\.com|stumbleupon\.com|twine\.com|yelp\.com|mixx\.com|chime\.in|delicious\.com|tumblr\.com|disqus\.com|intensedebate\.com|plurk\.com|slideshare\.net|backtype\.com|netvibes\.com|mister-wong\.com|diigo\.com|flixster\.com|12seconds\.tv|zooomr\.com|identi\.ca|jaiku\.com|flickr\.com|imeem\.com|dailymotion\.com|photobucket\.com|fotolog\.com|smugmug\.com|classmates\.com|myyearbook\.com|mylife\.com|tagged\.com|brightkite\.com|hi5\.com|yuku\.com|cafemom\.com|plus\.google\.com|instagram\.com|prezi\.com|newsvine\.com|pinterest\.com|wiebo\.com|nevkontakte\.com|qzone\.qq\.com|cloob\.com/i;

    if (referrerHost.match(naturalSearch)) {
      return channels.seo;
    } else if (referrerHost.match(socialNetworks)) {
      return channels.soc;
    } else if (referrerHost.match(socialNetworksOther)) {
      return channels.soc_other;
    } else {
      return channels.other_ref;
    }
  }

  function isExternalReferrer(referrerHost) {
    return !referrerHost.match(/lonelyplanet./i);
  }

}());
