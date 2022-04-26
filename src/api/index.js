import axios from 'axios'
const Axios = axios.create({
    timeout:3000
})

Axios.interceptors.request.use(req=>{
    return req
})
Axios.interceptors.response.use(res=>{
    return res
})
export default Axios;