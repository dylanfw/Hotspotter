/**
 * Created by SmithS on 01/29/2016.
 */

var mongoose = require('mongoose')

var Commit = mongoose.Schema({
    Time: Date,
    BugFix: Boolean
})

module.exports = mongoose.model('Commit', Commit)