import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { BarLoader } from "react-spinners"

import { useFetch } from "../hooks"
import { getOriginalUrl, storeClicks } from "../db"

const RedirectLink = () => {
    const { id } = useParams()
    const { loading, data, fn: fnGetOriginalUrl } = useFetch(getOriginalUrl, id)
    const { loading: loadingStats, fn: fnStats } = useFetch(storeClicks, {
        id: data?.id,
        originalUrl: data?.original_url,
    })

    useEffect(() => {
        fnGetOriginalUrl()
    }, [])

    useEffect(() => {
        if (!loading && data) {
            fnStats()
        }
    }, [loading])

    if (loading || loadingStats) {
        return (
            <div>
                <BarLoader width={"100%"} color='#00ffa4' />
                <br />
                Redirecting...
            </div>
        )
    }

    return null
}

export default RedirectLink
