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

import api from 'src/@core/utils/api'

import Close from 'mdi-material-ui/Close'
import { Windsock } from 'mdi-material-ui'
import { Account , Lock , Note , Cellphone} from 'mdi-material-ui'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))



const UserInfo = (props) => {
  // ** State
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    };
    
  return (
    <CardContent>
      <form>
        <Grid container spacing={.5}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
          </Grid> 
          <Grid item xs={6} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Account/>
              <h3 style={{marginLeft:'10px'}}>Username : <span style={{color:'#939393',fontWeight:'lighter'}}>{props.user.username} {props.user.adminPrivalage?'(set as admin)':''}</span></h3>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Lock/>
              <h3 style={{marginLeft:'10px'}}>Password : <span style={{color:'#939393',fontWeight:'lighter'}}>{props.user.password}</span></h3>
              </Box>
          </Grid>
          <Grid item xs={6} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Note/>
              <h3 style={{marginLeft:'10px'}}>Name : <span style={{color:'#939393',fontWeight:'lighter'}}>{props.user.firstname} {props.user.lastname}</span></h3>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Cellphone/>
              <h3 style={{marginLeft:'10px'}}>Mobile: <span style={{color:'#939393',fontWeight:'lighter'}}>{props.user.mobileNo?props.user.mobileNo:'---'}</span></h3>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6}>
            <h3>Create Date : <span style={{color:'#939393',fontWeight:'lighter'}}>{formatDate(props.user.createdAt)}</span></h3>
          </Grid>
          <Grid item xs={6} sm={6}>
            <h3>ModifiedAt Date : <span style={{color:'#939393',fontWeight:'lighter'}}>{formatDate(props.user.modifiedAt)}</span></h3>
          </Grid>
          <Grid item xs={6} sm={12}>
            <h3>Last Login : <span style={{color:'#939393',fontWeight:'lighter'}}>{props.user.lastlogin?formatDate(props.user.lastlogin):'---'}</span></h3>
          </Grid>
          <div style={{width:'100%',display:'flex',justifyContent:'right'}}>
            <Button variant='contained' style={{backgroundColor:'transparent',border:'1px solid red',color:'red'}} sx={{ marginRight: 3.5 }} onClick={(e) => props.handleDelete(e)}>
                Delete
            </Button>
            <Button variant='contained'  sx={{ marginRight: 3.5 }} onClick={(e) => props.handleEdit(e)}>
                Edit
            </Button>
          </div>
        </Grid>
      </form>
    </CardContent>
  )
}

export default UserInfo
