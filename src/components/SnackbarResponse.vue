<template>
  <v-snackbar
    v-model="response.show"
    :timeout="2000"
    :color="response.sucess ? 'primary' : 'warning'"
    absolute
    centered
  >
    {{ response.text }}
  </v-snackbar>
</template>

<script>
export default {
  props: {
    response: Object,
  },
};
</script>
