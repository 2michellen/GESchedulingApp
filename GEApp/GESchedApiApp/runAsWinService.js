/////////////////////////////////////////////////////////////////////////////////////
// Run this node.js server app as a Windows service in the background.
// Update the name, description and path accordingly. To run:
// node runAsWinService.js
// Use -u argument to uninstall:
// node runAsWinService.js -u
//
// Prerequisite:
// https://github.com/coreybutler/node-windows
// The recommended way to install node-windows is with npm, using the global flag:
// npm install node-windows
// Then, in your project root, run:
// npm link node-windows
/////////////////////////////////////////////////////////////////////////////////////

const fs = require('fs'); // File system.
const Service = require('node-windows').Service;

const args = process.argv; 
var scriptParam = null;
if (args.length == 3 && args[2] != null) { scriptParam = args[2]; }

var doInstallation = true;
if (scriptParam == "-u" || scriptParam == "--uninstall") {
    doInstallation = false;
}

var serverExecPath = null;
var serverExecPathSufix = ':\\GESchedulingApp\\GESchedulingApp\\GEApp\\GESchedApiApp\\server.js';

var drives = ['C','D','E','F','G','H','I','X','Y','Z'];

var foundPath = false;
drives.forEach((drive) => {
    if (!foundPath) {
        serverExecPath = drive + serverExecPathSufix;
        if (fs.existsSync(serverExecPath)) {
            foundPath = true;
        }
    }
});

// Create a new service object
const svc = new Service({
  name:'GE-MeetingRequestApp',
  description: 'The GE Meeting Request Web App.',
  script: serverExecPath,
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});



if (doInstallation) {

    svc.on('install',function(){
        svc.start(); // start it after installation.
    });
    svc.install();

} else {
    svc.uninstall();
}

const delyInSecs = 6;
setInterval(() => process.exit(), delyInSecs * 1000); // Ensures enough time for installation callback to start service.