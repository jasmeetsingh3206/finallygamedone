<!-- client side -->
<template>
  <div class="bg-green-100 h-screen flex flex-col items-center justify-evenly">
    <div class="flex justify-center">
      <span class="font-semibold text-xl mt-2">Room Code : {{ code }}</span>
    </div>

    <div>
      <button
        v-if="checkrestart == true"
        type="button"
        class="restart rounded-3xl"
        @click="restart"
      >
        Play again
      </button>
    </div>
    <div v-if="print == true" class="ola text-xl font-bold">
      <div>{{ countP1 }} - {{ countP2 }}</div>
      <h1>{{ winner }} WINS!!</h1>
    </div>
    <div class="flex justify-center mt-3">
      <span class="bg-blue-100 text-blue-800 text-xl font-medium mr-2 px-2.5 py-0.5 rounded">
        {{ Store.opponentName }}
      </span>

      <div
        @click="Store.showEmojiPicker = !Store.showEmojiPicker"
        class="text-2xl hover:cursor-pointer animate-[bounce.6s_ease-in-out_infinite]"
      >
        {{ Store.opponentEmoji }}
      </div>
    </div>

    <canvas
      v-if="this.Store.havecode == '5iztui'"
      ref="canvas"
      class="rounded bg-gradient-to-r from-teal-200 to-teal-200 m-auto mt-6 mb-4 border-black z-10 cust h-[45dvh] lg:h-[63dvh]"
      height="500"
      width="500"
    ></canvas>
    <canvas
      v-else-if="this.Store.havecode !== '5iztui'"
      ref="canvas"
      class="rounded bg-gradient-to-r from-teal-200 to-teal-200 m-auto mt-6 mb-4 z-10 border-black cust h-[45dvh] lg:h-[63dvh]"
      height="500"
      width="500"
      v-bind:style="canvasrotation"
    >
    </canvas>

    <hollow-dots-spinner
      v-if="Store.clientcount == 1"
      :animation-duration="1000"
      :dot-size="15"
      :dots-num="3"
      color="#3d8ab5"
    />

    <div class="flex mt-1">
      <button
        @click="Store.showEmojiPicker = !Store.showEmojiPicker"
        class="bg-blue-100 text-blue-800 text-xl font-medium mr-2 px-2.5 py-0.5 rounded"
      >
        {{ Store.myName }}
      </button>
      <EmojiPicker
        v-if="Store.showEmojiPicker"
        @select="showEmoji"
        class="fixed lg:right-40 z-50 bottom-10"
        disable-skin-tones="true"
        display-recent="true"
        native="true"
        hide-group-icons="true"
        disabled-groups="['animals_nature', 'objects', 'symbols', 'travel_places']"
      />
      <button
        @click="Store.showEmojiPicker = !Store.showEmojiPicker"
        class="text-2xl hover:cursor-pointer animate-[bounce.6s_ease-in-out_infinite]"
      >
        {{ Store.selectedEmoji }}
      </button>
    </div>

    <div class="flex md:hidden w-full justify-between">
      <i class="fa fa-arrow-left h-14 mb-10 ml-9 text-5xl text-blue-900" @click="buttonLeft"></i>
      <i class="fa fa-arrow-right h-14 mb-10 mr-9 text-5xl text-blue-900" @click="buttonRight"></i>
    </div>
    <img src="../images/logo.png" class="h-20 lg:h-80 m-5 absolute top-0 left-2" />
  </div>
</template>

<script>
// import io from 'socket.io-client';
import socket from '@/SocketConnection.js'
// import gameStarting from '@/components/gameStarting.vue'
import { mapStores } from 'pinia'
import { useMyStore } from '../store/havecode'
// import { PulseLoader } from 'vue-spinner/dist/vue-spinner.min.js'
import { AtomSpinner, HollowDotsSpinner } from 'epic-spinners'
import EmojiPicker from 'vue3-emoji-picker'
// stylesheet
import '../../node_modules/vue3-emoji-picker/dist/style.css'

