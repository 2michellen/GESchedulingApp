<template>  
    <div>
        <div class="row">
            <div class="col col-12 col-md-1 col-lg-1"></div>
            <div class="col col-12 col-md-10 col-lg-10" style="color:gray" v-if="supportDoAnother">
                <button @click.prevent="onAddAnother" type="button" class="float-right btn btn-secondary">Add Another</button>
            </div>
            <div class="col col-12 col-md-1 col-lg-1"></div>
        </div>

        <div style="height:10px"></div>

        <div class="row">
            <div class="col col-12 col-md-1 col-lg-1"></div>

            <div id="emailBar" class="col col-12 col-md-4 col-lg-4" style="padding-bottom:10px">
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Recipient Name</span>
                </div>
                <input id="recipientName" type="text" v-bind:value="recipientNameValue" class="form-control send-mail-input" aria-label="recipient-name" aria-describedby="basic-addon1">
            </div>
            <p class="text-danger validation-msg" style="display:none;" id="REQUIRED-MSG-FOR-recipientName">The recipient name is required.</p>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon2">Recipient Email</span>
                </div>
                <input id="recipientEmail" type="text" v-bind:value="recipientEmailValue" class="form-control send-mail-input" aria-label="recipient-email" aria-describedby="basic-addon2">
            </div>
            <p class="text-danger validation-msg" style="display:none;" id="INVALID-MSG-FOR-recipientEmail">Please enter a valid email address.</p>
            <p class="text-danger validation-msg" style="display:none;" id="REQUIRED-MSG-FOR-recipientEmail">A email address is required.</p>
            <button @click.prevent="onGenerateEmail" type="button" class="float-right btn btn-sm btn-primary">Generate Email</button>
            <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>
            </div>

            <div id="adminUI" class="col col-12 col-md-6 col-lg-6">
            <div class="form-group">
                <label for="emailPreview">Email Preview</label>
                <textarea class="form-control" id="emailPreview" rows="14" readonly></textarea>
            </div>
            
            <div v-if="canEmail">
                <button type="button" @click.prevent="onNavOut" class="btn btn-sm btn-primary">{{navOutButtonLabel}}</button>
                <a :href="`mailto:${recipientEmailValue}?subject=${emailSubjectDataExport}&body=${emailStringDataExport}`">
                    <button type="button" class="float-right btn btn-sm btn-primary">Launch Email</button>
                </a>
            </div>
            <div v-else>
                <button type="button" @click.prevent="onNavOut" class="btn btn-sm btn-primary">{{navOutButtonLabel}}</button>
                <button type="button" class="float-right btn btn-sm btn-primary" disabled>Launch Email</button>
            </div>         
            </div>

            <div class="col col-12 col-md-1 col-lg-1"></div>
        </div>
  </div>
</template>

<script>
import axios from 'axios';
import * as util from '@/common/util.js';
import * as apiMgr from '@/common/apiMgr.js';
import * as localCacheMgr from '@/common/localCacheMgr.js';
import * as textTransformer from '@/common/textTransformer.js';
import { validatePrompts } from '@/common/requestMgr.js'

