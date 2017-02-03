function addMessage(div,type,text){
	var content = '';
	switch (type) {
	  	case 0:
	  		content = ` <div class="alert alert-info">
		 					<strong>Info: </strong> ${text}
	 		  			</div>`;
	    	break;
	  	case 1:
	  		content = ` <div class="alert alert-danger">
		 					<strong>Error: </strong> ${text}
	 		  			</div>`;
	    	break;
	}
    $(div).html(content);
}

function removeMessage(div){
    $(div).html('');
}
