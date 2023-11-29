import {build, analyzeMetafile, serve} from 'esbuild'

const entry_points = {
  splash: 'src/views/splash.js',
  viewer: 'src/views/viewer.js',
  singleview: 'src/views/singleview.js',
  twinview: 'src/views/twinview.js',
  info: 'src/views/info.js',
  style: 'src/index.css'
}

if (process.env.NODE_ENV === 'production') {

  // Production build
  build({
    entryPoints: entry_points,
    outdir: 'dist',
    bundle: true,
    minify: true,
    metafile: true,
    splitting: true,
    format: 'esm',
    loader: {
      '.ttf': 'file',
      '.svg': 'file'
    }
  })
  .then((result) => {
    
    analyzeMetafile(result.metafile).then((analysis) => {
      console.log(analysis)
      console.log('Build finished 👍')
    })
    
  })
  .catch(() => process.exit(1))

} else {

  // Development mode watches for file changes and rebuilds
  serve({
    servedir: 'public',
  }, {
    entryPoints: entry_points,
    loader: {
      '.ttf': 'file',
      '.svg': 'file'
    },
    outdir: 'public',
    bundle: true,
    splitting: true,
    format: 'esm'
  }).then(server => {
    console.log(server)
    // Call "stop" on the web server to stop serving
    // server.stop()
  })
}
