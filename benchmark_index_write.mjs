import fs from "fs";
import Benchmark from 'benchmark';
import { createLunrIndex, createSearchIndex } from './index_factory.mjs';

const MAX_DOCUMENTS = 3000;

const documents = JSON.parse(fs.readFileSync('documents.json', 'utf-8')).slice(0, MAX_DOCUMENTS);

const suite = new Benchmark.Suite()

suite.add('Lunr create index', 	function() { createLunrIndex(documents); })
	.add('search-index create index', {
		defer: true,
		fn: function(deferred) {
			createSearchIndex(documents).then((idx) => idx.INDEX.STORE.close())
			.then(() => deferred.resolve())
		}
	})
	.on('cycle', function(event) {
		console.log(String(event.target));
	})
	.on('complete', function() {
		console.log('Fastest is ' + this.filter('fastest').map('name'));
	})
	.run({async: true});

