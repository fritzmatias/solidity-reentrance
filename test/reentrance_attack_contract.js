const ReentranceAttackContract = artifacts.require("ReentranceAttackContract");
const ReentranceVulnerableVault = artifacts.require("ReentranceVulnerableVault");

const logBalances= (addressees)=>{
  addressees.forEach(element => {
    logBalance(element);
  });
}
const logBalance=async (trustedUser1)=>{
    if(trustedUser1.type == null)
      console.log("contract("+trustedUser1.name+"): "+await web3.utils.fromWei(await web3.eth.getBalance(trustedUser1.address),'ether')+"eth");
    else
      console.log("user("+trustedUser1.name+"): "+await web3.utils.fromWei(await web3.eth.getBalance(trustedUser1.address),'ether')+"eth");
}

const deployedNamedContracts= async ()=>{
    let attacker=await ReentranceAttackContract.deployed();
    attacker.name="attacker";
    let vulnerableVaultInstance=await ReentranceVulnerableVault.deployed();
    vulnerableVaultInstance.name="vulnerableVault";
    return {vulnerableVaultInstance,attacker};
}
/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("ReentranceAttackContract", function (accounts) {
    const trustedUser1={
      type: "user",
      name: "trustedUser1",
      address: accounts[1]
    };
    const thief={
      type: "user",
      name: "thief",
      address: accounts[0]
    };

  it("should assert true", async function () {
    await ReentranceAttackContract.deployed();
    return assert.isTrue(true);
  });

  it("should have the thief as owner", async function () {
    const {vulnerableVaultInstance,attacker}=await deployedNamedContracts();
    expect(await attacker.owner()).to.equal(thief.address);
  });

  it("should have ReentranceVulnerableVault's address", async function () {
    const {vulnerableVaultInstance,attacker}=await deployedNamedContracts();
    expect(await attacker.vulnerableVault()).to.equal(vulnerableVaultInstance.address);
  });

  it('should vulnerableVault', async () => {
    const {vulnerableVaultInstance,attacker}=await deployedNamedContracts();
    await console.log("Initial context");
    await logBalances([vulnerableVaultInstance,attacker,trustedUser1,thief]);
    const trustedUserR=await vulnerableVaultInstance.deposit({from: trustedUser1.address, value: await web3.utils.toWei("20","ether")});
    await logBalances([vulnerableVaultInstance,attacker,trustedUser1,thief]);
    expect(trustedUserR.receipt.status).to.equal(true);
  });


  it('should drain eth from vulnerableVault', async () => {
    const {vulnerableVaultInstance,attacker}=await deployedNamedContracts();
    await logBalances([vulnerableVaultInstance,attacker,trustedUser1,thief]);
    const trustedUserR=await vulnerableVaultInstance.deposit({from: trustedUser1.address, value: await web3.utils.toWei("40","ether")});
    await logBalances([vulnerableVaultInstance,attacker,trustedUser1,thief]);
    expect(trustedUserR.receipt.status).to.equal(true);

    const attackResponse=await attacker.attack({from: thief.address, value: await web3.utils.toWei("1","ether")});
    await logBalances([vulnerableVaultInstance,attacker,trustedUser1,thief]);
    expect(attackResponse.receipt.status).to.equal(true);
    const actualThiefIntEthers=Math.trunc(web3.utils.fromWei(await web3.eth.getBalance(thief.address)));
    console.log(actualThiefIntEthers);
    expect(actualThiefIntEthers).to.equal(159); // because side effect from all tests 20+40-fees
  });
});
