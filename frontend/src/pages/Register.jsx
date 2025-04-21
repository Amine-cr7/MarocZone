import React, { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { register, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    password2: ''
  })

  const { fullName, email, phone, password, password2 } = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector(state => state.auth)

  useEffect(() => {
    if (isError && message) {
      toast.error(message)
    }
    if (isSuccess || user) {
      navigate('/')
    }
  }, [user, isError, isSuccess, message, navigate, dispatch])

  useEffect(() => {
    if (isError || isSuccess) {
      dispatch(reset())
    }
  }, [isError, isSuccess, dispatch])

  const onchange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (password !== password2) {
      toast.error("Password Not Match")
    } else {
      const userData = {
        FullName:fullName,
        email,
        phone,
        password
      }
      dispatch(register(userData))
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <section className='heading'>
        <h1>
          <FaUser /> Register
        </h1>
        <p>Please create an account</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              className='form-control'
              id='fullName'
              name='fullName'
              value={fullName}
              placeholder='Enter Your Full Name'
              onChange={onchange}
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              className='form-control'
              id='email'
              name='email'
              value={email}
              placeholder='Enter Your Email'
              onChange={onchange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className='form-control'
              id='phone'
              name='phone'
              value={phone}
              placeholder='Enter Your Phone Number'
              onChange={onchange}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className='form-control'
              id='password'
              name='password'
              value={password}
              placeholder='Enter Your Password'
              onChange={onchange}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className='form-control'
              id='password2'
              name='password2'
              value={password2}
              placeholder='Confirm Your Password'
              onChange={onchange}
            />
          </div>

          <div className="form-group">
            <button className='btn btn-block'>Submit</button>
          </div>
        </form>
      </section>
    </>
  )
}
