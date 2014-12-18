/*required information*/
var instid = 21;  //put institution id
var authkey ="a00c018783jsgbxq"; //enter apikey
var dispnumber = 10;  // number of items per page

var pubDetailDialog=function(pid){
	var url = "http://api.pids.gov.ph/serp-p/publications/details/"+pid;
	this.container = $('#myModal');
	 var container = this.container;		         
	 container.modal();
	 container.find('.modal-body').html("<center><img src='images/ajax-loader.gif'/><br/><div>Loading, please wait....</div></center>");

	$("#myModalLabel").text('Publication Detail');
	$.getJSON(url).done(function(data){	
		var abstract =data.publications[0].abstract;
		var template ='<div>{{#publications}}<div id="pub_title" style="font-weight:bold;font-size:20px;"> <a href="{{url}}" target=_new><h4>{{code}}: {{title}}</h4></a><br/></div>'+
				'<div id="pub_abstract"><span id="pub_abstract"></span></div>'+
				'{{#institution}}<div style="text-align:center;width:100%;float:left;font-size:16px;background-color:rgba(0,0,255,0.1);color:black;"><a href="#" onclick="institution_detail({{iid}});"><h5>{{institution}}</h5></a></div>{{/institution}}'+
				'<div id="pub_authors" style="width:49.5%;float:left;min-height:60px;padding-right:5px;"><div style="background-color:#F7CB16;text-align:center;color:white;">Authors</div>'+
				'<b>{{#authors}}<a href="#" onclick="main_search2(\'{{author}}\');">{{author}}</a>; {{/authors}}</b></div>'+
				'<div id="pub_keywords" style="width:49.5%;float:left;min-height:60px;"><div style="background-color:#F7CB16;text-align:center;color:white;">Keyword/s:</div>'+
				'<b>{{#keywords}}<a href="#" onclick="main_search2(\'{{keyword}}\');">{{keyword}}</a>; {{/keywords}}</b></div>'+
				'<div id="pub_authors" style="width:49.5%;float:left;min-height:60px;padding-right:5px;"><div style="background-color:#F7CB16;text-align:center;color:white;">Research Themes</div>'+
				'<b>{{#themes}}<a href="#" onclick="main_search2({{theme}});">{{theme}}</a>; {{/themes}}</b></div>'+
				'<div id="pub_authors" style="width:49.5%;float:left;min-height:60px;"><div style="background-color:#F7CB16;text-align:center;color:white;">Geographical Coverage</div>'+
				'<b>{{#geog}}<a href="#" onclick="main_search2(\'{{theme}}\');">{{theme}}; </a> {{/geog}}</b></div>'+
	
				'<div style="width:100%;float:left;background-color:rgba(0,0,255,0.1);">Published in {{year}} and available in the {{available}} or can be <a href="{{url}}" target=_new>downloaded as full text</a></div>'+
				'<!--<div style="width:49.5%;float:right;background-color:rgba(0,0,255,0.1);">Downloaded {{downloads}} times since {{ddate}}</div>-->'+
				'<input type="hidden" id="pid" value="{{pid}}"> <input type="hidden" id="aid" value="{{aids}}"> <input type="hidden" id="iid" value="{{iid}}">'+                       
				'</form>{{/publications}}</div>';
		var compiled = Hogan.compile(template);
		var output = $(compiled.render(data));
		container.find('.modal-body').html(output);
		$('#pub_abstract').html(abstract);
		
		var template = '<span id="fb" style="float:left;width:70px;height:20px;"></span>'+
				'<span id="twitter" style="float:left;width:70px;height:20px;"></span>'+
				'<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>';
		compiled = Hogan.compile(template);
		output = compiled.render({});
		container.find('.modal-footer').html(output);	
		var facebook = '<iframe src="//www.facebook.com/plugins/share_button.php?href=http%3A%2F%2Fserp-p.pids.gov.ph%2Fdetails.php%3Fpid%3D'+pid+'&amp;width&amp;layout=button&amp;appId=705481429492944" scrolling="no" frameborder="0" style="border:none; overflow:hidden;" allowTransparency="true"></iframe>';	
		var twitter = '<a href="https://twitter.com/share" class="twitter-share-button" data-url="http://serp-.pids.gov.ph/details.php?pid='+pid+'" data-text="SERP-P: " data-via="SERPPH" data-hashtags="SERP-P">Tweet</a>'+
			"<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>";
		$("#fb").html(facebook);
		$("#twitter").html(twitter);

	});
}
/*fetches next set of results*/
var next = function(url){
	$('#main_gen_content').html("<center><img src='images/ajax-loader.gif''><br/><div>Loading, please wait....</div></center>");
	$.getJSON(url).done(function(data){
	               if (data.prev == 0){
	              	      var template ='<h5>Latest Publication from {{#authors}}{{institution}}{{/authors}}</h5><div style="float:right"><a href="#" onclick="next(\''+data.next+'\');"> >>> </a></div><table class="table table-condensed table-striped">{{#publications}}<tr><td><a href="#" onclick="pubDetailDialog({{pid}});">{{title}}</a></td></tr>{{/publications}}</table>';
		}else{
		     var template ='<h5>Latest Publication from {{#authors}}{{institution}}{{/authors}}</h5><div style="float:left"><a href="#" onclick="next(\''+data.prev+'\');"> <<< </a></div><div style="float:right"><a href="#" onclick="next(\''+data.next+'\');"> >>> </a></div><table class="table table-condensed table-striped">{{#publications}}<tr><td><a href="#" onclick="pubDetailDialog({{pid}});">{{title}}</a></td></tr>{{/publications}}</table>';			
		}
		var compiled = Hogan.compile(template);
		var output = $(compiled.render(data));
		$('#main_gen_content').html(output);
	});
}
/*fetches next set of results from search*/
var main_search=function(url){
	if (url ==0){
		var param = $("input[name=search_param]").val();
		if (param !=""){
		url = "http://api.pids.gov.ph/serp-p/search/"+param+"/"+dispnumber+"/0/"+authkey;
		}else{
			return false;
		}
		
	}
	$('#main_gen_content').html("<center><img src='images/ajax-loader.gif''><br/><div>Loading, please wait....</div></center>");
	$.getJSON(url).done(function(data){
	               if ((data.prev == 0) && (data.publications.total < data.publications.count.count)){ 
	              	      var template ='<h5>Search Results for '+data.publications.count.param+' ('+data.publications.count.count+')</h5><div style="float:right"><a href="#" onclick="main_search(\''+data.next+'\');"> >>> </a></div><table class="table table-condensed table-striped">{{#publications.search}}<tr><td><a href="#" onclick="pubDetailDialog({{pid}});">{{title}}</a></td></tr>{{/publications.search}}</table><div style="float:right"><a href="#" onclick="main_search(\''+data.next+'\');"> >>> </a></div>';
	               }else if ((data.prev == 0) && (data.publications.total > data.publications.count.count)){
		     var template ='<h5>Search Results for '+data.publications.count.param+'  ('+data.publications.count.count+')</h5><table class="table table-condensed table-striped">{{#publications.search}}<tr><td><a href="#" onclick="pubDetailDialog({{pid}});">{{title}}</a></td></tr>{{/publications.search}}</table><div style="float:left">';						
	               }else if (data.publications.total > data.publications.count.count){
		     var template ='<h5>Search Results for '+data.publications.count.param+'  ('+data.publications.count.count+')</h5><div style="float:left"><a href="#" onclick="main_search(\''+data.prev+'\');"> <<< </a></div><table class="table table-condensed table-striped">{{#publications.search}}<tr><td><a href="#" onclick="pubDetailDialog({{pid}});">{{title}}</a></td></tr>{{/publications.search}}</table><div style="float:left"><a href="#" onclick="main_search(\''+data.prev+'\');"> <<< </a></div>';						
		}else{
		     var template ='<h5>Search Results for '+data.publications.count.param+'  ('+data.publications.count.count+')</h5><div style="float:left"><a href="#" onclick="main_search(\''+data.prev+'\');"> <<< </a></div><div style="float:right"><a href="#" onclick="main_search(\''+data.next+'\');"> >>> </a></div><table class="table table-condensed table-striped">{{#publications.search}}<tr><td><a href="#" onclick="pubDetailDialog({{pid}});">{{title}}</a></td></tr>{{/publications.search}}</table><div style="float:left"><a href="#" onclick="main_search(\''+data.prev+'\');"> <<< </a></div><div style="float:right"><a href="#" onclick="main_search(\''+data.next+'\');"> >>> </a></div>';			
		}
		var compiled = Hogan.compile(template);
		var output = $(compiled.render(data));
		$('#main_gen_content').html(output);

	
	});		
}
var main_search2=function(param){
	$('#myModal').modal('hide');
	$("input[name=search_param]").val(param);
	url = "http://api.pids.gov.ph/serp-p/search/"+param+"/"+dispnumber+"/0/"+authkey;
	$('#main_gen_content').html("<center><img src='images/ajax-loader.gif''><br/><div>Loading, please wait....</div></center>");
	$.getJSON(url).done(function(data){
	               if ((data.prev == 0) && (data.publications.total < data.publications.count.count)){ 
	              	      var template ='<h5>Search Results for '+data.publications.count.param+' ('+data.publications.count.count+')</h5><div style="float:right"><a href="#" onclick="main_search(\''+data.next+'\');"> >>> </a></div><table class="table table-condensed table-striped">{{#publications.search}}<tr><td><a href="#" onclick="pubDetailDialog({{pid}});">{{title}}</a></td></tr>{{/publications.search}}</table><div style="float:right"><a href="#" onclick="main_search(\''+data.next+'\');"> >>> </a></div>';
	               }else if ((data.prev == 0) && (data.publications.total > data.publications.count.count)){
		     var template ='<h5>Search Results for '+data.publications.count.param+'  ('+data.publications.count.count+')</h5><table class="table table-condensed table-striped">{{#publications.search}}<tr><td><a href="#" onclick="pubDetailDialog({{pid}});">{{title}}</a></td></tr>{{/publications.search}}</table><div style="float:left">';						
	               }else if (data.publications.total > data.publications.count.count){
		     var template ='<h5>Search Results for '+data.publications.count.param+'  ('+data.publications.count.count+')</h5><div style="float:left"><a href="#" onclick="main_search(\''+data.prev+'\');"> <<< </a></div><table class="table table-condensed table-striped">{{#publications.search}}<tr><td><a href="#" onclick="pubDetailDialog({{pid}});">{{title}}</a></td></tr>{{/publications.search}}</table><div style="float:left"><a href="#" onclick="main_search(\''+data.prev+'\');"> <<< </a></div>';						
		}else{
		     var template ='<h5>Search Results for '+data.publications.count.param+'  ('+data.publications.count.count+')</h5><div style="float:left"><a href="#" onclick="main_search(\''+data.prev+'\');"> <<< </a></div><div style="float:right"><a href="#" onclick="main_search(\''+data.next+'\');"> >>> </a></div><table class="table table-condensed table-striped">{{#publications.search}}<tr><td><a href="#" onclick="pubDetailDialog({{pid}});">{{title}}</a></td></tr>{{/publications.search}}</table><div style="float:left"><a href="#" onclick="main_search(\''+data.prev+'\');"> <<< </a></div><div style="float:right"><a href="#" onclick="main_search(\''+data.next+'\');"> >>> </a></div>';			
		}
		var compiled = Hogan.compile(template);
		var output = $(compiled.render(data));
		$('#main_gen_content').html(output);	
	});		
}
serpp.Menu = Class.extend({	
	init:function(elementId){
		var _this = this;
		var search= "<span style='margin-left:60px;margin-top:3px;float:left;' id='institution'></span><div class='main_search_form'  style='float:right;margin-right:50px;margin-top:3px;'>"+
			"<input type='text' name='search_param'  style='max-width:100px;'  onblur='main_search(0);'>"+
			"<input type='submit' name='submit' value='Go' onclick='main_search(0);'/></div>";			
			
		var main_stru = "<div id='topbar'></div><div id='header_gen'>"+
		"</div>"+
		"<div id='center_gen'>"+
		"</div>"+
		"<div id='main_gen_content'>"+
		"</div>";
		$('#editor').html(main_stru);
		var summary ="<p align='justify' style='width:70%;margin-top:30px;'><b>SERP-P</b> or <b>SocioEconomic Research Portal for the Philippines</b> is an online knowledge repository of socioeconomic materials produced by the <a href='http://www.pids.gov.ph/' target=_new>Philippine Institute for Development Studies</a> (PIDS) and other government agencies, academic and research institutions, and development organizations comprising the SERP-P Network.";			
		$('#header_gen').html("<img src='images/serpplogo.png ' style='width:15%;float:left;margin-right:10px;margin-top:0px;'/>");
		$('#header_gen').append(summary);
		$('#topbar').html(search);
		$.getJSON("http://api.pids.gov.ph/serp-p/institution/details/"+instid+"/"+dispnumber+"/0/"+authkey).done(function(data){	
		              //  if (data.prev == 0){
		                       var template ='<h5>Latest Publication from {{#authors}}{{institution}}{{/authors}}</h5><div style="float:right"><a href="#" onclick="next(\''+data.next+'\');"> >>> </a></div><table class="table table-condensed table-striped">{{#publications}}<tr><td><a href="#" onclick="pubDetailDialog({{pid}});">{{title}}</a></td></tr>{{/publications}}</table>';
			//}else{
			       //var template ='<h5>Latest Publication from {{#authors}}{{institution}}{{/authors}}</h5><div style="float:left"><a href="#" onclick="next(\''+data.prev+'\');"> <<< </a></div><div style="float:right"><a href="#" onclick="next(\''+data.next+'\');"> >>> </a></div><table class="table table-condensed table-striped">{{#publications}}<tr><td><a href="#" onclick="pubDetailDialog({{pid}});">{{title}}</a></td></tr>{{/publications}}</table>';
				
			//}
			var compiled = Hogan.compile(template);
			var output = $(compiled.render(data));
			$('#main_gen_content').html(output);			
			$('#institution').html("<h4 style='color:white;'>"+data.authors[0].institution+"</h4>");		
		});		
	}
});