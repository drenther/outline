import queryString from 'query-string';

export default function methodOverride(options) {
  return async function methodOverrideMiddleware(ctx, next) {
    if (ctx.method === 'POST') {
      ctx.body = ctx.request.body;
    } else if (ctx.method === 'GET') {
      ctx.method= 'POST';
      ctx.body = queryString.parse(ctx.querystring);
    }
    return next();
  }
};
