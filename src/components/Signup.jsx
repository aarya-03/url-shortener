import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BeatLoader } from 'react-spinners'
import * as Yup from 'yup'

import { signup } from '../db'
import { useFetch } from "../hooks";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from './ui'
import Error from './Error'
import { UrlState } from '../context'

const Signup = () => {
  const [errors, setErrors] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const { data, error, loading, fn:fnSignup } = useFetch(signup, formData)
  const navigate = useNavigate()
  const {fetchUser} = UrlState()
  const [searchParams] = useSearchParams()
  const longURL = searchParams.get('createNew')

  useEffect(() => {
    if(error===null && data) {
      navigate(`/dashboard?${longURL ? `createNew=${longURL}` : ''}`)
      fetchUser()
    }
  }, [loading, error])
  

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSignup = async () => {
    setErrors([])
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid Email").required("Email is required"),
        password: Yup.string().min(6, "Password must be atleast 6 characters").required("Password is required")
      })
      await schema.validate(formData, { abortEarly: false })
      await fnSignup()
    } catch (e) {
      const validationErrors = {}
      e?.inner?.forEach((err) => {
        validationErrors[err.path] = err.message
      })
      setErrors(validationErrors)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New here?</CardTitle>
        <CardDescription>Create your account to get started.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
      {error && <Error message={error.message} />}
      <div className="space-y-1">
          <Input name="name" type="text" placeholder="Name" onChange={handleInputChange} />
          {errors.name && <Error message={errors.name} />}
        </div>
        <div className="space-y-1">
          <Input name="email" type="email" placeholder="Email" onChange={handleInputChange} />
          {errors.email && <Error message={errors.email} />}
        </div>
        <div className="space-y-1">
          <Input name="password" type="password" placeholder="Password" onChange={handleInputChange} />
          {errors.password && <Error message={errors.password} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSignup}>
          {loading ? <BeatLoader size={10} color='#00ffa4' /> : "Create Account"}
        </Button>
      </CardFooter>
    </Card>

  )
}

export default Signup