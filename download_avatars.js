var request = require('request');
require('dotenv/config');
var fs = require('fs');
var token = process.env.GITHUB_TOKEN;
var owner = "";
var name = "";

// Error Handling: Checking if .env file exists and token added under GITHUB_TOKEN value
if (!fs.existsSync("./.env")){
  console.log("Please add .env file in your folder");
} else if (token === undefined){
  console.log("Please add your github token in .env file and under 'GITHUB_TOKEN' key ");
}

// Error Handling: Checks if user added too little or too many arguments
if (process.argv.length > 4 || process.argv.length < 3){
  console.log("Please enter two variables: 1) owner name 2) repo name ");
} else{
  owner = process.argv[2];
  name = process.argv[3];
}

// Request to be sent to GitHub API
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

// Function for image download
function downloadImageByURL(url, filePath){
  request.get(url)
    .on('error', function(err){
      console.log(err);
    })
    .pipe(fs.createWriteStream(filePath));
}

// Function call to download pictures if there are no errors. Also, adds avatar folder if it doesn't already exist.
if (owner !== "" && name !== "" && token !== undefined){
  getRepoContributors(owner, name, function(err, parsedBody){
    var array = parsedBody;
    if (array.message === 'Not Found') {
      console.log("Please enter a valid owner name and repo name");
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