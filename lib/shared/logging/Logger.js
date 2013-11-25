
var log4js = require('log4js')
,	path  = require('path')
;

/*
  ALL: new Level(Number.MIN_VALUE, "ALL"), 
  TRACE: new Level(5000, "TRACE"), 
  DEBUG: new Level(10000, "DEBUG"), 
  INFO: new Level(20000, "INFO"), 
  WARN: new Level(30000, "WARN"), 
  ERROR: new Level(40000, "ERROR"), 
  FATAL: new Level(50000, "FATAL"), 
  OFF: new Level(Number.MAX_VALUE, "OFF"),
*/

log4js.configure( path.join(__dirname, "/log4jsconfig.json") );

module.exports = log4js;
