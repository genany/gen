const client = require('deploy-kit')
const path = require('path')
client
  .sftp({
    // sever account, address, port
    server: 'dev:zc-user!Q@W3e@223.203.221.60',
    // deploy all files in the directory
    workspace: path.join(__dirname, '..', 'build'),
    // ignore the matched files (glob pattern: https://github.com/isaacs/node-glob#glob-primer)
    // support array of glob pattern
    ignore: '**/*.map',
    // where the files are placed on the server
    deployTo: '/home/share/pay-admin/',
    // you can specify different place for each file
    rules: [
      //   {
      //     test: /dist\/(.*)$/,
      //     // $1, $2... means the parenthesized substring matches
      //     // [$n] will be replaced with matched string
      //     dest: 'public/static/[$1]'
      //   },
      //   {
      //     test: /views\/((?:[^/]+\/)*?[^\/]+).html$/,
      //     dest: 'app/views/[$1].phtml'
      //   }
    ]
  })
  .exec()
