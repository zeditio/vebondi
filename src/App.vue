<style>
html,
body {
  height: 100%;
  margin: 0;
}

#app {
  min-height: 100%;
  font-family: 'Roboto', sans-serif;
}
</style>

<template>
<v-app id="app">
  <v-navigation-drawer fixed clipped app v-model="drawer">
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
              <v-list-group v-else-if="item.children" v-model="item.model" no-action>
                  <v-list-tile slot="item" @click="">
                      <v-list-tile-action>
                          <v-icon>{{ item.model ? item.icon : item['icon-alt'] }}</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>
                          <v-list-tile-title>
                              {{ item.text }}
                          </v-list-tile-title>
                      </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile v-for="(child, i) in item.children" :key="i" @click="">
                      <v-list-tile-action v-if="child.icon">
                          <v-icon>{{ child.icon }}</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-content>
                          <v-list-tile-title>
                              {{ child.text }}
                          </v-list-tile-title>
                      </v-list-tile-content>
                  </v-list-tile>
              </v-list-group>
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
  <v-toolbar color="pink darken-3" dark app clipped-left fixed>
    <v-toolbar-side-icon v-if="$vuetify.breakpoint.width <= 1264" @click="drawer = !drawer"></v-toolbar-side-icon>
    <span class="title">Vebondi</span>
  </v-toolbar>
  <v-content>
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
