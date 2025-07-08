import { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { BeatLoader } from "react-spinners";
import { QRCode } from 'react-qrcode-logo';
import * as yup from 'yup'

import {
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "./ui"
import Error from "./Error"
import { UrlState } from "../context"
import { useFetch } from "../hooks";
import { createUrl } from "../db";

const CreateLink = () => {
  const { user } = UrlState()
  const navigate = useNavigate()
  let [searchParams, setSearchParams] = useSearchParams()
  const ref = useRef()
  const originalLink = searchParams.get('createNew')

  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    title: '',
    originalUrl: originalLink ? originalLink : '',
    customUrl: '',
  })

  const { loading, error, data, fn: fnCreateUrl } = useFetch(createUrl, { ...formData, user_id: user.id })

  useEffect(()=>{
    if(error===null && data){
      navigate(`/link/${data[0].id}`)
    }
  }, [error, data])

  const schema = yup.object().shape({
    title: yup.string().required('Name is required'),
    originalUrl: yup.string().url('Must be a valid URL').required('Long URL is required'),
    customUrl: yup.string(),
  })

  const handleCreateUrl = async() => {
    setErrors([])
    try{
      await schema.validate(formData, {abortEarly: false})
      const canvas = ref.current.canvasRef.current
      const blob = await new Promise((resolve) => canvas.toBlob(resolve))

      await fnCreateUrl(blob)
    }catch (e) {
      const formErrors = {}
      e?.inner?.forEach((err) => {
        formErrors[err.path] = err.message
      })
      setErrors(formErrors)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleDialogChange = (res) => {
    if (!res)
      setSearchParams({})
  }

  return (
    <Dialog defaultOpen={originalLink} onOpenChange={handleDialogChange}>
      <DialogTrigger>
        <Button className='bg-brand-green'>Create New Link</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='font-bold text-xl'>Create New</DialogTitle>
        </DialogHeader>
        {formData.originalUrl && (
          <QRCode value={formData.originalUrl} size={100} ref={ref} />
        )}
        <Input
          id='title'
          placeholder='📌 Give it a name'
          value={formData.title}
          onChange={handleChange}
        />
        {errors.title && <Error message={errors.title} />}

        <Input
          id='originalUrl'
          placeholder='🔗 Paste the long URL here'
          value={formData.originalUrl}
          onChange={handleChange}
        />
        {errors.originalUrl && <Error message={errors.originalUrl} />}

        <div className='flex items-center gap-2'>
          <Card className='p-2'>shortr.in</Card> /
          <Input
            id='customUrl'
            placeholder='Add custom shortlink (optional)'
            value={formData.customUrl}
            onChange={handleChange}
          />
        </div>
        {error && <Error message={error.message} />}

        <DialogFooter className='sm:justify-start'>
          <Button
            disabled={loading}
            onClick={handleCreateUrl}
            className='bg-brand-green'
          >
            {loading ? <BeatLoader size={10} color='white' /> : '✨ Shorten it!'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateLink