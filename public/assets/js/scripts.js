$( document ).ready(function() {
  //loggedDraw();
  notLoggedDraw();
  navActivation();
});

function sendEmail(){
	window.location.href = "mailto:andoni.sanchez.antolin@gmail.com";
}

function navActivation(){
    $("#" + $("#pageName").val() + "PageNav").addClass("active");
    $("#" + $("#pageName").val() + "PageNavMobile").addClass("active");
}

function isLoggedDraw(){
	$('#userConnection').html(''+
			'<span><i class="icon-user"></i><a id="usernameBarText" href="#">Usuario</a></span>'+
            '<span><i class="glyphicon glyphicon-off"></i><a id="logoutBarText" href="/logout">Desconexión</a></span>'+
            '');
}

function notLoggedDraw(){
	$('#userConnection').html(''+
            '<span><i class="icon-user"></i><a id="logoutBarText" href="#">Anonimo</a></span>'+
            '');
}