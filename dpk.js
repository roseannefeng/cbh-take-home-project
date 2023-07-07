const crypto = require("crypto");

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  const MAX_PARTITION_KEY_LENGTH = 256;
  let candidate;

  function shortenCandidate(candid) {
    return crypto.createHash("sha3-512").update(candidate).digest("hex");
  }

  if (!(event)) {
    candidate = TRIVIAL_PARTITION_KEY;
  } else if (typeof event.partitionKey == "string") {
    candidate = event.partitionKey;
    if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
      candidate = shortenCandidate(candidate);
    }
  } else if (event.partitionKey) {
    candidate = JSON.stringify(event.partitionKey);
    if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
      candidate = shortenCandidate(candidate);
    }
  } else {
    const data = JSON.stringify(event);
    candidate = crypto.createHash("sha3-512").update(data).digest("hex");
  }


  return candidate;
};