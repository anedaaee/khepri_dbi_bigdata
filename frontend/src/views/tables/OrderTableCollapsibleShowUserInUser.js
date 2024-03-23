// ** React Imports
import { useState, Fragment } from 'react'

import { API_KEY } from "../../../src/config";

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


const Row = props => {
  // ** Props
  const { row } = props

  // ** State
  const [open, setOpen] = useState(false)

  const statusObj = {
    ['-1']: { color: 'error' ,name:'Declined'},
    ['0']: { color: 'warning' ,name:'Pending'},
    ['1']: { color: 'secondary' ,name:'In progress'},
    ['2']: { color: 'success' ,name:'Completed'}
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
   
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
 
  return (
    <Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell align='center'>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <ChevronUp /> : <ChevronDown />}
          </IconButton>
        </TableCell>
        <TableCell align='left'>
          <Chip
            label={statusObj[row.status].name}
            color={statusObj[row.status].color}
            sx={{
              height: 24,
              fontSize: '0.75rem',
              textTransform: 'capitalize',
              '& .MuiChip-label': { fontWeight: 500 }
            }}
          />
        </TableCell>
        
        <TableCell align='left'>{row.name}</TableCell>
        <TableCell align='center'>{formatDate(row.createdAt)}</TableCell>
        <TableCell align='center'>{formatDate(row.modifiedAt)}</TableCell>
        <TableCell align='left'>{row.trackingCode}</TableCell>
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
                    <TableCell>Name</TableCell>
                    <TableCell align='right'>Kind</TableCell>
                    <TableCell align='right'>Value</TableCell>
                    <TableCell align='right'>Unit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.properties.map((propertyRow) => {
                    if(propertyRow.isVisible){
                      return(
                          <TableRow key={propertyRow.id}>
                          <TableCell component='th' scope='row'>
                            {propertyRow.id}
                          </TableCell>
                          <TableCell>{propertyRow.name}</TableCell>
                          <TableCell align='right'>{propertyRow.kind}</TableCell>
                          <TableCell align='right'>{propertyRow.kind==='file'?
                            (
                              <Link href={`${API_KEY}/File/DownloadFile?token=${localStorage.getItem('authToken-oilyfan')}&file_id=${propertyRow.value}`}>{propertyRow.filename}</Link>
                            )
                          :propertyRow.value}</TableCell>
                          <TableCell align='right'>{propertyRow.unit?propertyRow.unit:'---'}</TableCell>
                        </TableRow>
                    
                      )
                    }else{
                      return(<div key={propertyRow.id}/>)
                    }
                    
                  })}
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



const OrderTableCollapsibleShowUserForUser = (props) => {

  

  return (
    <div>

      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align='left'>status</TableCell>
              <TableCell align='left'>Name</TableCell>
              <TableCell align='center'>Created date</TableCell>
              <TableCell align='center'>Modified date</TableCell>
              <TableCell align='left'>tracking code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.orders.map(row => (
              <Row key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
    
  )
}

export default OrderTableCollapsibleShowUserForUser
