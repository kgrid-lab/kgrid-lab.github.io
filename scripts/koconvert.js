const fs = require('fs-extra')
const yaml = require('js-yaml')
const path = require('path')
const klawSync = require('klaw-sync')

    let source = 'collection'
    const paths = klawSync(source, { nofile: true, depthLimit: 0});
    paths.forEach(e=>{
      console.log(path.basename(e.path))
      updateKO(path.basename(e.path))
    })

function updateKO(id){
  let sourcePath = 'collection/'+id
  let targetPath = 'target/'+id
  fs.ensureDirSync(path.join(targetPath))

  /**  Metadata  **/
  let topMeta = fs.readJsonSync(path.join(sourcePath, 'metadata.json'));
  topMeta.version = 'v1.0'
  topMeta.identifier = topMeta.identifier+'/'+topMeta.version
  topMeta['@id']=topMeta.identifier.replace('ark:/','')
  fs.writeJsonSync(path.join(targetPath, 'metadata.json'), topMeta, {spaces: 4})

  /** Payload **/
  let payloadFiles = topMeta.hasPayload
  if( typeof(payloadFiles) == 'string' ){
      fs.copySync(path.join(sourcePath, payloadFiles), path.join(targetPath, payloadFiles))
  } else {
    payloadFiles.forEach(e=>{
      fs.copySync(path.join(sourcePath, payloadFiles), path.join(targetPath, payloadFiles))
    })
  }

  /** deployment.yaml **/
  const oldDeploymentSpec = yaml.safeLoad(fs.readFileSync(path.join(sourcePath,'deployment.yaml'), 'utf8'), {json:true})
  let deploymentSpec = {}
  Object.keys(oldDeploymentSpec.endpoints).forEach(e=>{
    deploymentSpec[e]={}
    deploymentSpec[e].post={}
    deploymentSpec[e].post.engine='javascript'
    deploymentSpec[e].post.artifact=oldDeploymentSpec.endpoints[e].artifact
    deploymentSpec[e].post.function=oldDeploymentSpec.endpoints[e].entry || oldDeploymentSpec.endpoints[e].function

  })
  // console.log(deploymentSpec)
  fs.writeFileSync(path.join(targetPath, 'deployment.yaml'),
    yaml.safeDump(deploymentSpec, {
      styles: {'!!null': 'canonical',}, // dump null as ~
      sortKeys: false,                   // sort object keys
    })
  )

  /** service.yaml **/
  const oldServiceSpec = yaml.safeLoad(fs.readFileSync(path.join(sourcePath,'service.yaml'), 'utf8'), {json:true})
  let serviceSpec = oldServiceSpec
  serviceSpec.info.version='1.0'
  serviceSpec.servers[0].url = serviceSpec.servers[0].url +'/1.0'
  // console.log(serviceSpec)
  fs.writeFileSync(path.join(targetPath, 'service.yaml'),
    yaml.safeDump(serviceSpec, {
      styles: {'!!null': 'canonical',}, // dump null as ~
      sortKeys: false,                   // sort object keys
    })
  )
}
