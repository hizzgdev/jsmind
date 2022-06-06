/**
 * @license BSD
 * @copyright 2014-2022 hizzgdev@163.com
 *
 * Project Home:
 *   https://github.com/hizzgdev/jsmind/
 */

import { $ } from "./jsmind.dom.js";
import { logger } from "./jsmind.common.js";

export const util = {
    ajax: {
        _xhr: function () {
            var xhr = null;
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else {
                try {
                    xhr = new ActiveXObject('Microsoft.XMLHTTP');
                } catch (e) { }
            }
            return xhr;
        },
        _eurl: function (url) {
            return encodeURIComponent(url);
        },
        request: function (url, param, method, callback, fail_callback) {
            var a = util.ajax;
            var p = null;
            var tmp_param = [];
            for (var k in param) {
                tmp_param.push(a._eurl(k) + '=' + a._eurl(param[k]));
            }
            if (tmp_param.length > 0) {
                p = tmp_param.join('&');
            }
            var xhr = a._xhr();
            if (!xhr) { return; }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200 || xhr.status == 0) {
                        if (typeof callback === 'function') {
                            var data = util.json.string2json(xhr.responseText);
                            if (data != null) {
                                callback(data);
                            } else {
                                callback(xhr.responseText);
                            }
                        }
                    } else {
                        if (typeof fail_callback === 'function') {
                            fail_callback(xhr);
                        } else {
                            logger.error('xhr request failed.', xhr);
                        }
                    }
                }
            }
            method = method || 'GET';
            xhr.open(method, url, true);
            xhr.setRequestHeader('If-Modified-Since', '0');
            if (method == 'POST') {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
                xhr.send(p);
            } else {
                xhr.send();
            }
        },
        get: function (url, callback) {
            return util.ajax.request(url, {}, 'GET', callback);
        },
        post: function (url, param, callback) {
            return util.ajax.request(url, param, 'POST', callback);
        }
    },

    file: {
        read: function (file_data, fn_callback) {
            var reader = new FileReader();
            reader.onload = function () {
                if (typeof fn_callback === 'function') {
                    fn_callback(this.result, file_data.name);
                }
            };
            reader.readAsText(file_data);
        },

        save: function (file_data, type, name) {
            var blob;
            if (typeof $.w.Blob === 'function') {
                blob = new Blob([file_data], { type: type });
            } else {
                var BlobBuilder = $.w.BlobBuilder || $.w.MozBlobBuilder || $.w.WebKitBlobBuilder || $.w.MSBlobBuilder;
                var bb = new BlobBuilder();
                bb.append(file_data);
                blob = bb.getBlob(type);
            }
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(blob, name);
            } else {
                var URL = $.w.URL || $.w.webkitURL;
                var bloburl = URL.createObjectURL(blob);
                var anchor = $.c('a');
                if ('download' in anchor) {
                    anchor.style.visibility = 'hidden';
                    anchor.href = bloburl;
                    anchor.download = name;
                    $.d.body.appendChild(anchor);
                    var evt = $.d.createEvent('MouseEvents');
                    evt.initEvent('click', true, true);
                    anchor.dispatchEvent(evt);
                    $.d.body.removeChild(anchor);
                } else {
                    location.href = bloburl;
                }
            }
        }
    },

    json: {
        json2string: function (json) {
            if (!!JSON) {
                try {
                    var json_str = JSON.stringify(json);
                    return json_str;
                } catch (e) {
                    logger.warn(e);
                    logger.warn('can not convert to string');
                    return null;
                }
            }
        },
        string2json: function (json_str) {
            if (!!JSON) {
                try {
                    var json = JSON.parse(json_str);
                    return json;
                } catch (e) {
                    logger.warn(e);
                    logger.warn('can not parse to json');
                    return null;
                }
            }
        },
        merge: function (b, a) {
            for (var o in a) {
                if (o in b) {
                    if (typeof b[o] === 'object' &&
                        Object.prototype.toString.call(b[o]).toLowerCase() == '[object object]' &&
                        !b[o].length) {
                        util.json.merge(b[o], a[o]);
                    } else {
                        b[o] = a[o];
                    }
                } else {
                    b[o] = a[o];
                }
            }
            return b;
        }
    },

    uuid: {
        newid: function () {
            return (new Date().getTime().toString(16) + Math.random().toString(16).substr(2)).substr(2, 16);
        }
    },

    text: {
        is_empty: function (s) {
            if (!s) { return true; }
            return s.replace(/\s*/, '').length == 0;
        }
    }
};
