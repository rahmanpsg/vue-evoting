<template>
  <v-main>
    <v-card-title>
      <v-alert
        :value="error"
        dense
        outlined
        border="left"
        type="error"
        elevation="2"
      >
        <v-row align="center">
          <v-col class="grow"> {{ alert }} </v-col>
          <v-col class="shrink">
            <v-btn v-show="btnErr" @click="startCamera">aktifkan</v-btn>
          </v-col>
        </v-row>
      </v-alert>

      <v-alert
        :value="alertDetection.show"
        :type="alertDetection.type"
        transition="scale-transition"
        dense
        outlined
        border="left"
        elevation="2"
      >
        <span v-html="alertDetection.text"></span>
      </v-alert>
      <v-progress-linear
        :active="progress.active"
        :value="progress.value"
      ></v-progress-linear>

      <!-- <v-row
        v-if="showLoading"
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-col class="subtitle-1 text-center" cols="12">
          {{ loadingText }}
        </v-col>
        <v-col cols="10">
          <v-progress-linear
            color="deep-purple accent-4"
            indeterminate
            rounded
            height="6"
          ></v-progress-linear>
        </v-col>
      </v-row> -->
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row ref="container" align-content="center" justify="center">
          <video
            v-show="cameraReady"
            ref="video"
            id="video"
            autoplay="true"
          ></video>
          <canvas style="display: none" id="preview"></canvas>
          <!-- <img ref="imgStream" :width="videoSize" :height="videoSize" /> -->
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn color="primary" @click="back" block>
        <v-icon left> mdi-arrow-left </v-icon>
        Login dengan username & password
      </v-btn>
    </v-card-actions>
  </v-main>
</template>

<script>
// import { mapState, mapActions } from "vuex";
// import { checkPermission } from "@capacitor/camera";
// import io from "socket.io-client";

export default {
  data() {
    return {
      cameraReady: false,
      error: false,
      btnErr: true,
      alert: "Silahkan aktifkan kamera terlebih dahulu!",
      alertDetection: {
        show: false,
        type: "warning",
        text: "Tidak ada wajah yang terdeteksi",
      },
      totalDetection: 0,
      currentDetection: null,
      // socket: io("http://192.168.43.239:4000/", {
      //   path: "/ws/socket.io/",
      //   transports: ["websocket", "polling"],
      // }),
      socket: new WebSocket("ws://192.168.43.239:4000/ws"),
      response: null,
    };
  },
  async mounted() {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    // this.socket.on("connect", function () {
    //   console.log("connected");
    // });

    this.startCamera();

    this.canvas = document.getElementById("preview");
    this.context = this.canvas.getContext("2d");

    // this.canvas.width = 700;
    // this.canvas.height = 900;

    // this.context.width = this.canvas.width;
    // this.context.height = this.canvas.height;

    // var video = document.getElementById("video");

    // const base64_arraybuffer = async (data) => {
    //   // Use a FileReader to generate a base64 data URI
    //   const base64url = await new Promise((r) => {
    //     const reader = new FileReader();
    //     reader.onload = () => r(reader.result);
    //     reader.readAsDataURL(new Blob([data]));
    //   });

    //   return base64url.split(",", 2)[1];
    // };

    // example use:
  },
  beforeDestroy() {
    if (!this.error) this.stop();
    clearInterval(this.detectionInterval);
  },
  computed: {
    videoSize() {
      // switch (this.$vuetify.breakpoint.name) {
      //   case "xs":
      //     return "450px";
      //   default:
      //     return "450px";
      // }
      return this.canvas.height ?? 0;
    },
    progress() {
      return {
        active: this.alertDetection.type === "info",
        value: (this.totalDetection / 5) * 100,
      };
    },
  },
  methods: {
    settingSize(width, height) {
      this.canvas.width = width;
      this.canvas.height = height;

      this.context.width = this.canvas.width;
      this.context.height = this.canvas.height;
    },
    startCamera() {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: false,
        })
        .then((stream) => {
          try {
            this.$refs.video.srcObject = stream;
          } catch (error) {
            this.$refs.video.src = URL.createObjectURL(stream);
          }

          console.log(stream.getVideoTracks()[0].getSettings());

          const { width, height } = stream.getVideoTracks()[0].getSettings();

          this.settingSize(width, height);

          this.cameraReady = true;

          console.log("Camera connected");

          // this.socket.on("stream", this.stream);
          this.socket.onmessage = this.stream;

          this.stop = () => {
            stream.getVideoTracks().forEach((track) => {
              track.stop();
            });
          };

          this.detectionInterval = setInterval(() => {
            this.draw(this.$refs.video, this.context);
          }, 500);
        })
        .catch((err) => {
          this.error = true;
          this.alert =
            "Kamera telah di blok, silahkan aktifkan kamera secara manual!";
          this.btnErr = false;
          console.log(err);
        });
    },
    draw(video, context) {
      context.drawImage(video, 0, 0, context.width, context.height);
      // this.socket.emit("stream", this.canvas.toDataURL("image/jpeg"));
      this.socket.send(this.canvas.toDataURL());
    },
    async stream(message) {
      console.log(message);
      const { data } = message;

      const res = JSON.parse(data);

      this.alertDetection.show = true;
      if (res.detect == null) {
        this.alertDetection.type = "error";
        this.alertDetection.text = "Tidak ada wajah yang terdeteksi";
        this.totalDetection = 0;
      } else if (res.detect == false) {
        this.alertDetection.type = "warning";
        this.alertDetection.text = "Wajah tidak terdaftar";
        this.totalDetection = 0;
      } else {
        // Jika mendeteksi wajah yang sama sebanyak 5x
        if (this.currentDetection == res.detect) {
          this.totalDetection++;
        } else {
          this.totalDetection = 0;
        }

        this.currentDetection = res.detect;

        this.alertDetection.type = "info";
        this.alertDetection.text = "Sedang mengenali wajah...";

        if (this.totalDetection < 5) return;

        clearInterval(this.detectionInterval);

        this.alertDetection.type = "success";
        this.alertDetection.text = `Anda berhasil login sebagai ${res.nama}`;
      }
      // const bytes = new Uint8Array(image);
      // const base64 = await base64_arraybuffer(bytes);

      // self.$refs.imgStream.src = "data:image/png;base64," + atob(base64);
    },
    back() {
      this.$emit("setShow", true);
    },
  },
};
</script>

<style lang="scss" scoped>
video {
  width: 100%;
  min-width: 300px;
  background-color: rgb(131, 128, 128);
}
</style>
