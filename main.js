requirejs.config({
    paths : {
        "harmony" : "node_modules/harmony/harmony",
        "sender" : "node_modules/sender/sender",
        "superagent" : "node_modules/superagent/superagent",
        "file" : "node_modules/requirejs-text/text",
    }
});

requirejs(["harmony-sender"], function(sender){

    window.sender = sender;

});