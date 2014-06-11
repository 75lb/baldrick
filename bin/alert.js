var cp = require("child_process");

exports.say = say;
exports.bell = bell;

function say(msg){
    cp.exec("say -v Ralph " + msg);
}

function bell(){
    console.log("\u0007")
}
