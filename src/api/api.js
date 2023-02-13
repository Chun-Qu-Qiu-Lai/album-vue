import request from '@/api/request'

// 登录
export function login (username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/user/admin/login',
    method: 'post',
    headers: {
      isToken: false,
      'Content-Type': 'application/x-www-form-urlencoded;charset:utf-8;'
    },
    data: data
  })
}
// 获取目录列表
export function getCatalogues () {
  return request({
    url: '/catalogue/admin/getCatalogueTables',
    method: 'get',
    headers: {
      isToken: true
    }
  })
}
// 获取图片信息
export function getPicTable (catalogueId) {
  const data = {
    catalogueId
  }
  return request({
    url: 'oss/admin/getPicTables',
    method: 'post',
    headers: {
      isToken: false,
      'Content-Type': 'application/x-www-form-urlencoded;charset:utf-8;'
    },
    data: data
  })
}
// 创建目录
export function addAlbum (catalogueName) {
  const data = {
    catalogueName
  }
  return request({
    url: 'catalogue/createCatalogue',
    method: 'post',
    headers: {
      isToken: true,
      'Content-Type': 'application/x-www-form-urlencoded;charset:utf-8;'
    },
    data: data
  })
}
// 图片签名信息
export function getSignature (catalogueId) {
  const data = {
    catalogueId
  }
  return request({
    url: '/oss/policy',
    method: 'post',
    headers: {
      isToken: true,
      'Content-Type': 'application/x-www-form-urlencoded;charset:utf-8;'
    },
    data: data
  })
}
// 删除图片
export function deletePicture (filePath) {
  const data = {
    filePath
  }
  return request({
    url: '/oss/deleteFile',
    method: 'post',
    headers: {
      isToken: false,
      'Content-Type': 'application/x-www-form-urlencoded;charset:utf-8;'
    },
    data: data
  })
}
// 修改相册名称
export function updateAlbumName (newAlbumName, catalogueId) {
  const data = {
    newAlbumName,
    catalogueId
  }
  return request({
    url: '/catalogue/updateAlbumName',
    method: 'post',
    headers: {
      isToken: false,
      'Content-Type': 'application/x-www-form-urlencoded;charset:utf-8;'
    },
    data: data
  })
}
// 修改密码
export function updatePsw (password, checkPassword) {
  const data = {
    password,
    checkPassword
  }
  return request({
    url: '/user/admin/editPsw',
    method: 'post',
    headers: {
      isToken: true,
      'Content-Type': 'application/x-www-form-urlencoded;charset:utf-8;'
    },
    data: data
  })
}
// 获取用户信息
export function getUserInfo () {
  return request({
    url: '/user/getUserInfo',
    method: 'get',
    headers: {
      isToken: true
    }
  })
}

export function deleteCatalogue (catalogueId) {
  const data = {
    catalogueId
  }
  return request({
    url: 'catalogue/admin/removeCatalogue',
    method: 'post',
    headers: {
      isToken: true,
      'Content-Type': 'application/x-www-form-urlencoded;charset:utf-8;'
    },
    data: data
  })
}

export function editHighHandle (pictureHandleForm) {
  return request({
    url: 'oss/editFile',
    method: 'post',
    data: pictureHandleForm
  })
}

export function downloadFile (fileId) {
  const data = {
    fileId
  }
  return request({
    url: 'oss/download',
    method: 'post',
    headers: {
      isToken: true
    },
    data: data
  })
}

export function getUploadOperation () {
  return request({
    url: 'operation/admin/uploadOperation',
    method: 'get',
    headers: {
      isToken: true
    }
  })
}
export function deletePictures (idList) {
  return request({
    url: `oss/removeFiles/${idList}`,
    method: 'get',
    headers: {
      isToken: true
    }
  })
}
export function getDownloadOperation () {
  return request({
    url: 'operation/admin/downloadOperation',
    method: 'get',
    headers: {
      isToken: true
    }
  })
}
