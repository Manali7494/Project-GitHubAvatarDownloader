var request = require('request');
require('dotenv/config');
var token = process.env.GITHUB_TOKEN;
var fs = require('fs');
var owner = "";
var name = "";
var errorLogs = ["Please enter two variables: 1) owner name 2) repo name", "Please enter a valid owner name and repo name"];
if (process.argv.length > 4 || process.argv.length < 3){
  console.log(errorLogs[0]);
} else{
  owner = process.argv[2];
  name = process.argv[3];
}
function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': "token " + token
    }
  };
  request(options, function(err, res, body) {
    var parsedBody = JSON.parse(body);
    cb(err, parsedBody);
  });
}

function downloadImageByURL(url, filePath){
  request.get(url)
    .on('error', function(err){
      console.log(err);
    })
    .pipe(fs.createWriteStream(filePath));
}

if (owner !== "" && name !== ""){
  getRepoContributors(owner, name, function(err, parsedBody){
    var array = parsedBody;
    if (array.message === 'Not Found') {
      console.log(errorLogs[1]);
    } else{
      console.log('Welcome to the Github Avatar Downloader');
      console.log("Errors:", err);
      array.forEach(function(element, index) {
        if (!fs.existsSync('./avatars')){
          fs.mkdirSync('./avatars');
        }
        var filePath = "./avatars/" + element["login"] + ".jpg";
        var url = element["avatar_url"];
        downloadImageByURL(url, filePath);
      });
    }
  });
}