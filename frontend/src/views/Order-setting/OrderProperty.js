// ** React Imports
import { useState } from 'react'

import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Checkbox  from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Button from '@mui/material/Button'

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const OrderProperty = (props) => {
  
  const [loading,setLaoding] = useState(false)

  const handleAddPropertyFunction = async() => {
    try{
      let maxId = 0
      if(props.order.properties.length === 0){
        maxId = 1
      }else {
        for(const property of props.order.properties){
          if(property.id > maxId){
            maxId = property.id
          }
        }
        maxId += 1
      }

      props.order.properties.push({
        id:maxId,
        name:'',
        kind:'',
        unit:'',
        value:'',
        file:'',
        filename:'',
        isVisible:false,
      })
      props.changeOrder(props.order)
    }catch(err){

    }
  }

  const handleRemovePropertyFunction = async (id) => {
    try{
      
      let newProperties = []
      for(const property of props.order.properties){
        if(property.id !== id){
          newProperties.push(property)
        }
      }
      props.order.properties = newProperties

      props.changeOrder(props.order)
    }catch(err){
      console.log(err);
    }
  }

  const handleAddProperty = async(e) => {
    e.preventDefault()
    try{
      setLaoding(true)
      await handleAddPropertyFunction()
      setLaoding(false)
    }catch(err){
      console.log(err);
    }
  }

  const handleRemoveProperty = async(e,id) => {
    e.preventDefault()
    
    try{
      setLaoding(true)
      await handleRemovePropertyFunction(id)
      setLaoding(false)
    }catch(err){
      console.log(err);
    }
  }

  return (
      <div>
      {
        loading?
        (<div/>)
        :(
          <form>
            <CardContent sx={{ paddingBottom: 0 }}>
              {
                props.order.properties.map((val)=>{
                 
                  return(
                    
                    <form key={val.id}>
                      <h3>{val.id}'st property</h3>
                      <Grid container spacing={7}>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label='Name*' placeholder='Order Name' value={val.name} defaultValue={val.name} onChange={(e) =>props.onChangePropertyOrder(e.target.value,'name',val.id)}/>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel>Kind*</InputLabel>
                            <Select label='Kind' defaultValue={val.kind}  onChange={(e) =>props.onChangePropertyOrder(e.target.value,'kind',val.id)}>
                              <MenuItem value={'file'}>File</MenuItem>
                              <MenuItem value={'number'}>Number</MenuItem>
                              <MenuItem value={'text'}>Text</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        {
                          val.kind?(
                            val.kind === 'file'?
                            (
                              <>
                                <Grid item xs={12} sm={12}>
                                  <ButtonStyled component='label' variant='contained' htmlFor={`account-settings-upload-image-${val.id}`}>
                                    Upload File
                                    <input key={val.id}
                                      hidden
                                      type='file'
                                      onChange={(e) => props.onChangePropertyOrder(e.target.files[0],'file',val.id)}
                                      id={`account-settings-upload-image-${val.id}`}
                                    />
                                  </ButtonStyled>
                                  <p>{val.file.name?val.file.name:'Enter file'}</p>
                                </Grid>
                              </>
                            ):
                            (
                              <>
                                
                                {
                                  val.kind == 'number'?
                                  ( 
                                    <> 
                                      <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label='unit' placeholder='unit' value={val.unit} defaultValue={val.unit} onChange={(e) =>props.onChangePropertyOrder(e.target.value,'unit',val.id)}/>
                                      </Grid>
                                      <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label='value' placeholder='value' value={val.value} defaultValue={val.value} onChange={(e) =>props.onChangePropertyOrder(e.target.value,'value',val.id)}/>
                                      </Grid>
                                    </>
                                  ):
                                  (
                                    <Grid item xs={12} sm={12}>
                                      <TextField fullWidth label='value' placeholder='value' value={val.value} defaultValue={val.value} onChange={(e) =>props.onChangePropertyOrder(e.target.value,'value',val.id)}/>
                                    </Grid>  
                                  )
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
                            control={<Checkbox name='form-layouts-alignment-checkbox' defaultChecked={val.isVisible} onChange={(e) => {props.onChangePropertyOrder(e.target.value=='on'?true:false,'isVisible',val.id)}}/>}
                            sx={{ '& .MuiButtonBase-root': { paddingTop: 0, paddingBottom: 0 } }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Link style={{cursor:"pointer"}} onClick={(e) => handleRemoveProperty(e,val.id)}>Remove</Link>
                        </Grid>
                        <hr/><br/>
                        
                      </Grid>
                    </form>
                  )
                })
              }
              <div style={{width:'100%',display:'flex',justifyContent:'right'}}>
                <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={(e) => handleAddProperty(e)}>
                    Add
                </Button>
              </div>
            </CardContent>
          </form>
        )
      }
      </div>
  )
}

export default OrderProperty
