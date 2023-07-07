const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the input's partitionKey if provided as string", () => {
    const event = {partitionKey: "abc"};
    const expectedKey = event.partitionKey;
    const hashKey = deterministicPartitionKey(event);
    expect(hashKey).toBe(expectedKey);
  });

  it("Returns the input's partitionKey as a JSONified string if not a string", () => {
    const event = {partitionKey: {}};
    const expectedKey = "{}";
    const hashKey = deterministicPartitionKey(event);
    expect(hashKey).toBe(expectedKey);
  });

  it.each([
    [{}, crypto.createHash("sha3-512").update("{}").digest("hex")],
    [{"key": "value"}, crypto.createHash("sha3-512").update("{\"key\":\"value\"}").digest("hex")],
  ])("Returns the SHA3-512 hash of input if no partitionKey provided", (event, expectedKey) => {
    const hashKey = deterministicPartitionKey(event);
    expect(hashKey).toBe(expectedKey);
  });

  it("Returns a hashed partitionKey if too long", () => {
    const MAX_PARTITION_KEY_LENGTH = 256;
    const event = {partitionKey: "a".repeat(MAX_PARTITION_KEY_LENGTH + 1)};
    const expectedKey = crypto.createHash("sha3-512").update(event.partitionKey).digest("hex");
    const hashKey = deterministicPartitionKey(event);
    expect(hashKey).toBe(expectedKey);
  });

});
