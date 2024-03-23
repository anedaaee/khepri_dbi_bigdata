// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Checkbox  from '@mui/material/Checkbox'

import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'


// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import KeyOutline from 'mdi-material-ui/KeyOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'

import OrderTableCollapsibleShowUser from '../tables/OrderTableCollapsibleShowUser'

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const UserOrder = (props) => {
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    };
  

  
  const handleAdd = (e,user) => {
    e.preventDefault()
    try{
      window.location.href = `/pages/admin/add-order?user_id=${user.id}&username=${user.username}`
    }catch(err){
      console.log(err);
    }
  }

  return (
      <div>
          <form>
            
            <CardContent sx={{ paddingBottom: 0 }}>
              
                  
                    <form>
                      <OrderTableCollapsibleShowUser orders={props.orders}/>
                    </form>
                    <br/>
                    <div style={{width:'100%',display:'flex',justifyContent:'right'}}>
                      <Button variant='contained'  sx={{ marginRight: 3.5 }} onClick={(e) => handleAdd(e,props.user)}>
                          Add
                      </Button>
                    </div>
                
            
            </CardContent>
          </form>
      </div>
  )
}

export default UserOrder
