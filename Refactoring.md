# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

My understanding of determinsticPartitionKey is that it tries to extract a partitionKey from the input so that it is passed either a valid partitionKey, or it will use the input itself to generate a new partitionKey. With that in mind, I refactored the function so that it was not using two separate sets of conditions, since they are actually the same set of results and do not need to be handled sequentially. It is easier to follow a single set of conditionals to understand what different kinds of input we expect and how they are handled differently. While the check for partitionKey length is still in a separate conditional, this is more readable because it is clear that this is a completely separate block of logic than the first block to define candidate in the first place.
