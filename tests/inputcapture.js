var readline = require('readline')
,	os = require('os')
,	path = require('path')
, 	fs = require('fs');



var rl = readline.createInterface({
	input : process.stdin,
	output : process.stdout
});

/*
var keepGoing = "";
while (keepGoing.toLowerCase() !== 'bye') {
		
	rl.question("Next command (type 'bye' to leave): ", function(answer) {
		// TODO: Log the answer in a database
		// console.log("Thank you for your valuable feedback:", answer);
		keepGoing = answer;
		
		console.log('Processing: ' + answer);
		output.write(answer + "\n");
		
	});

}

*/

function captureInput() {

	var cmdFifoPath = path.join(os.tmpdir(),'mp_cmd_pipe');
	console.log("Writing FIFO: " + cmdFifoPath);
	
	rl.question("Next command (type 'bye' to leave): ", function(answer) {
		
		var output = fs.createWriteStream(cmdFifoPath, {
			flags: 'a+'
		});
		
		/*
		var output = fs.createWriteStream('/var/tmp/jdw_pipe', {
			flags: 'w',
			start: 0
		});
		*/
		
		if (answer.toLowerCase().trim() === "bye") {
			rl.close();
			return;
		}

		console.log('Processing: ' + answer);
		output.write(answer + "\n");
		
		setTimeout(function() {
			captureInput();
		}, 100);
		
	});
	
}

captureInput();