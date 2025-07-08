import { Link, useNavigate } from 'react-router-dom'
import { BarLoader } from 'react-spinners'
import { LinkIcon, LogOut } from 'lucide-react'

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui'
import { UrlState } from '../context'
import { useFetch } from '../hooks'
import { logout } from '../db'


const Header = () => {
  const navigate = useNavigate()
  const { user, fetchUser } = UrlState()
  const { loading, fn: fnLogout } = useFetch(logout)
  return (
    <>
      <nav className='py-4 flex justify-between items-center'>
        <Link to='/'>
          <img src='/logo.png' className='h-18' alt='Shortr logo' />
        </Link>
        <div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className='mx-4 w-8 rounded-full overflow-hidden'>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>profile</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to='/dashboard' className='flex'>
                    <LinkIcon className='mr-2 h-4 w-4' />My Links
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className='text-red-400'>
                  <LogOut className='mr-2 h-4 w-4 text-red-400' />
                  <span
                    onClick={() => {
                      fnLogout().then(() => {
                        fetchUser()
                        navigate('/')
                      })
                    }}
                  >
                    Logout
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) :
            (<Button onClick={() => navigate('/auth')}>Login</Button>)
          }
        </div>
      </nav>
      {loading && <BarLoader className='mb-4' width={"100%"} color='#00ffa4' />}
    </>
  )
}

export default Header