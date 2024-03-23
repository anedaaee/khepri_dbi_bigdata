import axios from "axios";

import { API_KEY } from "../../../src/config";

const api = async (method,url,data) => {
    try{
        let config = {
            method : method,
            url : `${API_KEY}${url}`,
            maxBodyLength: Infinity,
            data:data,
        }
        let result = await axios.request(config)
       
        if(result.data !== undefined){
            if(result.data.status == 2){
                return result.data
            }else if(result.data.status == 1){
                return result.data
            }else if(result.data.status == 0){
                return result.data
            }else if(result.data.status == -1){
                if(result.data.message == 'Access Denied'){
                    window.location.href = '/pages/user'
                }else if(result.data.message=='Invalid Token'){
                    localStorage.clear()
                    window.location.href = '/'
                }
               
                return result.data
            }else if(result.data.status == -2){
                return {
                    error:true,
                    message : 'Username or Password is incorrect'
                }
            }
        }
    }catch(err){throw err}
}


export default api