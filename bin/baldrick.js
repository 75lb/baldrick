#!/usr/bin/env node
"use strict";
var cliArgs = require("command-line-args");
var fs = require("fs");
var FileSet = require("file-set");
var cp = require("child_process");
var dope = require("console-dope");
var s = require("string-tools");
var alert = require("../lib/alert");

var cli = cliArgs([
    { name: "do", type: String },
    { name: "when", type: Array, defaultOption: true },
    { name: "change", type: Boolean },
    { name: "speak", alias: "s", type: Boolean },
    { name: "pollInterval", alias: "p", value: 1000 }
]);
var usage = cli.getUsage({ forms: [ "$ baldrick <options>" ] })

try {
    var argv = cli.parse();
} catch(err){
    halt(err.message);
}

if (!(argv.do && argv.when)) halt("Must specify --do and --when");

var fileSet = new FileSet(argv.when);

fileSet.files.forEach(function(file){
    fs.watchFile(file, { interval: argv.pollInterval }, function(curr, prev){
        dope.bold.underline.log("%s touched", file);
        if (argv.change && (curr.mtime.getTime() > prev.mtime.getTime())){
            cp.exec(argv.do, function(err, stdout, stderr){
                if (err){
                    alert.bell();
                    if (argv.speak) alert.say("i fucked up!");
                    dope.red.bold.log("%s fucked up", s.symbol.cross);
                    dope.log(err.message);
                } else {
                    if (argv.speak) alert.say("my lord");
                    dope.bold.green.log("%s work done", s.symbol.tick);
                    if (stdout || stderr){
                        dope.bold.log("\noutput");
                        if (stdout) dope.log(stdout);
                        if (stderr) dope.log(stderr);
                    }
                }
            });
        }
    });
});

function halt(msg){
    dope.red.error("Error: " + msg);
    dope.log(usage);
    process.exit(1);
}
