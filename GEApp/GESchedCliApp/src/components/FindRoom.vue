<template>
<div>
<!-- Modal -->
<div class="modal" id="findRoomModal" tabindex="-1" role="dialog" aria-labelledby="findRoomModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="findRoomModalLabel">Choose Room</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>Would you like to select this room?</p>
        <div class="card" id="selectedRoomUI">
            <!--Room card will be injected here-->
          </div>
        <div v-if="selectedRoom != null">
          <div v-if="selectedRoom.configurations.length > 0">
            <hr>
            <p>Select a configuration:</p>
            <div class="card">
              <div class="card-header bg-warning" id="configHeading" data-toggle="collapse" data-target="#configCollapse" aria-expanded="false" aria-controls="configCollapse">
                  Configurations&nbsp;<i class="fa fa-caret-down" aria-hidden="true"></i>
              </div>

              <div id="configCollapse" class="collapse" aria-labelledby="configHeading" data-parent="#accordionExample">
                <div class="card-body">
                  <div v-for="(configuration, index) in selectedRoom.configurations" :key="index">
                    <div v-if="index == 0">
                      <div :id="`${configuration}`" @click.prevent="onConfigSelect" class="card border-success">
                        <div :id="`${configuration}`" class="card-body">
                          <div :id="`${configuration}`" style="text-align:center">
                            <img :id="`${configuration}`" style="height:200px" :src="require(`@/assets/roomconfig/${selectedRoom.name.replace(/\'|\s+/g, '')}/${configuration}.png`)" :alt="configuration"/>
                            </div>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <div :id="`${configuration}`" @click.prevent="onConfigSelect" class="card">
                        <div :id="`${configuration}`" class="card-body">
                          <div :id="`${configuration}`" style="text-align:center">
                            <img :id="`${configuration}`" style="height:200px" :src="require(`@/assets/roomconfig/${selectedRoom.name.replace(/\'|\s+/g, '')}/${configuration}.png`)" :alt="configuration"/>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            
        </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click.prevent="onRoomDeselect">Close</button>
        <button type="button" class="btn btn-primary" @click.prevent="onRoomSelectConfirm">Confirm Select</button>
      </div>
    </div>
  </div>
