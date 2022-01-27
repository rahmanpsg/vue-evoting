<template>
  <v-app>
    <v-app-bar color="primary" dark app>
      <v-btn v-if="hasChildren" icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title>{{ $route.meta.text }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn v-if="!hasChildren" icon to="/logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="px-4 py-4">
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </v-container>
    </v-main>

    <v-bottom-navigation
      :value="value"
      color="white"
      background-color="primary"
      app
      dark
      grow
    >
      <v-btn
        v-for="(item, i) in items"
        style="background-color: transparent; height: inherit"
        :key="`route-${i}`"
        :to="item.href"
        ref="link"
        exact
      >
        <span v-text="item.text"></span>
        <v-icon v-html="item.icon"></v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      value: "Home",
      drawer: false,
      items: [
        { text: "Home", href: "/pemilih", icon: "mdi-home" },
        {
          text: "Akun",
          href: "/pemilih/akun",
          icon: "mdi-account-cog",
        },
      ],
    };
  },
  computed: {
    hasChildren() {
      return this.$route.fullPath.split("/").length > 2;
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
