//
// Request Manager for request initialization and validation.
//

import axios from 'axios'
import * as util from '@/common/util.js';
import * as apiMgr from '@/common/apiMgr.js';
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


export const clearValidationMessages = (prompts, currentScreenNum) => {
    
    $.each(prompts, function (index, requestPrompt) {
        if (requestPrompt.screenNum == undefined || requestPrompt.screenNum == null ||
            requestPrompt.screenNum < 1 || requestPrompt.screenNum == currentScreenNum) {

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

}


export const validatePrompts = (prompts) => {
    //debugger; // Uncomment to trigger breakpoint.

    // Hide all existing errors since the fields will be re-validated.
    clearValidationMessages(prompts, -1);

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

    if (location == undefined || location == null) {
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
        selectStartDateTimeStr = selectStartDateTimeStr.replace(new RegExp('-', 'g'), '/');
        let providedStartDateTime = new Date(selectStartDateTimeStr);
        
        let selectEndDateTimeStr = endDateVal + " " + endTimeVal;
        selectEndDateTimeStr = selectEndDateTimeStr.replace(new RegExp('-', 'g'), '/');
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

    var invalidMsg = $('#OUTOFBOUNDS-MSG-FOR-' + ctrlDataId)
    if (invalidMsg != null) {
        invalidMsg.hide();
    }
    var invalidMsg = $('#INVALID-MSG-FOR-' + ctrlDataId)
    if (invalidMsg != null) {
        invalidMsg.hide();
    }

    let maxSeatingCapacityInputVal = centralStore.state.appConfig.maxNumberValueInput;
    if (inVal < 0 || inVal > maxSeatingCapacityInputVal) {
        isValid = false;
        var invalidMsg = $('#OUTOFBOUNDS-MSG-FOR-' + ctrlDataId)
        if (invalidMsg != null) {
            invalidMsg.show();
        }
    } else if (!isValid) {
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
    clearValidationMessages(centralStore.state.requestPrompts, currentScreenNum);

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
            //debugger;
            util.logDebugMsg("bindUiValuesFromRequest - processing for " + inputCtrl.id);

            if (ctrl.is(':checkbox')) {
                ctrl.prop('checked', false);
                util.logDebugMsg("set ctrl check false for " + inputCtrl.id);
            } else if (ctrl.attr('type') == "text" || ctrl.attr('type') == "number") {
                ctrl.val(null);
                util.logDebugMsg("clear ctrl text/number for " + inputCtrl.id);
            }            

            var val = request[inputCtrl.id];
            if (val != undefined && val != null && val != "") {

                if (ctrl.is(':checkbox')) {

                    if (val == true) {
                        ctrl.prop('checked', true);
                        util.logDebugMsg("bindUiValuesFromRequest - Check control");
                    } else {
                        ctrl.prop('checked', false);
                        util.logDebugMsg("bindUiValuesFromRequest - Uncheck control");
                    }
                    assignmentCount += 1;

                } else if (ctrl.attr('type') == "text" || ctrl.attr('type') == "number") {

                    ctrl.val(val);
                    util.logDebugMsg("bindUiValuesFromRequest - set text control value: " + val);
                    assignmentCount += 1;

                } else if (ctrl.attr('isEventDateTime') == "true"){
                    
                    //debugger;
                    util.logDebugMsg("bindUiValuesFromRequest - About to bind to isEventDateTime control.");

                    var startDateTimeVal = val.startDateTime;
                    var endDateTimeVal = val.endDateTime;

                    if (startDateTimeVal != undefined && startDateTimeVal != null && startDateTimeVal != "") {

                        var startDateCtrlId = inputCtrl.id + "StartDate";
                        var startTimeCtrlId = inputCtrl.id + "StartTime";
                        
                        util.logDebugMsg("bindUiValuesFromRequest - About to create startDateTime Date object from " + startDateTimeVal);

                        var timeParts = util.getDateTimeParts(startDateTimeVal);
                        var dateValToSet = timeParts.fullDateUsingDashes;
                        var timeValToSet = timeParts.timeOption;

                        util.logDebugMsg("bindUiValuesFromRequest - About to set start date to control with: " + dateValToSet);
                        util.logDebugMsg("bindUiValuesFromRequest - About to set start time to control with: " + timeValToSet);

                        //debugger;
                        $('#' + startDateCtrlId).val(dateValToSet);
                        $('#' + startTimeCtrlId).val(timeValToSet);
                    } else {                        
                        util.logDebugMsg("bindUiValuesFromRequest - startDateTime value is null so default the time only!");
                        $('#' + startTimeCtrlId).val(centralStore.state.defaultTimeOption);
                    }

                    if (endDateTimeVal != undefined && endDateTimeVal != null && endDateTimeVal != "") {

                        let endDateCtrlId = inputCtrl.id + "EndDate";
                        let endTimeCtrlId = inputCtrl.id + "EndTime";

                        util.logDebugMsg("bindUiValuesFromRequest - About to create endDateTime Date object from " + endDateTimeVal);

                        var timeParts = util.getDateTimeParts(endDateTimeVal);
                        var dateValToSet = timeParts.fullDateUsingDashes;
                        var timeValToSet = timeParts.timeOption;
                        
                        util.logDebugMsg("bindUiValuesFromRequest - About to set end date to control with: " + dateValToSet);
                        util.logDebugMsg("bindUiValuesFromRequest - About to set end time to control with: " + timeValToSet);

                        $('#' + endDateCtrlId).val(dateValToSet);
                        $('#' + endTimeCtrlId).val(timeValToSet);
                    } else {
                        //debugger;
                        util.logDebugMsg("bindUiValuesFromRequest - endDateTime value is null so default the time only!");
                        $('#' + endTimeCtrlId).val(centralStore.state.defaultTimeOption);
                    }

                    assignmentCount += 1;

                } else {
                    ctrl.val(val);

                    util.logDebugMsg("bindUiValuesFromRequest - for other control, set value: " + val);
                    assignmentCount += 1;
                }
            } else {
                //debugger;
                if (ctrl.attr('isEventDateTime') == "true") {
                    let startDateCtrlId = inputCtrl.id + "StartDate";
                    let endDateCtrlId = inputCtrl.id + "EndDate";
                    let startTimeCtrlId = inputCtrl.id + "StartTime";
                    let endTimeCtrlId = inputCtrl.id + "EndTime";
                    $('#' + startDateCtrlId).val(null);
                    $('#' + endDateCtrlId).val(null);
                    //debugger;
                    $('#' + startTimeCtrlId).val(centralStore.state.defaultTimeOption);
                    $('#' + endTimeCtrlId).val(centralStore.state.defaultTimeOption);
                }
            }


            if (inAdminMode) {
                if (!ctrl.is('div')) {
                    ctrl.prop('readonly', true);
                    ctrl.prop('disabled', true);
                    ctrl.css("background-color", "white")
                }
            } else {
                ctrl.prop('readonly', false);
                ctrl.prop('disabled', false);
            }
        }
    });

    ctrls = $('.is-request-data-part');
    $.each(ctrls, function (index, inputCtrl) {
        var ctrl = $(inputCtrl);
        if (ctrl != null && ctrl.attr('screenNum') == currentScreenNum) {
            if (inAdminMode) {
                ctrl.prop('readonly', true);
                ctrl.prop('disabled', true);
                ctrl.css("background-color", "white")
            } else {
                ctrl.prop('readonly', false);
                ctrl.prop('disabled', false);
            }
        }
    });

    //debugger;
    ctrls = $('.is-additional-comment');
    $.each(ctrls, function (index, inputCtrl) {
        var ctrl = $(inputCtrl);
        if (ctrl != null && ctrl.attr('screenNum') == currentScreenNum) {
            var commentCtrlId = ctrl.attr('id').replace('Container', '');
            var commentCtrl = $('#' + commentCtrlId);
            var val = commentCtrl.val();
            if (val === undefined || val === null || val === "") {
                ctrl.hide();  
            } else {
                ctrl.show();
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
                    ctrl.prop('disabled', true);
                    ctrl.css("background-color", "lightyellow")
                } else {
                    ctrl.prop('readonly', false);
                    ctrl.prop('disabled', false);
                    ctrl.css("background-color", "lightyellow")
                }
                ctrl.show();
            } else {
                ctrl.hide();              
            }

            assignmentCount += 1;
        }
    });

    return assignmentCount;
}


export const getTotalAttendees = (request) => {
    let count = 0;

    if (request != undefined && request != null) {
        if (request.numOfGeEmpAttending != undefined && request.numOfGeEmpAttending != null) {
            count += request.numOfGeEmpAttending;  
        }
        if (request.numOfNonGeAttending != undefined && request.numOfNonGeAttending != null) {
            count += request.numOfNonGeAttending;  
        }
    }

    return count;
}


export const isTotalAttendeesLessThanOrEqualToRoomCapacity = (request) => {
    let status = true;

    if (request != undefined && request != null &&
        request.locationOfEvent != undefined && request.locationOfEvent != null) {

        let attendeesCount = getTotalAttendees(request);
        if (attendeesCount > request.locationOfEvent.seatingCapacity) {
            status = false;
        }
    }
    return status;
}


export const getLocalUserRequestById = (requestId, getfromPreviewRequests) => {

    var matchedRequest = null;

    if (getfromPreviewRequests) {
        $.each(centralStore.state.currentRequestsPreview, function (index, request) {
            if (request._id == requestId) {
                matchedRequest = request;
            }
        });
    } else {
        $.each(centralStore.state.currentUserRequests, function (index, request) {
            if (request._id == requestId) {
                matchedRequest = request;
            }
        });
    }

    return matchedRequest;
}

export const applyBadgeColorBasedOnProcessingStatus = () => {
    $(function() {
        $(".newUnsubmitted").addClass("badge badge-light");
        $(".approved").addClass("badge badge-success");
        $(".rejected").addClass("badge badge-danger");
        $(".underReview").addClass("badge badge-warning");
        $(".cancelled").addClass("badge badge-danger"); 
      });
}


export const manageProcessingStatus = (request) => {
    //debugger; // Uncomment to trigger breakpoint.

    if (request.processingStatus == "newUnsubmitted") {
        request.userCanEdit = true;
        request.adminCanEdit = false;
        request.processingStatusLabel = centralStore.state.appConfig.requestStatusTagNewUnsubmitted;
        request.processingStatusMessage = centralStore.state.appConfig.requestStatusMessageNewUnsubmitted;
    } else if (request.processingStatus == "underReview") {
        request.userCanEdit = false;
        request.adminCanEdit = true;
        request.processingStatusLabel = centralStore.state.appConfig.requestStatusTagUnderReview;
        request.processingStatusMessage = centralStore.state.appConfig.requestStatusMessageUnderReview;
    } else if (request.processingStatus == "approved") {
        request.userCanEdit = false;
        request.adminCanEdit = true;
        request.processingStatusLabel = centralStore.state.appConfig.requestStatusTagApproved;
        request.processingStatusMessage = centralStore.state.appConfig.requestStatusMessageApproved;
    } else if (request.processingStatus == "rejected") {
        request.userCanEdit = true;
        request.adminCanEdit = false;
        request.processingStatusLabel = centralStore.state.appConfig.requestStatusTagRejected;
        request.processingStatusMessage = centralStore.state.appConfig.requestStatusMessageRejected;
    } else if (request.processingStatus == "cancelled") {
        request.userCanEdit = false;
        request.adminCanEdit = true;
        request.processingStatusLabel = centralStore.state.appConfig.requestStatusTagCancelled;
        request.processingStatusMessage = centralStore.state.appConfig.requestStatusMessageCancelled;
    }    
}


export const prepareRequestsForUI = (requests) => {
    $.each(requests, function (index, request) {
        manageProcessingStatus(request);
    });
}



export const saveRequest = (request) => {

    var url = apiMgr.getRequestsUrl();
    var neverGotSaved = false;

    if (request._id == undefined || request._id == null) {
      neverGotSaved = true;
      request.processingStatus = "newUnsubmitted";       
      util.logDebugMsg(`Updated the new request: ${request.eventTitle}, processingStatus: ${request.processingStatus}`);   
    }
    manageProcessingStatus(request);

    if (neverGotSaved) {

      axios.post(url, request)
      .then(res => {
            if (res.status == 201 && res.data != null) {
              util.logDebugMsg(`Successfully saved the new request: ${request.eventTitle}, status: ${res.status}`);
              centralStore.state.currentRequest = res.data;
            } else {
              let errMsg = `Unable to saved the new request with newUnsubmitted: ${request.eventTitle}, status: ${res.status}`;
              util.logDebugMsg(errMsg);
              util.centralEvent.$emit('OnRequestBackgroundSaveError', errMsg);
            }             
        })
        .catch((err) => {   
          let errMsg = `Unable to saved the new request: ${request.eventTitle}, error: ${err}`;        
          util.logDebugMsg(errMsg);
          util.centralEvent.$emit('OnRequestBackgroundSaveError', errMsg);
        })

    } else {

      axios.put(url, request)
      .then(res => {
            if ((res.status == 200 || res.status == 204) && res.data != null) {
              util.logDebugMsg(`Successfully saved the editing request: ${request.eventTitle}, status: ${res.status}`);
              centralStore.state.currentRequest = res.data;
            } else {
              let errMsg = `Unable to saved the editing request with newUnsubmitted: ${request.eventTitle}, status: ${res.status}`;
              util.logDebugMsg(errMsg);
              util.centralEvent.$emit('OnRequestBackgroundSaveError', errMsg);
            }             
        })
        .catch((err) => {   
          let errMsg = `Unable to saved the editing request: ${request.eventTitle}, error: ${err}`;        
          util.logDebugMsg(errMsg);
          util.centralEvent.$emit('OnRequestBackgroundSaveError', errMsg);
        })
    }

}

