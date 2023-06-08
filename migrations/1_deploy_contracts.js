const ReentranceVulnerableVault = artifacts.require('ReentranceVulnerableVault');
const ReentranceAttackContract = artifacts.require('ReentranceAttackContract');

module.exports = function (deployer) {
  deployer.then(async ()=>{
  await deployer.deploy(ReentranceVulnerableVault);
  await deployer.deploy(ReentranceAttackContract,ReentranceVulnerableVault.address)
  });
  
};
