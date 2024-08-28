import request from '@/utils/request'

export function changeUserInfo(name, password, real_name, gender, phoneNum) {
    const data = {
        name,
        password,
        real_name,
        gender,
        phoneNum
    }

    return request({
        url: '/user/change',
        method: 'post',
        data: data
    })
}

export function getUserInfo() {

    return request({
        url: '/user/getInfo',
        method: 'get',
    })
}