import axios from "axios";

import { API_KEY } from "../../../src/config";

const api = async (method,url,data,secure) => {
    try{
        let token
        if (secure){
            token = localStorage.getItem('authToken-khepri')
        }
        let config = {
            method : method,
            url : `${API_KEY}${url}`,
            maxBodyLength: Infinity,
            data:data,
            headers : 
            secure?
            {
                Authorization : `Bearer ${token}`
            }
            :
            {

            }
        }
        let result = await axios.request(config)
        console.log(result);
        console.log(result.status);
        if(result.status == 200 || result.status == 201){
            return result.data.body
        }else if(result.status == 400){
            alert(result.data.metadata.message)
        }else if(result.status == 401){
            alert("unAuthorized")
            window.location.href = '/'
        }else if(result.status == 500){
            
            alert(result.data.metadata.message)
        }
    }catch(err){    
        throw err
    }
}


export default api