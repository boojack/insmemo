const ErrorCode = ["20001", "20002", "40001", "50001", "50002"];
const Errors: IterObject = {
  // 客户端请求数据格式错误
  "20001": "Request body type is illegal",
  "20002": "Username is unusable",
  "20003": "Sign up/in failed",

  "40001": "Unknown error",

  // 服务端出错
  "50001": "Server is not working normal",
  "50002": "Database error",
};

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
