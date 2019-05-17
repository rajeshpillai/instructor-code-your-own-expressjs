// usage: log('inside coolFunc',this,arguments);
// http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
const log = function(){
    log.history = log.history || [];   // store logs to an array for reference
    log.history.push(arguments);
    console.log( Array.prototype.slice.call(arguments) );
};

module.exports = log;