export default {
  name: 'helloWorld',
  components: {
    HollowDotsSpinner,
    EmojiPicker: EmojiPicker
  },
  watch: {
    'Store.clientcount'(newVal) {
      if (newVal === 2 && this.audio.paused) this.audio.play()
    }
  },

  data() {
    return {
      Store: useMyStore(),
      widthtemp_1: 500,
      heighttemp_1: 500,
      x_1: 250,
      dx_1: 4,
      y_1: 440,
      dy_1: 4,
      radius_1: 10,
      greyX_1: 210,
      greyY_1: 450,
      secondgreyX_1: 210,
      secondgreyY_1: 50,
      check_1: true,
      check1_1: false,
      socket: null,
      room: '',
      code: '...',
      socketid: '',
      gameover: '',
      countP1: 0,
      countP2: 0,
      paddel1Velocity: 0,
      paddel2Velocity: 0,
      checkrestart: false,
      print: false,
      audio: null,
      bounce_sound: null,
      goalSound: null
    }
  },
  computed: {
    ...mapStores(useMyStore),

    canvasrotation() {
      return {
        transform: 'rotate(180deg)'
      }
    }
  },

  mounted() {
    const canvas = this.$refs.canvas

    if (canvas.getContext != null) {
      const context_1 = canvas.getContext('2d')
      // to create rectangle
      context_1.beginPath()
      context_1.arc(250, 500, 95, 0, 2 * Math.PI)
      context_1.strokeStyle = 'black'
      context_1.stroke()

      context_1.beginPath()
      context_1.arc(250, 0, 95, 0, 2 * Math.PI)
      context_1.strokeStyle = 'black'
      context_1.stroke()

      context_1.beginPath()
      context_1.moveTo(0, 250)
      context_1.lineTo(500, 250)
      context_1.stroke()

      context_1.beginPath()
      context_1.arc(250, 250, 60, 0, 2 * Math.PI)
      context_1.strokeStyle = 'black'
      context_1.stroke()

      context_1.beginPath()
      context_1.fillStyle = '#32756c'
      context_1.fillRect(185, 490, 130, 10)
      context_1.strokeStyle = 'red'
      context_1.stroke()

      context_1.fillStyle = '#32756c'
      context_1.fillRect(185, 0, 130, 10)
      context_1.strokeStyle = 'red'
      context_1.stroke()

      context_1.beginPath()
      context_1.fillStyle = 'black'
      context_1.fillRect(this.greyX_1, this.greyY_1, 80, 5)
      context_1.stroke()

      context_1.beginPath()
      context_1.fillStyle = 'black'
      context_1.fillRect(this.secondgreyX_1, this.secondgreyY_1, 80, 5)
      context_1.stroke()

      context_1.beginPath()
      context_1.arc(250, 250, this.radius_1, 0, 2 * Math.PI)
      context_1.fillStyle = '#fe4f32'
      context_1.fill()

      this.audio = new Audio(
        'https://docs.google.com/uc?export=download&id=17diq43t5Rc8Z9ppvQG5d6PRFx9-KxemO'
      )
      this.audio.volume = 0.4
      this.bounce_sound = new Audio(
        'https://docs.google.com/uc?export=download&id=1ULvJnA8QyCnyRfcDLla7TFdVo2Kufymc'
      )
      this.goalSound = new Audio(
        'https://docs.google.com/uc?export=download&id=1X2ls1jko9rdX0Ukm6ON7WVpNsfPtXVfB'
      )
      this.connectToSocket()
      document.addEventListener('keydown', (event) => {
        if (event.code === 'ArrowLeft') {
          this.socket.emit('movePaddle', {
            direction: 'left',
            value: this.greyX_1,
            secondvalue: this.secondgreyX_1,
            socketID: this.socketid,
            key: this.code
          })
        } else if (event.code === 'ArrowRight') {
          this.socket.emit('movePaddle', {
            direction: 'right',
            value: this.greyX_1,
            secondvalue: this.secondgreyX_1,
            socketID: this.socketid,
            key: this.code
          })
        }
      })
    }
  },
  methods: {
    showEmoji(e) {
      this.Store.selectedEmoji = e.i
      console.log(e.i)
      console.log(e.i.type)
      this.Store.showEmojiPicker = false
      this.socket.emit('emojy', {
        selectedEmoji: this.Store.selectedEmoji
      })
    },
    restart() {
      this.Store.restart = true
      this.$router.replace('/')
    },
    buttonLeft(e) {
      e.target.style.opacity = '0'
      this.socket.emit('movePaddle', {
        direction: 'left',
        value: this.greyX_1,
        secondvalue: this.secondgreyX_1,
        socketID: this.socketid,
        key: this.code
      })
      // debugger
      setTimeout(() => {
        e.target.style.opacity = '.8'
      }, 100)
    },
    buttonRight(e) {
      e.target.style.opacity = '0'
      this.socket.emit('movePaddle', {
        direction: 'right',
        value: this.greyX_1,
        secondvalue: this.secondgreyX_1,
        socketID: this.socketid,
        key: this.code
      })
      setTimeout(() => {
        e.target.style.opacity = '.8'
      }, 80)
    },

    connectToSocket() {
      this.socket = socket

      this.socket.emit('join', {
        roomId: this.room,
        havecode: this.Store.havecode,
        name: this.Store.myName
      })
      let data = {
        x_1: this.x_1,
        y_1: this.y_1,
        radius_1: this.radius_1,
        dx_1: this.dx_1,
        dy_1: this.dy_1,
        goals_1: this.goals_1,
        code: this.code,
        greyX_1: this.greyX_1,
        check1_1: this.check1_1,
        check_1: this.check_1,
        secondgreyX_1: this.secondgreyX_1,
        widthtemp_1: 500,
        heighttemp_1: 500,
        key: this.Store.havecode,
        winner: '',
        countP1: this.countP1,
        countP2: this.countP2,
        paddel1Velocity: this.paddel1Velocity,
        paddel2Velocity: this.paddel1Velocity
      }
      this.socket.emit('life', data)

      this.socket.on('emojies', (data) => {
        console.log(data.SelectedEmoji)
        this.Store.opponentEmoji = data.SelectedEmoji
      })

      this.socket.on('room-created', (data) => {
        this.code = data.roomId
      })
      this.socket.on('info', (data) => {
        this.socketid = data.socketid
      })

      this.socket.on('message', (data) => {
        this.greyX_1 = data.position
        this.secondgreyX_1 = data.secondpostion
      })
      this.socket.on('collision', () => {
        this.bounce_sound.play()
      })
      this.socket.on('goalsound', () => {
        if (this.gameover !== 'over') this.goalSound.play()
      })
      this.socket.on('gameanimated', (data) => {
        this.x_1 = data.x_cordinate_center
        this.y_1 = data.y_cordinate_center
        this.dx_1 = data.xspeed
        this.dy_1 = data.yspeed
        ;(this.radius_1 = data.radius_1),
          (this.goals_1 = data.goals_1),
          (this.gameover = data.gameover),
          (this.check1_1 = data.check1_1),
          (this.check_1 = data.check_1)

        this.canvasupdate()
      })
      this.socket.on('clientcount', (data) => {
        this.Store.clientcount = data.clientcount
      })
      this.socket.on('gameover', (data) => {
        this.gameover = data.gamestatus
        this.winner = data.winner
        this.audio.pause()
        this.goalSound.pause()
        this.bounce_sound.pause()

        this.updatewinnerstatus()
      })
      this.socket.on('scoreUpdate', (data) => {
        this.countP1 = data.countPlayer1
        this.countP2 = data.countPlayer2
      })
      this.socket.on('playernames', (data) => {
        if (this.Store.havecode === '5iztui') this.Store.opponentName = data.player2name
        else this.Store.opponentName = data.player1name
      })
    },

    canvasupdate() {
      const canvas = this.$refs.canvas

      if (canvas.getContext('2d') != null) {
        const context_1 = canvas.getContext('2d')
        context_1.clearRect(0, 0, 500, 500)
        context_1.beginPath()
        context_1.arc(250, 500, 95, 0, 2 * Math.PI)
        context_1.strokeStyle = 'black'
        context_1.stroke()

        context_1.beginPath()
        context_1.arc(250, 0, 95, 0, 2 * Math.PI)
        context_1.strokeStyle = 'black'
        context_1.stroke()

        context_1.beginPath()
        context_1.moveTo(0, 250)
        context_1.lineTo(500, 250)
        context_1.stroke()

        context_1.beginPath()
        context_1.arc(250, 250, 60, 0, 2 * Math.PI)
        context_1.strokeStyle = 'black'
        context_1.stroke()

        context_1.beginPath()
        context_1.fillStyle = '#32756c' //pinkkkk
        context_1.fillRect(185, 490, 130, 10)
        context_1.strokeStyle = '#ffaa47'
        context_1.stroke()

        context_1.fillStyle = '#32756c'
        context_1.fillRect(185, 0, 130, 10)
        context_1.strokeStyle = '#ffaa47'
        context_1.stroke()

        context_1.beginPath()
        context_1.fillStyle = '#ef476f'
        context_1.fillRect(this.greyX_1 + 1, this.greyY_1, 80, 5)
        context_1.stroke()

        context_1.beginPath()
        context_1.fillStyle = '#ef476f'
        context_1.fillRect(this.secondgreyX_1, this.secondgreyY_1, 80, 5)
        context_1.stroke()

        context_1.beginPath()
        context_1.arc(this.x_1, this.y_1, this.radius_1, 0, 2 * Math.PI)
        context_1.fillStyle = '#fe4f32'
        context_1.fill()

        if (this.Store.havecode == '5iztui') {
          context_1.font = 'italic bold 60px cursive'
          context_1.fillStyle = 'green'
          context_1.fillText(this.countP2, 50, 230)

          context_1.font = 'italic bold 60px cursive'
          context_1.fillStyle = 'mint'
          context_1.fillText(this.countP1, 50, 310)
        } else {
          context_1.save()

          context_1.translate(200, 200)
          context_1.rotate(Math.PI)

          context_1.font = 'italic bold 60px cursive'
          context_1.fillStyle = 'skyblue'
          context_1.fillText(this.countP2, -250, 10)

          context_1.font = 'italic bold 60px cursive'
          context_1.fillStyle = 'skyblue'
          context_1.fillText(this.countP1, -245, -80)

          context_1.restore()
        }
      }
    },
    updatewinnerstatus() {
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, 500, 500)
      this.checkrestart = true

      this.print = true
    }
  },
  beforeUnmount() {
    this.socket.close()
  }
}
</script>

<style scoped>
.flipimage {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}
.restart {
  width: 150px;
  height: 40px;
  border: 1px solid rgb(37, 1, 1);

  border-radius: 3cm;
  background-color: rgb(219, 90, 90);
  font-size: medium;
  color: rgb(252, 251, 251);

  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}

.cus {
  margin-left: 400px;
}
.cust {
  border: 4px solid rgba(58, 46, 46, 0.973);
  margin-top: 16px;
}
.customclass {
  height: 100vh;
}
.ola {
  display: flex;
  justify-content: center;
  position: relative;
  top: 23%;
  z-index: 999;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
}
</style>
