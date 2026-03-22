// ============================================================
// DATOS CENTRALIZADOS DE EPISODIOS TRADUCIDOS
// ============================================================

const GACHA_DATA = {
    chapters: [
        // ========== Capítulo 0 ==========
        {
            chapter: 0,
            title: "Capítulo 0",
            episodes: [
                { num: 0, title: "Gacha Infinita - Parte 1" },
                { num: 1, title: "Gacha Infinita - Parte 2: Tres años después" },
                { num: 2, title: "Gacha Infinita - Parte 3: La venganza contra Garou" }
            ]
        },
        
        // ========== Capítulo 1 ==========
        {
            chapter: 1,
            title: "Capítulo 1",
            episodes: [
                { num: 1, title: "El viaje comienza" },
                { num: 2, title: "Planes de futuro" },
                { num: 3, title: "¿Cómo vengarse de la elfa Sasha?" }
            ]
        }
    ],
    
    // ========== FUNCIONES AUXILIARES ==========
    
    // Obtener todos los episodios en orden
    getAllEpisodes: function() {
        const all = [];
        for (const chapter of this.chapters) {
            for (const ep of chapter.episodes) {
                all.push({
                    chapter: chapter.chapter,
                    chapterTitle: chapter.title,
                    episodeNum: ep.num,
                    title: ep.title,
                    file: `capitulo${chapter.chapter}e${ep.num}.html`
                });
            }
        }
        return all;
    },
    
    // Obtener episodio por capítulo y número de episodio
    getEpisode: function(chapterNum, episodeNum) {
        const chapter = this.chapters.find(c => c.chapter == chapterNum);
        if (!chapter) return null;
        const episode = chapter.episodes.find(e => e.num == episodeNum);
        if (!episode) return null;
        return {
            chapter: chapter.chapter,
            chapterTitle: chapter.title,
            episodeNum: episode.num,
            title: episode.title,
            file: `capitulo${chapter.chapter}e${episode.num}.html`
        };
    },
    
    // Obtener todos los episodios en orden (para navegación secuencial)
    getAllEpisodesOrdered: function() {
        const all = [];
        for (const chapter of this.chapters) {
            for (const ep of chapter.episodes) {
                all.push({
                    chapter: chapter.chapter,
                    chapterTitle: chapter.title,
                    episodeNum: ep.num,
                    title: ep.title,
                    file: `capitulo${chapter.chapter}e${ep.num}.html`
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