</div>
<!--Page Contents-->
<div class="containerDiv container-fluid" style="width:100%">
  <div class="row">
    <div class="col col-12 col-md-1 col-lg-2"></div>
    <div class="col col-12 col-md-10 col-lg-8" style="color:gray">
    <div class="site-name-footer" v-html="$store.state.appConfig.siteName"></div>
    <div class="site-address-footer" v-html="$store.state.appConfig.siteAddress"></div>      
    <div style="height:8px;"></div>
      <div class="alert alert-warning" role="alert">
          <h5 class="alert-heading">Select Room</h5>
          <div style="height:2px;"></div>
          <div v-if="isSelectingRoom">
            <p>Select a location below. Return to the request page by hitting the back button.</p>
          </div>
          <div v-else>
              <p>To save a room to appear on your next new request, select it below.</p>
              <p>
                <span>Current saved room:
                <div v-if="selectedRoom != null">
                  <b>{{selectedRoom.name}}</b>&nbsp;
                  <div v-if="selectedRoom['selectedConfig'] != null">
                  <i class="fa fa-arrow-right" aria-hidden="true"></i>&nbsp;{{selectedRoom['selectedConfig'].replace(/\-/g, " ")}}
                  </div>
                </div>
                <div v-else class="font-italic">
                  No room selected!
                </div>
                </span>
              </p>
          </div>
        </div>

    </div>
    <div class="col col-12 col-md-1 col-lg-2"></div>
  </div>

  <div class="row">
    <div class="col col-12 col-md-1 col-lg-2"></div>

    <div id="searchUI" class="col col-12 col-md-5 col-lg-4" style="margin-bottom:20px">
      <div class="card">
      <div class="dropdownMenu card-header bg-primary text-light" id="searchHeader" style="cursor:pointer;" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
      <i class="fa fa-search-plus" aria-hidden="true"></i>&nbsp;&nbsp;Search Menu&nbsp;&nbsp;<i class="fa fa-caret-down" aria-hidden="true"></i>
      <div class="custom-control custom-checkbox float-right">
          <input type="checkbox" class="custom-control-input" id="show-names-only" value="show-names-only" v-model="showNamesOnly">
          <label class="custom-control-label" for="show-names-only">Names Only</label>
      </div>      
      </div>
      <div id="collapseOne" class="collapse show" aria-labelledby="searchHeader" data-parent="#accordion">
          <div id="filterMenu" class="card-body" style="padding:10px; width:100%;">

            <div id="inputRoomName" class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Room Name</span>
              </div>
              <input type="text" class="form-control room-find-custom-filter-input" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
            </div>

            <div id="inputBuilding" class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Building</span>
              </div>
              <select class="custom-select room-find-custom-filter-input">
                <option selected></option>
                  <option v-bind:id="buildingLabel" v-bind:value='buildingLabel' v-for="(buildingLabel, index) in buildings" :key="index">
                    {{buildingLabel}}
                  </option>
              </select>
            </div>
            
            <div id="inputSeatingCapacity" class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Seating Capacity</span>
              </div>
              <input type="number" placeholder="ex. 50" class="form-control room-find-custom-filter-input" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
            </div>
    
            <div id="inputSizeType" class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Size Type</span>
              </div>
              <select class="custom-select room-find-custom-filter-input">
                <option class="room-find-custom-filter-input" selected></option>
                  <option class="room-find-custom-filter-input" v-bind:id="sizeItem._id" v-bind:value='sizeItem._id' v-for="(sizeItem, index) in sizeTypes" :key="index">
                    <span>{{sizeItem._id}} &nbsp;
                    <div v-if="sizeItem.minSeatingCapacity == sizeItem.maxSeatingCapacity">
                      ({{sizeItem.minSeatingCapacity}} seats)
                    </div>
                    <div v-else>
                      ({{sizeItem.minSeatingCapacity}} - {{sizeItem.maxSeatingCapacity}} seats)
                    </div>
                    </span>
                  </option>
              </select>
            </div>

            
            <div id="inputCapabilities" class="card">
              <div style="text-align:left; cursor:pointer;" class="card-header input-group-text bg-light" id="headingTwo" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                    Capabilities&nbsp;&nbsp;<i class="fa fa-caret-down" aria-hidden="true"></i>
              </div>
              <div id="collapseTwo" class="collapse hide" aria-labelledby="headingTwo" data-parent="#accordion">
                <div class="card-body">
                  <div v-for="(capabilityLabel, index) in capabilities" :key="index" width="100%">
                    <input class="capabilityCheckbox" v-bind:id="capabilityLabel" type="checkbox"/>&nbsp;{{capabilityLabel}}
                  </div>
                </div>
              </div>
            </div>
              
            
            <br>
            <button type="button" class="btn btn-sm btn-primary float-right" @click.prevent="filterView">Search</button>
            <button type="button" class="btn btn-sm btn-secondary" @click.prevent="resetFilterView">Reset</button>
          </div>
        </div>
      </div>
    </div>

    <div id="roomUI" class="col col-12 col-md-5 col-lg-4">
      <div class="card">
        <div class="card-header bg-secondary text-light">
          Rooms
        </div>
      </div>
      <div v-for="(room, index) in rooms" :key="index">
        <div class="card" v-bind:class="room._id">
          <div class="card-body">

            <h6 :hidden="showNamesOnly" class="card-title">{{room.name}}
              <i v-bind:id="room._id" class="popup fa fa-info-circle text-info" :hidden="showNamesOnly || room.specialNote == null || room.specialNote ==''" @click.prevent="togglePopup">
                <span class="popuptext" style="font-family: Calibri; font-weight:normal" v-bind:id="`popup-${room._id}`">{{room.specialNote}}</span>
              </i>
            </h6>
            <h6 :hidden="!showNamesOnly" class="card-title">{{room.name}}&nbsp;-&nbsp;(seats: {{room.seatingCapacity}}),&nbsp;{{room.building}}
            <button :hidden="!showNamesOnly" v-bind:id="room._id" type="button" class="btn btn-sm btn-warning float-right" @click.prevent="onRoomSelectModal">Select</button>
            </h6>
            <div :hidden="showNamesOnly">
            <div class="card-text" :hidden="showNamesOnly || room.building == null || room.building == ''">Building: {{room.building}}</div>
            <div class="card-text" :hidden="showNamesOnly || room.sizeType == null || room.sizeType == ''">Size Type: {{room.sizeType}}</div>
            <div class="card-text" :hidden="showNamesOnly || room.seatingCapacity == null || room.seatingCapacity == ''">Seating Capacity: {{room.seatingCapacity}}</div>
            <div class="card-text" :hidden="showNamesOnly || room.configurations == null || room.configurations.length == 0"><span class="badge badge-secondary">Has Custom Configurations</span></div>
            <div class="card-text" :hidden="showNamesOnly || room.capabilities == null || room.capabilities.length == 0">
              <hr>
              <span v-for="(capability, index) in room.capabilities" :key="index" style="padding:1px">
                <span class="badge text-light capability-badge-style">
                  {{capability}}
                </span>
              </span>  
            </div>
            <br>
            </div>
            <button :hidden="showNamesOnly" v-bind:id="room._id" type="button" class="btn btn-sm btn-warning float-right" @click.prevent="onRoomSelectModal">Select</button>
          </div>
        </div>
      </div>
    </div>

    <div class="col col-12 col-md-1 col-lg-2"></div>
  </div>
  </div>
  </div>
