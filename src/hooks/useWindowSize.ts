import { useEffect, useState } from 'react'

interface State {
    width: number | null
    height: number | null
}
export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState<State>({
        width: null,
        height: null,
    })

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return windowSize
}
