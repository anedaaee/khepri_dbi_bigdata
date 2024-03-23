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
import CardInfluencer from 'src/views/cards/CardInfluencer'
import PropertyTableOrderShow from '../tables/PropertyTableOrderShow'
import { LoadingButton } from '@mui/lab'

import EyeOutline from 'mdi-material-ui/EyeOutline'
import KeyOutline from 'mdi-material-ui/KeyOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const OrderProperty2 = (props) => {
  
  const [addNew,setAddNew] = useState()
  const [property,setProperty] = useState({})
  const [loading,setLoading] = useState(false)
  
  
  const handleAddProperty =async (e) => {
    e.preventDefault()
    try{
        let maxId = 0
        if(props.order.properties.length === 0){
            maxId=1
        }
        for (const property of props.order.properties){
            if (property.id > maxId){
                maxId = property.id
            }
        }
        setProperty({
            id:maxId,
            name:'',
            kind:'',
            value:'',
            unit:'',
            file:'',
            filename:'',
            isVisible:false
        })
        setAddNew(true)
    }catch(err){
      console.log(err);
    }
  }

  const handleCancelAddProperty =async (e) => {
    e.preventDefault()
    try{
        setAddNew(false)
        
    }catch(err){
      console.log(err);
    }
  }
  
  const onChangePropertyOrder = (val,key) => {
    try{
        setProperty({
            ...property,
            [key]:val
        })
    }catch(err){

    }
  }

  return (
      <div>
      {
        loading?
        (<div/>)
        :(
          <form>
            <PropertyTableOrderShow properties={props.order.properties} handleDelete={(e,val) => props.handleDelete(e,val)}/>
            <CardContent sx={{ paddingBottom: 0 }}>
              {
                addNew?
                (
                    <div />
                ):
                (
                    <div style={{width:'100%',display:'flex',justifyContent:'right'}}>
                        <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={(e) => handleAddProperty(e)}>
                            Add
                        </Button>
                    </div>
                )
              }
              <br/>
            </CardContent>
            {
                addNew?
                (
                  <CardContent>

                    <form>
                      <hr/>
                      <h3>New Property</h3>
                      <Grid container spacing={7}>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label='Name*' placeholder='Order Name' value={property.name} defaultValue={property.name} onChange={(e) =>onChangePropertyOrder(e.target.value,'name')}/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel>Kind*</InputLabel>
                            <Select label='Kind' defaultValue={property.kind}  onChange={(e) =>onChangePropertyOrder(e.target.value,'kind')}>
                              <MenuItem value={'file'}>File</MenuItem>
                              <MenuItem value={'number'}>Number</MenuItem>
                              <MenuItem value={'text'}>Text</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        {
                          property.kind?(
                            property.kind === 'file'?
                            (
                              <>
                                <Grid item xs={12} sm={12}>
                                  <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                                    Upload File
                                    <input
                                      hidden
                                      type='file'
                                      onChange={(e) => onChangePropertyOrder(e.target.files[0],'file')}
                                      id='account-settings-upload-image'
                                    />
                                  </ButtonStyled>
                                  <p>{property.file.name}</p>
                                </Grid>
                              </>
                            ):
                            (
                              <>
                                
                                {
                                  property.kind == 'number'?
                                  ( 
                            
                                    <Grid item xs={12} sm={6}>
                                      <TextField type='number' fullWidth label='value' placeholder='value' value={property.value} defaultValue={property.value} onChange={(e) =>onChangePropertyOrder(e.target.value,'value')}/>
                                    </Grid>
                                    
                          
                                  ):
                                  (
                                    <Grid item xs={12} sm={12}>
                                      <TextField fullWidth label='value' placeholder='value' value={property.value} defaultValue={property.value} onChange={(e) =>onChangePropertyOrder(e.target.value,'value')}/>
                                    </Grid>  
                                  )
                                  }
                                  {
                                    property.kind == 'number'?
                                    (
                                      <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label='unit' placeholder='unit' value={property.unit} defaultValue={property.unit} onChange={(e) =>onChangePropertyOrder(e.target.value,'unit')}/>
                                      </Grid>
                                    )
                                    :(<div/>)
                                  }
                              </>
                            )
                          ):
                          (
                            <div/>
                          )
                          
                        }
                        
                        <Grid item xs={12}>
                          <FormControlLabel
                            label='This item will be displayed for user'
                            control={<Checkbox name='form-layouts-alignment-checkbox' defaultChecked={property.isVisible} onChange={(e) => {onChangePropertyOrder(e.target.value=='on'?true:false,'isVisible')}}/>}
                            sx={{ '& .MuiButtonBase-root': { paddingTop: 0, paddingBottom: 0 } }}
                          />
                        </Grid>
                        <hr/><br/>
                        <div style={{width:'100%',display:'flex',justifyContent:'right'}}>
                            <Button variant='contained' sx={{ marginRight: 3.5 }} style={{backgroundColor:'transparent',border:'1px solid #939393',color:'#939393'}} onClick={(e) => handleCancelAddProperty(e)}>
                                Cancel
                            </Button>
                            <LoadingButton variant='contained' sx={{ marginRight: 3.5 }} onClick={(e) => props.handleAddProperty(e,property)} loading={props.loadingButton}>
                                Submit
                            </LoadingButton>
                        </div>
                      </Grid>
                        <br/>
                    </form>
                  </CardContent>
                ):(<div/>)
            }
          </form>
        )
      }
      </div>
  )
}

export default OrderProperty2
