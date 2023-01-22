# Benchmarking Lunr and search-index

This code compares the indexing and search performance of the
[Lunr](https://lunrjs.com) and
[search-index](https://github.com/fergiemcdowall/search-index) open source
full-text in-memory search libraries.

## Preparing sample data

For my own tests I chose 2500 freely available [Blog Articles from the
Department of
Justice](https://www.justice.gov/api/v1/blog_entries.json?pagesize=20).

You can download the JSON arrays 20-50 at a time, then join them with the
following command, using [jq](https://stedolan.github.io/jq/):

```
jq -s '[.[].results[]|{body, changed, created, title, "_id":.uuid }]' blog_*.json > documents.json
```

The data set is a bit messy because it contains HTML tags, some of them
with long identifiers or URLs. I have a hunch that this might bloat the
search index, but on the other hand it's "realistic" data.

## Running the benchmarks

For your research you need to have a JSON file called `documents.json`
with an array of objects. If you're using a different data set, adapt the
field names for the Lunr indexer in [`index_factory.mjs`](index_factory.mjs).
The objects must have an `_id` property that is a unique index, so you can
reference them from the search result.

### Benchmarking the index generation

	node benchmark_index_write.mjs

This will benchmark importing the documents over and over again into freshly
created index objects.

### Benchmarking search performance

	node benchmark_index_search.mjs

This will benchmark searching for the 100 most common words in the English
language over and over again. To make the test run faster (without
affecting the benchmarks), the benchmark will create exported versions of
the indices in the `cache` directory.

### Adapting the size of the data set

Set the constant MAX_DOCUMENTS in the benchmark files to a smaller number
to test the performance with smaller data sets.

## Outcome

The question "which library performs better" is inconclusive. The two
libraries seem to have a trade-off between index size/generation time and
search performance: Lunr is faster at index generation as has a smaller
index, while search-index takes longer to build the index. search-index
queries are faster, but only for larger collections of documents. 

You can the this code as a basis for your own investigation, using your
own data set.


