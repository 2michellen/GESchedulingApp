<template>  
<div>
<!-- Modal -->
  <div class="modal" id="adminAddModal" tabindex="-1" role="dialog" aria-labelledby="deleteAdminUserModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
          <!-- Modal Content for Delete -->
          <div :hidden="!(currModalForDisplay == 'deleteAdminUser')">
            <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Delete Admin User</h5>
            <button @click.prevent="onDeleteAdminUserDeselect" type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            <div v-if="isAllowedToDeleteAdmin">
                <div class="modal-body">
                    <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                    <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>
                </div>
            </div>
            <div v-else>
                <div class="modal-body">
                    <p class="text-danger" :hidden="!canShowDeleteAdminMessage">Error: {{deleteAdminMessage}}</p>
                    <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>
                </div>
            </div>

            <div :hidden="!isAllowedToDeleteAdmin" class="modal-body">
                <div class="card">
                    <div class="card-body" id="selectedAdminUserUI">

                    </div>
                </div>
            </div>
            
            <div v-if="isAllowedToDeleteAdmin">
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click.prevent="onDeleteAdminUserDeselect">Cancel</button>
                    <button type="button" class="btn btn-primary" @click.prevent="onDeleteAdminUserConfirm">Confirm Delete</button>
                </div>
            </div>
            <div v-else>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click.prevent="onDeleteAdminUserDeselect">Close</button>
                </div>
            </div>
          </div>

        <!-- Modal Content for Admin Add Send Email -->
        <div :hidden="!(currModalForDisplay == 'adminAddSendEmail')">
            <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Send Email Notification</h5>
            <button @click.prevent="onDeleteAdminUserDeselect" type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>
            
            <div class="modal-body">
                <p>{{adminAddEmailAsk}}</p>
                <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>
            </div>
            
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click.prevent="onAdminAddEmailSkip">No</button>
                <button type="button" class="btn btn-primary" @click.prevent="onAdminAddSendEmail">Yes</button>
            </div>
           
        </div>

      </div>
    </div>
  </div>
  <!-- Page Contents -->
    <div class="container-fluid">
        <div class="row">
          <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
          <div class="col col-12 col-sm-10 col-md-8 col-lg-8">
      
            <div class="card" style="width:100%">
              <div class="card-header bg-danger text-light">
                  Invite Admin
                  <button @click.prevent="onResetAdd" type="button" class="float-right btn btn-outline-light">Reset</button>
              </div>
            </div> 

          </div>
          <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
      </div>
      <div class="row">
      <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>

        <div class="col col-12 col-sm-10 col-md-8 col-lg-8 accordion" id="adminAddAccordian">
            <div class="card">
                <div id="collapseAddAdmin" class="collapse show" aria-labelledby="addAdminCollapse" data-parent="#adminAddAccordian">
                    <div class="card-body">
                        <p class="float-right text-success" :hidden="!hasSuccess">&nbsp;&nbsp;{{successMessage}}</p>
                        <div class="form-group">
                            <label for="recipientNameAdminInput">Recipient Name<i class="required-star">*</i></label>
                            <input type="text" class="form-control" id="recipientNameAdminInput" aria-describedby="nameHelp">
                            <small id="nameHelp" class="form-text text-muted">How the name is displayed here is how it will be displayed in the app.</small>
                            <p class="text-danger" style="display:none;" id="REQUIRED-MSG-FOR-recipientNameAdminInput">The recipient name is required.</p>
                        </div>
                        <div class="form-group">
                            <label for="recipientEmailAdminInput">Email address<i class="required-star">*</i></label>
                            <input type="text" class="form-control" id="recipientEmailAdminInput" aria-describedby="recipient-email">
                            <p class="text-danger validation-msg" style="display:none;" id="INVALID-MSG-FOR-recipientEmailAdminInput">Please enter a valid email address.</p>
                            <p class="text-danger validation-msg" style="display:none;" id="REQUIRED-MSG-FOR-recipientEmailAdminInput">A email address is required.</p>
                        </div>
                        <div class="form-group">
                            <label for="recipientPhoneAdminInput">Phone Number</label>
                            <input type="text" class="form-control" id="recipientPhoneAdminInput" aria-describedby="recipient-phone">
                        </div>
                        <button @click.prevent="onAddAdmin" type="button" class="float-right btn btn-primary">Add Admin</button>
                        <div style="height:30px"></div>
                        <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>
                    </div>
                </div>
            </div>
        </div>
      <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
    </div>
    <div style="height:30px"></div>
    <div class="row">
      <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
      <div class="col col-12 col-sm-10 col-md-8 col-lg-8">
  
        <div class="card" style="width:100%">
          <div class="card-header bg-danger text-light">
              Current Admins            
          </div>
        </div> 

        <div v-if="adminUsers != null" id="currentAdminUI">
          <div v-for="(admin, index) in adminUsers" :key="index" class="card">
            <div :class="[admin._id, 'card-body']">
                <div class="float-left">
                    <h6>{{admin.name}}</h6>
                    <span class="font-weight-light">{{admin.email}}</span>
                    <div v-if="admin.phone != undefined">
                        <span class="font-weight-light">{{admin.phone}}</span>
                    </div>
                </div>
                <div class="float-right">
                    <button :id="admin._id" style="padding-top:5px;padding-bottom:5px" class="btn btn-danger btn-sm fas fa-trash-alt float-left" type="button" @click.prevent="onDeleteAdminUserModal"></button>
                </div>
            </div>
          </div>
        </div> 

      </div>
      <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
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
import * as apiMgr from '@/common/apiMgr.js';
import * as localCacheMgr from '@/common/localCacheMgr.js';
import * as textTransformer from '@/common/textTransformer.js';
import * as util from '@/common/util.js';
import { validatePrompts } from '@/common/requestMgr.js'

