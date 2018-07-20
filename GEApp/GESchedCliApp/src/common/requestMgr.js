//
// Request Manager for request initialization and validation.
//

//import { centralStore } from '@/common/centralStore.js';
const centralStore = require('@/common/centralStore.js').centralStore;

export const inferNumOfRequestScreens = (prompts) => {
    //debugger; // Uncomment to trigger breakpoint.
    var highestScreenNum = 0;

    $.each(prompts, function (index, prompt) {
        if (prompt.screenNum > highestScreenNum) {
            highestScreenNum = prompt.screenNum;
        }
    });

    centralStore.state.numOfRequestScreens = highestScreenNum;
}


export const validatePrompts = (prompts) => {
    //debugger; // Uncomment to trigger breakpoint.

    // Hide all existing errors since the fields will be re-validated.
    $.each(prompts, function (index, prompt) {

        var ctrlDataId = prompt.inputType.ctrlDataId;

        var invalidMsg = $('#INVALID-MSG-FOR-' + ctrlDataId)
        if (invalidMsg != null) {
            invalidMsg.hide();
        }

        var requiredMsg = $('#REQUIRED-MSG-FOR-' + ctrlDataId)
        if (requiredMsg != null) {
            requiredMsg.hide();
        }

    });

    var allValid = true;

    $.each(prompts, function (index, prompt) {
  
        var currentFieldInvalid = false;
        var isValid = true;

        if (prompt.isRequired != undefined && prompt.isRequired == true) {

            var ctrlDataId = prompt.inputType.ctrlDataId;

            //debugger;
            if (prompt.inputType.ctrlType == "eventSchedule") {
                isValid = validateIsRequiredEventSchedulePrompt(ctrlDataId);
                if (!isValid) {
                    allValid = false;
                    currentFieldInvalid = true;
                }
            } else if (prompt.inputType.ctrlType == "selectRoom") {
                isValid = validateIsRequiredLocationOfEventPrompt(ctrlDataId);
                if (!isValid) {
                    allValid = false;
                    currentFieldInvalid = true;
                }
            } else {             
                var inputVal = $("#" + ctrlDataId).val();
                isValid = validateIsRequiredPrompt(ctrlDataId, inputVal);
                if (!isValid) {
                    allValid = false;
                    currentFieldInvalid = true;
                }
            }
            
        }

        if (!currentFieldInvalid && (prompt.inputType.ctrlType == 'eventSchedule')) {
            //debugger;
            var ctrlDataId = prompt.inputType.ctrlDataId;
            isValid = validateEventSchedulePrompt(ctrlDataId);
            if (!isValid) {
                allValid = false;
                currentFieldInvalid = true;
            }
        }

        if (!currentFieldInvalid && prompt.inputType.ctrlType == 'email') {
            var ctrlDataId = prompt.inputType.ctrlDataId;
            var inputVal = $("#" + ctrlDataId).val();
            isValid = validateEmailPrompt(ctrlDataId, inputVal);
            if (!isValid) {
                allValid = false;
                currentFieldInvalid = true;
            }
        }

        if (!currentFieldInvalid && prompt.inputType.ctrlType == 'number') {
            var ctrlDataId = prompt.inputType.ctrlDataId;
            var inputVal = $("#" + ctrlDataId).val();
            isValid = validateNumberPrompt(ctrlDataId, inputVal);
            if (!isValid) {
                allValid = false;
                currentFieldInvalid = true;
            }
        }

        if (!currentFieldInvalid && (prompt.inputType.ctrlType == 'yesNo' || prompt.inputType.ctrlType == 'yesNoWithComment')) {
            var ctrlDataId = prompt.inputType.ctrlDataId;
            var currObject = $("#" + ctrlDataId);
            inputVal = currObject[0].checked;
            isValid = validateYesNoPrompt(ctrlDataId, inputVal);
            if (!isValid) {
                allValid = false;
                currentFieldInvalid = true;
            }
        }
        

    });

    return allValid;
}


export const validateIsRequiredPrompt = (ctrlDataId, inputVal) => {

    //debugger; // Uncomment to trigger breakpoint.

    let isValid = true;
    let validInput = null;

    if ((typeof inputVal) == "string") {
        try {
            inputVal = inputVal.trim();
            var atLeastOneCharRegEx = /.+/;
            validInput = inputVal.match(atLeastOneCharRegEx);
        } catch (err) {
            console.warn("validateIsRequiredPrompt error: " + err);
        }
    } else if (inputVal != null && inputVal != undefined) {
        validInput = inputVal;       
    }

    if (validInput == null) {
        isValid = false;
        var requiredMsg = $('#REQUIRED-MSG-FOR-' + ctrlDataId)
        if (requiredMsg != null) {
            requiredMsg.show();
        }
    }

    return isValid;
}

