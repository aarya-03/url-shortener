import { useNavigate, useParams } from "react-router-dom"
import { UrlState } from "../context"
import { deleteUrl, getClicksForUrl, getUrlDetails } from "../db"
import { BarLoader, BeatLoader } from "react-spinners"
import { useFetch } from "../hooks"
import { useEffect } from "react"
import { Copy, Download, LinkIcon, Trash } from "lucide-react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../components/ui"
import LocationStats from "../components/LocationStats"
import DeviceStats from "../components/DeviceStats"

const Link = () => {
  const handleDownloadImage = () => {
    const imageUrl = url?.qr
    const fileName = url?.title

    // Simulating to download the QR image
    // Create an anchor element 
    const anchor = document.createElement('a')
    anchor.href = imageUrl
    anchor.download = fileName

    // Append anchor to the body 
    document.body.appendChild(anchor)

    // Trigger the download by simulating a click event
    anchor.click()

    // Remove the anchor from the body
    document.body.removeChild(anchor)
  }

  const { id } = useParams()
  const { user } = UrlState()
  const navigate = useNavigate()
  let link = ""

  const { loading, data: url, fn: fnGetOriginalUrl, error } = useFetch(getUrlDetails, { id, user_id: user?.id })
  const { loading: loadingStats, data: stats, fn: fnStats } = useFetch(getClicksForUrl, id)
  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id)

  useEffect(() => {
    fnGetOriginalUrl()
    fnStats()
  }, [])

  if (error) {
    navigate("/dashboard")
  }

  if (url) {
    link = url?.custom_url ? url?.custom_url : url?.short_url
  }

  return (
    <>
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color='#00ffa4' />

      )}
      <div className="flex flex-col gap-8 sm:flex-row justify-between w-full sm:w-5/6 m-auto">
        <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
          <span className="text-3xl font-extrabold hover:underline cursor-pointer text-brand-green">{url?.title}</span>
          <a
            href={`${window.location.origin}/${link}`}
            className="text-xl sm:text-2xl text-blue-400 font-bold hover:undeline cursor-pointer"
            target="_blank"
          >
            {window.location.origin}/{link}
          </a>
          <a
            href={url?.original_url}
            className="flex items-center gap-1 hover:undeline cursor-pointer"
            target="_blank"
          >
            <LinkIcon className="p-1" />
            {url?.original_url}
          </a>
          <span className="flex items-end font-extralight text-sm">
            {new Date(url?.created_at).toLocaleString()}
          </span>

          <div className='flex gap-2'>
            <Button variant='outline'
              onClick={() => navigator.clipboard.writeText(`${origin}${url?.short_url}`)}
            >
              <Copy />
            </Button>
            <Button variant='outline' onClick={handleDownloadImage}>
              <Download />
            </Button>
            <Button variant='outline' onClick={() => fnDelete()}>
              {loadingDelete ? <BeatLoader size={4} color='white' /> : <Trash />}
            </Button>
          </div>

          <img
            src={url?.qr}
            className='w-1/2 self-center sm:self-start p-1 object-contain ring ring-blue-500'
            alt='qr code'
          />
        </div>

        <Card className="sm:w-3/5">
          <CardHeader>
            <CardTitle className="text-xl font-extrabold text-brand-green">URL Stats</CardTitle>
          </CardHeader>
          {stats && stats?.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{stats?.length}</p>
                </CardContent>
              </Card>
              <CardTitle>Location Data</CardTitle>
              <LocationStats stats={stats} />

              <CardTitle>Device Info</CardTitle>
              <DeviceStats stats={stats} />
            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false ? "No statistics available" : "Loading statistics..."}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  )
}

export default Link
