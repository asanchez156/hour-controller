$( document ).ready(function() {
	$('#newWorkingDayPanelCounter').val(0);
    loadDates();
    //Add to Employees by default
    addEmployeePanel();
    addEmployeePanel();
})


function populateHourDatatable(data){
	var table = $('#hoursTable').DataTable({
        "bAutoWidth" : false,
        "aaData" : data,
        "columns" : [ {
            "data" : "id"
        }, {
            "data" : "name"
        }, {
            "data" : "lat"
        }, {
            "data" : "lon"
        }]
    });
}

function searchWorkingday(){
	var employee = $('#employee').val();
	var initialDate = $('#initialDate').val();
	var endDate = $('#endDate').val();
	
	var search = {
		employee : employee,
		initialDate : initialDate,
		endDate : endDate
	}

	$.post('/hour', search , function(data) {
		populateHourDatatable(data);
	})
	.done(function() {
	    //alert( "second success" );
	})
	.fail(function() {
	    //alert( "error" );
	})
	.always(function() {
	    //alert( "finished" );
	});
}

function newWorkingdayFormSend(){

}

function newWorkingday(){
	var user = '<%= user.username %>';
	var date = $('#date').val();
	var endDate = $('#endDate').val();

	var workingdayDataList = [];
	$('#newworkingDayPanel').forEach(function(value, index){
		var workingdayData = {
			employee : $('#employee'+index).val(),
			date : $('#employee'+index).val(),
		}
	});


	workingdayDataList.push(workingdayData);

	$.post('/hour/create', workingdayDataList , function(data) {
		
	}).done(function() {
	    //alert( "second success" );
	}).fail(function() {
	    //alert( "error" );
	}).always(function() {
	    //alert( "finished" );
	});
}

function newPale(){
	var paleData = {

	}

	$.post('/pale/create', paleData , function(data) {
		
	}).done(function() {
	    //alert( "second success" );
	}).fail(function() {
	    //alert( "error" );
	}).always(function() {
	    //alert( "finished" );
	});
}

function loadDates(){
	$('.datepicker').datepicker({
	    format: 'dd/mm/yyyy',
	    defaultDate: 'yesterday',
	    laguage: 'es',
    	autoclose: true
	});
}

function addEmployeePanel(){
	var id = parseInt($('#newWorkingDayPanelCounter').val());
	id+=1;
	$('#newWorkingDayPanelCounter').val(id);

	var htmlContent = 	`<div class="panel panel-primary" id="newWorkingDayPanel${id}">
	                        <div class="panel-heading">
	                            <h3 class="panel-title" id="employeeTitle">Jornada empleado ${id}</h3></div>
	                        <div class="panel-body">
	                            <div class="row">
	                                <div class="form-group">
	                                    <div class="col-md-1 col-sm-6 col-xs-6">
	                                        <label for="employee${id}">Nombre empleado</label>
	                                    </div>
	                                    <div class="col-md-3 col-sm-6 col-xs-6">
	                                        <input type="text" class="form-control" id="employee${id}" name="employee${id}">
	                                    </div>
	                                    <div class="col-md-1 col-sm-6 col-xs-6">
	                                        <label for="date${id}">Fecha</label>
	                                    </div>
	                                    <div class="form-item col-md-3 col-sm-6 col-xs-6">
	                                        <div class="input-group date" data-provide="datepicker">
	                                            <input type="text" class="form-control" id="date${id}" name="date${id}">
	                                            <div class="input-group-addon">
	                                                <span class="glyphicon glyphicon-th"></span>
	                                            </div>
	                                        </div>
	                                    </div>
	                                    <div class="col-md-1 col-sm-6 col-xs-6">
	                                        <label for="hours${id}">Horas</label>
	                                    </div>
	                                    <div class="col-md-3 col-sm-6 col-xs-6">
	                                        <div class="input-group">
	                                            <span class="input-group-btn">
	                                               <button type="button" class="btn btn-danger btn-number" data-type="minus" data-field="hours${id}">
	                                                    <span class="glyphicon glyphicon-minus"></span>
	                                                </button>
	                                              </span>
	                                            <input id="hours${id}" name="hours${id}" class="form-control input-number" value="8" min="1" max="20" type="text">
	                                            <span class="input-group-btn">
	                                                <button type="button" class="btn btn-success btn-number" data-type="plus" data-field="hours${id}">
	                                                    <span class="glyphicon glyphicon-plus"></span>
	                                                </button>
	                                             </span>
	                                        </div>
	                                    </div>
	                                </div>
	                            </div>
	                        </div>
	                    </div>`;

	$('#newWorkingDayPanelContent').append(htmlContent);
}

function removeEmployeePanel(){
	var id = parseInt($('#newWorkingDayPanelCounter').val());
	if(id > 0){
		$('#newWorkingDayPanel'+id).remove();
		$('#newWorkingDayPanelCounter').val(id-1);
	}

}


//plugin bootstrap minus and plus
//http://jsfiddle.net/laelitenetwork/puJ6G/
$('.btn-number').click(function(e){
    e.preventDefault();
    
    fieldName = $(this).attr('data-field');
    type      = $(this).attr('data-type');
    var input = $("input[name='"+fieldName+"']");
    var currentVal = parseInt(input.val());
    if (!isNaN(currentVal)) {
        if(type == 'minus') {
            
            if(currentVal > input.attr('min')) {
                input.val(currentVal - 1).change();
            } 
            if(parseInt(input.val()) == input.attr('min')) {
                $(this).attr('disabled', true);
            }

        } else if(type == 'plus') {

            if(currentVal < input.attr('max')) {
                input.val(currentVal + 1).change();
            }
            if(parseInt(input.val()) == input.attr('max')) {
                $(this).attr('disabled', true);
            }

        }
    } else {
        input.val(0);
    }
});
$('.input-number').focusin(function(){
   $(this).data('oldValue', $(this).val());
});
$('.input-number').change(function() {
    
    minValue =  parseInt($(this).attr('min'));
    maxValue =  parseInt($(this).attr('max'));
    valueCurrent = parseInt($(this).val());
    
    name = $(this).attr('name');
    if(valueCurrent >= minValue) {
        $(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
    } else {
        alert('Sorry, the minimum value was reached');
        $(this).val($(this).data('oldValue'));
    }
    if(valueCurrent <= maxValue) {
        $(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
    } else {
        alert('Sorry, the maximum value was reached');
        $(this).val($(this).data('oldValue'));
    }
    
    
});
$(".input-number").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) || 
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });