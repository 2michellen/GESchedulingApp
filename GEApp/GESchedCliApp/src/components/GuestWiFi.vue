<template>

  <div class="container-fluid" style="width:100%">
      <div class="row">
        <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">

          <div class="GuestWiFi">
            {{ viewDescription }}
          </div>
          <div style="height:10px; width:100%"></div>
          <!--For each note in noteItems-->
          <div style="padding:10px; width:100%" class="alert alert-info card" v-for="(note, index) in noteItems" :key="index" :hidden="note.type != 'GuestWiFiAccess'">
            <!--if the object is an array,-->
            <template v-if="note.type == 'GuestWiFiAccess'">
              <!--display each item-->
              <span v-html="note.text"></span>
            </template>
          </div>
          <button type="button" class="btn btn-primary btn-sm float-right" 
            @click.prevent="onPrint"><span class="fas fa-print"></span>&nbsp;Print</button>
          <br>
          <br>
          <br>
        </div>
      </div>
    </div>
</template>

<script>
import * as util from '@/common/util.js';

export default {
  data () {
    return {
    }
  },

  computed: {
    title() {
      return this.$store.state.appConfig.guestWifiViewTitle; 
    },
    viewDescription() {
      return this.$store.state.appConfig.guestWifiViewDescription; 
    },
    noteItems() {
            return this.$store.state.notes;
    }
  },

  methods: {
     
    onPrint(evt) {
      util.launchPrint();
    }   
  },

  activated() {
    console.log('GuestWiFi.vue activated.');

    if (this.$store.state.appConfig.guestWifiViewTitle == null) {
      this.$router.push('/login'); // Config data lost, force back to login to refetch data.
      return;
    }

    this.$store.state.currentViewTitle = this.title;
    this.$store.state.enableNavBar = true;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  display: inline-block;
}
.container-fluid{
  flex-direction: column;
  display: flex;
}

</style>
