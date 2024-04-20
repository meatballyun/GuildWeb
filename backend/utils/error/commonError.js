const CommonError = {
    400: {
        STATUS: "Bad Request",
        STATUS_CODE: 400,
        MESSAGE: "The server cannot process the request due to a client error."
    },

    401: {
        STATUS: "Unauthorized",
        STATUS_CODE: 401,
        MESSAGE: "The request has not been applied because it lacks valid authentication credentials for the target resource."
    },

    403: {
        STATUS: "Forbidden",
        STATUS_CODE: 403,
        MESSAGE: "The server understood the request, but refuses to authorize it."
    },

    404: {
        STATUS: "Not Found",
        STATUS_CODE: 404,
        MESSAGE: "The server cannot find the requested resource."
    },

    405: {
        STATUS: "Method Not Allowed",
        STATUS_CODE: 405,
        MESSAGE: "The method specified in the request is not allowed for the resource identified by the request URI."
    },

    408: {
        STATUS: "Request Timeout",
        STATUS_CODE: 408,
        MESSAGE: "The server timed out waiting for the request."
    },

    409: {
        STATUS: "Conflict",
        STATUS_CODE: 409,
        MESSAGE: "The request could not be completed due to a conflict with the current state of the target resource."
    },

    410: {
        STATUS: "Gone",
        STATUS_CODE: 410,
        MESSAGE: "The requested resource is no longer available at the server and no forwarding address is known."
    },

    413: {
        STATUS: "Payload Too Large",
        STATUS_CODE: 413,
        MESSAGE: "The server is refusing to process a request because the request payload is larger than the server is willing or able to process."
    },

    415: {
        STATUS: "Unsupported Media Type",
        STATUS_CODE: 415,
        MESSAGE: "The server is refusing to service the request because the payload is in a format not supported by the requested resource for the requested method."
    },

    418: {
        STATUS: "I'm a teapot",
        STATUS_CODE: 418,
        MESSAGE: "The server refuses the attempt to brew coffee with a teapot."
    },

    422: {
        STATUS: "Unprocessable Entity",
        STATUS_CODE: 422,
        MESSAGE: "The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions."
    },

    424: {
        STATUS: "Failed Dependency",
        STATUS_CODE: 424,
        MESSAGE: "The method could not be performed on the resource because the requested action depended on another action and that action failed."
    },

    426: {
        STATUS: "Upgrade Required",
        STATUS_CODE: 426,
        MESSAGE: "The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol."
    },

    428: {
        STATUS: "Precondition Required",
        STATUS_CODE: 428,
        MESSAGE: "The origin server requires the request to be conditional."
    },

    429: {
        STATUS: "Too Many Requests",
        STATUS_CODE: 429,
        MESSAGE: "The user has sent too many requests in a given amount of time."
    },

    431: {
        STATUS: "Request Header Fields Too Large",
        STATUS_CODE: 431,
        MESSAGE: "The server is unwilling to process the request because its header fields are too large."
    },

    451: {
        STATUS: "Unavailable For Legal Reasons",
        STATUS_CODE: 451,
        MESSAGE: "The server is denying access to the resource as a consequence of a legal demand."
    },

    500: {
        STATUS: "Internal Server Error",
        STATUS_CODE: 500,
        MESSAGE: "The server encountered an unexpected condition that prevented it from fulfilling the request."
    },

    501: {
        STATUS: "Not Implemented",
        STATUS_CODE: 501,
        MESSAGE: "The server does not support the functionality required to fulfill the request."
    },

    502: {
        STATUS: "Bad Gateway",
        STATUS_CODE: 502,
        MESSAGE: "The server received an invalid response from an inbound server it accessed while attempting to fulfill the request."
    },

    503: {
        STATUS: "Service Unavailable",
        STATUS_CODE: 503,
        MESSAGE: "The server is currently unable to handle the request due to a temporary overload or maintenance of the server."
    },

    504: {
        STATUS: "Gateway Timeout",
        STATUS_CODE: 504,
        MESSAGE: "The server did not receive a timely response from the upstream server while attempting to load the requested resource."
    },

    505: {
        STATUS: "HTTP Version Not Supported",
        STATUS_CODE: 505,
        MESSAGE: "The server does not support, or refuses to support, the HTTP protocol version that was used in the request message."
    },
};

module.exports = CommonError;
