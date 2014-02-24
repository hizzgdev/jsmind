var $d = window.document;
var $g = function(id){return $d.getElementById(id);};

var $settings_panel = $g('jsmind_settings_panel');
var shortcutRadios = document.getElementsByName('shortcut');

function showSettingsPanel(shortcut){
	var curr_width = $settings_panel.offsetWidth;
	var curr_height = $settings_panel.offsetHeight;
	var sh = (window.innerHeight / 2) - curr_height;
	var sw = (window.innerWidth /2) - (curr_width /2);
	$settings_panel.style.top = sh +'px';
	$settings_panel.style.left = sw +'px';
	
	if(shortcut.IsShortcutEnabled()){shortcutRadios[0].checked = true;}else{shortcutRadios[1].checked = true;}
	$settings_panel.style.visibility = 'visible';
}

function performEditSettings(shortcut){
	if(shortcutRadios[0].checked){
		shortcut.EnableShortCut();
	}else{
		shortcut.DisableShortCut();
	}
	$settings_panel.style.visibility = 'hidden';
}

function cancelEditSettings(){
	$settings_panel.style.visibility = 'hidden';
}
