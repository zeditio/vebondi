<template type="text/babel">

  <v-layout column>
    <v-flex xs12>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <template v-for="(line, i) in lines">
            <v-card class="dark--text" transition="slide-y-reverse-transition">
              <v-card-title primary-title>
                <div class="headline"> {{ line.key }}
                  <v-icon v-on:click="gotoBuscar(line.key)">arrow_forward</v-icon>
                </div>
              </v-card-title>
            </v-card>
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
