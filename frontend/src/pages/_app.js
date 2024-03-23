// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'
import { SettingsConsumerUser ,SettingsProviderUser } from 'src/@core/context/settingsContextUser'

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}
const specialPages = ['/pages/user', '/pages/user/orders','/pages/user/inProgress-order','/pages/user/completed-order']; 



const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps ,router} = props

  const isSpecialPage = () => {
    console.log( specialPages.includes(router.pathname));
   
    return specialPages.includes(router.pathname);
  }

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{`${themeConfig.templateName}`}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName}`}
        />
        <meta name='keywords' content='Oilyfan' />
        <meta name='viewport' content='Oilyfan' />
      </Head>
      {
        isSpecialPage()?
        (
            <SettingsProviderUser>
              <SettingsConsumerUser>
                {({ settings }) => {
                  return <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>
                }}
              </SettingsConsumerUser>
            </SettingsProviderUser>
        ):(
            <SettingsProvider>
              <SettingsConsumer>
                {({ settings }) => {
                  return <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>
                }}
              </SettingsConsumer>
            </SettingsProvider>
        )
      }
      
      </CacheProvider>
  )
}

export default App
