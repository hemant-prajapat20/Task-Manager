import axios from "axios"

const  BASE_URL ="http://localhost:3000/api"

const axiosInstance=axios.create({
    baseURL:BASE_URL,
    timeout:10000,
    headers:{
        "content-Type": "applcation/json",
        Accept: "applcation/json",
    },
})