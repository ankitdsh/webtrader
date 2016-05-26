define(["jquery","charts/chartingRequestMap","websockets/binary_websockets","websockets/ohlc_handler","currentPriceIndicator","charts/indicators/highcharts_custom/indicators","moment","highcharts-exporting","common/util"],function(a,b,c,d,e,f,g){"use strict";function h(a){var c=a.containerIDWithHash,d=a.timePeriod,e=a.instrumentCode;if(d&&e){var f=b.keyFor(e,d);b.unregister(f,c)}}function i(a){var c=isTick(a.timePeriod),d=b.keyFor(a.instrumentCode,a.timePeriod),e=a.instrumentName+" ("+a.timePeriod+").csv",f=b.barsTable.chain().find({instrumentCdAndTp:d}).simplesort("time",!1).data(),h=f.map(function(a){return c?'"'+g.utc(a.time).format("YYYY-MM-DD HH:mm")+'",'+ +a.open:'"'+g.utc(a.time).format("YYYY-MM-DD HH:mm")+'",'+a.open+","+a.high+","+a.low+","+a.close}),i=(c?"Date,Tick\n":"Date,Open,High,Low,Close\n")+h.join("\n"),j=new Blob([i],{type:"text/csv;charset=utf-8;"});if(navigator.msSaveBlob)navigator.msSaveBlob(j,e);else{var k=document.createElement("a");if(void 0!==k.download){var l=URL.createObjectURL(j);k.setAttribute("href",l),k.setAttribute("download",e),k.style.visibility="hidden",document.body.appendChild(k),k.click(),document.body.removeChild(k)}}}return a(function(){Highcharts.setOptions({global:{useUTC:!0},lang:{thousandsSep:","}})}),f.initHighchartIndicators(b.barsTable),{drawChart:function(f,g,h){if(a(f).highcharts()){var j=b.keyFor(g.instrumentCode,g.timePeriod);b.removeChart(j,f),a(f).highcharts().destroy()}a(f).data({instrumentCode:g.instrumentCode,instrumentName:g.instrumentName,timePeriod:g.timePeriod,type:g.type,delayAmount:g.delayAmount}),a(f).highcharts("StockChart",{chart:{events:{load:function(){this.showLoading(),e.init(),c.execute(function(){d.retrieveChartDataAndRender({timePeriod:g.timePeriod,instrumentCode:g.instrumentCode,containerIDWithHash:f,type:g.type,instrumentName:g.instrumentName,series_compare:g.series_compare,delayAmount:g.delayAmount})}),a.isFunction(h)&&h(),this.credits.element.onclick=function(){window.open("http://www.binary.com","_blank")}}},spacingLeft:0,marginLeft:45},navigator:{enabled:!0,series:{id:"navigator"}},plotOptions:{candlestick:{lineColor:"black",color:"red",upColor:"green",upLineColor:"black",shadow:!0},series:{events:{afterAnimate:function(){this.options.isInstrument&&"navigator"!==this.options.id&&(this.removeCurrentPrice(),this.addCurrentPrice()),this.chart.hideLoading()}}}},title:{text:"true"===getParameterByName("affiliates")?g.instrumentName+" ("+g.timePeriod+")":""},credits:{href:"http://www.binary.com",text:"Binary.com"},xAxis:{events:{afterSetExtremes:function(){}},labels:{formatter:function(){var a=this.axis.defaultLabelFormatter.call(this);return a.replace(".","")}},ordinal:!1},yAxis:[{opposite:!1,labels:{formatter:function(){return a(f).data("overlayIndicator")?(this.value>0?" + ":"")+this.value+"%":this.value},align:"center"}}],rangeSelector:{enabled:!1},tooltip:{crosshairs:[{width:2,color:"red",dashStyle:"dash"},{width:2,color:"red",dashStyle:"dash"}],enabled:!0,enabledIndicators:!0},exporting:{enabled:!0,buttons:{contextButton:{menuItems:[{text:"Download PNG",onclick:function(){this.exportChartLocal()}},{text:"Download JPEG",onclick:function(){this.exportChart({type:"image/jpeg"})},separator:!1},{text:"Download PDF",onclick:function(){this.exportChart({type:"application/pdf"})},separator:!1},{text:"Download SVG",onclick:function(){this.exportChartLocal({type:"image/svg+xml"})},separator:!1},{text:"Download CSV",onclick:function(){i(a(f).data())},separator:!1}]}},filename:g.instrumentName.split(" ").join("_")+"("+g.timePeriod+")"}})},destroy:h,triggerReflow:function(b){a(b).highcharts()&&a(b).highcharts().reflow()},refresh:function(b){var c=a(b).highcharts(),d=[],e=void 0;a(c.series).each(function(a,b){b.options.isInstrument&&(d.push(b.name),e=b.options.compare)}),this.drawChart(b,{instrumentCode:a(b).data("instrumentCode"),instrumentName:a(b).data("instrumentName"),timePeriod:a(b).data("timePeriod"),type:a(b).data("type"),series_compare:e,delayAmount:a(b).data("delayAmount")});var f=this;require(["instruments/instruments"],function(c){d.forEach(function(d){var e=c.getSpecificMarketData(d);void 0!=e.symbol&&a.trim(e.symbol)!=a(b).data("instrumentCode")&&f.overlay(b,e.symbol,d,e.delay_amount)})})},addIndicator:function(b,c){if(a(b).highcharts()){var d=a(b).highcharts(),e=d.series[0];e&&d.addIndicator(a.extend({id:e.options.id},c))}},overlay:function(b,e,f,g){if(a(b).highcharts()){var h=a(b).highcharts(),i=a(b).data("timePeriod"),j=a(b).data("type");h.showLoading();for(var k=0;k<h.series.length;k++){var l=h.series[k];(l.options.isInstrument||l.options.onChartIndicator)&&l.update({compare:"percent"})}c.execute(function(){d.retrieveChartDataAndRender({timePeriod:i,instrumentCode:e,containerIDWithHash:b,type:j,instrumentName:f,series_compare:"percent",delayAmount:g})})}}}});