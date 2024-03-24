// ** React Imports
import { useState, Fragment ,useEffect} from 'react'

import { API_KEY } from "../../../src/config";
import api from 'src/@core/utils/api'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import Collapse from '@mui/material/Collapse'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TableContainer from '@mui/material/TableContainer'
import Chip from '@mui/material/Chip'
import { CheckCircleOutline} from 'mdi-material-ui'

import Link from '@mui/material/Link'

// ** Icons Imports
import ChevronUp from 'mdi-material-ui/ChevronUp'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import { Button, TextField } from '@mui/material';


const Row = props => {
  // ** Props
  const { row} = props

  // ** State
  const [open, setOpen] = useState(false)
  const [numberToSale,setNumberToSale] = useState(0)

  const sale = async(e,id) => {
    e.preventDefault()
    await api('post','/purchases/sale',{stock:id,number:numberToSale},true)
    window.location.reload()
  }
  
return (
    <Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell align='center'>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <ChevronUp /> : <ChevronDown />}
          </IconButton>
        </TableCell>  
        <TableCell align='left'>{row._id}</TableCell>
        <TableCell align='left'>{row.name}</TableCell>
        <TableCell align='left'>{row.volume}</TableCell>
        <TableCell align='center'>{parseFloat(row.open.toFixed(4))}$</TableCell>
        <TableCell align='center'>{parseFloat(row.close.toFixed(4))}$</TableCell>
        <TableCell align='left'>{parseFloat(row.high.toFixed(4))}$</TableCell>
        <TableCell align='left'>{parseFloat(row.low.toFixed(4))}$</TableCell>
        <TableCell align='center'>{row.number}</TableCell>
        <TableCell align='center'>{parseFloat((((row.open + row.close) / 2 )* row.number).toFixed(2))}$</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ py: '0 !important' }} style={{paddingLeft:'3vw'}}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ m: 2 }}>
              <Typography variant='h6' gutterBottom component='div' style={{marginTop:'1em'}}>
                Properties
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Select for Sale</TableCell>
                    <TableCell align='right'>admin</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow key={row._id}>
                      <TableCell>...</TableCell>
                      <TableCell component='th' scope='row'>
                        <TextField fullWidth type='number' label='Number' defaultValue={numberToSale}  onChange={(e) => setNumberToSale(e.target.value)} InputProps={{inputProps:{min : 0,max:row.number}}}/>
                      </TableCell>
                      <TableCell align='right'>
                        <Button type='reset' variant='outlined' color='secondary' onClick={(e) => sale(e,row._id)}>
                          Submit
                        </Button>
                      </TableCell>
                    </TableRow>
                  <br/><br/>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}



const WalletTable = (props) => {
  
  return (
    <TableContainer component={Paper}>
      <Table aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align='left'>Stock ID</TableCell>
            <TableCell align='left'>Stock Name</TableCell>
            <TableCell align='left'>Volume</TableCell>
            <TableCell align='center'>Open</TableCell>
            <TableCell align='center'>Close</TableCell>
            <TableCell align='left'>High</TableCell>
            <TableCell align='left'>Low</TableCell>
            <TableCell align='center'>Number</TableCell>
            <TableCell align='center'>Totla Value</TableCell>
          </TableRow>
        </TableHead>
        {
        }
        <TableBody>
          {props.wallet.map(row => (
            <Row key={row._id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default WalletTable
