const ReentranceVulnerableVault = artifacts.require("ReentranceVulnerableVault");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("ReentranceVulnerableVault", function (/* accounts */) {
  it("should assert true", async function () {
    await ReentranceVulnerableVault.deployed();
    return assert.isTrue(true);
  });
});
