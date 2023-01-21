# Benchmarking Lunr and search-index

This code compares the indexing and search performance of the [Lunr](https://lunrjs.com) and [search-index](https://github.com/fergiemcdowall/search-index) open source full-text in-memory search libraries.

## Preparing sample data

I chose the [Blog Articles of the Department of
Justice](https://www.justice.gov/api/v1/blog_entries.json?pagesize=20).
Download the JSON arrays 20-50 at a time, then join them with the
following command, using [jq](https://stedolan.github.io/jq/):

```
jq -s '[.[].results[]|{body, changed, created, title, uuid }]' blog_*.json > documents.json
```

The data set is a bit messy because it contains HTML tags, some of them
with long identifiers or URLs.

## Running the benchmarks

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

## Outcome

I've run this only on one machine, YMMV. The two libraries seem to have
a trade-off between index size/generation time and search performance.
Lunr is faster at index generation as has a smaller index, while
search-index takes longer to build the index. search-index queries are
faster.



