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
    { name: "do", type: String, multiple: true },
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

validate();
watchFiles(options.when);

function runCommand(file, command){
    if (file){
        command = command.replace(/{{file}}/g, file);
    }
    if (/{{file}}/.test(command)) return;
    
    cp.exec(command, function(err, stdout, stderr){
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

function watchFiles(whenExpression){
    var fileSet = new FileSet(whenExpression);

    fileSet.files.forEach(function(file){
        if (options.verbose){
            console.log(file);
        }

        fs.watchFile(file, { interval: options["poll-interval"] }, function(currStat, prevStat){
            dope.bold.underline.log("%s touched", file);
            if (options.change && (currStat.mtime.getTime() > prevStat.mtime.getTime())){
                options.do.forEach(runCommand.bind(null, file));
            }
        });
    });    
}
options.do.forEach(runCommand.bind(null, null));

function halt(msg){
    dope.red.error("Error: " + msg);
    dope.log(usage);
    process.exit(1);
}

function validate(){
    if (!(options.do.length && options.when)) halt("Must specify --do and --when");
}
