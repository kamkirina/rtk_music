import { useLoginMutation } from '@/features/auth/api/authApi'

export const Login = () => {
  const [login] = useLoginMutation()

  const loginHandler = () => {
    const redirectUri = import.meta.env.VITE_DOMAIN_ADDRESS + '/oauth/callback'

    const url = `${import.meta.env.VITE_BASE_URL}/auth/oauth-redirect?callbackUrl=${redirectUri}`

    window.open(url, 'redirectPopup', 'width=500, height=600')

    const receiveMessage = async (event: MessageEvent) => {
      if (event.origin !== import.meta.env.VITE_DOMAIN_ADDRESS) return

      const { code } = event.data
      if (!code) return

      window.removeEventListener('message', receiveMessage)
      login({ code, redirectUri, rememberMe: false })
    }

    window.addEventListener('message', receiveMessage)
  }

  return (
    <button type="button" onClick={loginHandler}>
      login
    </button>
  )
}
