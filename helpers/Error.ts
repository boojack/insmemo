const Errors: IterObject = {
  "20001": "请先登录",
  "20002": "用户名不可用",
  "20003": "注册失败，请稍候再试",
  "20004": "登录失败，请检查账号密码是否正确",
  "20010": "GitHub 服务错误",

  // 客户端请求数据格式错误
  "30001": "请求数据错误",

  "40001": "未知领域的错误",

  // 服务端出错
  "50001": "服务器出错啦，请稍候再试",
  "50002": "数据库挂啦，请稍候再试",
};
const ErrorCode = Object.keys(Errors);

export function getErrorInfo(code: string) {
  if (!ErrorCode.includes(code)) {
    code = "40001";
  }
  const statusCode = parseInt(code.slice(0, 3));

  return {
    statusCode,
    message: Errors[code],
  };
}
