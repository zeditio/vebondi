<style>
html,
body {
  font-family: 'Roboto', sans-serif;
}

#app {
}
.content {
  padding-bottom: 56px;
}

</style>

<template>
<v-app id="app">
  <v-navigation-drawer fixed clipped app touchless v-model="drawer">
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
  </v-navigation-drawer>
  <v-toolbar color="primary" dark app clipped-left fixed>
    <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
    <span class="title">Vebondi</span>
  </v-toolbar>
  <v-content class="content">
    <router-view></router-view>
  </v-content>
  <fab></fab>
  <navbar></navbar>
</v-app>
</template>

<script>
import Fab from '@/components/floating-action-button'
import Navbar from '@/components/navbar'

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
  },
  components: {
    Fab,
    Navbar
  }
}
</script>
