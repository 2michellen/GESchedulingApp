<template>  
    <div class="container-fluid">
        <div class="row">
            <div class="col col-12 col-md-1 col-lg-1"></div>
            <div class="col col-12 col-md-10 col-lg-10" style="color:gray">    
                <div class="alert alert-warning">
                    {{viewDescription}}
                </div>
            </div>
            <div class="col col-12 col-md-1 col-lg-1"></div>
        </div>
        <div style="height:8px"></div>

        <send-email-component-ctrl 
            :emailSubject="emailSubject"
            :emailTemplate="emailTemplate"
            :navOutButtonLabel="navOutButtonLabel"
            :navOutRoutePath="navOutRoutePath"
            :supportDoAnother="supportDoAnother"
            :defRecipientName="defRecipientName"
            :defRecipientEmail="defRecipientEmail"
            :needMostRecentUserAccessCode="needMostRecentUserAccessCode"
            :needMostRecentAdminAccessCode="needMostRecentAdminAccessCode">
        </send-email-component-ctrl>

        <div style="height:12px"></div>
        <div class="row">
          <div class="col col-12 col-sm-1 col-md-1 col-lg-1"></div>
          <div class="col col-12 col-auto" style="color:gray">
          <div class="site-name-footer" v-html="$store.state.appConfig.siteName"></div>
          <div class="site-address-footer" v-html="$store.state.appConfig.siteAddress"></div>
          <br>
          </div>
          <div class="col col-12 col-sm-1 col-md-1 col-lg-1"></div>
      </div>
  </div>
</template>
<script>
import sendEmailComponent from '@/components/admin/SendEmailCommon.vue'

export default {
    data () {
        return {
            navOutButtonLabel: "Done",
            navOutRoutePath: "/admin/manageaccounts",
            supportDoAnother: false,
            needMostRecentUserAccessCode: false,
            needMostRecentAdminAccessCode: false
        }
    },

    components: {
        sendEmailComponentCtrl: sendEmailComponent
    },

    
    computed: {
 
        title() {
            return this.$store.state.appConfig.adminAddSendEmailViewTitle; 
        },

        viewDescription() {
            return this.$store.state.appConfig.adminAddSendEmailViewDescription; 
        },
        
        emailSubject() {
            return this.$store.state.appConfig.adminAddEmailSubject; 
        },

        emailTemplate() {
            return this.$store.state.appConfig.adminAddEmailTemplate; 
        },

        defRecipientName() {
            return this.$store.state.defRecipientNameForSendEmail; 
        },
        defRecipientEmail() {
            return this.$store.state.defRecipientEmailForSendEmail; 
        },
    },

    activated() {
        console.log('SendAdminAddEmail.vue activated.');

        this.$store.state.currentViewTitle = this.title;
        this.$store.state.enableNavBar = true;

        
    },
    
}
</script>