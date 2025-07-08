import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BeatLoader } from 'react-spinners'
import * as Yup from 'yup'

import { login } from '../db'
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

const Login = () => {
  const [errors, setErrors] = useState([])
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const { data, error, loading, fn:fnLogin } = useFetch(login, formData)
  const navigate = useNavigate()
  const {fetchUser} = UrlState()
  const [searchParams] = useSearchParams()
  const longURL = searchParams.get('createNew')

  useEffect(() => {
    if(error===null && data) {
      navigate(`/dashboard?${longURL ? `createNew=${longURL}` : ''}`)
      fetchUser()
    }
  }, [data, error])
  

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleLogin = async () => {
    setErrors([])
    try {
      const schema = Yup.object().shape({
        email: Yup.string().email("Invalid Email").required("Email is required"),
        password: Yup.string().min(6, "Password must be atleast 6 characters").required("Password is required")
      })
      await schema.validate(formData, { abortEarly: false })
      await fnLogin()
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
        <CardTitle>Welcome back!</CardTitle>
        <CardDescription>Let's get you signed in.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
      {error && <Error message={error.message} />}
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
        <Button onClick={handleLogin}>
          {loading ? <BeatLoader size={10} color='#00ffa4' /> : "Login"}
        </Button>
      </CardFooter>
    </Card>

  )
}

export default Login