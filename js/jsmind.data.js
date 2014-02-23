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
    jsMind.util.file.read(options.data,function(data){
        var mind = jsMind.util.json.string2json(data);
        if(typeof(fn_callback) === 'function'){
            fn_callback(mind);
        }
    });
}

function save_mind_localfile(options,mind,fn_callback){
    var mind_str = jsMind.util.json.json2string(mind.data);
    jsMind.util.file.save(mind_str,'text/jsmind',mind.name+'.jm');
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
