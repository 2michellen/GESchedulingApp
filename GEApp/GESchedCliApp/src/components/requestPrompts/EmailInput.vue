<template>
  <div :id="ctrlContainerId">  
    <label :for="ctrlId">{{ promptLabel }}</label>&nbsp;<i v-if="isRequired" class="required-star">*</i>&nbsp;&nbsp;<span v-if="inAdminMode" class="badge badge-warning" :adminCommentCtrlId="adminCommentCtrlId" @click.prevent="onAddAdminComment"><span class="far fa-comment-dots"></span></span>
    <input type="text" :id="ctrlId" :screenNum="screenNum" class="is-request-data form-control form-control-sm">
    <p :id="dataInvalidMsgId" style="display:none;" class="text-danger">Please enter a valid email address.</p>
    <p :id="dataRequiredMsgId" style="display:none;" class="text-danger">Please enter an email address.</p>
    <textarea :id="adminCommentCtrlId" :screenNum="screenNum" style="display:none; border: 2px solid orange;" placeholder="Add Comment" class="is-admin-comment form-control form-control-sm"></textarea>
  </div>
</template>

<script>
export default {
  props: ['screenNum', 'ctrlId', 'promptLabel', 'dataInvalidMsgId', 'dataRequiredMsgId', 'inAdminMode', 'isRequired'],

  computed: {
    adminCommentCtrlId() {
      return this.ctrlId + "AdminComment";
    },
    ctrlContainerId() {
      return this.ctrlId + "Container";
    }
  },

  methods: {
    onAddAdminComment(evt) {     
      var adminCtrl = $("#" +$(this).attr('adminCommentCtrlId'));
      if (!adminCtrl.is(':visible')) {
          adminCtrl.show();
      } else {
          adminCtrl.hide();
          adminCtrl.val(null);
      }
    }
  }    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>