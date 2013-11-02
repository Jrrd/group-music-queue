
var _ = require('underscore');

function ObjectQueue(maxSize) {
    maxSize = maxSize || 0;
  
    var instance = this,
        queueArr = [];
    
    instance.add = function(obj) {
        queueArr.push(obj);
        trim();
    };
    
    instance.remove = function() {
        return queueArr.shift();
    };
    
    instance.getArray = function() {
        return [].concat(queueArr);
    };
    
    function trim() {
        if (maxSize > 0) {
            while(queueArr.length > maxSize) {
                instance.remove();
            }
        }
    }
    
}

module.exports = ObjectQueue;