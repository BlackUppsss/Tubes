import axios from "axios";

const URL = "http://localhost:3000"

export async function getPosts() {
    // http://localhost:3000/posts
    const response = await axios.get(`${URL}/KamarHotel`)

    if (response.status === 200) {
        return response.data
    } else {
        return
    }
}

export async function getPost(id) {
    // http://localhost:3000/posts/12345
    const response = await axios.get(`${URL}/KamarHotel/${id}`)

    if (response.status === 200) {
        return response.data
    } else {
        return
    }
}

export async function createPost(post) {
    // http://localhost:3000/posts
    const response = await axios.post(`${URL}/KamarHotel`, post)
    return response
}

export async function updatePost(id, post) {
    // http://localhost:3000/posts/12345
    const response = await axios.put(`${URL}/KamarHotel/${id}`, post)
    return response
}

export async function deletePost(id) {
    // http://localhost:3000/posts/12345
    const response = await axios.delete(`${URL}/KamarHotel/${id}`)
    return response
}

export async function getUsers(id) {
    // http://localhost:3000/posts/12345
    const response = await axios.get(`${URL}/Users/${id}`)

    if (response.status === 200) {
        return response.data
    } else {
        return
    }
}

export async function createUsers(user) {
    // http://localhost:3000/posts
    const response = await axios.post(`${URL}/Users`, user)
    return response
}

export async function updateUsers(id, user) {
    // http://localhost:3000/posts/12345
    const response = await axios.put(`${URL}/Users/${id}`, user)
    return response
}

export async function deleteUsers(id) {
    // http://localhost:3000/posts/12345
    const response = await axios.delete(`${URL}/Users/${id}`)
    return response
}

export async function VerifyUser(Luser) {
    const response = await axios.post(`${URL}/Users/login`, Luser)
    if (response.data.success) {
        return response.data.token
    }else{
        return
    }
}


export async function getActives() {
    // http://localhost:3000/posts
    const response = await axios.get(`${URL}/ActiveHotel`)

    if (response.status === 200) {
        return response.data
    } else {
        return
    }
}

export async function getActive(id) {
    // http://localhost:3000/posts/12345
    const response = await axios.get(`${URL}/ActiveHotel/${id}`)

    if (response.status === 200) {
        return response.data
    } else {
        return
    }
}

export async function NewActive(post) {
    // http://localhost:3000/posts
    const response = await axios.post(`${URL}/ActiveHotel`, post)
    return response
}

export async function UpdateActive(id, post) {
    // http://localhost:3000/posts/12345
    const response = await axios.put(`${URL}/ActiveHotel/${id}`, post)
    return response
}

export async function deleteActive(id) {
    // http://localhost:3000/posts/12345
    const response = await axios.delete(`${URL}/ActiveHotel/${id}`)
    return response
}
