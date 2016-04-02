/**
 * Created by natem on 10/25/2015.
 */
var localPath = ('./tempProjects')
var File      = require('../file/fileModel')
var Commit    = require('../commit/commitModel')
var fsService = require('../fs/fsService')
var async     = require("async")
var crypto    = require("crypto")
var diffParse = require("parse-diff")


var sha1      = function(input) {
  return crypto.createHash('sha1')
            .update(JSON.stringify(input))
            .digest('hex')
}


exports.gitCheckout = function (repoURL, callback) {
    var simpleGitClone = require('simple-git')()
    var repoURLHash = sha1(repoURL)
    var repoPath = localPath + "/" + repoURLHash
    console.log("REPO URL: " + repoURL)
    console.log("REPO HASH: " + repoURLHash)
    simpleGitClone
        .outputHandler(function (command, stdout, stderr) {
            stdout.pipe(process.stdout)
            stderr.pipe(process.stderr)
        })
        .clone(repoURL, repoPath, function(err) {
            if (err) callback(err)
            else callback(null)
        })
}

exports.gitPull = function (repoURL, callback) {
   
    var repoURLHash = sha1(repoURL)
    var repoPath = localPath + "/" + repoURLHash
    var simpleGitPull = require('simple-git')(repoPath)
    console.log("REPO URL: " + repoURL)
    console.log("REPO HASH: " + repoURLHash)
    simpleGitPull
        .outputHandler(function (command, stdout, stderr) {
            stdout.pipe(process.stdout)
            stderr.pipe(process.stderr)
        })
        .pull(repoURL, function(err) {
            if (err) callback(err)
            else callback(null)
        })
}

exports.gitLogCommits = function (repoPath, filePaths, repo, callback) {
    var simpleGit = require('simple-git')("./" + repoPath)
    var exec = require('child_process').exec;
    var files = []
    var FirstModified = new Date()
    var LastModified = new Date()
    //var Hashes = new Set()

    async.each(filePaths, function (filePath, callback) {

        var path = filePath.replace(repoPath + "/", '')
        simpleGit.log({'file': path}, function (err, log) {

            // Loop through commits in log and add to Commits array
            commits = []
            var commitsLog = log.all
            count = 0
            var fileHash = sha1(filePath)

            exec('git log -p --pretty=format:%H --follow ' + path + ' > ' + '.' + fileHash + '.txt',  { cwd: './'+repoPath }, function(err, std, stderr) {

                if (err) callback(err)

                var file = repoPath + '/' + '.' + fileHash + '.txt'
                fsService.extractDiff(file, function(err, diff_RAW) {
                    if (err) callback(err)
                    else {

                        async.each(commitsLog, function (commit, callback) {
                            // Determine if commit was a bug fixing commits
                            // Keywords taken from: https://stackoverflow.com/questions/1687262/link-to-github-issue-number-with-commit-
                            var bugfix = false
                            if(commit.message.indexOf('fix') != -1 ||
                                commit.message.indexOf('close') != -1 ||
                                commit.message.indexOf('resolve')!= -1) {
                                    bugfix = true
                            }

                            var hashIndex = diff_RAW.indexOf(commit.hash)
                            var newLineIndex = diff_RAW.indexOf('\n\n', hashIndex)

                            if (newLineIndex == -1) newLineIndex = diff_RAW.length-1;

                            console.log(hashIndex + " " + newLineIndex)

                            var diff = diff_RAW.substring(hashIndex, newLineIndex)

                            

                            commits.push(new Commit({
                                Time: commit.date,
                                Hash: commit.hash,
                                Author: commit.author_name,
                                BugFix: bugfix,
                                Diff_RAW: diff
                            })) 
                            callback() 

                        },
                        function(err) {

                            if (err) callback(err)
                            else {
                                files.push(new File({
                                    FullPath: filePath,
                                    Commits: commits
                                }))
                                callback()
                            }
                        })
                    }
                })
            })               
        })
    },
    function (err) {
        if(err) return callback(err)
        
        simpleGit.log(function (err, log) {
            repo.Files = files

            repo.FirstModified = log.all[log.all.length - 1].date
            repo.LastModified = log.all[0].date

            if (err) return callback(err)
            else return callback(null, repo)
        })
    })

}

exports.parseDiff = function(diff, callback) {

    // var hashIndex = data.indexOf(commit.hash)
    // var newLineIndex = data.indexOf('\n\n', hashIndex)

    // if (newLineIndex == -1) newLineIndex = data.length-1;

     //console.log(hashIndex + " " + newLineIndex)

    // var diffObject = null
    // var diff = std.substring(hashIndex, newLineIndex)

    // var content = [], additions, deletions, index = [], to, from, fileNew

    // if (diff.indexOf('similarity index 100%') == -1) {
    //     diffObject = diffParse(diff)

    //     content = diffObject[0].chunks
    //     additions = diffObject[0].additions
    //     deletions = diffObject[0].deletions
    //     index = diffObject[0].index
    //     to = diffObject[0].to
    //     from = diffObject[0].from
    //     fileNew = false
    //     if (diffObject[0].new) fileNew = true 

    // } else {
    //     content = []
    //     additions = 0
    //     deletions = 0
    //     index = []
    //     var toIndex = diff.indexOf('rename to') + 10
    //     var fromIndex = diff.indexOf('rename from') + 12
    //     to = diff.substring(toIndex, diff.length)
    //     from = diff.substring(fromIndex, diff.indexOf('\n', fromIndex))
    //     fileNew = false
    // }
}