<template>
  <v-snackbar
    :timeout="2000"
    :value="response.show"
    absolute
    center
    text
    outlined
    :color="response.type"
  >
    <v-alert :type="response.type" text shaped prominent>
      <strong v-text="response.text"></strong>
    </v-alert>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    response: Object,
  },
};
</script>
