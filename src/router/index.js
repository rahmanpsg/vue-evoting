import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

Vue.use(VueRouter);

const isLogin = (to, from, next) => {
  const { login, role } = store.state.authModule;

  try {
    if (to.name == "Login") {
      if (login) next(role);
    } else {
      if (!login) next("/");

      if (to.name.toLowerCase() != role) {
        next(role);
      }
    }
  } catch (error) {
    // console.log(error);c
  }

  next();
};

const routes = [
  {
    path: "/",
    name: "Login",
    beforeEnter: isLogin,
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/admin",
    component: () => import("../views/admin/index.vue"),
    beforeEnter: isLogin,
    children: [
      {
        path: "",
        name: "admin",
        component: () => import("../views/admin/dashboard.vue"),
      },
      {
        path: "kandidat/",
        component: () => import("../views/admin/kandidat.vue"),
      },

      {
        path: "pemilih/",
        component: () => import("../views/admin/pemilih.vue"),
      },
      {
        path: "daftarvote/",
        component: () => import("../views/admin/daftarVote.vue"),
      },
      {
        path: "kotaksuara/",
        component: () => import("../views/admin/kotakSuara.vue"),
      },
      {
        path: "hitungcepat/",
        component: () => import("../views/admin/hitungCepat.vue"),
      },
      {
        path: "laporan/",
        component: () => import("../views/admin/laporan.vue"),
      },
      {
        path: "user/",
        component: () => import("../views/admin/user.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