</template>

<script>
import axios from 'axios';
import * as util from '@/common/util.js';
import * as apiMgr from '@/common/apiMgr.js';
import * as localCacheMgr from '@/common/localCacheMgr.js';
import { saveRequest } from '@/common/requestMgr.js'

export default {
  data () {
    return {
      isSelectingRoom: false,
      showNamesOnly: false
    }
  },

  computed: {
    title() {
      return this.$store.state.appConfig.findRoomViewTitle; 
    },
    
    viewDescription() {
      return this.$store.state.appConfig.roomsViewDescription; 
    },

    rooms() {
      return this.$store.state.roomSearchResult;
    },

    sizeTypes(){
      return this.$store.state.appConfig.sizeTypes;
    },

    capabilities(){
      return this.$store.state.appConfig.roomCapabilities;
    },

    buildings(){
      return this.$store.state.appConfig.buildings;
    },

    selectedRoom(){
      return this.$store.state.selectedRoom;
    },

    isNewRequest() {
      var isNew = true;
      var storeState = this.$store.state;
      if (storeState.currentRequest != null && 
          storeState.currentRequest.processingStatus != undefined && 
          storeState.currentRequest.processingStatus != null && 
          storeState.currentRequest.processingStatus != "newUnsubmitted") {
        isNew = false;
      }
      return isNew;
    }
  },

  activated() {
    util.logDebugMsg('FindRoom.vue activated.');
    let vm = this;

    if (this.$store.state.appConfig.findRoomViewTitle == null) {
      this.$router.push('/login'); // Config data lost, force back to login to refetch data.
      return;
    }

    this.$store.state.currentViewTitle = this.title;
    this.$store.state.enableNavBar = true;

    vm.clearSearchUI();

    //reopen search UI
    /* $('#dropdownMenu').each(function(){
      this.dropdown('open');
    }); */

    var selects = $("option");
    selects.each(function() {
      this.selected = false;
    });


    // empty roomSearchResult, then re-add all rooms
    if(vm.$store.state.roomSearchResult != null){
      while(vm.$store.state.roomSearchResult.length > 0) {
        vm.$store.state.roomSearchResult.pop();
      }
    }
    $.each(this.$store.state.rooms, function (index, room) {
      vm.$store.state.roomSearchResult.push(room);
    });


    util.logDebugMsg('FindRoom.vue activated - vm.$store.state.previousPage: ' + vm.$store.state.previousPage);

    vm.isSelectingRoom = false;
    //check if previous screen was a request screen
    if(vm.$store.state.previousPage.indexOf("RequestScreen") > -1){
      util.logDebugMsg(`Previous screen is request: ${vm.$store.state.previousPage}. Select Room Activated.`);
      vm.isSelectingRoom = true;
      vm.$store.state.currentViewTitle = "Select Room";
    }

  },

  methods: {

    onShowNamesOnly: function(event) {
      event.stopPropagation();
      return false;
    },

    filterView: function(event) {
      if(event){
        var queryString = '';
        var vm = this;

        if (util.detectIsInSmallWidthMode()) {
          //collapse search menu
          $("#searchHeader").click();
        }

        //gather name to query
        var nameToQuery = '';
        var nameInputLocation = $("#inputRoomName input");

        nameToQuery = nameInputLocation.val();

        //gather building to query
        var buildingToQuery = '';
        var buildingSet = $("#inputBuilding select option");

        $.each(buildingSet, function( index, item ){
          if (item.selected){
            buildingToQuery = item.id;
          }
        });

        //gather seating capacity to query
        var seatingCapacityToQuery = '';
        var seatingCapacityInputLocation = $("#inputSeatingCapacity input");

        seatingCapacityToQuery = seatingCapacityInputLocation.val();

        //gather sizeType to query
        var sizeTypeToQuery = '';
        var sizeTypeSet = $("#inputSizeType select option");

        $.each(sizeTypeSet, function( index, item ){
          if (item.selected){
            sizeTypeToQuery = item.id;
          }
        });

        //gather capabilities to query
        var capabilitiesToQuery = [];
        var capabilitySet = $(".capabilityCheckbox");

        $.each(capabilitySet, function( index, item ){
          if (item.checked){
            capabilitiesToQuery.push(item.id);
          }
        });


        //append to queryString
        queryString += '&';

        if (sizeTypeToQuery!='') {
          queryString += `sizeTypeContains=${encodeURIComponent(sizeTypeToQuery)}`;
          queryString += '&'
        }

        if (buildingToQuery!='') {
          queryString += `buildingContains=${encodeURIComponent(buildingToQuery)}`;
          queryString += '&'
        }

        if (capabilitiesToQuery.length!=0) {
          var capabilityString = 'hasTheseCapabilities=';
          for(let capability in capabilitiesToQuery){
            capabilityString += `${encodeURIComponent(capabilitiesToQuery[capability])}|`;
          }
          //trim last |
          capabilityString = capabilityString.substring(0, capabilityString.length-1);
          queryString += capabilityString;
          queryString += '&'
        }

        if (nameToQuery!=''){
          queryString += `nameContains=${encodeURIComponent(nameToQuery)}`;
          queryString += '&'
        }

        if (seatingCapacityToQuery!=''){
          queryString += `seatingCapacityGreaterOrEqual=${encodeURIComponent(seatingCapacityToQuery)}`;
          //queryString += '&'
        }

        //clean up last & if needed
        var lastChar = queryString.charAt(queryString.length-1);
        if (lastChar == '&'){
          queryString = queryString.substring(0, queryString.length-1);
        }

        util.logDebugMsg(`FindRoom.vue - Query string: ${queryString}`);

        //get queried rooms
        var url = apiMgr.getRoomsUrl() + queryString; 

            axios.get(url)
                .then(res => {
                    util.logDebugMsg("getRoomsUrl return status: " + res.status);
                    
                    while(vm.$store.state.roomSearchResult.length > 0) {
                      vm.$store.state.roomSearchResult.pop();
                    }

                    var foundRooms = res.data;
                    
                    $.each(foundRooms, function (index, room) {
                      vm.$store.state.roomSearchResult.push(room);
                    });
                    
                    vm.isFetchingRooms = false;
                    
                    if (!util.detectIsInSmallWidthMode()) {
                      window.scrollTo(0, 0);
                    }
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })
        
      }
    },

    resetFilterView: function(event){
       if(event){
        var vm = this;

        //reset all input boxes and checkboxes
        vm.clearSearchUI();

        //get full list of rooms
        var url = apiMgr.getRoomsUrl(); 

            axios.get(url)
                .then(res => {
                    console.log("getRoomsUrl return status: " + res.status);
                    vm.$store.state.roomSearchResult = res.data;
                    vm.isFetchingRooms = false;
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })
      }
      
    },

    onRoomSelectModal: function(event){
      if(event){
          let vm = this;
          util.logDebugMsg("onRoomSelectModal begin.");


          $('#findRoomModal').modal('show');
          this.$store.state.isModalBeingDisplayed = true;
          let currId = event.target.id;

          let currCard = document.getElementsByClassName(currId)[0].innerHTML;
          currCard = currCard.replace(event.target.outerHTML, ""); //get rid of the button in modal
          document.getElementById("selectedRoomUI").innerHTML = currCard;

          //set selectedRoom
          var url = apiMgr.getRoomsByIdUrl(currId);

          axios.get(url)
              .then(res => {
                  util.logDebugMsg("onRoomSelectModal - getRoomsUrl return status: " + res.status);
                          
                  vm.$store.state.selectedRoom = res.data;
                  if (vm.$store.state.selectedRoom != null) {
                    util.logDebugMsg('onRoomSelectModal - Assigned vm.$store.state.selectedRoom: ' + vm.$store.state.selectedRoom.name);
                  }
              })
              .catch((err) => {
                  vm.hasFailure = true;
                  vm.failureMessage = "Server unavailable or not working at this time. Please try later.";  
                  util.logDebugMsg('onRoomSelectModal - ' + vm.failureMessage);                             
              })
      }
    },


    onRoomSelectConfirm() {
      util.logDebugMsg('onRoomSelectConfirm activated.');
      let vm = this;

      //save selected config
      if ($(".border-success").length > 0) {
        vm.$store.state.selectedRoom["selectedConfig"] = $(".border-success")[0].id;
        util.logDebugMsg('onRoomSelectConfirm activated. Set vm.$store.state.selectedRoom["selectedConfig"] = ' + vm.$store.state.selectedRoom["selectedConfig"]);
      }
      
      $('#findRoomModal').modal('hide');
      this.$store.state.isModalBeingDisplayed = false;
      window.scrollTo(0, 0);
      $("#collapseOne").removeClass("show");
      $("#collapseOne").removeClass("hide");

      util.logDebugMsg('onRoomSelectConfirm - findRoomModal.modal(hide)');

      if (vm.$store.state.previousPage != null) {
        util.logDebugMsg('onRoomSelectConfirm - vm.$store.state.previousPage: ' + vm.$store.state.previousPage);
      }

      if (vm.$store.state.previousPage.indexOf("Request") > -1) {
        //save to currentRequest and flush selectedRoom  
        var curReq = vm.$store.state.currentRequest;     
        curReq.locationOfEvent = vm.$store.state.selectedRoom;
        vm.$store.state.currentRequest = null; // temporarily change it and trick computed to trigger.
        vm.$store.state.currentRequest = curReq;
        if (vm.$store.state.currentRequest.locationOfEvent != null) {
          util.logDebugMsg('onRoomSelectConfirm - set currentRequest.locationOfEvent with selectRoom: ' + vm.$store.state.selectedRoom.name);
        }

        vm.$store.state.selectedRoom = null;
        util.logDebugMsg('onRoomSelectConfirm - cleared out. set selectedRoom to null');

        util.logDebugMsg('onRoomSelectConfirm - issue saveRequest');
        saveRequest(vm.$store.state.currentRequest);

        //navigate back to request page
        let pageNum = vm.$store.state.previousPage.substring(vm.$store.state.previousPage.length-1, vm.$store.state.previousPage.length);
        let routePath = `/request/${pageNum}`;
        util.logDebugMsg("onRoomSelectConfirm - route to: " + routePath);
        vm.$router.push(routePath);
      }

      vm.$forceUpdate();
         
    },

    onRoomDeselect(){
      util.logDebugMsg('onRoomDeselect activated. selectedRoom unset (set to null).');
      this.$store.state.selectedRoom = null;
      $('#findRoomModal').modal('hide');
      this.$store.state.isModalBeingDisplayed = false;
      $(".card").removeClass("border-success");
    },

    onConfigSelect: function(event){
      if (event){
        if(!($(`#${event.target.id}`).hasClass("border-success"))){
          $(".card").removeClass("border-success");
          $(`#${event.target.id}`).addClass("border-success");
        } else {
          $(".card").removeClass("border-success");
        }

      }
    },

    clearSearchUI() {
      //clear all search UI to be blank
      var inputs = $("input");
      inputs.each(function(){
        let inputType = this.type;
        if (inputType == "text" || inputType == "number"){
          this.value = "";
        } else if (inputType == "checkbox"){
          this.checked = false;
        }
      });

      var selects = $('select');
      selects.each(function(){
        if (this.id != null && this.id != "") {
          if (this.id.indexOf("default") > -1) {
            //if there is a default, reselect it
            this.value = this.id.replace("default-", "");
          }
        } else {
          this.value = "";
        }
      });
    },

    togglePopup: function(event){
      if (event){
        var popup = document.getElementById(`popup-${event.target.id}`);
        popup.classList.toggle("show");

        setTimeout(function () {
          if(popup.classList.contains("show")){
              popup.classList.toggle("show");
            }
        }, 10000); //wait 10 seconds
      }
    }


  }
}
</script>

<!-- Style scoped to the html template define in this file only -->
<style scoped>
/*div {
  display: inline-block;
  margin: 20px 20px;
}*/
.containerDiv {
  display: inline-block;
  margin-top: 16px;
}
.border-success{
  border-width: 3px;
}
</style>