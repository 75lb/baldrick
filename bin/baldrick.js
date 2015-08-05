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
    { name: "when", type: String, multiple: true, defaultOption: true },
    { name: "change", type: Boolean },
    { name: "speak", alias: "s", type: Boolean },
    { name: "poll-interval", alias: "p", type: Number, defaultValue: 1000 },
    { name: "help", alias: "h", type: Boolean },
    { name: "verbose", alias: "v", type: Boolean }
]);

var usage = cli.getUsage({ 
    title: "[bold]{baldrick}",
    description: "A general-purpose filesystem-watch-and-respond tool.",
    usage: {
        title: "[bold]{Usage}",
        forms: [ 
            "$ baldrick --do <command> --when <files> [--change] [--speak] [--poll-interval <number>]",
            "$ baldrick --help" 
        ]
    },
    footer: "Project page: [underline]{https://github.com/75lb/baldrick}"
});

try {
    var options = cli.parse();
} catch(err){
    halt(err.message);
}

if (options.help){
    console.log(usage);
    process.exit(0);
}

if (!(options.do && options.when)) halt("Must specify --do and --when");

var fileSet = new FileSet(options.when);

if (options.verbose){
    console.log(fileSet.files.join("\n"));
}

function runDo(){
    cp.exec(options.do, function(err, stdout, stderr){
        if (err){
            alert.bell();
            if (options.speak) alert.say("i fucked up!");
            dope.red.bold.log("%s fucked up", s.symbol.cross);
            dope.log(err.message);
        } else {
            if (options.speak) alert.say("my lord");
            dope.bold.green.log("%s work done", s.symbol.tick);
            if (stdout || stderr){
                dope.bold.log("\noutput");
                if (stdout) dope.log(stdout);
                if (stderr) dope.log(stderr);
            }
        }
    });
}

function onFileChange(file, curr, prev){
    dope.bold.underline.log("%s touched", file);
    if (options.change && (curr.mtime.getTime() > prev.mtime.getTime())){
        runDo();
    }
}

fileSet.files.forEach(function(file){
    fs.watchFile(file, { interval: options["poll-interval"] }, onFileChange.bind(null, file));
});
runDo();

function halt(msg){
    dope.red.error("Error: " + msg);
    dope.log(usage);
    process.exit(1);
}
