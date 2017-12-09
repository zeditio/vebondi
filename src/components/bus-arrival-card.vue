<style>

.pull-right {
    float: right;
}

</style>

<template type="text/babel">

<v-card class="dark--text" hover>
    <v-card-title>
        <v-flex xs11>
            <div class="headline">Casa al trabajo - C5463</div>
        </v-flex>
        <v-flex xs1>
            <v-icon>refresh</v-icon>
        </v-flex>
    </v-card-title>
    <v-list style="background: inherit">
        <v-list-tile>
            <v-list-tile-action >
                <v-chip color="accent" disabled>71</v-chip>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>Arribando, 10 min, 28 min</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
            <v-list-tile-action>
                <v-chip color="accent" disabled>72</v-chip>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>5 min, 14 min, 20 min</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
            <v-list-tile-action>
                <v-chip color="accent" disabled>75</v-chip>
            </v-list-tile-action>
            <v-list-tile-content>
                <v-list-tile-title>3 min, 7 min, 11 min</v-list-tile-title>
            </v-list-tile-content>
        </v-list-tile>
    </v-list>
</v-card>

</template>

<script>
export default {
  name: 'bus-arrival-card'
}
</script>
