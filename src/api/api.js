import request from "@/utils/request";


// 登录
export const userLogin = user => request.post('/api/users/login', user)
// 注册
export const userRegister = (user) => request.post('/api/users/register', user)
// 获取当前用户
export const getCurUser = () => request.get('/api/users/getInfo')
// 分页列表查询
export const pageUsers = (query) => request.get('/api/users/listPage', {params: query})
// 根据id删除  url?id=1
export const removeUserById = (user) => request.get('/api/users/removeById', {params: user})
// 修改
export const updateUser = (user) => request.post('/api/users/updateById',user)
// 商家注册
export const BusRegister = (business) => request.post('/api/businesses/register', business)
// 分页列表查询（商家）
export const pageBusiness = (query) => request.get('/api/businesses/listBusinessPage', {params: query})
// 根据id删除(商家)  url?business_id=1
export const removeBusiness1= (business) => request.get('/api/businesses/removeByBid', {params: business})
// 修改
export const updateBusiness = (business) => request.post('/api/businesses/updateByBid',business)
// AI接口
export const aiChat1 = (query) => request.get('/api/ai/chat1', {params: query})

// 分页查询商家
export const pageBusinesses = (query) => {
    return request.get('/api/businesses/search', {
        params: query  // 传递查询参数（如商家名称、描述、位置等）
    });
}

// export const getBusReview = (query) => {
//     return request().get('/api/reviews/getByBusId', {
//         params: query, // 使用 query 传递参数
//     });
// }
export const getBusReview = (query) => request.get('/api/reviews/getByBusId', {params: query})
