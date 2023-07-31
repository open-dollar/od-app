// A custom hook that builds on useLocation to parse query parameters

import React from 'react'
import { useLocation } from 'react-router-dom'

export function useQuery() {
    const { search } = useLocation()

    return React.useMemo(() => new URLSearchParams(search), [search])
}
