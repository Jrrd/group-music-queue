group-music-queue
=================

This was started as a fun project.  Our goal was to create a network resource that will play a shared music queue 
that is populated by many network clients.


Seems like we will have multiple components:

 - central music server
 	- CODEC decoders (mp3, aac, etc)
 	- provides audio device to play music (local sounds to start -- future: allow connection to airplay devices)
 	- may be able to parse all available songs on the network by sharing itunes library files
 
 - generic queue
 
 - server webapp
 	- standard media controls
 
 - client 
 	- maybe parse itunes library file
 	- submit local files to the shared queue (path and authentication information passed to server?)   