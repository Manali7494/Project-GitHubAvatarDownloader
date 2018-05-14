var request = require('request');
var token = ("secrets").GITHUB_TOKEN;

console.log('Welcome to the Github Avatar Downloader');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': token
    }
  };
  request(options, function(err, res, body) {
    var parsedBody = JSON.parse(body);
    cb(err, parsedBody);
  });
}


getRepoContributors('jquery', 'jquery', function(err, parsedBody){
  console.log("Errors:", err);
  var array = parsedBody;
  array.forEach(function(element, index) {
    console.log(element["avatar_url"]);
  });
});