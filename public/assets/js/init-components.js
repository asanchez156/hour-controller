function loadDate(id){
	$(`.date[data-id="datepicker${id}"]`).datepicker(dateInit());
    $(`.date[data-id="datepicker${id}"]`).datepicker('update', '-1d');
}

function dateInit (){
	return {
	    language: 'es',
    	autoclose: true
	};
}

var listEmployee = []

function loadHour(id){
	$(`.btn-number[data-field="hours${id}"]`).click(numberSpinner);
	$(`.input-number[data-field="hours${id}"]`).focusin(numberSpinnerFocusIn);
	$(`.input-number[data-field="hours${id}"]`).change(numberSpinnerChange);
	$(`.input-number[data-field="hours${id}"]`).keydown(numberSpinnerKeydown);
}

function loadEmployeeSelect(id){
	var inputSelectHtml = `	<select class="selectpicker" data-id="employee${id}" id="employee${id}" name="employee${id}">
							  	<option></option>`;
	listEmployee.forEach(function(element, index, array){
		inputSelectHtml += `<option value="${element.employeeId}">${element.name}</option>`;
	});
	inputSelectHtml += `</select>`;

	$(`#employeeSelectDiv${id}`).html(inputSelectHtml);
	$(`.selectpicker[data-id="employee${id}"]`).selectpicker({
		  style: 'btn-primary',
		  width: 'fit'
	});
}
function getEmployeePanelHtml(id){
	return `<div class="panel panel-primary" id="workingDayPanel${id}">
                <div class="panel-heading">
                    <h3 class="panel-title" id="employeeTitle">Jornada</h3></div>
                <div class="panel-body">
                    <div class="row">
                        <div class="form-group">
                            <div class="form-item col-md-3 col-sm-6 col-xs-6">
                                <label for="employee${id}">Empleado</label>
                            </div>
                            <div class="form-item col-md-3 col-sm-6 col-xs-6" id="employeeSelectDiv${id}">
                                <input type="text" class="form-control" id="employee${id}" name="employee${id}">
                            </div>
                            <div class="form-item col-md-3 col-sm-6 col-xs-6">
                                <label for="date${id}">Fecha</label>
                            </div>
                            <div class="form-item col-md-3 col-sm-6 col-xs-6">
                                <div class="input-group date" data-provide="datepicker" data-id="datepicker${id}">
                                    <input type="text" class="form-control" id="date${id}" name="date${id}">
                                    <div class="input-group-addon">
                                        <span class="glyphicon glyphicon-th"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="form-item col-md-3 col-sm-6 col-xs-6">
                                <label for="description${id}">Nota</label>
                            </div>
                            <div class="form-item col-md-3 col-sm-6 col-xs-6">
                                <input type="text" class="form-control" id="description${id}" name="description${id}">
                            </div>
                            <div class="form-item col-md-3 col-sm-6 col-xs-6">
                                <label for="hours${id}">Horas</label>
                            </div>
                            <div class="form-item col-md-3 col-sm-6 col-xs-6">
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
}

function getEmployeePanelHtmlBatch(id){
	return `<div class="panel panel-primary" id="workingDayPanel${id}">
                <div class="panel-heading">
                    <h3 class="panel-title" id="employeeTitle">Jornada</h3></div>
                <div class="panel-body">
                    <div class="row">
                        <div class="form-group">
                            <div class="form-item col-md-1 col-sm-6 col-xs-6">
                                <label for="employee${id}">Empleado</label>
                            </div>
                            <div class="form-item col-md-3 col-sm-6 col-xs-6" id="employeeSelectDiv${id}">
                                <input type="text" class="form-control" id="employee${id}" name="employee${id}">
                            </div>
                            <div class="form-item col-md-1 col-sm-6 col-xs-6">
                                <label for="description${id}">Nota</label>
                            </div>
                            <div class="form-item col-md-3 col-sm-6 col-xs-6">
                                <input type="text" class="form-control" id="description${id}" name="description${id}">
                            </div>
                            <div class="form-item col-md-1 col-sm-6 col-xs-6">
                                <label for="hours${id}">Horas</label>
                            </div>
                            <div class="form-item col-md-3 col-sm-6 col-xs-6">
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
}

function numberSpinner(e){
    e.preventDefault();

    fieldName = $(this).attr('data-field');
    type      = $(this).attr('data-type');
    var input = $("input[name='"+fieldName+"']");
    var currentVal = parseFloat(input.val());
    if (!isNaN(currentVal)) {
        if(type == 'minus') {

            if(currentVal > input.attr('min')) {
                input.val(currentVal - 0.5).change();
            }
            if(parseInt(input.val()) == input.attr('min')) {
                $(this).attr('disabled', true);
            }

        } else if(type == 'plus') {

            if(currentVal < input.attr('max')) {
                input.val(currentVal + 0.5).change();
            }
            if(parseInt(input.val()) == input.attr('max')) {
                $(this).attr('disabled', true);
            }

        }
    } else {
        input.val(0);
    }
}

function numberSpinnerFocusIn(){
   $(this).data('oldValue', $(this).val());
}

function numberSpinnerChange(e){
    minValue =  parseInt($(this).attr('min'));
    maxValue =  parseInt($(this).attr('max'));
    valueCurrent = parseInt($(this).val());

    name = $(this).attr('name');
    if(valueCurrent >= minValue) {
        $(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
    } else {
        alert('Lo siento, se ha alcanzado el número mínimo');
        $(this).val($(this).data('oldValue'));
    }
    if(valueCurrent <= maxValue) {
        $(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
    } else {
        alert('Lo siento, se ha alcanzado el número máximo');
        $(this).val($(this).data('oldValue'));
    }

}

function numberSpinnerKeydown (e){
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

}


//plugin bootstrap minus and plus
//http://jsfiddle.net/laelitenetwork/puJ6G/
$('.btn-number').click(numberSpinner);
$('.input-number').focusin(numberSpinnerFocusIn);
$('.input-number').change(numberSpinnerChange);
$(".input-number").keydown(numberSpinnerKeydown);
