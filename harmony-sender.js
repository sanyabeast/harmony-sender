"use strict";
define(["harmony", "file!sender.js", "file!superagent.js"], function(harmony, senderSource, superagentSource){

    var sender;

    var Sender = function(newInstance){
        if (sender instanceof Sender && newInstance !== true){
            return sender;
        }

        this.harmony = harmony;

        harmony.eval("harmony-sender", superagentSource);
        harmony.eval("harmony-sender", senderSource);
        harmony.run("harmony-sender", function(){
            self.sender.onResponse = function(){
                post(arguments);
            }
        });

        harmony.on("harmony-sender", this.__onMessage.bind(this));
        sender = this;
    };

    Sender.prototype = {
        __onMessage : function(data){
            console.log(data);
        }
    };

    return new Sender;

});