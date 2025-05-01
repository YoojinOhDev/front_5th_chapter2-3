import { useState, useEffect } from "react"
import { useURLParams } from "@/shared/lib"

interface PaginationAndSortProps {
  onParamsChange: (params: { skip: number; limit: number; sortBy: string; sortOrder: string }) => void
}

export const usePaginationAndSort = ({ onParamsChange }: PaginationAndSortProps) => {
  const { getParam, updateURL } = useURLParams()

  const [skip, setSkip] = useState<number>(parseInt(getParam("skip", "0")))
  const [limit, setLimit] = useState<number>(parseInt(getParam("limit", "10")))
  const [sortBy, setSortBy] = useState<string>(getParam("sortBy"))
  const [sortOrder, setSortOrder] = useState<string>(getParam("sortOrder", "asc"))

  const handleURLUpdate = (additionalParams: Record<string, string> = {}) => {
    updateURL({
      skip: skip.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
      ...additionalParams,
    })
  }

  useEffect(() => {
    onParamsChange({ skip, limit, sortBy, sortOrder })
    handleURLUpdate()
  }, [skip, limit, sortBy, sortOrder])

  return {
    skip,
    setSkip,
    limit,
    setLimit,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    handleURLUpdate,
  }
}
