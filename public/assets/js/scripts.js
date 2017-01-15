$( document ).ready(function() {
  navActivation();
});

function sendEmail(){
	window.location.href = "mailto:andoni.sanchez.antolin@gmail.com";
}

function navActivation(){
    $("#" + $("#pageName").val() + "PageNav").addClass("active");
    $("#" + $("#pageName").val() + "PageNavMobile").addClass("active");
}
