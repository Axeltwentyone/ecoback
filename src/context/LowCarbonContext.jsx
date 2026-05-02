// src/context/LowCarbonContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const LowCarbonContext = createContext()

export function LowCarbonProvider({ children }) {
  const [lowCarbonMode, setLowCarbonMode] = useState(() => {
    return localStorage.getItem('lowCarbon') === 'true'
  })

  useEffect(() => {
    localStorage.setItem('lowCarbon', lowCarbonMode)
    document.body.classList.toggle('low-carbon', lowCarbonMode)
  }, [lowCarbonMode])

  return (
    <LowCarbonContext.Provider value={{ lowCarbonMode, setLowCarbonMode }}>
      {children}
    </LowCarbonContext.Provider>
  )
}

export const useLowCarbon = () => useContext(LowCarbonContext)  