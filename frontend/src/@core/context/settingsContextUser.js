// ** React Imports
import { createContext, useState } from 'react'

// ** ThemeConfig Import
import themeConfig from 'src/configs/themeConfig'

const initialSettings = {
  themeColor:'warning',
  mode: themeConfig.mode,
  contentWidth: themeConfig.contentWidth
}

// ** Create Context
export const SettingsContextUser = createContext({
  saveSettings: () => null,
  settings: initialSettings
})

export const SettingsProviderUser = ({ children }) => {
  // ** State
  const [settings, setSettings] = useState({ ...initialSettings })

  const saveSettings = updatedSettings => {
    setSettings(updatedSettings)
  }

  return <SettingsContextUser.Provider value={{ settings, saveSettings }}>{children}</SettingsContextUser.Provider>
}

export const SettingsConsumerUser = SettingsContextUser.Consumer
