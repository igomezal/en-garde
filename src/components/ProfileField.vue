<template>
    <li>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon color="primary" v-bind="attrs" v-on="on" large>{{ icon }}</v-icon>
        </template>
        <span>{{ altText }}</span>
      </v-tooltip>
      {{ info }}
      <v-divider></v-divider>
    </li>
</template>

<style scoped>
li {
  margin-bottom: 5px;
}
</style>

<script>
export default {
  name: "ProfileField",
  props: ["icon", "altText", "info"],
};
</script>