function load_mind_ajax(options,fn_callback){
    var url = options.url;
    jsMind.util.ajax.get(url,function(data){
        if(typeof(fn_callback) === 'function'){
            fn_callback(data);
        }
    });
}

function save_mind_ajax(options,mind,fn_callback){
    // not support yet
}

function load_mind_localfile(options,fn_callback){
    // not support yet
}

function save_mind_localfile(options,mind,fn_callback){
    // not support yet
}

function load_mind_dropbox(options,fn_callback){
    // not support yet
}

function save_mind_dropbox(options,mind,fn_callback){
    // not support yet
}

function load_mind_jsmindserver(options,fn_callback){
    // not support yet
}

function save_mind_jsmindserver(options,mind,fn_callback){
    // not support yet
}
