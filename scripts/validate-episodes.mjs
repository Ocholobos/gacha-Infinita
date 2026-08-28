import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const dataSource = await readFile(path.join(root, 'data.js'), 'utf8');
const dataCode = dataSource.slice(0, dataSource.indexOf('// Responsive layout shared'));
const context = { GACHA_DATA: undefined };
vm.createContext(context);
vm.runInContext(`${dataCode}\nthis.catalog = GACHA_DATA;`, context);

const catalog = context.catalog;
if (!catalog || !Array.isArray(catalog.chapters)) {
    throw new Error('No se pudo leer el catalogo de episodios en data.js.');
}

const catalogEpisodes = catalog.chapters.flatMap(chapter => chapter.episodes.map(episode => ({
    key: `${chapter.num}-${episode.num}`,
    file: `capitulo${chapter.num}e${episode.num}.html`
})));
const errors = [];
const seen = new Set();

for (const episode of catalogEpisodes) {
    if (seen.has(episode.key)) errors.push(`Episodio duplicado en data.js: ${episode.key}`);
    seen.add(episode.key);
    try {
        await readFile(path.join(root, episode.file));
    } catch {
        errors.push(`Falta el archivo declarado en data.js: ${episode.file}`);
    }
}

const htmlFiles = (await readdir(root)).filter(file => /^capitulo\d+e\d+\.html$/.test(file));
const htmlKeys = new Set();
for (const file of htmlFiles) {
    const match = file.match(/^capitulo(\d+)e(\d+)\.html$/);
    const source = await readFile(path.join(root, file), 'utf8');
    const config = source.match(/const CHAPTER_NUM = (\d+);\s*const EPISODE_NUM = (\d+);/);
    const key = `${match[1]}-${match[2]}`;
    if (htmlKeys.has(key)) errors.push(`Archivo duplicado para el episodio: ${key}`);
    htmlKeys.add(key);
    if (!config || `${config[1]}-${config[2]}` !== key) {
        errors.push(`Configuracion incorrecta en ${file}`);
    }
    if (!catalogEpisodes.some(episode => episode.key === key)) {
        errors.push(`HTML no catalogado en data.js: ${file}`);
    }
}

for (const episode of catalogEpisodes) {
    if (!htmlKeys.has(episode.key)) errors.push(`Episodio catalogado sin HTML: ${episode.key}`);
}

if (errors.length) {
    console.error(errors.map(error => `- ${error}`).join('\n'));
    process.exit(1);
}

console.log(`Catalogo valido: ${catalogEpisodes.length} episodios y ${htmlFiles.length} archivos HTML.`);
