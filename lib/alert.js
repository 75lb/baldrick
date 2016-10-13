'use strict'
const cp = require('child_process')

exports.say = say
exports.bell = bell

function say (msg) {
  cp.exec('say ' + msg)
}

function bell () {
  console.log('\u0007')
}
