<template type="text/babel">

  <v-layout column>
    <v-flex xs12>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <template v-for="(line, i) in lines">
            <v-flex xs12>
              <v-card class="dark--text" transition="slide-y-reverse-transition">
                <v-card-title primary-title>
                  <v-flex xs6 class="text-xs-left">
                    <div class="headline">
                      <span>{{ line.key }}</span>
                    </div>
                  </v-flex>
                  <v-flex xs6 class="text-xs-right">
                    <a v-on:click="gotoBuscar(line.key)">
                      <v-icon  >arrow_forward</v-icon>
                    </a>
                  </v-flex>
                </v-card-title>
              </v-card>
            </v-flex>
          </template>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>

</template>

<script>
import Lines from '@/assets/lines.json'

export default {
  name: 'llegadas',
  data () {
    return {
      lines: []
    }
  },
  methods: {
    gotoBuscar: function (line) {
      this.$router.push({name: 'buscar', params: {line}})
    }
  },
  created: function () {
    this.lines = Lines
  },
  components: {}
}
</script>
