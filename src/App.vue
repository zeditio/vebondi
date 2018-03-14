<style>

html,
body {
    font-family: 'Roboto', sans-serif;
}

#app {}

.content {
    padding-bottom: 0px;
}


/* This is a compiled file, you should be editing the file in the templates directory */

#page-loader {
    -webkit-pointer-events: none;
    pointer-events: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    background-image: url('./assets/spinner.svg');
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-repeat: no-repeat;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 3000;
    background-position: center;
}

</style>

<template>

<v-app id="app">
    <v-dialog v-model="showPageLoader" persistent>
      <div id="page-loader" v-if="showPageLoader"></div>
    </v-dialog>




    <v-toolbar color="primary" dark app clipped-left fixed>
        <v-toolbar-title style="width: 100%; margin: 0 auto;">
            <v-layout row>
                <v-flex xs4 offset-xs4 class="text-xs-center"  @click="trackToolbarTitle()">
                    <router-link to="/">
                        <h2 class="white--text">Vebondi</h2>
                    </router-link>
                </v-flex>
            </v-layout>
        </v-toolbar-title>
    </v-toolbar>

    <v-content class="content">
        <router-view></router-view>
    </v-content>
    <fab></fab>
    <!-- <navbar></navbar> -->
</v-app>

</template>

<script>
import Fab from '@/components/floating-action-button'

export default {
  data: () => ({
    dialog: false,
    drawer: false,
    items: [{
      icon: 'settings',
      text: 'Settings'
    }, {
      icon: 'chat_bubble',
      text: 'Send feedback'
    }, {
      icon: 'help',
      text: 'Help'
    }]
  }),
  props: {
    source: String
  },
  methods: {
    trackToolbarTitle: function () {
      this.$ga.event({
        eventCategory: 'navitagion',
        eventAction: 'toolbar_title'
      })
    }
  },
  components: {
    Fab
  },
  computed: {
    showPageLoader () {
      return this.$store.state.showPageLoader
    }

  }
}
</script>
