// This is default stack. We need this to work-around yarn PnP resolution issues.
export default {
  stack: [
    "lws-basic-auth",
    "lws-body-parser",
    "lws-request-monitor",
    "lws-log",
    "lws-cors",
    "lws-json",
    "lws-compress",
    "lws-rewrite",
    "lws-blacklist",
    "lws-conditional-get",
    "lws-mime",
    "lws-range",
    "lws-spa",
    "lws-static",
    "lws-index"
  ]
};
