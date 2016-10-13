#!/usr/bin/env node
'use strict'
const tool = require('command-line-tool')
const fs = require('fs')
const FileSet = require('file-set')
const cp = require('child_process')
const alert = require('../lib/alert')

const defs = [
  { name: 'do', type: String, multiple: true, typeLabel: '<commands>' },
  { name: 'when', type: String, multiple: true, defaultOption: true, typeLabel: '<files>'},
  { name: 'change', type: Boolean },
  { name: 'speak', alias: 's', type: Boolean },
  { name: 'poll-interval', alias: 'p', type: Number, defaultValue: 1000, typeLabel: '<ms>' },
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'verbose', alias: 'v', type: Boolean }
]

const usageSections = [
  {
    header: 'baldrick',
    content: 'A general-purpose filesystem watch-and-respond tool.'
  },
  {
    header: 'Synopsis',
    content: [
      '$ baldrick --do <command> --when <files> [--change] [--speak] [--poll-interval <ms>]',
      '$ baldrick --help'
    ]
  },
  {
    header: 'Options',
    optionList: defs
  },
  {
    content: 'Project page: [underline]{https://github.com/75lb/baldrick}'
  }
]

let cli
try {
  cli = tool.getCli(defs, usageSections)
} catch(err) {
  tool.halt(err)
}
const options = cli.options
if (options.help) {
  tool.stop(cli.usage)
}

validate()
watchFiles(options.when)

function runCommand (file, command) {
  if (file) {
    command = command.replace(/{{file}}/g, file)
  }
  if (/{{file}}/.test(command)) return

  cp.exec(command, function (err, stdout, stderr) {
    if (err) {
      alert.bell()
      if (options.speak) alert.say('i fucked up!')
      tool.printOutput('[red]{✖ fucked up}')
      console.log(err.message)
    } else {
      if (options.speak) alert.say('my lord')
      tool.printOutput('[green]{✔︎ work done}')
      if (stdout || stderr) {
        tool.printOutput('[bold]{\noutput}')
        if (stdout) console.log(stdout)
        if (stderr) console.log(stderr)
      }
    }
  })
}

function watchFiles (whenExpression) {
  const fileSet = new FileSet(whenExpression)

  fileSet.files.forEach(function (file) {
    if (options.verbose) {
      console.log(file)
    }

    fs.watchFile(file, { interval: options['poll-interval']}, function (currStat, prevStat) {
      tool.printOutput(`[bold underline]{${file} touched}`)
      if (options.change && (currStat.mtime.getTime() > prevStat.mtime.getTime())) {
        options.do.forEach(runCommand.bind(null, file))
      }
    })
  })
}
options.do.forEach(runCommand.bind(null, null))

function validate () {
  if (!(options.do.length && options.when)) halt('Must specify --do and --when')
}
