import { Link } from "react-router-dom"
import { Button } from "./ui"
import { Copy, Download, Trash } from "lucide-react"
import { useFetch } from "../hooks"
import { deleteUrl } from "../db"
import { BeatLoader } from "react-spinners"

const LinkCard = ({ url, fetchUrls }) => {
  const origin = `${window.location.origin}/`
  const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl, url?.id)

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

  const handleDeleteUrl = () => {
    fnDelete().then(() => fetchUrls())
  }

  return (
    <div className='flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg'>
      <img 
        src={url?.qr}
        className='h-32 object-contain ring ring-blue-500 self-start'
        alt='qr code' 
      />
      <Link to={`/link/${url?.id}`} className='flex flex-col flex-1'>
        <span className='text-3xl font-bold text-brand-green hover:underline cursor-pointer'>
          {url?.title}
        </span>
        <span className='text-blue-400 font-bold hover:underline cursor-pointer'>
          {origin}{url?.custom_url ? url?.custom_url : url.short_url}
        </span>
        <span className='flex items-center gap-1 hover:underline cursor-pointer'>
          {url?.original_url}
        </span>
        <span className='flex items-end font-extralight text-sm flex-1'>
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>

      <div className='flex gap-2'>
        <Button variant='outline'
          onClick={() => navigator.clipboard.writeText(`${origin}${url?.short_url}`)}
        >
          <Copy />
        </Button>
        <Button variant='outline' onClick={handleDownloadImage}>
          <Download />
        </Button>
        <Button variant='outline' onClick={handleDeleteUrl}>
          {loadingDelete ? <BeatLoader size={4} color='white' /> : <Trash />}
        </Button>
      </div>
    </div>
  )
}

export default LinkCard