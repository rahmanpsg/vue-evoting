<template>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card color="blue-grey darken-3" dark>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-icon x-large v-html="icon"></v-icon>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text class="white--text">
        <strong v-text="title"></strong>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          plain
          color="accent"
          @click="$emit('closeDialog')"
          :disabled="dialogLoading"
        >
          Batal
        </v-btn>
        <v-btn
          plain
          color="error"
          @click="$emit('hapus')"
          :disabled="dialogLoading"
        >
          <v-progress-circular
            :size="25"
            indeterminate
            color="primary"
            v-if="dialogLoading"
          ></v-progress-circular>
          <div v-else>OK</div>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    dialogLoading: Boolean,
    title: String,
    icon: {
      type: String,
      default: "mdi-alert-circle-outline",
    },
  },
};
</script>
