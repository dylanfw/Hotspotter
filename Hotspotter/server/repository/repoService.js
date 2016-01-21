/**
 * Created by SmithS on 01/12/2016.
 */

var File = require('../file/fileModel');
var async = require("async");

// exports.createTree = function (files, res) {
// 	var Max = 0;
//     var Min = Number.MAX_VALUE;
    
    
//     async.each(files, function (file, callback) {
//         if (files.length == 1) {
//             Min = 0; Max = file.Commits;
//         } else {
//             if (file.Commits > Max) {
//                 Max=file.Commits;
//             }
//             if (file.Commits < Min) {
//                 Min=file.Commits;
//             }
//         }
//         callback();
//     },
//     function (err) {
//         var treeData = {folders: [], files: []};
//         var tree = treeData;
//         async.each(files, function (filePaths, callback1) {
//             // remove tempProject and git hash directory
//             var pathTrim = filePaths.FullPath.replace(/tempProjects\/[^\/]*\//,'');
//             var pathSplit = pathTrim.replace(/\//g,'/,').split(/,/);

//             async.each(pathSplit, function (path, callback2) {
//                  // ignore '/' root directory
//                 if (path != '/') {
//                     // insert file name
//                     if (path.indexOf('/') < 0) {
//                         tree.files.push({name: path, score: (1-((filePaths.Commits-Min)/(Max-Min)))});
//                     } else {
//                     // insert directory name
//                     // find next directory in path
//                     async.each(tree.folders, function (folder, callback3) {
//                         if (folder.name == path) {
//                             tree = folder;
//                             var found = new Error();
//                             found.break = true;
//                             return callback3(found);
//                         } 
//                         callback3();
//                     },
//                     function (err) {
//                         // directory doesn't exists so create folder object
//                         if (err && err.break) {
//                             // do nothing
//                         } else {
//                             tree.folders.push({name: path, folders: [], files: []});
//                             tree = tree.folders[tree.folders.length-1];
//                         }
//                     });
//                     }
//                 }
//                 callback2();
//             },
//             function (err) {
//                 tree = treeData;
//             });
//         callback1();

//         },
//         function (err) {
//             res(treeData, err);
//         });
    
//     });
// };

exports.createTree = function (files, res) {
    var Max = 0;
    var Min = Number.MAX_VALUE;
    var treeData = {folders: [], files: []};
    // tree pointer
    var tree = treeData;

    for (var i = 0; i < files.length;i++) {
        if (files.length == 1) {
            Min = 0; Max = files[i].Commits;
            break;
        } else {
            if (files[i].Commits > Max) {
                Max=files[i].Commits;
            }
            if (files[i].Commits < Min) {
                Min=files[i].Commits;
            }
        }
    }

    for (var i = 0; i < files.length;i++) {
        // remove tempProject and git hash directory
        var pathTrim = files[i].FullPath.replace(/tempProjects\/[^\/]*\//,'');
        // split full file path
        var path = pathTrim.replace(/\//g,'/,').split(/,/);

        for (var j = 0; j < path.length;j++) {
            // ignore '/' root directory
            if (path[j] != '/') {
                // insert file name
                if (path[j].indexOf('/') < 0) {
                    tree.files.push({name: path[j], score: (1-((files[i].Commits-Min)/(Max-Min)))});
                } else {
                // find next directory in path
                    var found = 0;
                    for (var k = 0; k < tree.folders.length;k++) {
                        if (tree.folders[k].name == path[j]) {
                            tree = tree.folders[k];
                            found = 1;
                            break;
                        } 
                    }
                
                    if (!found) {
                        // directory doesn't exists so create folder object
                        tree.folders.push({name: path[j], folders: [], files: []});
                        tree = tree.folders[tree.folders.length-1];
                    }
                }
            }
        }
        //reset pointer
        tree = treeData
    }
    res(treeData);
}

 


    

    

    