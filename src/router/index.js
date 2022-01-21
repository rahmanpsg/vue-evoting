import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

Vue.use(VueRouter);

const isLogin = (to, from, next) => {
  const { login, role } = store.state.userModule;

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
    // console.log(error);
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
  // {
  //   path: "/admin",
  //   beforeEnter: isLogin,
  //   component: () => import("../views/admin/index.vue"),
  //   children: [
  //     {
  //       name: "Admin",
  //       path: "",
  //       meta: { icon: "mdi-view-dashboard" },
  //       component: () => import("../views/admin/dashboard.vue"),
  //     },
  //     {
  //       path: "master/",
  //       name: "Master Data",
  //       meta: { icon: "mdi-gamepad-circle-outline" },

  //       children: [
  //         {
  //           name: "Kandidat",
  //           meta: {
  //             icon: "mdi-account-tie",
  //           },
  //           path: "kandidat/",
  //           // beforeEnter: (to, from, next) => console.log(to, from, next),
  //           component: () => import("../views/admin/kandidat.vue"),
  //         },
  //       ],
  //     },
  //   ],
  // },
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
        component: () => import("../views/admin/kandidat.vue"),
      },
      {
        path: "laporan",
        component: () => import("../views/admin/laporan.vue"),
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
