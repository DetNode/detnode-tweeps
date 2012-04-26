var Twitter = require('ntwitter');

var twitter = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var whoami;
twitter.verifyCredentials(function(err, data) {
  whoami = data.screen_name;
  var params = { geocode: '42.3319,-83.046513,60mi', rpp: 100 };
  twitter.search('#nodejs OR nodejs OR node.js', params, function(err, data) {
    data.results.forEach(function(tweet) {
      console.log(stylize(tweet.from_user) + ':', tweet.text);
    });
  });
});



var colorIndex = 0;
function stylize(str) {
  if (str === whoami) {
    return rainbowize(str);
  }

  var colors = ['cyan', 'magenta', 'yellow', 'red', 'green', 'blue', ];
  colorIndex = (colorIndex == colors.length - 1) ? 0 : colorIndex + 1;
  return wrapStyle(str, colors[colorIndex]);
}

function rainbowize(str) {
  var colors = ['red', 'yellow', 'green', 'blue'];
  var rainbow = '';
  var index = 0;
  str.split('').forEach(function(s) {
    rainbow += wrapStyle(s, colors[index]);
    index = (index == colors.length - 1) ? 0 : index + 1;
  });

  return rainbow;
}

function wrapStyle(str, styles) {
  if (typeof styles == 'string') {
    styles = [styles];
  }

  var allStyles = {
    'blue': ['\033[34m', '\033[39m'],
    'cyan': ['\033[36m', '\033[39m'],
    'green': ['\033[32m', '\033[39m'],
    'magenta': ['\033[35m', '\033[39m'],
    'red': ['\033[31m', '\033[39m'],
    'yellow': ['\033[33m', '\033[39m'],
  };

  function addStyle(str, style) {
    return style[0] + str + style[1];
  }

  var stylized = str;
  styles.forEach(function(style) {
    stylized = addStyle(stylized, allStyles[style]);
  });

  return stylized;
}
