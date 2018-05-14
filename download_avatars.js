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
    cb(err, body);
  });
}


getRepoContributors('lighthouse-labs', 'tweeter', function(err, result){
  console.log("Errors:", err);
  console.log("Result:", result);
});