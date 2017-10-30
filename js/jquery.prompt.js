;
if ( typeof Object.create !== 'function' ) {
    Object.create = function( obj ) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}
(function($, window, document, undefined ){
    "use strict";
    var Prompt = {
    	init:function(options,elem){
			this.prepareOptions(options, $.prompt.options);
		    this.addToDom();
			this.animate();
    	},
    	prepareOptions: function(options, options_to_extend) {
            var _options = {};
            if ( ( typeof options === 'string' ) || ( options instanceof Array ) ) {
                _options.text = options;
            } else {
                _options = options;
            }
            this.options = $.extend( {}, options_to_extend, _options );
        },
        addToDom: function(){
        	var container = $('<div id="promptContainer" style="width:1200px;position: absolute;z-index:999;margin: 300px;padding: 25px;background-color: rgba(0,0,0,0.5);text-align:center;font-size: 100px;border-radius: 40px;"><p style="color: #ffffff;"></p></div>');
		    container.find("p:eq(0)").text(this.options.text);
			$('#wrapper').prepend(container);
        },
        animate: function(){
        	window.setTimeout(function(){
        		$("#promptContainer").remove();
        	},this.options.time);
        }

    }

    $.prompt = function(options) {
        var prompt = Object.create(Prompt);
        prompt.init(options, this);
        return {
            
           
        }
    };

    $.prompt.options = {
        text: '',
        time:3000
    };
})(jQuery,window, document );