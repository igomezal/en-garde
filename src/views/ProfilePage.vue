<template>
  <v-container>
    <v-row v-if="user">
      <v-col cols="12">
        <ul>
          <ProfileField icon="mdi-account" altText="Name" :info="user.displayName" />
          <ProfileField icon="mdi-email" altText="Email" :info="user.email" />
        </ul>
        <v-form>
          <v-text-field
            :rules="[rules.required, rules.validNumber]"
            id="telephone"
            type="tel"
            v-model="telephone"
            label="Telephone"
            placeholder="Enter your telephone number"
            outlined
            dense
          ></v-text-field>
          <div class="d-flex justify-end">
            <v-btn class="mr-4" outlined @click="cancel">Cancel</v-btn>
            <v-btn :class="{ 'black--text': dark }" color="primary" @click="submit">Submit</v-btn>
          </div>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<style src="intl-tel-input/build/css/intlTelInput.min.css">
</style>

<style scoped>
  .v-application ul {
    padding-left: 0;
    list-style-type: none;
    margin-bottom: 20px;
  }
</style>

<script>
import intlTelInput from "intl-tel-input/build/js/intlTelInput.js";
import utilsScript from "intl-tel-input/build/js/utils.js";
import { mapState } from 'vuex';
import ProfileField from "@/components/ProfileField.vue";

let telephoneInput = undefined;

export default {
  name: "ProfilePage",
  data: () => ({
    telephoneInput: undefined,
    rules: {
      required: (value) => !!value || "Required.",
      validNumber: () =>
        (telephoneInput && telephoneInput.isValidNumber()) ||
        "Provide a valid telephone number.",
    },
  }),
  mounted: function () {
    const input = document.querySelector("#telephone");
    if (document.querySelector("#telephone") !== null && !telephoneInput) {
      telephoneInput = intlTelInput(input, {
        utilsScript,
      });
    }
  },
  updated: function () {
    if (!telephoneInput) {
      const input = document.querySelector("#telephone");
      telephoneInput = intlTelInput(input, {
        utilsScript,
      });
      telephoneInput.telInput.value = this.user.telephone;
    }
  },
  destroyed: function () {
    telephoneInput = undefined;
  },
  components: {
    ProfileField,
  },
  computed: {
    telephone: {
      get() {
        const { telephone } = this.$store.getters;
        if (telephoneInput && telephone)
          telephoneInput.setNumber(telephone);
        return telephone;
      },
      set() {},
    },
    dark() {
      return this.$vuetify.theme.dark;
    },
    ...mapState([
      'user',
    ]),
  },
  methods: {
    submit() {
      if (telephoneInput.isValidNumber()) {
        if (this.telephone !== telephoneInput.getNumber())
          this.$store.dispatch(
            "updateTelephoneNumber",
            telephoneInput.getNumber()
          );
        this.$router.push({ name: "Dashboard" });
      }
    },
    cancel() {
      this.$router.push({ name: "Dashboard" });
    },
  },
};
</script>