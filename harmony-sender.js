"use strict";
define(["harmony", "file!sender.js", "file!superagent.js"], function(harmony, senderSource, superagentSource){

    var sender;

    var Sender = function(newInstance){
        if (sender instanceof Sender && newInstance !== true){
            return sender;
        }

        sender = this;

        this.harmony = harmony;

        harmony.eval("harmony-sender", superagentSource);
        harmony.eval("harmony-sender", senderSource);
        harmony.run("harmony-sender", function(){
            self.sender.onResponse = function(response){
                if (response.request.callback){
                    delete response.request.callback;
                }

                var postResponse = {
                    body : response.body,
                    error : response.error ? {
                        code : response.error.code,
                        message : response.error.message,
                        name : response.error.name,
                        stack : response.error.stack
                    } : null,
                    name : response.name,
                    options : response.options,
                    request : response.request,
                    response : response.response ? {
                        ok : response.response.ok,
                        status : response.response.status,
                        statusCode : response.response.statusCode,
                        text : response.response.text,
                        error : response.response.error ? {
                            method : response.response.error.method,
                            status : response.response.error.status,
                            url : response.response.error.url,
                            message : response.response.error.message,
                        } : null,
                        badRequest : response.response.badRequest
                    } : null
                };

                postResponse.extra = postResponse.request.extra;

                postResponse.content = postResponse.body;

                post(postResponse);
            }
        });

        harmony.on("harmony-sender", this.__onMessage.bind(this));
        sender = this;
    };

    Sender.prototype = {
        __onMessage : function(response){
            if (this.onResponse) this.onResponse(response);
        },
        request : function(options, data){

            if (data && typeof data.callback == "function") data.callback = this.harmony.callback(data.callback);

            this.harmony.run("harmony-sender", function(data){
                if (data.data && data.data.callback) data.data.callback = __toFunc(data.data.callback);
                self.sender.request(data.options, data.data);
            }, {
                options : options,
                data : data
            });
        },
        set presets(presets){
            this._presets = presets;
            this.harmony.run("harmony-sender", function(presets){
                self.sender.presets = presets;
            }, presets);

        },
        get presets(){ return this._presets },
        set vars(vars){
            this._vars = vars;
            this.harmony.run("harmony-sender", function(vars){
                self.sender.vars = vars;
            }, vars);
        },
        get vars(){ return this._vars },
        set : function(type, name, value){
            this.harmony.run("harmony-sender", function(data){
                self.sender.set(data.type, data.name, data.value);
            }, {
                type : type,
                name : name,
                value : value
            });
        }
    };

    return Sender;

});