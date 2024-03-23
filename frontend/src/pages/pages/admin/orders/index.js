// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'


import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import OrderTableCollapsible from 'src/views/tables/OerderTableCollapsible'


// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import Head from 'next/head'



const AccountSettings = () => {
  // ** State

  return (
    <Card>
      <Head>
        <title>{`Oilyfan - Orders Table`}</title>
        <meta
          name='description'
          content={`Oilyfan - Orders Table`}
        />
        <meta name='keywords' content='Oilyfan' />
        <meta name='viewport' content='Oilyfan' />
      </Head>
      <Grid item xs={12}>
        <Grid item xs={12}>
          <Typography variant='h5' style={{paddingLeft:'40px',paddingTop:'30px'}}>
              <Link>
                Orders
              </Link>
          </Typography>
          <br/>
        </Grid>
      </Grid>
      <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <OrderTableCollapsible />
        </Card>
      </Grid>
    </Grid>

    </Card>
  )
}

export default AccountSettings
