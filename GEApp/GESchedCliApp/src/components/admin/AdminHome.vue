<template>
<div>
<!--Page Contents-->
<div class="container-fluid">
    <div class="row">
        <div class="col col-12 col-sm-0 col-md-0 col-lg-1"></div>
        <div class="col col-12 col-sm-12 col-md-12 col-lg-10" style="color:gray">
        <div style="padding:18px;background-color:#ffb3b3;">
            <div class="float-left"><img src="@/assets/ge-monogram.svg" width="40" height="40" class="d-inline-block align-top" alt=""></div>
            <div class="welcome-back-msg">{{welcomeMessage}}</div>
            <div style="cursor:pointer;" class="logoff-label" @click.prevent="$router.push('/login')">Log Out&nbsp;<span class="fas fa-chevron-right"></span></div>
        </div>
        </div>
        <div class="col col-12 col-sm-0 col-md-0 col-lg-1"></div>
    </div>
    
    <div style="height:10px"></div>

    <div class="row">
        <div class="col col-12 col-sm-0 col-md-0 col-lg-1"></div>
        <div class="col col-12 col-sm-12 col-md-12 col-lg-10" style="color:gray">
    
            <div class="card" style="width:100%">
                    <div class="card-header bg-info text-light">
                        {{requestResultCaption}} 
                    </div>
            </div>

        </div>
        <div class="col col-12 col-sm-0 col-md-0 col-lg-1"></div>
    </div>

    <div style="height:10px"></div>

    <div class="row">
    <div class="col col-12 col-sm-0 col-md-0 col-lg-1"></div>

    <div id="searchUI" class="col col-12 col-sm-5 col-md-5 col-lg-3" style="margin-bottom:20px">
        <div class="card-header">
            <span>
                Quick Filter:&nbsp;<br>
                <button id="allRequest" @click.prevent="resetFilterView" class="btn btn-xs btn-info">All Requests</button>
                <button id="underReview" @click.prevent="onQuickFilter" class="btn btn-xs btn-warning">{{underReviewLabel}}</button>
                <button id="rejected" @click.prevent="onQuickFilter" class="btn btn-xs btn-danger" >{{rejectedLabel}}</button>                
                <button id="approved" @click.prevent="onQuickFilter" class="btn btn-xs btn-success">{{approvedLabel}}</button>
                <button id="cancelled" @click.prevent="onQuickFilter" class="btn btn-xs btn-danger">{{cancelledLabel}}</button>
            </span>
        </div>
        <div style="height:10px"></div>
      <div class="card">
      <div class="card-header bg-primary text-light" id="filterMenu" style="cursor:pointer;" data-toggle="collapse" data-target="#filterPanel" aria-expanded="true" aria-controls="filterPanel">
      <i class="fa fa-search-plus" aria-hidden="true"></i>&nbsp;&nbsp;Custom Filter&nbsp;&nbsp;<i class="fa fa-caret-down" aria-hidden="true"></i>
      </div>
      <div id="filterPanel" class="collapse show" aria-labelledby="filterMenu" data-parent="#accordion">
          <div id="filterMenu" class="card-body" style="padding:10px; width:100%;">

            <div id="inputEventName" class="input-group input-group-sm mb-3">
                <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Event Name&nbsp;</span>
                </div>
                <input type="text" class="form-control admin-custom-filter-input" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
            </div>

            <div id="inputRequesterName" class="input-group input-group-sm mb-3">
                <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Requester Name&nbsp;</span>
                </div>
                <input type="text" class="form-control admin-custom-filter-input" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
            </div>

            <div id="inputRequesterEmail" class="input-group input-group-sm mb-3">
                <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Requester Email&nbsp;</span>
                </div>
                <input type="text" class="form-control admin-custom-filter-input" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
            </div>

            <div id="inputLocation" class="input-group input-group-sm mb-3">
                <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Room/Location&nbsp;</span>
                </div>
                <input type="text" class="form-control admin-custom-filter-input" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
            </div>

            <div id="inputStatus" class="input-group input-group-sm mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Status&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </div>
                <select class="custom-select admin-custom-filter-input">
                    <option class="admin-custom-filter-input" selected></option>
                    <option class="admin-custom-filter-input" v-bind:id="statusItem.statusValue" v-bind:value='statusItem.statusValue' v-for="(statusItem, index) in processingStatusOptions" :key="index">
                        {{ statusItem.statusLabel }}
                    </option>
                </select>
            </div>

            <div id="inputPreviewPerPage" class="input-group input-group-sm mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Items Per Page&nbsp;</span>
                </div>
                <select class="custom-select admin-custom-filter-input" id="default-6">
                    <option value="6" selected>6</option>
                    <option value="8">8</option>
                    <option value="10">10</option>
                    <option value="12">12</option>
                </select>
            </div>
            
            <br>
            <button type="button" class="btn btn-sm btn-primary float-right" @click.prevent="filterView">Search</button>
            <button type="button" class="btn btn-sm btn-secondary" @click.prevent="resetFilterView">Reset</button>
          </div>
        </div>
      </div>
    </div>

    <div id="requestUI" style="margin: 0px;" class="col col-12 col-sm-7 col-md-7 col-lg-7">
            <div v-if="requestsPreview.length < 1">
                <div class="card" style="margin: 0px; padding: 0px">
                    <br>
                    <p style="text-align:center" class="font-italic text-muted">No requests found.</p>
                    <br>
                </div>
            </div>
            <div v-else>
                <div style="margin: 0px; padding: 0px"></div>
                <div class="container" style="width:100%; display:flex; flex-wrap:wrap; margin: 0px; padding: 0px">
                    <div :class="[requestItem._id, 'request-item', 'card', 'col-12', 'col-xl-6']" v-for="(requestItem, index) in requestsPreview" :key="index">
                        <div class="card-body">
                            <h6 class="card-title">{{requestItem.eventTitle}}</h6>
                            <h6 class="card-title"><span :class="requestItem.processingStatus">{{requestItem.processingStatusLabel}}</span></h6>
                            <div class="card-text"><i class="label-icon fas fa-building"></i>&nbsp;&nbsp;<b>{{requestItem.locationOfEvent.name}}</b>,&nbsp;{{requestItem.locationOfEvent.building}}</div> 
                            <div v-if="requestItem.eventDateTimeDisp != null" class="card-text"><i class="label-icon fas fa-calendar-check"></i>&nbsp;&nbsp;{{requestItem.eventDateTimeDisp}}</div>
                            <div class="card-text"><i class="label-icon fas fa-user-circle"></i>&nbsp;&nbsp;{{requestItem.eventGEContactPersonNameDisp}}</div>                      
                            <div class="card-text text-muted" style="font-size:80%;margin-bottom: 8px;">Updated On:&nbsp;{{requestItem.updatedAtDisp}}</div>
                            <div v-if="requestItem.adminCanEdit">
                                <button :id="requestItem._id" style="cursor:pointer" type="button" @click.prevent="onEditViewRequest" class="enableEdit btn btn-warning btn-sm float-right">Edit</button>
                            </div>
                            <div v-else>
                                <button :id="requestItem._id" style="cursor:pointer" type="button" @click.prevent="onEditViewRequest" class="disableEdit btn btn-primary btn-sm float-right">View</button>
                            </div>
                            <button :id="requestItem._id" type="button" @click.prevent="onDeleteRequestConfirm" class="btn btn-danger btn-sm float-left"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            <div style="height:10px;"></div>
            <div class="float-right" style="display:flex; flex-direction:horizontal">
                <div class="input-group-prepend">
                    <span class="input-group-text bg-secondary text-light">Page</span>
                </div>
                <div v-if="currentPageNumber > 1">
                    <button @click.prevent="onPageDecrement" style="height:100%" type="button" class="btn btn-secondary btn-sm">
                        &nbsp;<span class="fas fa-chevron-left"></span>&nbsp;
                    </button>
                </div>
                <div v-else>
                    <button style="height:100%" type="button" class="btn btn-secondary btn-sm" disabled>
                        &nbsp;<span class="fas fa-chevron-left"></span>&nbsp;
                    </button>
                </div>
                <div v-for="number in numPages" :key="number">
                    <button @click.prevent="onPagePick" v-bind:id="`page${number}Button`" style="height:100%;" type="button" class="pageNumberButton btn btn-sm">&nbsp;{{number}}&nbsp;</button>
                </div>
                <div v-if="currentPageNumber != numPages">
                    <button @click.prevent="onPageIncrement" style="height:100%" type="button" class="btn btn-secondary btn-sm">
                        &nbsp;<span class="fas fa-chevron-right"></span>&nbsp;
                    </button>
                </div>
                <div v-else>
                    <button style="height:100%" type="button" class="btn btn-secondary btn-sm" disabled>
                        &nbsp;<span class="fas fa-chevron-right"></span>&nbsp;
                    </button>
                </div>
            </div>
            
            <div class="float-right" style="display:flex; flex-direction:horizontal">
                <div class="input-group-prepend">
                    Total Requests Found:&nbsp;<b>{{numRequests}}</b>&nbsp;&nbsp;
                </div>
            </div>
            <div style="height:60px;"></div>
            
    </div>

    <div class="col col-12 col-sm-0 col-md-0 col-lg-1"></div>
    </div>
    <div style="height:30px"></div>
    <div class="row">
        <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
        <div class="col col-12 col-auto" style="color:gray">
          <div class="site-name-footer" v-html="$store.state.appConfig.siteName"></div>
          <div class="site-address-footer" v-html="$store.state.appConfig.siteAddress"></div>
        <br>
        </div>
        <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
    </div>
