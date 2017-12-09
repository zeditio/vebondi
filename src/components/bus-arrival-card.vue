

<template type="text/babel">

<v-card color="" class="dark--text">
    <v-card-title primary-title>
        <h3 class="headline mb-0">Casa al trabajo - C5463</h3>
    </v-card-title>
    <v-list dark style="background: inherit">
        <v-list-tile @click="">
            <v-list-tile-action>
                <v-chip color="accent">71</v-chip>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>(650) 555-1234</v-list-tile-title>
                <v-list-tile-sub-title>Mobile</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
                <v-icon>chat</v-icon>
            </v-list-tile-action>
        </v-list-tile>
    </v-list>
    <v-card-actions>
        <v-btn flat color="primary">Share</v-btn>
        <v-btn flat color="primary">Explore</v-btn>
    </v-card-actions>
</v-card>

</template>

<script>
export default {
  name: 'bus-arrival-card'
}
</script>
