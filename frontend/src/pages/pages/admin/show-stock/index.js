// ** React Imports
import { useState ,useEffect} from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Chart } from "react-google-charts";

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'
import api from 'src/@core/utils/api'
import { LoadingButton } from '@mui/lab'
import TabInfo from 'src/views/account-settings/TabInfo'
import TabAccountEdit from 'src/views/account-settings/TabAccountEdit'
import TabSecurity from 'src/views/account-settings/TabSecurity'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import Head from 'next/head'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import dynamic from 'next/dynamic'
import { Button, TextField } from '@mui/material';

// const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

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
  const [value, setValue] = useState('data')
  const [stock,setStock] = useState({})
  const [history,setHistory] = useState([])
  const [stockId,setStockId] = useState('')
  const [loading,setLoading] = useState(true)
  const [candleData,setCandleDate] = useState([])
  const [date,setDate] = useState({
    lowerDate : '',
    upperDate : ''
  })
  const [numberToPurchase,setNumberToPurchase] = useState(0)
  const options = {
    legend: "none",
    bar: { groupWidth: "100%" },
    candlestick: {
      fallingColor: { strokeWidth: 0, fill: "#a52714" },
      risingColor: { strokeWidth: 0, fill: "#0f9d58" },
    },
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    };
  const dataForCandle= async(histories) => {
    let candle = []
    candle.push(["Day", "low", "open", "close"], "high",)
    for(const history of histories){
      date = formatDate(history.date)
      let arr = [date,parseInt(history.low),parseInt(history.open),parseInt(history.close),parseInt(history.high)]
      candle.push(arr)
    }
    setCandleDate(candle)
  }
  const fetchData = async(id,lowerDate,upperDate) => {
    try{
      setLoading(true)
      const userData = await api('get',
        `/stock/getStockById?_id=${id}&lower_date=${lowerDate}&upper_date=${upperDate}`,{},true)
      setStock(userData.stock)
      setHistory(userData.history.history)
      await dataForCandle(userData.history.history)
    }catch(err){  
      console.log(err);
    }finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    try{
      const queryString = window.location.search          
      const params = new URLSearchParams(queryString)
      const stockId = params.get('_id') 

      const today = new Date()
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth()-1)
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2,'0')
      const day =  String(today.getDate()).padStart(2,'0')
      const lastMonth_year = lastMonth.getFullYear()
      const lastMonth_month = String(lastMonth.getMonth() + 1).padStart(2,'0')
      const lastMonth_day =  String(lastMonth.getDate()).padStart(2,'0')
      setDate({
        ...date,
        lowerDate : `${lastMonth_year}-${lastMonth_month}-${lastMonth_day}`,
        upperDate : `${year}-${month}-${day}`
      })
      setStockId(stockId)    
      fetchData(stockId,`${lastMonth_year}-${lastMonth_month}-${lastMonth_day}`,`${year}-${month}-${day}`)
      
    }catch(err){

    }
  },[])
  
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const onChangeDate = (e,state) => {
    if(e.target.value){
      console.log(e.target.value);
      let datee = new Date(e.target.value)
      const year = datee.getFullYear()
      const month = String(datee.getMonth() + 1).padStart(2,'0')
      const day =  String(datee.getDate()).padStart(2,'0')
      datee = `${year}-${month}-${day}`
      e.preventDefault()
      if(state === 'upper'){
        setDate({
          ...date,
          upperDate : datee 
        })
      }else{
        setDate({
          ...date,
          lowerDate : datee 
        })
      }
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    await fetchData(stock._id,date.lowerDate,date.upperDate)
  } 
  const purchase = async(e) => {
    e.preventDefault()
    await api('post','/purchases/purchase',{stock:stock._id,number:numberToPurchase},true)
    window.location.href = '/pages/admin'
  }
  return (
    <div>
      {
        loading?
        (
          <div style={{width:'100%',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
            <img src='/loading.gif' alt='loading' style={{width:'20%'}}/> 
            <p style={{color:'#ff5358'}}>Loading...</p>
          </div>
        ):(
          <Card>
              <Head>
                <title>{`Khepry - Show Stock`}</title>
                <meta
                  name='description'
                  content={`Khepry - Show Stock`}
                />
                <meta name='keywords' content='Khepry' />
                <meta name='viewport' content='Khepry' />
              </Head>
              <TabContext value={value}>
                  <TabList
                  onChange={handleChange}
                  aria-label='account-settings tabs'
                  sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
                  >
                    <Tab
                        value='data'
                        label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccountOutline />
                            <TabName>Stock Data</TabName>
                        </Box>
                        }
                    />
                    <Tab
                        value='candle'
                        label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccountOutline />
                            <TabName>Candle Chart</TabName>
                        </Box>
                        }
                    />
                    <Tab
                        value='line'
                        label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccountOutline />
                            <TabName>Line Chart</TabName>
                        </Box>
                        }
                    />
                  </TabList>
                  <TabPanel sx={{ p: 0 }} value='data'>
                    <Grid item xs={12}>
                      <Grid item xs={12}>
                        <Typography variant='h5' style={{paddingLeft:'20px',paddingTop:'30px'}}>
                            <Link>
                              Stock Information
                            </Link>
                        </Typography>
                        <br/>
                      </Grid>
                    </Grid>
                    <Grid container spacing={.5}>
                      <Grid item xs={6} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <h3 style={{marginLeft:'10px'}}>Stock ID : <span style={{color:'#939393',fontWeight:'lighter'}}>{stock._id}</span></h3>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <h3 style={{marginLeft:'10px'}}>Stock Name : <span style={{color:'#939393',fontWeight:'lighter'}}>{stock.name}</span></h3>
                          </Box>
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <h3 style={{marginLeft:'10px'}}>Open: <span style={{color:'#939393',fontWeight:'lighter'}}>{stock.open}$</span></h3>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <h3 style={{marginLeft:'10px'}}>Close: <span style={{color:'#939393',fontWeight:'lighter'}}>{stock.close}$</span></h3>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <h3 style={{marginLeft:'10px'}}>High: <span style={{color:'#939393',fontWeight:'lighter'}}>{stock.high}$</span></h3>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <h3 style={{marginLeft:'10px'}}>Low: <span style={{color:'#939393',fontWeight:'lighter'}}>{stock.low}$</span></h3>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={12} style={{ display: 'flex', alignItems: 'center'}}>
                        <Grid item xs={6} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <h3 style={{marginLeft:'10px'}}>Volume : <span style={{color:'#939393',fontWeight:'lighter'}}>{stock.volume}</span></h3>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    <br/><br/><br/><br/>
                    <Grid container spacing={.5}>
                      <Grid item xs={6} sm={6}>
                        <TextField fullWidth type='number' label='Number' defaultValue={numberToPurchase}  onChange={(e) => setNumberToPurchase(e.target.value)} InputProps={{inputProps:{min : 0}}}/>
                      </Grid>
                      <div style={{width:'100%',display:'flex',justifyContent:'right'}}>
                        <Button variant='contained' style={{backgroundColor:'transparent',border:'1px solid red',color:'red'}} sx={{ marginRight: 3.5 }} onClick={(e) => purchase(e)}>
                            Purchase
                        </Button>
                      </div>
                    </Grid>
                    <br/><br/>
                  </TabPanel>
                  <TabPanel sx={{ p: 0 }} value='candle'>
                    <Chart
                      chartType="CandlestickChart"
                      width="100%"
                      height="400px"
                      data={candleData}
                      options={options}
                    />
                    <br/><br/><br/><br/><br/><br/>
                    <Grid container spacing={.5}>
                      <br/><br/><br/><br/><br/><br/>
                      <Grid item xs={6} sm={6}>
                        <TextField fullWidth type='date' label='Start date' defaultValue={date.lowerDate}  onChange={(e) => onChangeDate(e,'lower')}/>
                      </Grid>
                      <br/><br/><br/><br/><br/><br/>
                      <Grid item xs={6} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TextField fullWidth type='date' label='End date' defaultValue={date.upperDate}  onChange={(e) => onChangeDate(e,'upper')}/>
                        </Box>
                      </Grid>
                      <br/><br/><br/><br/><br/><br/>
                      <div style={{width:'100%',display:'flex',justifyContent:'right'}}>
                        <Button variant='contained' style={{backgroundColor:'ButtonFace',border:'1px solid red',color:'red'}} sx={{ marginRight: 3.5 }} onClick={(e) => handleSubmit(e)}>
                            Search
                        </Button>
                      </div>
                    </Grid>
                  </TabPanel>
                  <TabPanel sx={{ p: 0 }} value='line'>
                    {
                      history.length == 0?
                      (
                        <div/>
                      ):
                      (
                        <ResponsiveContainer width="100%" aspect={2}>
                          <LineChart
                            width={500}
                            height={300}
                            data={history}
                            margin={{
                              top: 50,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tickFormatter={formatDate}/>
                            <YAxis domain={['auto','auto']}/>
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="open" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="close" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="high" stroke="#e80909" />
                            <Line type="monotone" dataKey="low" stroke="#232320" />
                          </LineChart>
                        </ResponsiveContainer>
                      )
                    }
                    <br/><br/><br/><br/><br/><br/>
                    <Grid container spacing={.5}>
                      <br/><br/><br/><br/><br/><br/>
                      <Grid item xs={6} sm={6}>
                        <TextField fullWidth type='date' label='Start date' defaultValue={date.lowerDate}  onChange={(e) => onChangeDate(e,'lower')}/>
                      </Grid>
                      <br/><br/><br/><br/><br/><br/>
                      <Grid item xs={6} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TextField fullWidth type='date' label='End date' defaultValue={date.upperDate}  onChange={(e) => onChangeDate(e,'upper')}/>
                        </Box>
                      </Grid>
                      <br/><br/><br/><br/><br/><br/>
                      <div style={{width:'100%',display:'flex',justifyContent:'right'}}>
                        <Button variant='contained' style={{backgroundColor:'ButtonFace',border:'1px solid red',color:'red'}} sx={{ marginRight: 3.5 }} onClick={(e) => handleSubmit(e)}>
                            Search
                        </Button>
                      </div>
                    </Grid>
                  </TabPanel>
              </TabContext>
          </Card>
        )
      }
    </div>
    
  )
}

export default AccountSettings
