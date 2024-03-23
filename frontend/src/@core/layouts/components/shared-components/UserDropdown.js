import { useState, Fragment ,useEffect} from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { LogoutVariant } from 'mdi-material-ui'
import Button from '@mui/material/Button'
import api from 'src/@core/utils/api'


import { LoadingButton } from '@mui/lab'


const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = () => {
  

  const [anchorEl, setAnchorEl] = useState(null)
  const [user,setUser] = useState({})
  const [buttonLoading,setButtonLoading] = useState(false)
  

  const router = useRouter()

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }
  
  const handleLogout = async(e)=>{
    setButtonLoading(true)
    try{
      e.preventDefault()
      const result = await api('post',`/Account/Logout?token=${localStorage.getItem('authToken-oilyfan')}`,{}) 
      if(result){
        window.localStorage.clear()
        window.location.href = '/'
      }
    }catch(err){
      console.log(err);
      
    }
    setButtonLoading(true)
  }
  
  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }

  const fetchData = async () => {
    try{
      const result = await api('get',`/User/WhoAmI?token=${localStorage.getItem('authToken-oilyfan')}`,{}) 
      if(result){
        setUser(result.data.user)
        console.log(result);
      }
    }catch(err){
      console.log(err);
    }
  }
  useEffect(() => {
    try{
      fetchData()
    }catch(err){

    }
  } ,[])
  
  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar
          alt='John Doe'
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src='/images/avatars/1.png'
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar alt='John Doe' src='/images/avatars/1.png' sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
            <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{user.firstname} {user.lastname}</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {user.adminPrivilage?'Admin':''}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        
        <MenuItem sx={{ py: 2 }}>
          <LoadingButton loading={buttonLoading} variant='contained' sx={{ marginRight: 3.5 }} onClick={(e) => handleLogout(e)}>
            <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: '#FFF' }} />
            Logout
          </LoadingButton>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
