<script setup>
import { ref, onMounted } from 'vue'
import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig, loginRequest } from './authConfig'
import HelloWorld from './components/HelloWorld.vue'

// 狀態變數
const isAuthenticated = ref(false)
const username = ref('')
const isReady = ref(false)
// 新增：用來追蹤是否正在進行互動 (Login/Logout)
const isLoading = ref(false)
let msalInstance = null

// 初始化 MSAL
onMounted(async () => {
  try {
    msalInstance = await PublicClientApplication.createPublicClientApplication(msalConfig)

    await msalInstance.handleRedirectPromise()
    const activeAccount = msalInstance.getActiveAccount()
    if (activeAccount) {
      handleLoginSuccess(activeAccount)
    } else {
      const accounts = msalInstance.getAllAccounts()
      if (accounts.length > 0) {
        handleLoginSuccess(accounts[0])
      }
    }
  } catch (error) {
    console.error("MSAL 初始化失敗:", error)
  } finally {
    isReady.value = true
  }
})

// 處理登入成功狀態
const handleLoginSuccess = (account) => {
  msalInstance.setActiveAccount(account)
  isAuthenticated.value = true
  username.value = account.name || account.username
  isLoading.value = false
  if (window.location.hash.includes("code=")) {
    window.history.replaceState({}, document.title, window.location.pathname)
  }
}

// 登入功能 (彈跳視窗)
const login = async () => {
  if (!msalInstance || isLoading.value) return
  
  isLoading.value = true // 開始 Loading

  try {
    const response = await msalInstance.loginPopup(loginRequest)
    handleLoginSuccess(response.account)

  } catch (error) {
    console.error("登入失敗:", error)
    isLoading.value = false // 失敗也要關閉 Loading
  }
}

// 登出功能
const logout = async () => {
  if (!msalInstance || isLoading.value) return

  isLoading.value = true

  const currentAccount = msalInstance.getActiveAccount()

  isAuthenticated.value = false
  username.value = ''

  const logoutRequest = {
    account: currentAccount,
    logoutHint: currentAccount?.username,
    postLogoutRedirectUri: window.location.origin,
    mainWindowRedirectUri: window.location.origin
  }

  try {
    await msalInstance.logoutRedirect(logoutRequest)
  } catch (e) {
    console.error(e)
    isLoading.value = false
  } finally {
     isLoading.value = false
  }
}
</script>

<template lang="pug">
  main.wrapper
    // 加入 loading 判斷，避免未初始化時顯示按鈕
    div.loading(v-if="!isReady")
      p 載入中...

    div.login-card(v-else-if="!isAuthenticated")
      h1 歡迎來到 StepByDay
      p 請登入以存取完整內容
      // 加入 disabled 狀態與樣式
      button.btn-primary(@click="login" :disabled="isLoading") 
        span(v-if="isLoading") 處理中...
        span(v-else) 使用 Microsoft 登入

    div.content-area(v-else)
      div.header
        span Hi, {{ username }}
        // 加入 disabled 狀態
        button.btn-logout(@click="logout" :disabled="isLoading") 登出

      HelloWorld
</template>

<style lang="sass" scoped>
.wrapper
  width: 100vw
  height: 100vh
  display: flex
  justify-content: center
  align-items: center
  background-color: #1a1a1a
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif

.login-card
  background: white
  padding: 2rem 3rem
  border-radius: 12px
  box-shadow: 0 4px 12px rgba(0,0,0,0.1)
  text-align: center

  h1
    margin-bottom: 0.5rem
    color: #333

  p
    margin-bottom: 2rem
    color: #666

.content-area
  text-align: center
  width: 100%
  max-width: 800px

  .header
    position: absolute
    top: 20px
    right: 20px
    display: flex
    align-items: center
    gap: 1rem
    // 修改背景為半透明，增加現代感
    background: rgba(255, 255, 255, 0.6)
    // 加入毛玻璃效果
    backdrop-filter: blur(12px)
    -webkit-backdrop-filter: blur(12px)
    padding: 0.6rem 1.2rem
    border-radius: 50px
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05)
    border: 1px solid rgba(255, 255, 255, 0.8)
    font-weight: 600
    color: #1a202c
    z-index: 100

button
  cursor: pointer
  border: none
  font-size: 1rem
  transition: all 0.2s
  &:disabled
    opacity: 0.6
    cursor: not-allowed
    pointer-events: none

.btn-primary
  background-color: #0078d4
  color: white
  padding: 12px 24px
  border-radius: 4px
  font-weight: 600

  &:hover
    background-color: #006cbd

.btn-logout
  background-color: transparent
  border: 1px solid #ffcdd2
  color: #e53e3e
  padding: 6px 16px
  border-radius: 20px
  font-size: 0.9rem
  transition: all 0.2s ease

  &:hover
    background-color: #fff5f5
    border-color: #fc8181
    color: #c53030
    transform: translateY(-1px)

</style>