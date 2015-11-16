/**
 * Created by natem on 10/25/2015.
 */
var localPath = ('./tempProjects');
var File = require('../file/fileModel');
var simpleGit = require('simple-git')(localPath);
var async = require("async");


exports.gitCheckout = function (repoURL){
    console.log("REPO URL: " + repoURL);
    simpleGit
        .outputHandler(function (command, stdout, stderr) {
            stdout.pipe(process.stdout);
            stderr.pipe(process.stderr);
        })
        .clone(repoURL,localPath);
};

exports.gitLogCommits = function (filePaths, res) {
    var files = [];
    async.each(filePaths, function (filePath, callback) {
        simpleGit.log({'file': filePath.replace('tempProjects/', '')}, function (err, log) {
            files.push(new File({
                Name: filePath,
                Commits: log.total
            }));
            callback();
        });
    },
    function (err) {
        console.log(files);
        res(files);
    });
};