export const validateIsRequiredLocationOfEventPrompt = (ctrlDataId, inputVal) => {
    
    //debugger;

    let isValid = true;
    var location = null;

    try {
        location = centralStore.state.currentRequest.locationOfEvent;
    } catch (err) {
        console.warn("validateLocationOfEventPrompt error: " + err);
    }

    if (location == null) {
        isValid = false;
        var invalidMsg = $('#REQUIRED-MSG-FOR-' + ctrlDataId)
        if (invalidMsg != null) {
            invalidMsg.show();
        }
    }

    return isValid;
}


export const validateEmailPrompt = (ctrlDataId, inputVal) => {
    
    let isValid = true;
    var email = null;

    try {
        var emailRegEx = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i;
        email = inputVal.match(emailRegEx);
    } catch (err) {
        console.warn("validateEmailPrompt error: " + err);
    }

    if (email == null) {
        isValid = false;
        var invalidMsg = $('#INVALID-MSG-FOR-' + ctrlDataId)
        if (invalidMsg != null) {
            invalidMsg.show();
        }
    }

    return isValid;
}


export const validateIsRequiredEventSchedulePrompt = (ctrlDataId) => {
    
    //debugger; // Uncomment to trigger breakpoint.

    var isValid = isEventScheduleFieldsFilledIn(ctrlDataId);

    if (!isValid) {
        var invalidMsg = $('#REQUIRED-MSG-FOR-' + ctrlDataId)
        if (invalidMsg != null) {
            invalidMsg.show();
        }
    }

    return isValid;
} 

export const isEventScheduleFieldsFilledIn = (ctrlDataId) => {
    let allFilled = true;
    
    let startDateCtrlId = ctrlDataId + "StartDate";
    let startTimeCtrlId = ctrlDataId + "StartTime";
    let endDateCtrlId = ctrlDataId + "EndDate";
    let endTimeCtrlId = ctrlDataId + "EndTime";
    
    var startDateVal = $('#' + startDateCtrlId).val();
    var startTimeVal = $('#' + startTimeCtrlId).val();

    var endDateVal = $('#' + endDateCtrlId).val();
    var endTimeVal = $('#' + endTimeCtrlId).val();

    if (startDateVal == null || startDateVal == "" ||
        startTimeVal == null || startTimeVal == "" ||
        endDateVal == null || endDateVal == "" ||
        endTimeVal == null || endTimeVal == "") {
            allFilled = false;
    }

    return allFilled;
}


export const validateEventSchedulePrompt = (ctrlDataId) => {
    
    //debugger; // Uncomment to trigger breakpoint.

    var isValid = isEventScheduleFieldsFilledIn(ctrlDataId);
    
    if (isValid) {

        let startDateCtrlId = ctrlDataId + "StartDate";
        let startTimeCtrlId = ctrlDataId + "StartTime";
        let endDateCtrlId = ctrlDataId + "EndDate";
        let endTimeCtrlId = ctrlDataId + "EndTime";
        
        var startDateVal = $('#' + startDateCtrlId).val();
        var startTimeVal = $('#' + startTimeCtrlId).val();
    
        var endDateVal = $('#' + endDateCtrlId).val();
        var endTimeVal = $('#' + endTimeCtrlId).val();

        const millisecondsPerMinute = 60000;  

        let selectStartDateTimeStr = startDateVal + " " + startTimeVal;
        let providedStartDateTime = new Date(selectStartDateTimeStr);
        
        let selectEndDateTimeStr = endDateVal + " " + endTimeVal;
        let providedEndDateTime = new Date(selectEndDateTimeStr);  
        
        if (providedStartDateTime > providedEndDateTime) {
            isValid = false;
        }
    }

    if (!isValid) {
        var invalidMsg = $('#INVALID-MSG-FOR-' + ctrlDataId)
        if (invalidMsg != null) {
            invalidMsg.show();
        }
    }

    return isValid;
} 


export const validateNumberPrompt = (ctrlDataId, inputVal) => {
    
    let isValid = true;
    var inVal = 0;

    try {
        inVal = parseInt(inputVal);
    } catch (err) {
        console.warn("validateNumberPrompt error: " + err);
        isValid = false;
    }

    if (!isValid) {
        var invalidMsg = $('#INVALID-MSG-FOR-' + ctrlDataId)
        if (invalidMsg != null) {
            invalidMsg.show();
        }
    }

    return isValid;
}


