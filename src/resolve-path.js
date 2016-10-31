import fs from 'fs';
import path from 'path';
import url from 'url';

const paths = {};

async function resolvePath(request) {
  const { previous } = request;
  let { current } = request;
  if (current.substr(0, 5) === 'jspm:') {
    current = current.replace(/^jspm:/, '');

    // we need the parent, if the module of the file is not a primary install
    const parentURL = url.parse(System.baseURL);
    parentURL.pathname = url.parse(request.options.urlBase).pathname;
    const parent = url.format(parentURL);
    return (await System.normalize(current, parent)).replace(/\.js$|\.ts$/, '');
  }
  const prevBase = `${path.dirname(previous)}/`;
  const base = (previous === 'stdin') ? request.options.urlBase : paths[previous] || prevBase;
  let resolved = url.resolve(base, current);
  if (previous !== 'stdin') paths[current] = `${path.dirname(resolved)}/`;
  return resolved;
}

export default resolvePath;
