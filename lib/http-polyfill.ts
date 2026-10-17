import { EventEmitter } from 'events';
import http from 'http';
import https from 'https';

/**
 * Polyfill for Node.js https.request and http.request on Cloudflare Workers (workerd / unenv)
 * OpenNext uses unenv stubs which throw "[unenv] https.request is not implemented yet!".
 * This polyfill routes outgoing HTTP/HTTPS requests through standard Web fetch() so that
 * libraries like openid-client (used by NextAuth) work seamlessly in Cloudflare Workers.
 */
let installed = false;

export function ensureHttpFetchPolyfill() {
  if (installed) return;
  installed = true;

  const createRequestPolyfill = (isHttps: boolean) => {
    return (urlInput: any, optionsInput: any, cb?: any) => {
      let targetUrl = '';
      let options: Record<string, any> = {};

      if (typeof urlInput === 'string' || urlInput instanceof URL) {
        targetUrl = urlInput.toString();
        if (typeof optionsInput === 'object' && optionsInput !== null) {
          options = { ...optionsInput };
        }
      } else if (typeof urlInput === 'object' && urlInput !== null) {
        options = { ...urlInput };
        const proto = isHttps ? 'https:' : 'http:';
        const host = options.hostname || options.host || 'localhost';
        const port = options.port ? `:${options.port}` : '';
        const path = options.path || '/';
        targetUrl = `${proto}//${host}${port}${path}`;
      }

      const emitter = new EventEmitter();
      const headers: Record<string, string> = {};

      if (options.headers) {
        for (const [k, v] of Object.entries(options.headers)) {
          if (v !== undefined && v !== null) {
            headers[k.toLowerCase()] = String(v);
          }
        }
      }

      if (typeof cb === 'function') {
        emitter.once('response', cb);
      }

      const chunks: Buffer[] = [];

      const req: any = {
        ...emitter,
        on: emitter.on.bind(emitter),
        once: emitter.once.bind(emitter),
        emit: emitter.emit.bind(emitter),
        removeListener: emitter.removeListener.bind(emitter),
        setHeader(name: string, val: any) {
          headers[name.toLowerCase()] = String(val);
        },
        getHeader(name: string) {
          return headers[name.toLowerCase()];
        },
        removeHeader(name: string) {
          delete headers[name.toLowerCase()];
        },
        write(chunk: any) {
          if (chunk) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          }
        },
        destroy(err?: Error) {
          if (err) emitter.emit('error', err);
          emitter.emit('close');
        },
        setTimeout(ms: number, timeoutCb?: () => void) {
          if (typeof timeoutCb === 'function') {
            emitter.once('timeout', timeoutCb);
          }
          return req;
        },
        end(chunk?: any) {
          if (chunk) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          }

          const method = (options.method || 'GET').toUpperCase();
          const body =
            method !== 'GET' && method !== 'HEAD' && chunks.length > 0
              ? Buffer.concat(chunks)
              : undefined;

          fetch(targetUrl, {
            method,
            headers,
            body,
          })
            .then(async (res) => {
              const rawBuffer = Buffer.from(await res.arrayBuffer());
              const resEmitter = new EventEmitter();

              const resHeaders: Record<string, any> = {};
              res.headers.forEach((v, k) => {
                resHeaders[k.toLowerCase()] = v;
              });

              const responseObj = {
                ...resEmitter,
                statusCode: res.status,
                statusMessage: res.statusText,
                headers: resHeaders,
                on: resEmitter.on.bind(resEmitter),
                once: resEmitter.once.bind(resEmitter),
                emit: resEmitter.emit.bind(resEmitter),
                destroy: () => resEmitter.emit('close'),
                pipe: (dest: any) => {
                  dest.write(rawBuffer);
                  dest.end();
                  return dest;
                },
                [Symbol.asyncIterator]: async function* () {
                  yield rawBuffer;
                },
              };

              emitter.emit('response', responseObj);
            })
            .catch((err) => {
              emitter.emit('error', err);
            });
        },
      };

      return req;
    };
  };

  try {
    const origHttpsReq = (https as any).request;
    const origHttpReq = (http as any).request;

    // Test if https.request throws "[unenv] https.request is not implemented yet!"
    let needsPolyfill = false;
    try {
      if (typeof origHttpsReq !== 'function') {
        needsPolyfill = true;
      } else {
        // Quick call test to check if unenv stub throws
        origHttpsReq('https://example.com');
      }
    } catch (e: any) {
      if (e?.message?.includes('not implemented') || e?.message?.includes('unenv')) {
        needsPolyfill = true;
      }
    }

    if (needsPolyfill) {
      (https as any).request = createRequestPolyfill(true);
      (http as any).request = createRequestPolyfill(false);
    }
  } catch {
    (https as any).request = createRequestPolyfill(true);
    (http as any).request = createRequestPolyfill(false);
  }
}

// Auto-run on load
ensureHttpFetchPolyfill();
