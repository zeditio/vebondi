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
  <div id="page-loader" v-if="showPageLoader"></div>
    <!-- <v-navigation-drawer fixed clipped app touchless temporary v-model="drawer">
    <v-list dense>
      <template v-for="(item, i) in items">
              <v-layout row v-if="item.heading" align-center :key="i">
                  <v-flex xs6>
                      <v-subheader v-if="item.heading">
                          {{ item.heading }}
                      </v-subheader>
                  </v-flex>
                  <v-flex xs6 class="text-xs-center">
                      <a href="#!" class="body-2 black--text">EDIT</a>
                  </v-flex>
              </v-layout>
              <v-list-tile v-else @click="">
                  <v-list-tile-action>
                      <v-icon>{{ item.icon }}</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                      <v-list-tile-title>
                          {{ item.text }}
                      </v-list-tile-title>
                  </v-list-tile-content>
              </v-list-tile>
          </template>
    </v-list>
  </v-navigation-drawer> -->
  <a href="/">
    <v-toolbar color="primary" dark app clipped-left fixed >
      <v-toolbar-title style="width: 100%; margin: 0 auto;">
        <v-layout row >

      <v-flex xs4 offset-xs4 class="text-xs-center">
          <span>Vebondi</span>
      </v-flex>
    </v-layout>


      </v-toolbar-title>
        <!-- <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon> -->
       <!-- <span class="title">Vebondi</span> -->
    </v-toolbar>
    </a>
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
  methods: {},
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
