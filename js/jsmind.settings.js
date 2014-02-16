var $d = window.document;
var $g = function(id){return $d.getElementById(id);};

var $settings_panel = $g('jsmind_settings_panel');

function enableShortCut(shortcut){
	shortcut.EnableShortCut();
	$settings_panel.style.visibility = 'hidden';
}

function disableShortCut(shortcut){
	shortcut.DisableShortCut();
	$settings_panel.style.visibility = 'hidden';
}

function showSettingsPanel(){
	var curr_width = $settings_panel.offsetWidth;
	var curr_height = $settings_panel.offsetHeight;
	var sh = (window.innerHeight / 2) - curr_height;
	var sw = (window.innerWidth /2) - (curr_width /2);
	$settings_panel.style.top = sh +'px';
	$settings_panel.style.left = sw +'px';
	$settings_panel.style.visibility = 'visible';
}

function performEditSettings(){
	alert("toto");
}

function cancelEditSettings(){
	$settings_panel.style.visibility = 'hidden';
}