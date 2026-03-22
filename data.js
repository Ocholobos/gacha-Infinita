// ============================================================
// DATOS CENTRALIZADOS DE EPISODIOS
// Estructura: Capítulo > Episodio (numeración independiente por capítulo)
// Archivos: capituloXeY.html (X=capítulo, Y=episodio dentro del capítulo)
// ============================================================

const GACHA_DATA = {
    // Lista de capítulos con sus episodios
    chapters: [
        // ========== Capítulo 0 ==========
        {
            num: 0,
            title: "Capítulo 0",
            episodes: [
                { num: 0, title: "Gacha Infinita - Parte 1", date: "17/04/2020 12:00" },
                { num: 1, title: "Gacha Infinita - Parte 2: Tres años después", date: "17/04/2020 12:00" },
                { num: 2, title: "Gacha Infinita - Parte 3: La venganza contra Garou", date: "17/04/2020 12:00" }
            ]
        },
        
        // ========== Capítulo 1 ==========
        {
            num: 1,
            title: "Capítulo 1",
            episodes: [
                { num: 1, title: "El viaje comienza", date: "17/04/2020 12:00" },
                { num: 2, title: "Planes de futuro", date: "17/04/2020 17:00" },
                { num: 3, title: "¿Cómo vengarse de la elfa Sasha?", date: "18/04/2020 12:00" },
                { num: 4, title: "Interrupción", date: "18/04/2020 17:00" }
            ]
        },
        
        // ========== Interludio 1 ==========
        {
            num: "1i",
            title: "Interludio 1",
            episodes: [
                { num: 1, title: "Un día de Nazuna - Parte 1", date: "01/05/2020 17:00" },
                { num: 2, title: "Un día de Nazuna - Parte 2", date: "02/05/2020 12:00" },
                { num: 3, title: "Las demandas de las sirvientas", date: "02/05/2020 17:00" }
            ]
        },
        
        // ========== Capítulo 2: Venganza contra Sasha ==========
        {
            num: 2,
            title: "Capítulo 2: Venganza contra la elfa Sasha",
            episodes: [
                { num: 1, title: "Sasha y su prometido", date: "03/05/2020 12:00" },
                { num: 2, title: "El pasado alcanzado", date: "03/05/2020 17:00" },
                { num: 3, title: "La historia de Sasha", date: "04/05/2020 12:00" },
                { num: 4, title: "Light y Ellie", date: "04/05/2020 17:00" },
                { num: 5, title: "Los Caballeros Blancos 1", date: "05/05/2020 12:00" },
                { num: 6, title: "Los Caballeros Blancos 2", date: "05/05/2020 17:00" },
                { num: 7, title: "La misteriosa torre gigante", date: "06/05/2020 12:00" },
                { num: 8, title: "Aventureros mohicanos", date: "06/05/2020 17:00" },
                { num: 9, title: "Nya~", date: "07/05/2020 12:00" },
                { num: 10, title: "Siguiente acción", date: "07/05/2020 17:00" },
                { num: 11, title: "Leaf VII", date: "08/05/2020 12:00" },
                { num: 12, title: "Thunder Arrow", date: "08/05/2020 17:00" },
                { num: 13, title: "Cada cual con sus intenciones", date: "09/05/2020 12:00" },
                { num: 14, title: "Después de casi 3 años...", date: "09/05/2020 17:00" },
                { num: 15, title: "Conversación con Sasha", date: "10/05/2020 12:00" },
                { num: 16, title: "Tres personas", date: "10/05/2020 17:00" },
                { num: 17, title: "Ice Heat y Suzu", date: "11/05/2020 12:00" },
                { num: 18, title: "Objetivo", date: "11/05/2020 17:00" },
                { num: 19, title: "Nivel 7777", date: "12/05/2020 12:00" },
                { num: 20, title: "Sasha, hacia el bosque", date: "12/05/2020 17:00" },
                { num: 21, title: "Sasha, de reconocimiento", date: "13/05/2020 12:00" },
                { num: 22, title: "Los Caballeros Blancos deciden atacar", date: "13/05/2020 17:00" },
                { num: 23, title: "Reunión de estrategia", date: "14/05/2020 12:00" },
                { num: 24, title: "Preparativos de irrupción", date: "14/05/2020 17:00" },
                { num: 25, title: "Irrupción en la torre", date: "15/05/2020 12:00" },
                { num: 26, title: "Batalla en el primer piso 1", date: "15/05/2020 17:00" },
                { num: 27, title: "Batalla en el primer piso 2", date: "16/05/2020 12:00" },
                { num: 28, title: "Batalla en el primer piso 3", date: "16/05/2020 17:00" },
                { num: 29, title: "Batalla en el segundo piso 1", date: "17/05/2020 12:00" },
                { num: 30, title: "Batalla en el segundo piso 2", date: "17/05/2020 17:00" },
                { num: 31, title: "Batalla en el segundo piso 3", date: "18/05/2020 12:00" },
                { num: 32, title: "Batalla en el tercer piso 1", date: "18/05/2020 17:00" },
                { num: 33, title: "Batalla en el tercer piso 2", date: "19/05/2020 12:00" },
                { num: 34, title: "Reencuentro tras 3 años", date: "19/05/2020 17:00" },
                { num: 35, title: "Encuentro tras 3 años", date: "20/05/2020 12:00" },
                { num: 36, title: "Segunda venganza", date: "20/05/2020 17:00" },
                { num: 37, title: "¿Qué es la desesperación?", date: "21/05/2020 12:00" },
                { num: 38, title: "Gungnir, liberación fase 1", date: "21/05/2020 17:00" },
                { num: 39, title: "El as de Michael", date: "22/05/2020 12:00" },
                { num: 40, title: "Discordia", date: "22/05/2020 17:00" },
                { num: 41, title: "Ataduras de espinas", date: "23/05/2020 12:00" },
                { num: 42, title: "Venganza contra Sasha", date: "23/05/2020 17:00" },
                { num: 43, title: "Nueva información y caída de un reino", date: "24/05/2020 12:00" },
                { num: 44, title: "Reunión danzante", date: "24/05/2020 17:00" },
                { num: 45, title: "La memoria de Leaf VII", date: "25/05/2020 12:00" },
                { num: 46, title: "Declaración de independencia humana", date: "25/05/2020 17:00" },
                { num: 47, title: "Nueva información y...", date: "26/05/2020 12:00" }
            ]
        },
        
        // ========== Interludio 2 ==========
        {
            num: "2i",
            title: "Interludio 2",
            episodes: [
                { num: 1, title: "Pasta de frijol dulce o con granos", date: "26/05/2020 17:00" },
                { num: 2, title: "Baño y secretos", date: "27/05/2020 12:00" },
                { num: 3, title: "La historia de Nemumu", date: "27/05/2020 17:00" }
            ]
        },
        
        // ========== Capítulo 3: Arco del pasado ==========
        {
            num: 3,
            title: "Capítulo 3: Arco del pasado",
            episodes: [
                { num: 1, title: "Light, nivel 15", date: "28/05/2020 12:00" },
                { num: 2, title: "Light, nivel 1000", date: "28/05/2020 17:00" },
                { num: 3, title: "Capítulo del baño", date: "29/05/2020 12:00" },
                { num: 4, title: "Light, alrededor de nivel 3000", date: "29/05/2020 17:00" },
                { num: 5, title: "Light, alrededor de nivel 3000 (2)", date: "30/05/2020 12:00" },
                { num: 6, title: "vs Hydra", date: "30/05/2020 17:00" },
                { num: 7, title: "Light, nivel 3500", date: "31/05/2020 12:00" },
                { num: 8, title: "Calabozo 'Abismo', año 1", date: "31/05/2020 17:00" },
                { num: 9, title: "Light, nivel 7000", date: "01/06/2020 12:00" },
                { num: 10, title: "Calabozo 'Abismo', alrededor del año 2", date: "01/06/2020 17:00" },
                { num: 11, title: "Regreso a casa 1", date: "02/06/2020 12:00" },
                { num: 12, title: "Regreso a casa 2", date: "02/06/2020 17:00" }
            ]
        },
        
        // ========== Extra 3 ==========
        {
            num: "3e",
            title: "Extras del Capítulo 3",
            episodes: [
                { num: 1, title: "Extra 1", date: "03/06/2020 12:00" },
                { num: 2, title: "Extra 2", date: "03/06/2020 17:00" }
            ]
        },
        
        // ========== Capítulo 4: Reino Humano ==========
        {
            num: 4,
            title: "Capítulo 4: Reino Humano",
            episodes: [
                { num: 1, title: "Justicia Azul", date: "04/06/2020 12:00" },
                { num: 2, title: "El paradero de Yume", date: "04/06/2020 17:00" },
                { num: 3, title: "Inspección a la gran torre", date: "05/06/2020 12:00" }
            ]
        },
        
        // ========== Arco de Nano (Interludio especial) ==========
        {
            num: "nano",
            title: "Arco de Nano: La espada prohibida",
            episodes: [
                { num: 1, title: "Nano y la espada prohibida - Introducción", date: "12/06/2020 12:00" },
                { num: 2, title: "Nano y la espada prohibida 1", date: "12/06/2020 12:00" },
                { num: 3, title: "Nano y la espada prohibida 2", date: "12/06/2020 17:00" },
                { num: 4, title: "Nano y la espada prohibida 3", date: "13/06/2020 12:00" },
                { num: 5, title: "Nano y la espada prohibida 4", date: "13/06/2020 17:00" },
                { num: 6, title: "Nano y la espada prohibida 5", date: "14/06/2020 12:00" },
                { num: 7, title: "Nano y la espada prohibida 6", date: "14/06/2020 17:00" },
                { num: 8, title: "Nano y la espada prohibida 7", date: "15/06/2020 12:00" },
                { num: 9, title: "Nano y la espada prohibida 8", date: "15/06/2020 17:00" },
                { num: 10, title: "Nano y la espada prohibida 9", date: "16/06/2020 12:00" },
                { num: 11, title: "Nano y la espada prohibida 10", date: "16/06/2020 17:00" },
                { num: 12, title: "Nano y la espada prohibida 11", date: "17/06/2020 12:00" },
                { num: 13, title: "Nano y la espada prohibida 12", date: "17/06/2020 17:00" },
                { num: 14, title: "Nano y la espada prohibida 13", date: "18/06/2020 12:00" },
                { num: 15, title: "Nano y la espada prohibida 14", date: "18/06/2020 17:00" },
                { num: 16, title: "Nano y la espada prohibida 15", date: "19/06/2020 12:00" },
                { num: 17, title: "Nano y la espada prohibida 16", date: "19/06/2020 17:00" },
                { num: 18, title: "Nano y la espada prohibida 17", date: "20/06/2020 12:00" },
                { num: 19, title: "Nano y la espada prohibida 18", date: "20/06/2020 17:00" },
                { num: 20, title: "Nano y la espada prohibida 19", date: "21/06/2020 12:00" },
                { num: 21, title: "Nano y la espada prohibida 20", date: "21/06/2020 17:00" },
                { num: 22, title: "Nano y la espada prohibida 21", date: "22/06/2020 12:00" }
            ]
        }
    ],
    
    // ========== FUNCIONES AUXILIARES ==========
    
    // Generar nombre de archivo
    getFileName: function(chapterNum, episodeNum) {
        return `capitulo${chapterNum}e${episodeNum}.html`;
    },
    
    // Obtener todos los episodios con su información completa
    getAllEpisodes: function() {
        const all = [];
        for (const chapter of this.chapters) {
            for (const ep of chapter.episodes) {
                all.push({
                    chapter: chapter.num,
                    chapterTitle: chapter.title,
                    episodeNum: ep.num,
                    title: ep.title,
                    date: ep.date,
                    file: `capitulo${chapter.num}e${ep.num}.html`
                });
            }
        }
        return all;
    },
    
    // Obtener episodio por capítulo y número de episodio
    getEpisode: function(chapterNum, episodeNum) {
        const chapter = this.chapters.find(c => c.num == chapterNum);
        if (!chapter) return null;
        const episode = chapter.episodes.find(e => e.num == episodeNum);
        if (!episode) return null;
        return {
            chapter: chapter.num,
            chapterTitle: chapter.title,
            episodeNum: episode.num,
            title: episode.title,
            date: episode.date,
            file: `capitulo${chapter.num}e${episode.num}.html`
        };
    },
    
    // Obtener todos los episodios en orden (para navegación secuencial)
    getAllEpisodesOrdered: function() {
        const all = [];
        for (const chapter of this.chapters) {
            for (const ep of chapter.episodes) {
                all.push({
                    chapter: chapter.num,
                    chapterTitle: chapter.title,
                    episodeNum: ep.num,
                    title: ep.title,
                    date: ep.date,
                    file: `capitulo${chapter.num}e${ep.num}.html`
                });
            }
        }
        return all;
    },
    
    // Obtener índice de un episodio en la lista ordenada
    getIndex: function(chapterNum, episodeNum) {
        const all = this.getAllEpisodesOrdered();
        return all.findIndex(ep => ep.chapter == chapterNum && ep.episodeNum == episodeNum);
    },
    
    // Obtener episodio anterior
    getPrevEpisode: function(chapterNum, episodeNum) {
        const all = this.getAllEpisodesOrdered();
        const idx = this.getIndex(chapterNum, episodeNum);
        if (idx > 0) return all[idx - 1];
        return null;
    },
    
    // Obtener episodio siguiente
    getNextEpisode: function(chapterNum, episodeNum) {
        const all = this.getAllEpisodesOrdered();
        const idx = this.getIndex(chapterNum, episodeNum);
        if (idx < all.length - 1) return all[idx + 1];
        return null;
    }
};
