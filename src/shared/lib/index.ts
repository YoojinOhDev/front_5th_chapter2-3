import { useNavigate, useLocation } from "react-router-dom"

export const useURLParams = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const getParam = (key: string, defaultValue: string = "") => {
    return queryParams.get(key) || defaultValue
  }

  const updateURL = (params: Record<string, string>) => {
    const newParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) newParams.set(key, value)
    })
    navigate(`?${newParams.toString()}`)
  }

  return { getParam, updateURL }
}
