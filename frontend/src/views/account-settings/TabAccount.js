// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import { LoadingButton } from '@mui/lab'
import api from 'src/@core/utils/api'


import Close from 'mdi-material-ui/Close'
import { Windsock } from 'mdi-material-ui'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))



const TabAccount = () => {
  // ** State
  const [error, setError] = useState('')
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const [password,setPassword] = useState('')
  const [buttonLoading,setButtonLoadin] = useState(false)
  
  const [user,setUser] = useState({
    username:'',
    firstname:'',
    lastname:'',
    mobile:'',
    role:'admin',
  })
  
  const onChange = (val,key) => {
    try{
      setUser({
        ...user,
        [key]:val
      })
    }catch(err){

    }
  }
  
  const closeErr = (e)=>{
    e.preventDefault()
    try{
      setError('')
    }catch(err){

    }
  }
  
  const closePassword = (e)=>{
    e.preventDefault()
    try{
      setPassword('')
      window.location.href = '/pages/admin'
    }catch(err){

    }
  }
  
  const submit = async(e) => {
    setButtonLoadin(true)
    e.preventDefault()
    try{
      if(user.username&&user.firstname&&user.lastname&&user.mobile&&user.role){
        
        const result =await api('post',`/User/NewUser?token=${localStorage.getItem('authToken-oilyfan')}&username=${user.username}&firstname=${user.firstname}&lastname=${user.lastname}&mobile=${user.mobile}&is_admin=${user.role==='admin'?1:0}`,{})
        
        if(result){
          if(result.status == 2){
            setPassword(`Password: ${result.data.user.password}`)
          }else if(result.status == 0){
            setError('Duplicated User')
          }
        }
      }else{
        setError('Fill all paramete')
      }
      setButtonLoadin(false)
    }catch(err){
      console.log(err);
    }
  }
  
  const reset = (e) => {
    e.preventDefault()
    try{
      setUser({
        username:'',
        firstname:'',
        lastname:'',
        mobile:'',
        role:'admin',
      })
    }catch(err){
    }
  }
  
  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ImgStyled src={imgSrc} alt='Profile Pic' />
            </Box>
          </Grid> 
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Username' placeholder='username' defaultValue={user.username} onChange={(e) => onChange(e.target.value,'username')}/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type='number' label='Mobile' placeholder='+98 xxx xxx xxxx' defaultValue={user.mobile}  onChange={(e) => onChange(e.target.value,'mobile')}/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Firstname' placeholder='firstname' defaultValue={user.firstname}  onChange={(e) => onChange(e.target.value,'firstname')}/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='Lastname' placeholder='lastname' defaultValue={user.lastname}  onChange={(e) => onChange(e.target.value,'lastname')}/>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select label='Role' defaultValue={user.role}  onChange={(e) => onChange(e.target.value,'role')}>
                <MenuItem value='admin'>Admin</MenuItem>
                <MenuItem value='user'>User</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {error ? (
            <Grid item xs={12} sx={{ mb: 3 }}>
              <Alert
                severity='warning'
                sx={{ '& a': { fontWeight: 400 } }}
                action={
                  <IconButton size='small' color='inherit' aria-label='close' onClick={(e) =>closeErr(e)}>
                    <Close fontSize='inherit' />
                  </IconButton>
                }
              >
                <AlertTitle>{error}</AlertTitle>
                <Link href='/' onClick={e => e.preventDefault()}>
                  Reset values
                </Link>
              </Alert>
            </Grid>
          ) : null}
          {password ? (
            <Grid item xs={12} sx={{ mb: 3 }}>
              <Alert
                severity='warning'
                sx={{ '& a': { fontWeight: 400 } }}
                action={
                  <IconButton size='small' color='inherit' aria-label='close'  onClick={(e) =>closePassword(e)}>
                    Continue
                  </IconButton>
                }
              >
                <AlertTitle>{password}</AlertTitle>
                <Link href='/' onClick={e => e.preventDefault()}>
                  
                </Link>
              </Alert>
            </Grid>
          ) : null}
          <Grid item xs={12}>
            <LoadingButton variant='contained' sx={{ marginRight: 3.5 }} onClick={(e) => submit(e)} loading={buttonLoading}>
              Save Changes
            </LoadingButton>
            <Button type='reset' variant='outlined' color='secondary' onClick={(e) => reset(e)}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabAccount
