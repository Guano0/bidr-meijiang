import request from '@/utils/request'
export function testAPI1() {
  return request({
    url: "/zxhl2/basin/dict",
    method: "get"
});
}

/**
 * @param type 类型参数，可选
 * @param code 代码参数，可选
 * @returns Promise 返回查询结果
 */
export function testAPI2(data: any) {
  return request({
    url: "/api/hsfx/select",
    method: "post",
    params: data,
  });
}

/**
 * 文件选择接口
 * @param path 路径参数，可选
 * @returns Promise 返回查询结果
 */
export function testAPI3(path: any) {
  return request({
    url: "/api3/file/select",
    method: "get",
    params: path,
  });
}