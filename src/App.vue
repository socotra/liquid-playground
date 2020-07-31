<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Socotra Logo"
          class="shrink mr-2"
          contain
          :src="require('./assets/socotra-logo-with-name.png')"
          transition="scale-transition"
          width="150"
        />
      </div>

      <v-spacer />
      Liquid Playground
      <v-spacer />

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            :href="
              'https://github.com/socotra/liquid-playground/releases/tag/' +
              version
            "
            target="_blank"
            text
            v-bind="attrs"
            v-on="on"
            @click="trackEvent('GitHub Release Link Clicked')"
          >
            <span class="mr-2">{{ appVersion }}</span>
            <v-icon>mdi-github</v-icon>
          </v-btn>
        </template>
        <span>Visit this release on Github</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            href="https://github.com/socotra/liquid-playground/issues"
            target="_blank"
            icon
            v-bind="attrs"
            v-on="on"
            @click="trackEvent('Report a Problem Link Clicked')"
          >
            <v-icon>mdi-alert</v-icon>
          </v-btn>
        </template>
        <span>Tell me about a problem</span>
      </v-tooltip>
    </v-app-bar>

    <v-main>
      <HelloWorld />
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",

  components: {
    HelloWorld,
  },

  data: () => ({
    version: "v0.3.1",
  }),
};
</script>
