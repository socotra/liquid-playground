<template>
  <v-container>
    <v-row>
      <v-col cols="11">
        <v-text-field
          v-model="hostName"
          label="Tenant Hostname"
          :error-messages="authorizationErrorMessage"
          :color="authorized ? 'success' : 'normal'"
          @change="authorize"
        ></v-text-field>
      </v-col>
      <v-col cols="1">
        <v-icon :color="authorized ? 'success' : 'normal'">mdi-circle</v-icon>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-text-field
          v-model="username"
          label="Username"
          :error="!!authorizationErrorMessage"
          :color="authorized ? 'success' : 'normal'"
          @change="authorize"
        ></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="password"
          label="Password"
          :error="!!authorizationErrorMessage"
          :color="authorized ? 'success' : 'normal'"
          @change="authorize"
        ></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="perilId"
          label="Peril ID"
          :error-messages="perilErrorMessage"
          @change="checkLiquid"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="7">
        <editor
          v-model="liquid"
          lang="liquid"
          theme="monokai"
          width="100%"
          height="600"
          @init="editorInit"
          @input="checkLiquid"
        ></editor>
      </v-col>
      <v-col cols="5">
        <v-list>
          <v-subheader>Variables</v-subheader>
          <v-list-item v-for="(v, i) in variables" :key="`var_${i}`">
            <v-list-item-title>{{ v.key }}</v-list-item-title>
            {{ v.value }}
          </v-list-item>
          <v-subheader>Premiums</v-subheader>
          <v-list-item v-if="perilCalculation.premium">
            <v-list-item-title>Premium</v-list-item-title>
            {{ perilCalculation.premium }}
          </v-list-item>
          <v-list-item v-if="perilCalculation.technicalPremium">
            <v-list-item-title>Technical Premium</v-list-item-title>
            {{ perilCalculation.technicalPremium }}
          </v-list-item>
          <v-subheader>Commissions</v-subheader>
          <v-list-item
            v-for="(c, i) in perilCalculation.commissions"
            :key="`comm_${i}`"
          >
            <v-list-item-title>{{ c.recipient }}</v-list-item-title>
            {{ c.amount }}
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-row v-if="liquidErrorMessage">{{ liquidErrorMessage }} </v-row>
  </v-container>
</template>

<script>
import editor from "vue2-ace-editor";

const API_URL = "https://api.sandbox.socotra.com";

// TODO add to readme publicPath config

const initialLiquid = `{% assign base_rate = 21 %}
{% assign technical_premium = base_rate | times: 10 %}

{{ technical_premium | set_year_technical_premium }}
{{ technical_premium | times: 1.2 | set_year_premium }}

{{ 10 | add_commission: "Zenith Insurance Brokers" }}
{{ 25 | add_commission: "Agent Carla" }}
`;

export default {
  name: "HelloWorld",

  components: {
    editor,
  },

  data: () => ({
    hostName: "will-socotra-configeditor.co.sandbox.socotra.com",
    username: "alice.lee",
    password: "socotra",
    token: "",
    authorizationErrorMessage: "",
    perilId: "100000331",
    perilErrorMessage: "",
    liquid: initialLiquid,
    liquidErrorMessage: "",
    variables: "",
    perilCalculation: {},
  }),
  computed: {
    authorized() {
      return !!this.token;
    },
  },
  methods: {
    editorInit() {
      // eslint-disable-next-line global-require
      require("brace/ext/language_tools"); // language extension prerequisite...
      // eslint-disable-next-line global-require
      require("brace/mode/liquid");
      // eslint-disable-next-line global-require
      require("brace/theme/monokai");
      this.checkLiquid();
    },
    async authorize() {
      this.authorizationErrorMessage = ""; // Clear the error state of the input boxes
      this.token = ""; // Clear the existing token
      const authResponse = await fetch(`${API_URL}/account/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hostName: this.hostName,
          username: this.username,
          password: this.password,
        }),
      });
      const json = await authResponse.json();
      const token = json.authorizationToken;

      // Check for authorization failure (bad user or password)
      if (json.httpStatus === "401") {
        this.authorizationErrorMessage =
          json.message ||
          "Unauthorized: Username, Password, and Tenant Hostname don't match.";
      }
      // Check for some other error resulting in no token
      else if (!token) {
        this.authorizationErrorMessage =
          json.message ||
          "Unauthorized: Something went wrong, check the console.";
        // console.log("Error trying to authenticate. Here's the response:");
        // console.log(json);
      }

      // Set the token which is either legit or undefined
      this.token = token;
    },
    async checkLiquid() {
      // Reset error messages
      this.perilErrorMessage = "";
      this.liquidErrorMessage = "";

      await this.authorize(); // Authorize in case token is expired

      const r = await fetch(
        `${API_URL}/calculation/checkExistingPerilPremium`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: this.token,
          },
          body: JSON.stringify({
            calculation: this.liquid,
            perilDisplayId: this.perilId,
          }),
        }
      );
      const json = await r.json();
      if (r.ok) {
        // Success
        this.perilCalculation = json;
        this.variables = json.assignedVariables
          ? Object.keys(json.assignedVariables).map((k) => {
              return { key: k, value: json.assignedVariables[k] };
            })
          : [];
      } else if (r.status === 404) {
        // Bad Peril ID
        this.perilErrorMessage = json.message || "Bad Peril ID";
      } else if ([406, 422].includes(r.status)) {
        // Bad Liquid
        this.liquidErrorMessage = json.message || "Bad Liquid";
      } else {
        // Some other error
        this.liquidErrorMessage = json.message || "Some other error";
      }

      // Usage Tracking
      this.trackEvent("checkLiquid", {
        tenant: this.hostName,
        httpStatus: r.status,
        peril: this.perilId,
      });
    },
  },
};
</script>
