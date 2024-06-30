type CommonErrorType = {
  [key: number]: { status: string; statusCode: number; message: string };
};

export const CommonError: CommonErrorType = {
  400: {
    status: 'Bad Request',
    statusCode: 400,
    message: 'The server could not understand the request due to invalid syntax or missing parameters.',
  },

  401: {
    status: 'Unauthorized',
    statusCode: 401,
    message: 'The request has not been applied because it lacks valid authentication credentials for the target resource.',
  },

  403: {
    status: 'Forbidden',
    statusCode: 403,
    message: 'The server understood the request, but refuses to authorize it.',
  },

  404: {
    status: 'Not Found',
    statusCode: 404,
    message: 'The server cannot find the requested resource.',
  },

  405: {
    status: 'Method Not Allowed',
    statusCode: 405,
    message: 'The method specified in the request is not allowed for the resource identified by the request URI.',
  },

  408: {
    status: 'Request Timeout',
    statusCode: 408,
    message: 'The server timed out waiting for the request.',
  },

  409: {
    status: 'Conflict',
    statusCode: 409,
    message: 'The request could not be completed due to a conflict with the current state of the target resource.',
  },

  410: {
    status: 'Gone',
    statusCode: 410,
    message: 'The requested resource is no longer available at the server and no forwarding address is known.',
  },

  413: {
    status: 'Payload Too Large',
    statusCode: 413,
    message: 'The server is refusing to process a request because the request payload is larger than the server is willing or able to process.',
  },

  415: {
    status: 'Unsupported Media Type',
    statusCode: 415,
    message: 'The server is refusing to service the request because the payload is in a format not supported by the requested resource for the requested method.',
  },

  418: {
    status: "I'm a teapot",
    statusCode: 418,
    message: 'The server refuses the attempt to brew coffee with a teapot.',
  },

  422: {
    status: 'Unprocessable Entity',
    statusCode: 422,
    message: 'The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions.',
  },

  424: {
    status: 'Failed Dependency',
    statusCode: 424,
    message: 'The method could not be performed on the resource because the requested action depended on another action and that action failed.',
  },

  426: {
    status: 'Upgrade Required',
    statusCode: 426,
    message: 'The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.',
  },

  428: {
    status: 'Precondition Required',
    statusCode: 428,
    message: 'The origin server requires the request to be conditional.',
  },

  429: {
    status: 'Too Many Requests',
    statusCode: 429,
    message: 'The user has sent too many requests in a given amount of time.',
  },

  431: {
    status: 'Request Header Fields Too Large',
    statusCode: 431,
    message: 'The server is unwilling to process the request because its header fields are too large.',
  },

  451: {
    status: 'Unavailable For Legal Reasons',
    statusCode: 451,
    message: 'The server is denying access to the resource as a consequence of a legal demand.',
  },

  500: {
    status: 'Internal Server Error',
    statusCode: 500,
    message: 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
  },

  501: {
    status: 'Not Implemented',
    statusCode: 501,
    message: 'The server does not support the functionality required to fulfill the request.',
  },

  502: {
    status: 'Bad Gateway',
    statusCode: 502,
    message: 'The server received an invalid response from an inbound server it accessed while attempting to fulfill the request.',
  },

  503: {
    status: 'Service Unavailable',
    statusCode: 503,
    message: 'The server is currently unable to handle the request due to a temporary overload or maintenance of the server.',
  },

  504: {
    status: 'Gateway Timeout',
    statusCode: 504,
    message: 'The server did not receive a timely response from the upstream server while attempting to load the requested resource.',
  },

  505: {
    status: 'HTTP Version Not Supported',
    statusCode: 505,
    message: 'The server does not support, or refuses to support, the HTTP protocol version that was used in the request message.',
  },
};
