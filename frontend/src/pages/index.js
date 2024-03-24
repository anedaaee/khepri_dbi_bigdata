
import { useState ,useEffect} from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'
import themeConfig from 'src/configs/themeConfig'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import api from 'src/@core/utils/api'
import { LoadingButton } from '@mui/lab'

import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'



// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))


const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const LoginPage = () => {
  const [error,setError] = useState('')
  const [buttonLoading,setButtonLoading] = useState(false)
  const [loading,setLoading] = useState(true)

  const [values, setValues] = useState({
    username : '',
    password: '',
    showPassword: false
  })

  const fetchData = async() => {
    try{
      if(localStorage.getItem('authToken-khepri')){
        window.location.href = '/pages/admin'
      }else{
        setLoading(false)
      }
      
    }catch(err){}
  }

  useEffect(() => {
    try{
      fetchData()
    }catch(err){

    }
  } ,[])


  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }
  
  const handleLogin = async(e) => {
    setButtonLoading(true)
    e.preventDefault()
    try{
      const result = await api('post',`/auth/login`,{_id:values.username,password:values.password})
         
      localStorage.setItem('authToken-khepri',result.token)
      window.location.href = '/pages/admin'
          
    }catch(err){

    }
    setButtonLoading(false)
  }

  return (
    <div>
      {
        loading?
        (
          <div style={{width:'100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
              <img src='/loading.gif' alt='loading' style={{width:'20%'}}/> 
              <h1 style={{color:'#ff5358'}}>Welcome to Khepri...</h1>
              <p style={{color:'#ff5358'}}>Loading...</p>
            </div>
        ):(
          <Box className='content-center' style={{backgroundColor:'#f1f3fa'}}>
            <Card sx={{ zIndex: 1 }}>
              <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
                <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography
                    variant='h6'
                    sx={{
                      ml: 3,
                      lineHeight: 1,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: '1.5rem !important'
                    }}
                  >
                    {themeConfig.templateName}
                  </Typography>
                </Box>
                <Box sx={{ mb: 6 }}>
                  <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                    Welcome to {themeConfig.templateName}! 👋🏻
                  </Typography>
                  <Typography variant='body2'>Please sign-in to your account and start the adventure</Typography>
                </Box>
                <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
                  <TextField autoFocus fullWidth id='email' label='Username' sx={{ marginBottom: 4 }} onChange={handleChange('username')}/>
                  <FormControl fullWidth>
                    <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
                    <OutlinedInput
                      label='Password'
                      value={values.password}
                      id='auth-login-password'
                      onChange={handleChange('password')}
                      type={values.showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            aria-label='toggle password visibility'
                          >
                            {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  <Box
                    sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
                  >
                    
                  </Box>
                  <LoadingButton
                    loading={buttonLoading}
                    fullWidth
                    size='large'
                    variant='contained'
                    sx={{ marginBottom: 7 }}
                    onClick={(e) => handleLogin(e)}
                  >
                    Login
                  </LoadingButton> 
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Typography variant='body2' sx={{ marginRight: 2 }}>
                      Don't have an account?
                    </Typography>
                    <Typography variant='body2'>
                      <Link passHref href='/pages/register'>
                        <LinkStyled>Sign up instead</LinkStyled>
                      </Link>
                    </Typography>
                  </Box>
                  <Typography variant='body2' style={{color:'red'}}>{error}</Typography>
                </form>
              </CardContent>
            </Card>
          </Box>
        )
      }
    </div>
    
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default LoginPage