export const validateYesNoPrompt = (ctrlDataId, inputVal) => {
    
    let isValid = true;
    if(!(inputVal === true | inputVal === false)){
        isValid = false;
    }

    if (!isValid) {
        var invalidMsg = $('#INVALID-MSG-FOR-' + ctrlDataId)
        if (invalidMsg != null) {
            invalidMsg.show();
        }
    }

    return isValid;
}


export const validateRequest = (request, currentScreenNum) => {

    //debugger; // Uncomment to trigger breakpoint.

    var allValid = true;

    // Hide all existing errors since the fields will be re-validated.
    $.each(centralStore.state.requestPrompts, function (index, requestPrompt) {
        if (requestPrompt.screenNum == currentScreenNum) {

            var ctrlDataId = requestPrompt.inputType.ctrlDataId;

            var invalidMsg = $('#INVALID-MSG-FOR-' + ctrlDataId)
            if (invalidMsg != null) {
                invalidMsg.hide();
            }

            var requiredMsg = $('#REQUIRED-MSG-FOR-' + ctrlDataId)
            if (requiredMsg != null) {
                requiredMsg.hide();
            }
         
        }
    });

    $.each(centralStore.state.requestPrompts, function (index, requestPrompt) {
        if (requestPrompt.screenNum == currentScreenNum) {

            var currentFieldInvalid = false;
            var isValid = true;

            if (requestPrompt.isRequired != undefined && requestPrompt.isRequired == true) {
                var ctrlDataId = requestPrompt.inputType.ctrlDataId;

                //debugger;
                if (requestPrompt.inputType.ctrlType == "eventSchedule") {
                    isValid = validateIsRequiredEventSchedulePrompt(ctrlDataId);
                    if (!isValid) {
                        allValid = false;
                        currentFieldInvalid = true;
                    }
                } else if (requestPrompt.inputType.ctrlType == "selectRoom") {
                    isValid = validateIsRequiredLocationOfEventPrompt(ctrlDataId);
                    if (!isValid) {
                        allValid = false;
                        currentFieldInvalid = true;
                    }
                } else { 
                    var inputVal = request[ctrlDataId]
                    isValid = validateIsRequiredPrompt(ctrlDataId, inputVal);
                    if (!isValid) {
                        allValid = false;
                        currentFieldInvalid = true;
                    }
                }
            }

            if (!currentFieldInvalid && (requestPrompt.inputType.ctrlType == 'eventSchedule')) {
                //debugger;
                var ctrlDataId = requestPrompt.inputType.ctrlDataId;
                isValid = validateEventSchedulePrompt(ctrlDataId);
                if (!isValid) {
                    allValid = false;
                    currentFieldInvalid = true;
                }
            } 

            if (!currentFieldInvalid && requestPrompt.inputType.ctrlType == 'email') {
                var ctrlDataId = requestPrompt.inputType.ctrlDataId;
                var inputVal = $("#" + ctrlDataId).val();
                isValid = validateEmailPrompt(ctrlDataId, inputVal);
                if (!isValid) {
                    //debugger;
                    allValid = false;
                    currentFieldInvalid = true;
                }
            }

            if (!currentFieldInvalid && requestPrompt.inputType.ctrlType == 'number') {
                var ctrlDataId = requestPrompt.inputType.ctrlDataId;
                var inputVal = $("#" + ctrlDataId).val();
                isValid = validateNumberPrompt(ctrlDataId, inputVal);
                if (!isValid) {
                    //debugger;
                    allValid = false;
                    currentFieldInvalid = true;
                }
            }

            if (!currentFieldInvalid && (requestPrompt.inputType.ctrlType == 'yesNo' || requestPrompt.inputType.ctrlType == 'yesNoWithComment')) {
                var ctrlDataId = requestPrompt.inputType.ctrlDataId;
                var currObject = $("#" + ctrlDataId);
                inputVal = currObject[0].checked;
                isValid = validateYesNoPrompt(ctrlDataId, inputVal);
                if (!isValid) {
                    //debugger;
                    allValid = false;
                    currentFieldInvalid = true;
                }
            }

        }
    });

    return allValid;
}


