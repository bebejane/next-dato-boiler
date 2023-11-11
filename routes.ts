import fs from 'fs';

const manifest_path = './.next/prerender-manifest.json'

if (!fs.existsSync(manifest_path)) {
  console.log('manifest does not exist')
  process.exit(0)
}

const manifest = JSON.parse(fs.readFileSync(manifest_path).toString())
const routes = manifest.routes
const paths = Object.keys(routes).filter(k => routes[k].dataRoute).map((k) => {
  return {
    path: k,
    revalidate: routes[k].initialRevalidateSeconds
  }
})

console.log(paths)