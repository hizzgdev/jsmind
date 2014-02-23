function read_from_ajax(url,fn_callback){
    jsMind.util.ajax.get(url,function(data){
        if(typeof(fn_callback) === 'function'){
            fn_callback(data);
        }
    });
}

function save_to_ajax(options,mind,fn_callback){
    // not support yet
}

// filedata: the file object in html5
function read_from_localfile(filedata,fn_callback){
    jsMind.util.file.read(filedata,function(data){
        var mind = jsMind.util.json.string2json(data);
        if(typeof(fn_callback) === 'function'){
            fn_callback(mind);
        }
    });
}

function save_to_localfile(mind_data,mind_name,fn_callback){
    var mind_str = jsMind.util.json.json2string(mind_data);
    jsMind.util.file.save(mind_str,'text/jsmind',mind_name+'.jm');
    if(typeof(fn_callback) === 'function'){
        fn_callback('success');
    }
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
