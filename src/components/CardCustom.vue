<template>
  <v-card class="cardRadius">
    <v-row v-if="loading" class="no-gutters">
      <div class="col-auto">
        <div class="fill-height d-flex pa-5" :class="color">
          <v-skeleton-loader type="avatar"></v-skeleton-loader>
        </div>
      </div>
      <div class="col pa-3 py-4" :class="`${color}--text`">
        <v-skeleton-loader type="list-item-two-line"></v-skeleton-loader>
      </div>
    </v-row>
    <v-row v-else class="no-gutters">
      <div class="col-auto">
        <div class="fill-height d-flex pa-5" :class="color">
          <v-icon size="35" color="white" v-text="icon"> </v-icon>
        </div>
      </div>
      <div class="col pa-3 py-4" :class="`${color}--text`">
        <h5 class="text-truncate text-uppercase" v-text="title"></h5>
        <h1 v-text="total"></h1>
      </div>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    loading: Boolean,
    color: String,
    icon: String,
    title: String,
    total: Number,
  },
  inject: {
    theme: {
      default: { isDark: false },
    },
  },
};
</script>
