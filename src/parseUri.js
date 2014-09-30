/* jshint ignore:start */

module.exports = (function() {

  // This is a utility function that breaks a URL into an object
  // parseUri 1.2.2
  // (c) Steven Levithan <stevenlevithan.com>
  // MIT License

  function parseUri(d) {
      for (var a = parseUri.options, d = a.parser[a.strictMode ? "strict" : "loose"].exec(d), c = {}, b = 14; b--;) c[a.key[b]] = d[b] || "";
      c[a.q.name] = {};
      c[a.key[12]].replace(a.q.parser, function(d, b, e) {
          b && (c[a.q.name][b] = e)
      });
      return c
  }

  parseUri.options = {
      strictMode: !1,
      key: "source protocol authority userInfo user password host port relative path directory file query anchor".split(" "),
      q: {
          name: "queryKey",
          parser: /(?:^|&)([^&=]*)=?([^&]*)/g
      },
      parser: {
          strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
          loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
      }
  };

  return parseUri;

}());

/* jshint ignore:end */
