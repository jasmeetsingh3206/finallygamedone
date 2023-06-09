import { defineStore } from 'pinia'

export const useMyStore = defineStore('myStore', {
  state: () => ({
    havecode: '5iztui',
    clientcount: 0,
    socketid: '',
    restart: false,
    myName: null,
    opponentName: 'Waiting for opponent...',
    selectedEmoji:null,
    opponentEmoji: null,
    showEmojiPicker:false,
  })
})
