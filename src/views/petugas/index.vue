<template>
  <v-app>
    <v-app-bar color="primary" dark app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <!-- <v-toolbar-title>{{ items[selectedItem].text }}</v-toolbar-title> -->
      <v-toolbar-title>{{ selectedItem }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" color="primary" app bottom right dark>
      <v-list>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title v-text="nama"> </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group active-class="text--accent-4">
          <template v-for="(item, i) in items">
            <v-subheader
              v-if="item.header"
              :key="`h-${i}`"
              v-text="item.header"
            ></v-subheader>

            <v-list-item
              v-else-if="!item.children"
              :to="item.href"
              :key="`l-${i}`"
              link
              exact
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-title v-text="item.text"></v-list-item-title>
            </v-list-item>

            <v-list-group
              v-else
              :value="item.active"
              :key="item.text"
              :prepend-icon="item.icon"
              no-action
              color="white"
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item
                v-for="subItem in item.children"
                :to="subItem.href"
                :key="subItem.text"
              >
                <v-list-item-title v-text="subItem.text"></v-list-item-title>

                <v-list-item-icon>
                  <v-icon v-text="subItem.icon"></v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list-group>
          </template>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="px-4 py-4">
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </v-container>
    </v-main>

    <Footer />
  </v-app>
</template>

<script>
import Footer from "@/components/Footer.vue";
import { mapState } from "vuex";

export default {
  components: { Footer },
  data() {
    return {
      drawer: true,
      // selectedItem: 0,
      items: [
        { text: "Dashboard", href: "/petugas", icon: "mdi-view-dashboard" },
        {
          text: "Master Data",
          icon: "mdi-gamepad-circle-outline",
          active: false,
          children: [
            {
              text: "Data Kandidat",
              href: "/petugas/kandidat",
              icon: "mdi-account-tie",
            },
            {
              text: "Data Pemilih",
              href: "/petugas/pemilih",
              icon: "mdi-account-group ",
            },
            {
              text: "Daftar Vote",
              href: "/petugas/daftarvote",
              icon: "mdi-vote ",
            },
          ],
        },

        {
          text: "Kotak Suara",
          href: "/petugas/kotaksuara",
          icon: "mdi-package-variant",
        },
        {
          text: "Hitung Cepat",
          href: "/petugas/hitungcepat",
          icon: "mdi-counter",
        },
        {
          text: "Laporan",
          href: "/petugas/laporan",
          icon: "mdi-chart-box",
        },
        { header: "Setting" },
        {
          text: "Logout",
          href: "/logout",
          icon: "mdi-logout-variant",
        },
      ],
    };
  },
  computed: {
    ...mapState("authModule", ["nama"]),
    selectedItem() {
      let selected = this.items.findIndex(
        (item) => item.href == this.$route.path
      );

      const nested = this.items
        .map((item, index) =>
          item.children
            ? [
                index,
                item.children.findIndex(
                  (child) => child.href == this.$route.path
                ),
              ]
            : item.href == this.$route.path
        )
        .filter(Boolean)[0];

      const res =
        selected >= 0
          ? this.items[selected].text
          : this.items[nested[0]].children[nested[1]].text;

      return res;
    },
  },
  methods: {
    logout() {
      this.$store.commit("authModule/isLogin", false);
      this.$router.push("/");
      localStorage.clear();
    },
  },
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
