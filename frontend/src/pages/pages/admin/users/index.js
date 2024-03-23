// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'


import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import CardHeader from '@mui/material/CardHeader'
import OrderTableCollapsible from 'src/views/tables/OerderTableCollapsible'
import UserTable from 'src/views/tables/UserTable'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import Head from 'next/head'

const Tab = styled(MuiTab)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const AccountSettings = () => {
  // ** State

  return (
    <Card>
      <Head>
        <title>{`Oilyfan - Users`}</title>
        <meta
          name='description'
          content={`Oilyfan - Users`}
        />
        <meta name='keywords' content='Oilyfan' />
        <meta name='viewport' content='Oilyfan' />
      </Head>
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Typography variant='h5' style={{paddingLeft:'20px',paddingTop:'30px'}}>
              <Link>
                Users
              </Link>
          </Typography>
          <br/>
        </Grid>
      </Grid>
      <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <UserTable/>
        </Card>
      </Grid>
    </Grid>

    </Card>
  )
}

export default AccountSettings
