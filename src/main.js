import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

// Use Segment (usage tracking) via this Mixin which will give all Vue components access to the method below.
// in template, use: "trackEvent()"
// in Component use: this.trackEvent()
Vue.mixin({
  data: () => ({
    /**
     * appVersion presents the version number of the app, e.g. 0.3.1
     */
    appVersion: process.env.PACKAGE_VERSION,
  }),

  methods: {
    /**
     * Send the namedEvent to usage tracking
     *
     * @param {string} eventName The name that will identify this event in the usage tracking system
     * @param {object=} properties Optional keys and values to send with the tracked event name
     */
    trackEvent(eventName, properties) {
      const props = properties || {}; // Default to empty Object
      window.analytics.track(eventName, props);
    },
  },
});

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
