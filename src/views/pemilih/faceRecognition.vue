<template>
  <v-container>
    <v-card elevation="1" class="mx-auto mb-12" width="100%" max-width="700">
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
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    const id = this.$store.state.authModule.id;
    const BASE_URL = axios.defaults.baseURL
      .replace("http", "ws")
      .replace("https", "wss");
    return {
      cameraReady: false,
      error: false,
      btnErr: false,
      alert: "Silahkan aktifkan kamera terlebih dahulu!",
      alertDetection: {
        show: false,
        type: "warning",
        text: "Tidak ada wajah yang terdeteksi",
      },
      progressDetection: 0,
      response: null,
      socket: new WebSocket(`${BASE_URL}regisFace/${id}`),
    };
  },
  async mounted() {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    this.startCamera();

    this.canvas = document.getElementById("preview");
    this.context = this.canvas.getContext("2d");
  },
  beforeDestroy() {
    if (!this.error) this.stop();
    clearInterval(this.detectionInterval);
    this.socket.close();
  },
  computed: {
    progress() {
      return {
        active: this.alertDetection.type === "info",
        value: this.progressDetection,
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
          this.btnErr = true;
          console.log(err);
        });
    },
    draw(video, context) {
      context.drawImage(video, 0, 0, context.width, context.height);
      this.socket.send(this.canvas.toDataURL());
    },
    async stream(message) {
      console.log(message);
      const { data } = message;

      const res = JSON.parse(data);

      this.alertDetection.show = true;
      this.alertDetection.text = res.message;
      this.alertDetection.type = res.detect == null ? "error" : "warning";

      if (res.detect == true) {
        this.progressDetection = res.progress;
        this.alertDetection.type = "info";

        if (this.progressDetection < 100) return;

        clearInterval(this.detectionInterval);

        // this.socket.close();

        this.setFaceRecognition();

        this.alertDetection.type = "success";
        this.alertDetection.text = "Data wajah berhasil didaftar";
      }
    },
    setFaceRecognition() {
      const data = this.$store.state.pemilihModule.data;

      this.$store.commit(
        "pemilihModule/setData",
        Object.assign(data, { face_recognition: true })
      );

      setTimeout(() => {
        this.$router.go(-1);
      }, 2000);
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