export default {
    data () {
    return {
        hasFailure: false,
        failureMessage: "",
        hasSuccess: false,
        successMessage: "",

        hasBeenActivated: false,

        previewRequestNum: 3,
        recipientEmail: "",
        recipientName: "",
        recipientPhone: "",
        emailStringDataExport: "",
        emailStringDataDisplay: "",
        canEmail: false,
        adminUsers: [],

        canGenerateEmail: false,

        isAllowedToDeleteAdmin: false,
        selectedAdminUserToDelete: null,
        canShowDeleteAdminMessage: false,
        deleteAdminMessage: "",

        currModalForDisplay: "",

    }
  },

  computed: {
        title() {
            return this.$store.state.appConfig.adminAddViewTitle; 
        },
        viewDescription() {
            return this.$store.state.appConfig.adminAddViewDescription; 
        },
        addAdminEmailSubject() {
            return this.$store.state.appConfig.addAdminEmailSubject;
        },
        adminAddEmailAsk(){
            return this.$store.state.appConfig.adminAddEmailAsk;
        }
    },

    activated() {
        console.log('AdminHome.vue activated.');
        let vm = this;

        if (this.$store.state.appConfig.adminAddViewTitle == null) {
            this.$router.push('/login'); // Config data lost, force back to login to refetch data.
            return;
        }

        this.$store.state.currentViewTitle = this.title;
        this.$store.state.enableNavBar = true;
        
        vm.hasBeenActivated = true;
        vm.recipientName = "";
        vm.recipientEmail = "";

        this.getMostRecentAdminAccessCode();

        vm.currModalForDisplay = "";

        vm.onResetAdd();
        vm.refreshAdminUI();
    },

    methods: {

        getMostRecentAdminAccessCode() {

            var vm = this;
            let url = apiMgr.getAccessCodesUrl() + "&findOne=true&isForAdmin=true";

            axios.get(url)
                .then(res => {
                    console.log("getAccessCodesUrl return status: " + res.status);

                    if (res.status == 200 && res.data != null && res.data.length >= 1) {
                        vm.$store.state.mostRecentAdminAccessCode = res.data[0].code;
                    } else {
                        vm.hasFailure = true;
                        vm.failureMessage = "No user access code available. Please try later.";                         
                    }
                    
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later. [error code: 9]";                               
                })
        },


        refreshAdminUI(){
            let vm = this;

            //get admin users
            let url = apiMgr.getUsersUrl() + "&isAdmin=true";

            axios.get(url)
                .then(res => {
                    console.log("getAdminUsers return status: " + res.status);
                    
                    if(vm.adminUsers != null){
                            while(vm.adminUsers.length > 0) {
                            vm.adminUsers.pop();
                            }
                        }

                    var foundAdminUsers = res.data;

                    $.each(foundAdminUsers, function (index, foundAdminUser) {
                        vm.adminUsers.push(foundAdminUser);
                    });
                    
                    vm.$forceUpdate();
                    
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })
        },


        onAdminAddSendEmail() {
            console.log("onAdminAddSendEmail activate.")
            let vm = this;
            var storeState = this.$store.state;

            $('#adminAddModal').modal('hide');
            this.$store.state.isModalBeingDisplayed = false;
            
            storeState.defRecipientNameForSendEmail = $("#recipientNameAdminInput")[0].value;
            storeState.defRecipientEmailForSendEmail = $("#recipientEmailAdminInput")[0].value;
            
            util.logDebugMsg('AdminAdd - onAdminAddSendEmail');

            this.$router.push('/admin/sendadminaddemail'); 
        },


        onAddAdmin(){
            console.log("onAddAdmin activate.");
            let vm = this;
            
            vm.hasFailure = false;

            var prompts = [];

            prompts.push({ isRequired: true, inputType: { ctrlType: "text", ctrlDataId: "recipientNameAdminInput" } });
            prompts.push({ isRequired: true, inputType: { ctrlType: "email", ctrlDataId: "recipientEmailAdminInput" } });
            prompts.push({ isRequired: false, inputType: { ctrlType: "text", ctrlDataId: "recipientPhoneAdminInput" } });
            
            var allValid = validatePrompts(prompts);
            if (!allValid) {
                return;
            }       

            vm.recipientName = $("#recipientNameAdminInput")[0].value;
            vm.recipientEmail = $("#recipientEmailAdminInput")[0].value;
            vm.recipientPhone = $("#recipientPhoneAdminInput")[0].value;

            if(vm.recipientName != "" && vm.recipientEmail != ""){

                let isExistingStandardUser = false;
                let existingStandardUserId = null;

                var checkIfDupe = new Promise(function(resolve, reject) {
                    //check if it is a duplicate
                    let emailUrl = apiMgr.getUsersUrl().replace("users", "userscount") + `&emailContains=${vm.recipientEmail}`;

                    axios.get(emailUrl)
                        .then(res => {
                                console.log("onAddAdmin: get users return status: " + res.status);
                                
                                if(res.data.count >= 1){

                                    let queryExistingUserUrl = apiMgr.getUsersUrl() + `&emailContains=${vm.recipientEmail}`;

                                    //find matching user
                                    axios.get(queryExistingUserUrl)
                                        .then(res => {
                                            console.log("onFindExistingUser return status: " + res.status);

                                            if(res.data[0].isAdmin){

                                                vm.hasFailure = true;
                                                vm.failureMessage = "Error: A user with this email already exists!";   
                                            } else {
                                                
                                                isExistingStandardUser = true;
                                                existingStandardUserId = res.data[0]._id;
                                                resolve();
                                            }
                                
                                        })
                                        .catch((err) => {
                                            vm.hasFailure = true;
                                            vm.failureMessage = `An error has occured. ${err}`;                               
                                        });

                                } else {
                                    //if the user doesn't already exist
                                    resolve();
                                }

                            })
                            .catch((err) => {
                                vm.hasFailure = true;
                                vm.failureMessage = `An error has occured. ${err}`;                               
                            });
                });

                checkIfDupe.then(function() {
                    
                    if(!isExistingStandardUser){
                        //gather new user
                        let newUser = {
                            email: vm.recipientEmail,
                            name: vm.recipientName,
                            isAdmin: true,
                        };
                        if(vm.recipientPhone != ""){
                            newUser.phone = vm.recipientPhone;
                        }

                        //get url
                        let url = apiMgr.getUsersUrl();
                        
                        //create (post) new user
                        axios.post(url, newUser)
                            .then(res => {
                                console.log("onAddAdmin return status: " + res.status);
                                vm.createAdminSuccess();

                            })
                            .catch((err) => {
                                vm.hasFailure = true;
                                vm.failureMessage = `An error has occured. ${err}`;                               
                            });

                    } else {
                        //gather modified user
                        let modifiedUser = {
                            _id: existingStandardUserId,
                            name: vm.recipientName,
                            email: vm.recipientEmail,
                            isAdmin: true,
                        }

                        if(vm.recipientPhone != ""){
                            newUser.phone = vm.recipientPhone;
                        }

                        //get url
                        let url = apiMgr.getUsersUrl();
                        
                        //update (put) admin user
                        axios.put(url, modifiedUser)
                            .then(res => {
                                console.log("onAddAdmin return status: " + res.status);
                                vm.createAdminSuccess();

                            })
                            .catch((err) => {
                                vm.hasFailure = true;
                                vm.failureMessage = `An error has occured. ${err}`;                               
                            });
                    }
                    
                
                });


            } else {
                vm.hasFailure = true;
                vm.failureMessage = "Required fields cannot be empty."
            }
        },

        createAdminSuccess() {
            let vm = this;

            vm.hasFailure = false;
            vm.hasSuccess = true;

            vm.successMessage = "Success!"

            vm.currModalForDisplay = "adminAddSendEmail";
            $('#adminAddModal').modal('show');
            this.$store.state.isModalBeingDisplayed = true;

            vm.refreshAdminUI();
            vm.$forceUpdate();
        },


        onResetAdd() {

            $(".validation-msg").hide(); 

            $("input").each(function(){
                if(this.id.indexOf("AdminInput") > -1){
                    this.value = "";
                }
            });

            this.hasSuccess = false;
            this.emailStringDataExport = null;
            this.emailStringDataDisplay = null;
            $("#collapseAddAdmin").collapse("show");
            
            this.$forceUpdate();
        },


        onDeleteAdminUserModal: function(event) {
            if(event){
                console.log("onDeleteAdminUserModal activated.");
                let vm = this;
                let numAdmins = 0;
                vm.currModalForDisplay = "deleteAdminUser";

                vm.hasFailure = false;
                vm.isAllowedToDeleteAdmin = false;

                //query for num admins
                let url = apiMgr.getUsersUrl().replace("users", "userscount") + "&isAdmin=true";
                axios.get(url)
                    .then(res => {
                        console.log("getNumAdmins return status: " + res.status);

                        numAdmins = res.data.count;

                        if(numAdmins > 1){

                            vm.isAllowedToDeleteAdmin = true;
                            vm.selectedAdminUserToDelete = event.target.id;

                            //inject card into modal
                            let currCard = document.getElementsByClassName(vm.selectedAdminUserToDelete)[0].innerHTML;
                            currCard = currCard.replace(event.target.outerHTML, ""); //get rid of the button in modal
                            if(document.getElementById("selectedAdminUserUI") != null){
                                document.getElementById("selectedAdminUserUI").innerHTML = currCard;
                            }
                            

                        } else {
                            vm.canShowDeleteAdminMessage = true;
                            vm.deleteAdminMessage = "Cannot delete (only one admin left in database)";         
                        }

                    })
                    .catch((err) => {
                        vm.hasFailure = true;
                        vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                    })

                
                $("#adminAddModal").modal("show");
                this.$store.state.isModalBeingDisplayed = true;
                

            }
        },

        onDeleteAdminUserConfirm() {

            console.log("onDeleteAdminUserConfirm activated.");
            let vm = this;

                let siteCode = apiMgr.getUsersUrl().substring(apiMgr.getUsersUrl().indexOf("?"), apiMgr.getUsersUrl().length)
                let url = apiMgr.getUsersUrl().substring(0, apiMgr.getUsersUrl().indexOf("?")) + `/${vm.selectedAdminUserToDelete}` + siteCode;

                axios.delete(url)
                .then(res => {
                    console.log("onDeleteAdminUser return status: " + res.status);

                    $("#adminAddModal").modal("hide");
                    this.$store.state.isModalBeingDisplayed = false;
                    vm.refreshAdminUI();
                    vm.$forceUpdate();

                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })            

        },

        onDeleteAdminUserDeselect() {

            console.log("onDeleteAdminUserDeselect activated. Selected admin user unset.")
            let vm = this;

            $("#adminAddModal").modal("hide");
            this.$store.state.isModalBeingDisplayed = false;
            vm.selectedAdminUserToDelete = null;

            vm.currModalForDisplay = "";

        },

        onAdminAddEmailSkip() {

            $("#adminAddModal").modal("hide");
            this.$store.state.isModalBeingDisplayed = false;
            this.currModalForDisplay = "";

        }

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pad-bottom {
  padding-bottom:5px
}

</style>