export const bindUiValuesFromRequest = (request, currentScreenNum, inAdminMode) => {

    //debugger; // Uncomment to trigger breakpoint.

    var assignmentCount = 0;

    var ctrls = $('.is-request-data');
    $.each(ctrls, function (index, inputCtrl) {
        var ctrl = $(inputCtrl);
        if (ctrl != null && ctrl.attr('screenNum') == currentScreenNum) {

            if (ctrl.is(':checkbox')) {
                ctrl.prop('checked', false);
            } else if (ctrl.is(':text')) {
                ctrl.val(null);
            }
            var val = request[inputCtrl.id];
            if (val != undefined && val != null && val != "") {

                if (ctrl.is(':checkbox')) {

                    if (val == true) {
                        ctrl.prop('checked', true);
                    } else {
                        ctrl.prop('checked', false);
                    }

                } else if (ctrl.is(':text')) {

                    ctrl.val(val);

                } else if (ctrl.attr('isEventDateTime') == "true"){
                    
                    var startDateTimeVal = val.startDateTime;
                    var endDateTimeVal = val.endDateTime;

                    if (startDateTimeVal != undefined && startDateTimeVal != null && startDateTimeVal != "") {

                        let startDateCtrlId = inputCtrl.id + "StartDate";
                        let startTimeCtrlId = inputCtrl.id + "StartTime";

                        var startDateTime = new Date(startDateTimeVal);
                        var dd = startDateTime.getDate();
                        var mm = startDateTime.getMonth() + 1; //January is 0!
                        var yyyy = startDateTime.getFullYear();
                        var hrs = startDateTime.getHours();
                        var mins = startDateTime.getMinutes();

                        var ddStr = dd.toString();
                        var mmStr = mm.toString();
                        if (dd < 10) { ddStr = '0'+ ddStr; } 
                        if (mm < 10) { mmStr = '0'+ mmStr; } 
                        var dateValToSet = yyyy + '-' + mmStr + '-' + ddStr;                       
                        
                        var hrsStr = hrs.toString();
                        var minsStr = mins.toString();
                        if (hrs < 10) { hrsStr = '0'+ hrsStr; } 
                        if (mins < 10) { minsStr = '0'+ minsStr; } 

                        var timeValToSet = hrsStr + ':' + minsStr + ':00';

                        $('#' + startDateCtrlId).val(dateValToSet);
                        $('#' + startTimeCtrlId).val(timeValToSet);
                    }

                    if (endDateTimeVal != undefined && endDateTimeVal != null && endDateTimeVal != "") {

                        let endDateCtrlId = inputCtrl.id + "EndDate";
                        let endTimeCtrlId = inputCtrl.id + "EndTime";

                        var endDateTime = new Date(endDateTimeVal);
                        var dd = endDateTime.getDate();
                        var mm = endDateTime.getMonth() + 1; //January is 0!
                        var yyyy = endDateTime.getFullYear();
                        var hrs = endDateTime.getHours();
                        var mins = endDateTime.getMinutes();

                        var ddStr = dd.toString();
                        var mmStr = mm.toString();
                        if (dd < 10) { ddStr = '0'+ ddStr; } 
                        if (mm < 10) { mmStr = '0'+ mmStr; } 
                        var dateValToSet = yyyy + '-' + mmStr + '-' + ddStr;                       
                        
                        var hrsStr = hrs.toString();
                        var minsStr = mins.toString();
                        if (hrs < 10) { hrsStr = '0'+ hrsStr; } 
                        if (mins < 10) { minsStr = '0'+ minsStr; } 

                        var timeValToSet = hrsStr + ':' + minsStr + ':00';

                        $('#' + endDateCtrlId).val(dateValToSet);
                        $('#' + endTimeCtrlId).val(timeValToSet);
                    }

                } else {
                    ctrl.val(val);
                    assignmentCount += 1;
                }
            }
            if (inAdminMode) {
                ctrl.prop('readonly', true);
            } else {
                ctrl.prop('readonly', false);
            }
        }
    });

    ctrls = $('.is-admin-comment');
    $.each(ctrls, function (index, inputCtrl) {
        var ctrl = $(inputCtrl);
        if (ctrl != null && ctrl.attr('screenNum') == currentScreenNum) {
            ctrl.val(null);
            var val = request[inputCtrl.id];
            if (val != undefined && val != null && val != "") {
                ctrl.val(val);

                if (!inAdminMode) {
                    ctrl.prop('readonly', true);
                } 
                ctrl.show();
            }

            assignmentCount += 1;
        }
    });

    return assignmentCount;
}