group-music-queue
=================
Introduction
------------
This was started as a fun project.  Our initial goal was to create a network resource that will play a shared music queue 
that is populated by one or more network clients.

To install necessary dependencies, run the following command:
    
	npm install


To start the server, first look at the [install wiki page](https://github.com/Jrrd/group-music-queue/wiki/Server-Install-and-Additional-Requirements) and then run the following command

	node ./launch-server.js

To start a client, run the following command

	node ./launch-client.js

Components
----------
 - central music server
 	- CODEC decoders (mp3, aac, etc)
 	- provides audio device to play music (local sounds to start -- future: allow connection to airplay devices)
 	- may be able to parse all available songs on the network by sharing itunes library files
 
 - server webapp
 	- standard media controls
 	- configure audio output
 	- generic queue module
 
 - client 
 	- maybe parse itunes library file
 	- submit local files to the shared queue (path and authentication information passed to server?)   

Indexing
--------
Indexing takes place on each client producing a JSON file in the following format:

	{
		clientid : <client identifier>,
		songs : [
			{
				id : <song identifier>,
				path : <path to music file>,
				metadata : 
				{
					artist : ['Spor'],
					album : 'Nightlife, Vol 5.',
					albumartist : [ 'Andy C', 'Spor' ],
					title : 'Stronger',
					year : '2010',
					track : { no : 1, of : 44 },
					disk : { no : 1, of : 2 },
					picture : [ { format : 'jpg', data : <Buffer> } ]
				}
			},
			...
		]
	}
