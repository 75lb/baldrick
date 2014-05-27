#!/usr/bin/env node
"use strict";

var parseArgv = require("command-line-args"),
    fs = require("fs"),
    mfs = require("more-fs"),
    cp = require("child_process"),
    dope = require("console-dope"),
    w = require("wodge"),
    alert = require("./alert");

var argv = parseArgv([
    { name: "do", type: String },
    { name: "when", type: Array, defaultOption: true },
    { name: "change", type: Boolean }
]);

var fileSet = new mfs.FileSet(argv.when);

fileSet.files.forEach(function(file){
    fs.watchFile(file, { interval: 2000 }, function(curr, prev){
        dope.bold.underline.log("%s touched", file);
        if (argv.change && (curr.mtime.getTime() > prev.mtime.getTime())){
            cp.exec(argv.do, function(err, stdout, stderr){
                if (err){
                    alert.bell();
                    dope.red.bold.log("%s fucked up", w.symbol.cross);
                    dope.log(err.message);
                } else {
                    dope.bold.green.log("%s work done", w.symbol.tick);
                }
                if (stdout || stderr){
                    dope.bold.log("\noutput");
                    if (stdout) dope.log(stdout);
                    if (stderr) dope.log(stderr);
                }
            });
        }
    });
});
