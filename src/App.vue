<style>

  html,
  body {
    font-family: 'Roboto', sans-serif;
  }

  #app {
  }

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

  <v-app id="app" toolbar--fixed toolbar>
    <v-dialog v-model="showPageLoader" persistent>
      <div id="page-loader" v-if="showPageLoader"></div>
    </v-dialog>


    <v-navigation-drawer temporary
                         v-model="drawer"
                         enable-resize-watcher
                         disable-route-watcher
                         absolute
                         mini-variant
                         mobile-break-point="10240">
      <v-toolbar flat>
        <v-list>
          <v-list-tile class="title">
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list class="pt-0">

        <v-list-tile
          v-for="item in items"
          :key="item.title">

          <v-list-tile-action @click.stop="goTo(item.link)">
            <img :src="item.icon" style="max-height: 24px;"/>
          </v-list-tile-action>
        </v-list-tile>

      </v-list>
    </v-navigation-drawer>

    <v-toolbar color="primary" dark app clipped-left fixed>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title style="width: 100%; margin: 0 auto; margin-left: -36px;">
        <v-layout row>
          <v-flex xs12 class="text-xs-center" @click="trackToolbarTitle()">
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
  </v-app>

</template>

<script>
import Fab from '@/components/floating-action-button'

export default {
  data: function () {
    return {
      dialog: false,
      drawer: false,
      items: [
        {
          icon: '/static/img/icons/facebook.svg',
          link: 'https://www.facebook.com/vebondi/'
        },
        {
          icon: '/static/img/icons/instagram.svg',
          link: 'https://www.instagram.com/ve.bondi/'
        },
        {
          icon: '/static/img/icons/gmail.svg',
          link: 'mailto:joseboretto@gmail.com'
        }
      ]
    }
  },
  props: {
    source: String
  },
  methods: {
    trackToolbarTitle: function () {
      this.$ga.event({
        eventCategory: 'navitagion',
        eventAction: 'toolbar_title'
      })
    },
    goTo (url) {
      var win = window.open(url, '_blank')
      win.focus()
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
