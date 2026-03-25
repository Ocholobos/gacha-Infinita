// ============================================================
// DATOS CENTRALIZADOS DE EPISODIOS TRADUCIDOS
// Última actualización: 24/03/2026 21:25
// ============================================================

const GACHA_DATA = {
    chapters: [
    {
        'num': 0,
        'title': 'Prólogo: Gacha Infinita',
        'episodes': [
            {
                'num': 0,
                'title': 'Gacha Infinita - Parte 1',
                'date': '2020/04/17 12:00'
            },
            {
                'num': 1,
                'title': 'Tres años después',
                'date': '2020/04/17 12:00'
            },
            {
                'num': 2,
                'title': 'La venganza contra Garou',
                'date': '2020/04/17 12:00'
            }
        ]
    },
    {
        'num': 1,
        'title': 'Comienzo de la venganza',
        'episodes': [
            {
                'num': 1,
                'title': 'El viaje comienza',
                'date': '2020/04/17 12:00'
            },
            {
                'num': 2,
                'title': 'Planes de futuro',
                'date': '2020/04/17 17:00'
            },
            {
                'num': 3,
                'title': '¿Cómo vengarse de la elfa Sasha?',
                'date': '2020/04/18 12:00'
            },
            {
                'num': 4,
                'title': 'Interrupción',
                'date': '2020/04/18 17:00'
            },
            {
                'num': 5,
                'title': 'Dentro del calabozo',
                'date': '2020/04/19 12:00'
            },
            {
                'num': 6,
                'title': 'Límites del crecimiento',
                'date': '2020/04/19 17:00'
            },
            {
                'num': 7,
                'title': 'Jóvenes aventureros',
                'date': '2020/04/20 12:00'
            },
            {
                'num': 8,
                'title': 'Combate en el calabozo',
                'date': '2020/04/20 17:00'
            },
            {
                'num': 9,
                'title': 'Ducado de Six',
                'date': '2020/04/21 12:00'
            },
            {
                'num': 10,
                'title': 'Intercambio de piedras mágicas',
                'date': '2020/04/21 17:00'
            },
            {
                'num': 11,
                'title': 'Inculcando el espíritu caballeresco',
                'date': '2020/04/22 12:00'
            }
        ]
    }
],
    
    // ========== FUNCIONES AUXILIARES ==========
    
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
    
    getIndex: function(chapterNum, episodeNum) {
        const all = this.getAllEpisodesOrdered();
        return all.findIndex(ep => ep.chapter == chapterNum && ep.episodeNum == episodeNum);
    },
    
    getPrevEpisode: function(chapterNum, episodeNum) {
        const all = this.getAllEpisodesOrdered();
        const idx = this.getIndex(chapterNum, episodeNum);
        if (idx > 0) return all[idx - 1];
        return null;
    },
    
    getNextEpisode: function(chapterNum, episodeNum) {
        const all = this.getAllEpisodesOrdered();
        const idx = this.getIndex(chapterNum, episodeNum);
        if (idx < all.length - 1) return all[idx + 1];
        return null;
    }
};
