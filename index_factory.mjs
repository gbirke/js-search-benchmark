import fs from "fs";
import si from 'search-index';
import lunr from 'lunr'
import { MemoryLevel } from 'memory-level';
import stopwords from './stopwords.mjs';

const lunrIndexName = "./cache/idx_lunr.json";
const siIndexName = "./cache/idx_si.json";

export function createLunrIndex(documents) {
	const idx = lunr(function() {
		this.ref('uuid');
		this.field('body');
		this.field('title');
		this.field('created');
		this.field('changed');

		documents.forEach( 
			function( doc ) { 
				this.add(doc)
			},
			this
		);

	})
	return idx;
}

export async function createSearchIndex(documents) {
	const idx = await si({db: MemoryLevel, stopwords});
	await idx.PUT(documents, {stopwords, storeRawDocs: false})
	return idx;
}

export async function createCachedLunrIndex(documents) {
	if (!fs.existsSync(lunrIndexName)) {
		await fs.promises.mkdir('./cache', {recursive: true});
		const lunrIndex =  createLunrIndex(documents);
		const contents = lunrIndex.toJSON();
		await fs.promises.writeFile(lunrIndexName, JSON.stringify(contents), {encoding: 'utf8'});
		return lunrIndex;
	} else {
		const content = await fs.promises.readFile(lunrIndexName, 'utf8');
		return lunr.Index.load( JSON.parse(content) );
	}
}

export async function createCachedSearchIndex(documents) {
	if (!fs.existsSync(siIndexName)) {
		await fs.promises.mkdir('./cache', {recursive: true});
		const idx = await createSearchIndex(documents);
		const data = await idx.EXPORT();
		await fs.promises.writeFile(siIndexName, JSON.stringify(data), {encoding: 'utf8'});
		return idx;
	} else {
		const idx = await si({db: MemoryLevel, stopwords});
		const content = await fs.promises.readFile(siIndexName, 'utf8');
		await idx.IMPORT(JSON.parse(content));
		return idx
	}
}

