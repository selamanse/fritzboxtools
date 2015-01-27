fritzboxtools
=============

this is a module for nodejs.
It can get Smart Home Data from your fritz!Box, turn on and off Fritz!DECT 200 Outlets.
 
currently developed and tested on mac osx maverics.
currently tested as metrics collecting application running on Arch Linux ARM (on RaspberryPi)

depends on following node modules:

- http (included in nodejs)
- util (included in nodejs)
- xml2js
- MD5
- optimist (only for examples and restproxy)
- express (only for restproxy)

These tools are currently in progress of development but can be used for developing apps on top of it.

fritzboxtools.js represents a working reimplementation of the session-id based example of 
the http interface action for avm-products described in this document:

http://www.avm.de/de/Extern/files/session_id/AVM_Technical_Note_-_Session_ID.pdf

STATE: INTEGRATABLE BUT STILL PREALPHA...use at own risk...

Example: At the moment I use it to collect temperature Data from Fritz!DECT 200 outlets. Look further into metrics.js example.