
var util = require('util'),
	events = require('events');

function ObjectQueue(maxSize) {
	
    maxSize = maxSize || 0;
  
    var instance = this,
        queueArr = [];

    events.EventEmitter.call(instance);
    
    // add to back of queue
    instance.add = function(obj) {
        queueArr.unshift(obj);
        trim();
        instance.emit(instance.EVENTS.ITEM_NEW);
    };
    
    // add to front of queue
    instance.push = function(obj) {
    	queueArr.push(obj);
    	trim();
    	instance.emit(instance.EVENTS.ITEM_NEW);
    };
    
    instance.getLast = function() {
    	var item = queueArr.shift();
    	hasItems();
    	
    	return item;
    };
    
    instance.getNext = function() {
    	var item = queueArr.pop();
    	hasItems();
    	
    	return item;
    };
    
    
    instance.getArray = function() {
        return [].concat(queueArr);
    };
    
    instance.getLength = function() {
    	return queueArr.length;
    };
    
    function hasItems() {
    	if (queueArr.length < 1) {
    		instance.emit(instance.EVENTS.QUEUE_EMPTY);
    		return false;
    	}
    	return true;
    }
    
    function trim() {
        if (maxSize > 0) {
            while(queueArr.length > maxSize) {
                instance.emit(instance.EVENTS.ITEM_DROPPED, instance.getLast());
            }
            
            if (queueArr.length === maxSize) {
            	instance.emit(instance.EVENTS.QUEUE_FULL);
            }
        }
    }
    
}
util.inherits(ObjectQueue, events.EventEmitter);

ObjectQueue.prototype.EVENTS = {
		QUEUE_EMPTY 	: "queue-empty",
		QUEUE_FULL 		: "queue-full",
		ITEM_DROPPED 	: "item-dropped",
		ITEM_NEW 		: "item-new"
};

module.exports = ObjectQueue;