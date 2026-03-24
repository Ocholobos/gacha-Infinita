// ============================================================
// DATOS CENTRALIZADOS DE EPISODIOS TRADUCIDOS
// ============================================================

const GACHA_DATA = {
    chapters: [
        // ========== 0章 ==========
        {
            num: 0,
            title: "Capítulo 0",
            episodes: [
                { num: 0, title: "Gacha Infinita - Parte 1", date: "17/04/2020 12:00" },
                { num: 1, title: "Gacha Infinita - Parte 2: Tres años después", date: "17/04/2020 12:00" },
                { num: 2, title: "Gacha Infinita - Parte 3: La venganza contra Garou", date: "17/04/2020 12:00" }
            ]
        },
        
        // ========== 1章 ==========
        {
            num: 1,
            title: "Capítulo 1",
            episodes: [
                { num: 1, title: "El viaje comienza", date: "17/04/2020 12:00" },
                { num: 2, title: "Planes de futuro", date: "17/04/2020 17:00" },
                { num: 3, title: "¿Cómo vengarse de la elfa Sasha?", date: "18/04/2020 12:00" },
                { num: 4, title: "Interrupción", date: "18/04/2020 17:00" },
                { num: 5, title: "Dentro del calabozo", date: "19/04/2020 12:00" },
                { num: 6, title: "Límites del crecimiento", date: "19/04/2020 17:00" },
                { num: 7, title: "Jóvenes aventureros", date: "20/04/2020 12:00" },
                { num: 8, title: "Combate en el calabozo", date: "20/04/2020 17:00" }
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
