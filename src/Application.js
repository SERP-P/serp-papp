var serpp = {
        backend:{},
        dialog:{}
};
serpp.Application = Class.extend(
{
    NAME : "serpp.Application", 
    init : function()
    {  
        this.contentLayout = $('#container').layout({
	     center: {
		     resizable:false,
		     closable:false,
		     spacing_open:0,
		     spacing_closed:0,
		     paneSelector: "#content"
	     }
	    });	     
	   this.editorLayout = $('#content').layout({
  	         center: {
                   resizable:false,
                   closable:false,
                   spacing_open:0,
                   spacing_closed:0,
                   paneSelector: "#editor"
  	          }
	   });
  	  this.menu = new serpp.Menu("menu");
    }
});
