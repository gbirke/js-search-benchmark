import fs from "fs";
import Benchmark from 'benchmark';
import { searchterms } from './searchterms.mjs';
import { createCachedLunrIndex, createCachedSearchIndex } from './index_factory.mjs';

const MAX_DOCUMENTS = 3000;

const documents = JSON.parse(fs.readFileSync('documents.json', 'utf-8')).slice(0, MAX_DOCUMENTS);

const suite = new Benchmark.Suite();

const lunrIndex = await createCachedLunrIndex(documents);
const searchIndex = await createCachedSearchIndex(documents);

suite.add('Lunr search', function() { 
		searchterms.map(t => lunrIndex.search(t)) 
	})
	.add('search-index search', {
		defer: true,
		fn: function(deferred) {
			Promise.all( searchterms.map( t => searchIndex.QUERY(t) ))
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

