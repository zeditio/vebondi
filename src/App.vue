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
                         mobile-break-point="10240">
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              Vebondi
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list class="pt-0">

        <v-list-tile
          v-for="item in items"
          :key="item.title">

          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <a :href="item.link" target="_blank">
              <v-list-tile-title>{{ item.text }}</v-list-tile-title>
            </a>
          </v-list-tile-content>
        </v-list-tile>

      </v-list>
    </v-navigation-drawer>

    <v-toolbar color="primary" dark app clipped-left fixed>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title style="width: 100%; margin: 0 auto;">
        <v-layout row>
          <v-flex xs4 offset-xs4 class="text-xs-center" @click="trackToolbarTitle()">
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
      items: [{
        icon: 'chat_bubble',
        text: 'Enviar Comentario',
        link: 'https://mail.google.com/mail/?view=cm&fs=1&to=joseboretto@gmail.com'
      },
      {
        icon: 'thumb_up_alt',
        text: 'Facebook',
        link: 'https://www.facebook.com/vebondi/'
      },
      {
        icon: 'photo_library',
        text: 'Instagram',
        link: 'https://www.instagram.com/vebondi.cordoba/'
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