</div> 
</div>
</template>

<script>
import axios from 'axios';
import * as util from '@/common/util.js';
import * as apiMgr from '@/common/apiMgr.js';
import * as localCacheMgr from '@/common/localCacheMgr.js';
import { getLocalUserRequestById, manageProcessingStatus, prepareRequestsForUI, applyBadgeColorBasedOnProcessingStatus } from '@/common/requestMgr.js'

export default {
    data () {
        return {
            previewPerPage: 6, //hardcoded for now - need review
            numPages: 0,
            numRequests: 0,
            requestResultCaption: "Requests - All",
            currentPageNumber: 1,
            requestsQueryString: "",
            deleteMode: false,
            allStatusesExcludeNew: "underReview|rejected|approved|cancelled"
        }
    },


    computed: {

        processingStatusOptions() {
            return this.$store.state.processingStatusOptions; 
        },

        underReviewLabel() {
            return this.$store.state.appConfig.requestStatusTagUnderReview; 
        },

        rejectedLabel() {
            return this.$store.state.appConfig.requestStatusTagRejected; 
        },

        approvedLabel() {
            return this.$store.state.appConfig.requestStatusTagApproved; 
        },

        cancelledLabel() {
            return this.$store.state.appConfig.requestStatusTagCancelled; 
        },

        title() {
            return this.$store.state.appConfig.adminHomeViewTitle; 
        },

        viewDescription() {
            return this.$store.state.appConfig.adminHomeViewDescription; 
        },

        requestsPreview() {
            return this.$store.state.currentRequestsPreview;
        },

        welcomeMessage() {
            var welcomeMsg = "Welcome";
            try {               
                var userFullName = this.$store.state.currentAdminUser.name;
                var nameParts = userFullName.split(' ');
                var firstName = nameParts[0];
                welcomeMsg = "Welcome, " + firstName;
                var maxLenGoodForSmallPhone = 28;
                if (util.detectIsInSmallWidthMode() && welcomeMsg.length > maxLenGoodForSmallPhone) {
                    welcomeMsg = firstName;
                }
            } catch (err) {}  
            return welcomeMsg;      
        }
    },


    created() {
        console.log('AdminHome.vue created.');
        let vm = this;

        util.centralEvent.$on('onDeleteSelectedRequest', () => {
            if (vm.$store.state.actionForSelectedRequest.forDeleteFromView == "AdminHome.vue") {
                vm.onDeleteRequest();
            }
        });
    },
  

    activated() {
        console.log('AdminHome.vue activated.');
        let vm = this;

        if (this.$store.state.appConfig.adminHomeViewTitle == null) {
        this.$router.push('/login'); // Config data lost, force back to login to refetch data.
        return;
        }

        this.$store.state.currentViewTitle = this.title;
        this.$store.state.enableNavBar = true;
        this.$store.state.hideBackNav  = true;

        if (util.detectIsInSmallWidthMode()) {
            //collapse search menu
            $("#filterPanel").removeClass("show");
            $("#filterPanel").removeClass("hide");
        }

        vm.clearSearchUI();
        vm.requestsQueryString = `&processingStatusContains=${this.allStatusesExcludeNew}`;
        vm.requestResultCaption = "Requests - All";

        vm.currentPageNumber = 1;
        vm.updateRequests();
        vm.$forceUpdate();

        $('#allRequest').focus();
    },


    updated() {
        let vm = this;

        applyBadgeColorBasedOnProcessingStatus();

        //highlight current page num
        $('.pageNumberButton').each(function(index){
            if($(this).attr('id') == `page${vm.currentPageNumber}Button`){
                $(this).removeClass();
                $(this).addClass('pageNumberButton btn btn-info btn-sm');
            } else {
                $(this).removeClass();
                $(this).addClass('pageNumberButton btn btn-secondary btn-sm');
            }
        });
    },

    deactivated(){
        console.log("AdminHome.vue deactivated.");
    },

    methods: {

        onPagePick: function(event){
            if (event){
                console.log("onPagePick activate.");
                let vm = this;
                
                vm.currentPageNumber = event.target.id.replace("page", "").replace("Button", "");
                vm.updateRequests();
            }
        },


        onPageIncrement: function(event){
            if(event){
                console.log("onPageIncrement activate.")
                let vm = this;

                vm.currentPageNumber++;
                vm.updateRequests();
            }
        },


        onPageDecrement: function(event){
            if(event){
                console.log("onPageDecrement activate.")
                let vm = this;

                vm.currentPageNumber--;
                vm.updateRequests();
            }
        },


        updateRequests() {
            console.log("updateRequests activate.");
            let vm = this;

            let pageNumber = vm.currentPageNumber;
            console.log(`Page number: ${pageNumber}`);

            if (util.detectIsInSmallWidthMode()) {
                //collapse search menu
                $("#filterPanel").removeClass("show");
                $("#filterPanel").removeClass("hide");
            }

            //gather query string
            var url = apiMgr.getRequestsUrl() + `&numOfItemsToSkip=${vm.previewPerPage * (vm.currentPageNumber-1)}&summaryFieldsOnly=true&numOfItemsPerPage=${vm.previewPerPage}`;
            
            if(vm.requestsQueryString != null && vm.requestsQueryString != ""){
                url += vm.requestsQueryString;
            }
            console.log(url);

            //get requests
            axios.get(url)
                .then(res => {
                    console.log("getRequestsUrl return status: " + res.status);
                    
                    if(vm.$store.state.currentRequestsPreview != null){
                        while(vm.$store.state.currentRequestsPreview.length > 0) {
                            vm.$store.state.currentRequestsPreview.pop();
                        }
                    }
                    var foundRequests = res.data;

                    $.each(foundRequests, function (index, foundRequest) {

                        foundRequest.updatedAtDisp = util.getDateTimeDisplay(foundRequest.updatedAt);

                        foundRequest.eventGEContactPersonNameDisp = foundRequest.eventGEContactPersonName;
                        if (foundRequest.eventGEContactPersonNameDisp == null && foundRequest.eventGEContactPersonNameDisp == "") {
                            foundRequest.eventGEContactPersonNameDisp = foundRequest.eventGEContactPersonEmail; 
                        } else {
                            foundRequest.eventGEContactPersonNameDisp += `, (${foundRequest.eventGEContactPersonEmail})`;
                        }

                        if (foundRequest.eventSchedule != null && foundRequest.eventSchedule.startDateTime != null && foundRequest.eventSchedule.endDateTime != null) {
                            foundRequest.eventDateTimeDisp = util.makeEventDateTimeDisplay(foundRequest.eventSchedule.startDateTime, foundRequest.eventSchedule.endDateTime);
                        }

                        vm.$store.state.currentRequestsPreview.push(foundRequest);
                    });

                    prepareRequestsForUI(vm.$store.state.currentRequestsPreview);         
                    vm.getNumPages();
                    if (!util.detectIsInSmallWidthMode()) {
                      window.scrollTo(0, 0);
                    }
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })
        },


        filterView( quickFilterStatus ) {
            console.log("filterView activated.");
            var queryString = '';
            var vm = this;

            vm.currentPageNumber = 1;
            vm.requestsQueryString = "";

            vm.requestResultCaption = "Requests - custom filter"

            if (util.detectIsInSmallWidthMode()) {
                //collapse search menu
                $("#filterPanel").removeClass("show");
                $("#filterPanel").removeClass("hide");
            }

            //get preview per page
            vm.previewPerPage = $("#inputPreviewPerPage select")[0].value;

            //gather event name to query
            var nameToQuery = '';
            var nameSet = $("#inputEventName input");
            
            $.each(nameSet, function( index, item ){
                if(item.value != null && item.value != ""){
                    nameToQuery = item.value;
                    vm.requestsQueryString += `&requestNameContains=${nameToQuery}`;
                }
            });

            //gather requester email to query
            var requesterEmailToQuery = '';
            var requesterEmailSet = $("#inputRequesterEmail input");
            
            $.each(requesterEmailSet, function( index, item ){
                if(item.value != null && item.value != ""){
                    requesterEmailToQuery = item.value;
                    vm.requestsQueryString += `&requesterEmailContains=${requesterEmailToQuery}`;
                }
            });

            //gather requester name to query
            var requesterNameToQuery = '';
            var requesterNameSet = $("#inputRequesterName input");
            
            $.each(requesterNameSet, function( index, item ){
                if(item.value != null && item.value != ""){
                    requesterNameToQuery = item.value;
                    vm.requestsQueryString += `&requesterNameContains=${requesterNameToQuery}`;
                }
            });

            //gather location to query
            var locationToQuery = '';
            var locationSet = $("#inputLocation input");

            $.each(locationSet, function( index, item ){
                if(item.value != null && item.value != ""){
                    locationToQuery = item.value;
                    vm.requestsQueryString += `&locationContains=${locationToQuery}`;
                }
            });

            //gather status to query
            var statusToQuery = '';
            var statusSet = $("#inputStatus select option");

            $.each(statusSet, function( index, item ){
                if (item.selected && item.id != ""){
                    statusToQuery = item.id;
                    vm.requestsQueryString += `&processingStatusContains=${statusToQuery}`;
                }
            });
            
            vm.updateRequests();
        },


        resetFilterView: function(event){
            console.log("resetFilterView activated.");
            let vm = this;
            vm.requestResultCaption = "Requests - All"
            vm.requestsQueryString = `&processingStatusContains=${this.allStatusesExcludeNew}`;
            vm.clearSearchUI();
            vm.updateRequests();
        },


        getNumPages( pageNumBeforeDelete ){
            console.log("getNumPages activated.");
            let vm = this;

            //get requests and pages count
            var url = apiMgr.getRequestsUrl().replace("requests", "requestscount") + `&numOfItemsPerPage=${vm.previewPerPage}`;
            if(vm.requestsQueryString != null && vm.requestsQueryString != ""){
                url += `${vm.requestsQueryString}`;
            }

            axios.get(url)
                .then(res => {
                    console.log("getRequestsUrl return status: " + res.status);
                    
                    vm.numPages = res.data.numOfPages;
                    vm.numRequests = res.data.count;

                    var newCountPart = " (" + vm.numRequests + ")";
                    var beginCountPart = vm.requestResultCaption.indexOf("(");
                    if (beginCountPart > -1) {
                        // Need to remove the previous number part first.
                        var requestResultCaptionSuffix = vm.requestResultCaption.substring(beginCountPart, vm.requestResultCaption.length);
                        var requestResultCaptionPrefix = vm.requestResultCaption.replace(requestResultCaptionSuffix, '').trim();                     
                        vm.requestResultCaption = requestResultCaptionPrefix + newCountPart;
                    } else {
                        vm.requestResultCaption = vm.requestResultCaption + newCountPart;
                    }

                    if(pageNumBeforeDelete !== undefined){
                        if(pageNumBeforeDelete > vm.numPages){
                        console.log("AdminHome.vue - Going back 1 page after Delete");

                        vm.currentPageNumber = vm.numPages;
                        console.log(vm.requestsQueryString);
                        vm.updateRequests();

                        }
                    }

                    vm.$forceUpdate();                   
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })
        },


        onEditViewRequest: function(event) {
            console.log('AdminHome.vue - onEditViewRequest activate');

            let vm = this;
            let selectedReqId = event.target.id;
            let storeState = this.$store.state;

            var url = apiMgr.getRequestByIdUrl(selectedReqId);
            console.log(url);

            //get requests
            axios.get(url)
                .then(res => {
                    console.log("getRequestByIdUrl return status: " + res.status);

                    storeState.currentRequest = res.data;
                    manageProcessingStatus(storeState.currentRequest);
                
                    //check if it is an edit or a view; if edit, go to request/1, if view, go to summary
                    if($(event.target).hasClass("enableEdit")){
                        vm.$router.push('/request/1');
                    } else if ($(event.target).hasClass("disableEdit")) {
                        vm.$router.push('/requestsummary'); 
                    }
                })
                .catch((err) => { //todo
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })
        },


        onDeleteRequest() {
            console.log('AdminHome.vue - onDeleteRequest');
            let vm = this;

            let currId = this.$store.state.actionForSelectedRequest.forDelete._id;                
            var url = apiMgr.getRequestByIdUrl(currId);
            console.log(`AdminHome.vue - Query url: ${url}`);

            let pageNumBeforeDelete = vm.currentPageNumber;
            
            axios.delete(url) // send delete request
                .then(res => {
                    console.log("getRequestsUrl return status: " + res.status);
                    vm.removeRequestPreviewFromLocalCollection(currId);
                    vm.isFetchingRequests = false;
                    this.$store.state.actionForSelectedRequest.forDelete = null;
                    this.$store.state.actionForSelectedRequest.forDeleteFromView = null;
                    $('#requestActionConfirmDialog').modal('hide');
                    this.$store.state.isModalBeingDisplayed = false;

                    //if the request was the last on its page, then go back 1 page
                    vm.getNumPages(pageNumBeforeDelete);

                })
                .catch((err) => {
                    if (err.response.status == 400) {
                        vm.removeRequestPreviewFromLocalCollection(currId);
                    } else {
                        console.log(err);
                        vm.hasFailure = true;
                        vm.failureMessage = "Server unavailable or not working at this time. Please try later.";       
                    }                        
                })           
        },

        removeRequestPreviewFromLocalCollection: function(id) {
            var indexToRemove = -1;
            $.each(this.$store.state.currentRequestsPreview, function (index, reqPreview) {
                if (reqPreview._id == id) {
                    indexToRemove = index;
                }
            });      
            if (indexToRemove > -1) {
                this.$store.state.currentRequestsPreview.splice(indexToRemove, 1);
            } 
        },

        onQuickFilter: function(event) {
            if (event) {
                console.log("onQuickFilter activate.");
                let vm = this;

                vm.clearSearchUI();

                if (util.detectIsInSmallWidthMode()) {
                    //collapse search menu
                    $("#filterPanel").removeClass("show");
                    $("#filterPanel").removeClass("hide");
                }

                vm.currentPageNumber = 1;
                vm.requestsQueryString = "";
                let statusToQuery = event.target.id;

                var filterLabel = util.getProcessingStatusOptionLabel(statusToQuery);
                vm.requestResultCaption = "Requests - " + filterLabel;
                
                vm.requestsQueryString += `&processingStatusContains=${statusToQuery}`;
                vm.updateRequests();
            }
        },

        onDeleteRequestConfirm: function(event){
            if(event){
                console.log("onDeleteRequestConfirm");
                let vm = this;

                let currId = event.currentTarget.id;
                this.$store.state.actionForSelectedRequest.forDelete = getLocalUserRequestById(currId, true);
                this.$store.state.actionForSelectedRequest.forDeleteFromView = "AdminHome.vue";
                
                $('#requestActionConfirmDialog').modal('show');
                this.$store.state.isModalBeingDisplayed = true;
            }
        },


        clearSearchUI(){
            //clear all search UI to be blank
            var inputs = $("input");
            inputs.each(function(){
            let inputType = this.type;
            if (inputType == "text" || inputType == "number"){
                this.value = "";
            } else if (inputType == "checkbox"){
                this.checked = false; //needs fixing
            } 
            });

            var selects = $('select');
            selects.each(function(){
                if (this.id != null && this.id != "") {
                    if (this.id.indexOf("default") > -1) {
                        //if there is a default, reselect it
                        this.value = this.id.replace("default-", "");
                    } else {
                        this.value = "";
                    }
                } else {
                    this.value = "";
                }
            });
        }

    }
} 
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pad-bottom {
  padding-bottom:5px
}
a {
    margin:2px
}

</style>