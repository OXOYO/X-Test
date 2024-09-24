import nodeAbi from 'node-abi'

const getNodeModuleVersion = (nodeVersion = '7.2.0') => {
  const nodeModuleVersion = nodeAbi.getAbi(nodeVersion, 'node')
  console.log('nodeVersion:', nodeVersion, 'nodeModuleVersion:', nodeModuleVersion)
}

const getNodeVersion = (nodeModuleVersion = '51') => {
  const nodeVersion = nodeAbi.getTarget(nodeModuleVersion, 'node')
  console.log('nodeVersion:', nodeVersion, 'nodeModuleVersion:', nodeModuleVersion)
}

const nodeVersionList = [
  // '10.24.1',
  // '10.24.1',
  // '11.12.0',
  // '12.22.12',
  // '14.21.3',
  // '16.20.0',
  // '16.20.2',
  // '18.19.0',
  // '19.5.0',
  // '20.10.0',
  '20.17.0',
  '21.7.3',
  '22.9.0',
]

const nodeModuleVersionList = [
  // '51'
  '115',
  '120',
  // '121',
  // '122',
  // '123',
  // '125'
]

nodeVersionList.forEach(getNodeModuleVersion)
nodeModuleVersionList.forEach(getNodeVersion)