export default {

    props: ['emailSubject', 
            'emailTemplate', 
            'navOutButtonLabel', 
            'navOutRoutePath', 
            'navOutClickedEmitEventName',
            'supportDoAnother',
            'defRecipientName', 
            'defRecipientEmail',
            'needMostRecentUserAccessCode',
            'needMostRecentAdminAccessCode',
            ],

    data () {
        return {
            hasFailure: false,
            failureMessage: null,
            emailStringDataExport: null,
            emailStringDataDisplay: null,
            emailSubjectData: null,
            canEmail: false,

            recipientEmailValue: null,
            recipientNameValue: null
        }
    },

    computed: {
        emailSubjectDataExport() {
            return this.emailSubjectData;
        }
    },

    activated() {
        console.log('SendEmailCommon.vue activated.');
        let vm = this;

        if (this.$store.state.appConfig.siteCode == null) {
            this.$router.push('/login'); // Config data lost, force back to login to refetch data.
            return;
        }

        this.$store.state.currentViewTitle = this.title;
        this.$store.state.enableNavBar = true;
        this.$store.state.hideBackNav  = true;
        
        if (this.needMostRecentUserAccessCode) {
            this.getMostRecentUserAccessCode();
        }
        if (this.needMostRecentAdminAccessCode) {
            this.getMostRecentAdminAccessCode();
        }


        //set email and name values
        if(this.defRecipientEmail != null && this.defRecipientEmail != ""){
            this.recipientEmailValue = this.defRecipientEmail;
        } else {
            this.recipientEmailValue = this.$store.state.currentSendEmailRecipientEmail;
        }    
            
        if(this.defRecipientName != null && this.defRecipientName != ""){
            this.recipientNameValue = this.defRecipientName;
        } else {
            this.recipientNameValue = this.$store.state.currentSendEmailRecipientName;
        }

        document.getElementById("recipientName").disabled = false;
        document.getElementById("recipientEmail").disabled = false; 

        this.onReset();
    },

    created() {
       console.log('SendEmailCommon.vue created.');
       let vm = this;

       util.centralEvent.$on('submittedRequestDisableRecipientInput', () => {
           document.getElementById("recipientName").disabled = true;
           document.getElementById("recipientEmail").disabled = true; 
       });
   },


    methods: {

        onNavOut() {
            this.$store.state.currentRequest = null;
            util.logDebugMsg("onSubmitRequest - set currentRequest to null.");

            if (this.navOutRoutePath != undefined && this.navOutRoutePath != null) {
                this.$store.state.defRecipientNameForSendEmail = null;
                this.$store.state.defRecipientEmailForSendEmail = null;
                if(this.navOutRoutePath.indexOf("home") > -1){
                    if(this.$store.state.inAdminMode){
                        this.$router.push("/admin/home");
                    } else {
                        this.$router.push(this.navOutRoutePath);
                    }
                } else {
                    this.$router.push(this.navOutRoutePath);
                }
                
                return;
            }

            if (this.navOutClickedEmitEventName != undefined && navOutClickedEmitEventName != null) {
                util.centralEvent.$emit(navOutClickedEmitEventName);
                return;
            }
        },       


        getMostRecentUserAccessCode() {

            var vm = this;
            let url = apiMgr.getAccessCodesUrl() + "&findOne=true";

            axios.get(url)
                .then(res => {
                    console.log("getAccessCodesUrl return status: " + res.status);

                    if (res.status == 200 && res.data != null && res.data.length >= 1) {
                        vm.$store.state.mostRecentUserAccessCode = res.data[0].code;
                    } else {
                        vm.hasFailure = true;
                        vm.failureMessage = "No user access code available. Please try later.";                         
                    }
                    
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later. [error code: 8]";                               
                })
        },

        
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
                        vm.failureMessage = "No Admin user access code available. Please try later.";                         
                    }
                    
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later. [error code: 9]";                               
                })
        },

        onGenerateEmail () {
            console.log("onGenerateEmail activated.");
            let vm = this;

            vm.isValid = true;

            vm.recipientNameValue = $("#recipientName").val();
            vm.recipientEmailValue = $("#recipientEmail").val();
            let recipientEmail = vm.recipientEmailValue;
            let recipientName = vm.recipientNameValue;
            
            var prompts = [];
            prompts.push({ isRequired: true, inputType: { ctrlType: "email", ctrlDataId: "recipientEmail" } });
            prompts.push({ isRequired: true, inputType: { ctrlType: "text", ctrlDataId: "recipientName" } });

            var allValid = validatePrompts(prompts);
            
            if(allValid){
                vm.hasFailure = false;

                //Replace meta tags in email body
                vm.emailStringDataExport = vm.emailTemplate;

                let loopCount = 0;
                while(vm.emailStringDataExport.indexOf("[") > -1 && vm.emailStringDataExport.indexOf("]") > -1){
                    loopCount += 1;
                    if (loopCount > 50){
                        break;
                    }

                    vm.emailStringDataExport = vm.emailStringDataExport
                        .replace('[RECIPIENTNAME]', recipientName)
                        .replace('[RECIPIENTEMAIL]', recipientEmail)
                        .replace('[APPLINK]', vm.$store.state.appConfig.appLink)
                        .replace('[ACCESSCODE]', vm.$store.state.mostRecentUserAccessCode)
                        .replace('[APPNAME]', vm.$store.state.appConfig.appName)                  
                        .replace('[ADMINDISTEMAIL]', vm.$store.state.appConfig.notifyAppAdminEmailDistributionList);

                    if(vm.$store.state.inAdminMode){
                        vm.emailStringDataExport = vm.emailStringDataExport
                            .replace('[ADMINACCESSCODE]', vm.$store.state.mostRecentAdminAccessCode)
                            .replace('[ADMINNAME]', vm.$store.state.currentAdminUser.name);
                    } else {
                        vm.emailStringDataExport = vm.emailStringDataExport
                            .replace('[CURRENTUSER]', vm.$store.state.currentUser.name);
                    }

                    if(vm.$store.state.currentRequest != null){
                        let currentRequest = vm.$store.state.currentRequest;

                        vm.emailStringDataExport = vm.emailStringDataExport
                            .replace('[CURRENTUSER]', currentRequest.eventGEContactPersonName)
                            .replace('[EVENTTITLE]', currentRequest.eventTitle)
                            .replace('[EVENTDATE]', `${util.makeEventDateTimeDisplay(currentRequest.eventSchedule.startDateTime, currentRequest.eventSchedule.endDateTime)}`)
                            .replace('[EVENTROOMNAME]', currentRequest.locationOfEvent.name);
                    }
                }

                vm.emailStringDataExport = textTransformer.transformAsMailToBodyText(vm.emailStringDataExport);
                
                //Reformat email body for display in preview
                vm.emailStringDataDisplay = vm.emailStringDataExport.replace(/%0D%0A/g, '\n').replace(/%20/g, ' ').replace(/%26/g, '&');

                $("#emailPreview").val(vm.emailStringDataDisplay);  


                //Replace meta tags in email subject

                vm.emailSubjectData = vm.emailSubject;

                let loopCount2 = 0;
                while(vm.emailSubjectData.indexOf("[") > -1 && vm.emailSubjectData.indexOf("]") > -1){
                    loopCount2 += 1;
                    if (loopCount2 > 50){
                        break;
                    }

                    vm.emailSubjectData = vm.emailSubjectData.replace('[APPNAME]', vm.$store.state.appConfig.appName)

                    if(vm.$store.state.currentRequest != null){
                        let currentRequest = vm.$store.state.currentRequest;

                        vm.emailSubjectData = vm.emailSubjectData
                            .replace('[EVENTTITLE]', currentRequest.eventTitle)
                            .replace('[CURRENTUSER]', currentRequest.eventGEContactPersonName);
                    }
                }

                
                vm.emailSubjectData = textTransformer.transformAsMailToBodyText(vm.emailSubjectData);
                
                vm.canEmail = true;
            }
            
            vm.$forceUpdate();          
        },

        onAddAnother() {
            this.recipientNameValue = null;
            this.recipientEmailValue = null;
            this.onReset();
        },

        onReset() {

            $(".validation-msg").hide();    
            $("#recipientEmail").val(this.recipientEmailValue);
            $("#recipientName").val(this.recipientNameValue);
            $("#emailPreview").val(null);  

            this.emailStringDataExport = null;
            this.emailStringDataDisplay = null;
            this.emailSubjectData = null;
            
            this.$forceUpdate();
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