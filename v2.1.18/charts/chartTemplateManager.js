"use strict";function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();define(["jquery","charts/chartWindow","common/rivetsExtra","lodash"],function(a,b,c,d){require(["text!charts/chartTemplateManager.html"]),local_storage.get("templates")||local_storage.set("templates",[]);var e=function(){function e(a,b){var d=this;_classCallCheck(this,e);var f=this,g=local_storage.get("templates");g.forEach(function(a){a.random||(a=f.setRandom(a))}),local_storage.set("templates",g);var h=this.init_state(a,b);require(["text!charts/chartTemplateManager.html"],function(b){a.append(b.i18n()),d.view=c.bind(a[0],h)})}return _createClass(e,[{key:"init_state",value:function(c,e){var f=this,g=(a("#"+e+"_chart").highcharts(),{route:{value:"menu"},menu:{save_changes_disabled:!0},templates:{array:local_storage.get("templates"),save_as_value:"",rename_tmpl:null,rename_value:"",current:null}}),h=g.route,i=g.templates,j=g.menu,k=this.setRandom(b.get_chart_options(e));return i.array=local_storage.get("templates"),-1!==d.findIndex(i.array,function(a){return a.random===k.random})&&(i.current=k),h.update=function(a){h.value=a},j.save_as=function(){var a=b.get_chart_options(e)||{};a.name=[a.timePeriod+" "+a.type].concat(a.indicators.map(function(a){return a.name})).concat(a.overlays.map(function(a){return a.displaySymbol})).join(" + "),i.save_as_value=a.name,h.update("save-as")},j.templates=function(){i.array=local_storage.get("templates"),h.update("templates")},j.save_changes=function(){var c=f.setRandom(b.get_chart_options(e)),g=c.name,h=local_storage.get("templates"),j=d.findIndex(h,function(a){return a.name===g});-1!==j?h[j]=c:h.push(c),local_storage.set("templates",h),i.array=h,i.current=c,a.growl.notice({message:"Template changes saved ".i18n()+"("+c.name+")"})},j.open_file_selector=function(){a(c).find("input[type=file]").click()},j.upload=function(b){var c=f,d=b.target.files[0];if(b.target.value=null,d){var e=new FileReader;e.onload=function(b){var d=b.target.result,e=local_storage.get("templates"),f=null;try{f=JSON.parse(d),f.name=f.name.substring(0,20).replace(/[<>]/g,"-");var g=f.random;if(f=c.setRandom(f),g!==f.random)throw"Invalid JSON file".i18n();if(c.isDuplicate(f,e))return;if(!f.indicators)throw"Invalid template type".i18n()}catch(b){return void a.growl.error({message:b})}for(var h=1,j=f.name;;){if(!e.map(function(a){return a.name}).includes(j)){f.name=j;break}j=f.name+" ("+h+")",h++}i.apply(f),e.push(f),local_storage.set("templates",e),i.array=e,a.growl.notice({message:"Successfully applied the template and saved it as ".i18n()+"<b>"+f.name+"</b>"})},e.readAsText(d)}},i.save_as=function(a){a.preventDefault();var c=i.save_as_value.substring(0,20).replace(/[<>]/g,"-"),d=f.setRandom(b.get_chart_options(e));if(d){d.name=c;var g=local_storage.get("templates");if(f.isDuplicate(d,g))return;g.push(d),i.current=d,local_storage.set("templates",g),i.array=g,h.update("menu"),b.set_chart_options(e,d)}},i.download=function(b){var c=JSON.stringify(b);download_file_in_browser(b.name+".json","text/json;charset=utf-8;",c),a.growl.notice({message:"Downloading template as <b>".i18n()+b.name+".json</b>"})},i.remove=function(a){var b=local_storage.get("templates");i.array=b.filter(function(b){return b.name!==a.name}),local_storage.set("templates",i.array),i.current&&a.name===i.current.name&&(i.current=null)},i.rename=function(a){i.rename_value=a.name,i.rename_tmpl=a,h.update("rename")},i.do_rename=function(c){c.preventDefault();var d=i.rename_tmpl.name,g=i.rename_value.substring(0,20).replace(/[<>]/g,"-"),j=local_storage.get("templates");if(j.map(function(a){return a.name}).includes(g))return void a.growl.error({message:"Template name already exists".i18n()});var k=j.find(function(a){return a.name===d});if(k){k.name=g,local_storage.set("templates",j),i.array=j,h.update("templates");var l=f.setRandom(b.get_chart_options(e));l.name==d&&(l.name=g,b.set_chart_options(e,l),i.current=l)}},i.apply=function(a){b.apply_chart_options(e,a),i.current=a},i.confirm=function(a,b){h.update("confirm");var c=b.currentTarget.text;i.confirm_prevMenu=c==="Delete".i18n()?"templates":"menu",i.confirm_text="Delete"===c?"Are you sure you want to delete template?".i18n():"Are you sure you want to overwrite current template?".i18n(),i.confirm_yes=function(){c==="Delete".i18n()?i.remove(a):j.save_changes(),i.confirm_no()},i.confirm_no=function(){h.update(i.confirm_prevMenu)}},g}},{key:"setRandom",value:function(a){var b=a.name;return delete a.name,delete a.random,a.random=this.hashCode(JSON.stringify(a)),a.name=b,a}},{key:"hashCode",value:function(a){return a.split("").reduce(function(a,b){return a=(a<<5)-a+b.charCodeAt(0),a&a},0)}},{key:"isDuplicate",value:function(b,c){var e=d.find(c,["random",b.random]);return e?(a.growl.error({message:"Template already saved as ".i18n()+"<b>"+e.name+"</b>."}),!0):!1}},{key:"unbind",value:function(){this.view&&this.view.unbind(),this.view=null}}]),e}();return{init:function(a,b){return new e(a,b)}}});