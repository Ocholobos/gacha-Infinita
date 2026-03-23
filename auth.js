// ============================================================
// SISTEMA DE AUTENTICACIÓN Y RECOMPENSAS
// ============================================================

// ========== NIVELES Y PUNTOS ==========
const LEVELS = [
    { name: "S", minPoints: 10000, badge: "👑 Leyenda", color: "#ffd700" },
    { name: "A", minPoints: 5000, badge: "🏆 Élite", color: "#c0c0c0" },
    { name: "B", minPoints: 2500, badge: "⭐ Avanzado", color: "#cd7f32" },
    { name: "C", minPoints: 1000, badge: "📖 Lector ávido", color: "#4caf50" },
    { name: "D", minPoints: 500, badge: "📚 Lector", color: "#2196f3" },
    { name: "E", minPoints: 200, badge: "🆕 Principiante", color: "#9c27b0" },
    { name: "F", minPoints: 50, badge: "🌱 Novato", color: "#ff9800" },
    { name: "G", minPoints: 0, badge: "🥚 Recluta", color: "#757575" }
];

// Puntos por acciones
const POINTS = {
    READ_CHAPTER: 10,
    RATE_CHAPTER: 5,
    COMMENT: 3,
    COMMENT_LIKE: 1
};

// ========== REGISTRO ==========
async function registerUser(email, password, username) {
    try {
        // Verificar si el nombre de usuario ya existe
        const existingUsers = await db.collection('users')
            .where('username', '==', username)
            .get();
        
        if (!existingUsers.empty) {
            return { success: false, error: "Este nombre de usuario ya está en uso" };
        }
        
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        await db.collection('users').doc(user.uid).set({
            username: username,
            email: email,
            totalPoints: 0,
            level: "G",
            levelBadge: "🥚 Recluta",
            levelColor: "#757575",
            stats: {
                chaptersRead: 0,
                ratingsGiven: 0,
                commentsWritten: 0,
                likesReceived: 0
            },
            achievements: [],
            readChapters: [],
            ratedChapters: [],
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastActive: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========== INICIO DE SESIÓN ==========
async function loginUser(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        await db.collection('users').doc(user.uid).update({
            lastActive: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========== CERRAR SESIÓN ==========
async function logoutUser() {
    try {
        await auth.signOut();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========== OBTENER PERFIL DE USUARIO ==========
async function getUserProfile(uid = null) {
    try {
        const userId = uid || (auth.currentUser ? auth.currentUser.uid : null);
        if (!userId) return { success: false, error: "No hay usuario autenticado" };
        
        const doc = await db.collection('users').doc(userId).get();
        if (!doc.exists) return { success: false, error: "Usuario no encontrado" };
        
        return { success: true, profile: doc.data(), uid: userId };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========== ACTUALIZAR NIVEL SEGÚN PUNTOS ==========
function calculateLevel(points) {
    for (let i = 0; i < LEVELS.length; i++) {
        if (points >= LEVELS[i].minPoints) {
            return LEVELS[i];
        }
    }
    return LEVELS[LEVELS.length - 1];
}

async function updateUserLevel(uid) {
    const userDoc = await db.collection('users').doc(uid).get();
    const points = userDoc.data().totalPoints;
    const newLevel = calculateLevel(points);
    
    await db.collection('users').doc(uid).update({
        level: newLevel.name,
        levelBadge: newLevel.badge,
        levelColor: newLevel.color
    });
    
    return newLevel;
}

// ========== REGISTRAR LECTURA DE CAPÍTULO ==========
async function registerChapterRead(chapterNum, episodeNum) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "Debes iniciar sesión" };
    
    const readKey = `${chapterNum}_${episodeNum}`;
    const userDoc = await db.collection('users').doc(user.uid).get();
    const alreadyRead = userDoc.data().readChapters || [];
    
    if (alreadyRead.includes(readKey)) {
        return { success: false, error: "Ya leíste este capítulo", alreadyRead: true };
    }
    
    const currentPoints = userDoc.data().totalPoints || 0;
    const newPoints = currentPoints + POINTS.READ_CHAPTER;
    const newStats = { ...(userDoc.data().stats || {}) };
    newStats.chaptersRead = (newStats.chaptersRead || 0) + 1;
    
    await db.collection('users').doc(user.uid).update({
        totalPoints: newPoints,
        stats: newStats,
        readChapters: firebase.firestore.FieldValue.arrayUnion(readKey),
        lastActive: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    const newLevel = await updateUserLevel(user.uid);
    
    return { 
        success: true, 
        pointsGained: POINTS.READ_CHAPTER, 
        newPoints,
        newLevel
    };
}

// ========== REGISTRAR CALIFICACIÓN ==========
async function registerRating(chapterNum, episodeNum, rating) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "Debes iniciar sesión" };
    
    const ratingKey = `${chapterNum}_${episodeNum}`;
    const userDoc = await db.collection('users').doc(user.uid).get();
    const alreadyRated = userDoc.data().ratedChapters || [];
    
    if (alreadyRated.includes(ratingKey)) {
        return { success: false, error: "Ya calificaste este capítulo", alreadyRated: true };
    }
    
    // Guardar calificación en colección independiente
    await db.collection('ratings').add({
        userId: user.uid,
        username: userDoc.data().username,
        chapterNum: chapterNum,
        episodeNum: episodeNum,
        rating: rating,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    const currentPoints = userDoc.data().totalPoints || 0;
    const newPoints = currentPoints + POINTS.RATE_CHAPTER;
    const newStats = { ...(userDoc.data().stats || {}) };
    newStats.ratingsGiven = (newStats.ratingsGiven || 0) + 1;
    
    await db.collection('users').doc(user.uid).update({
        totalPoints: newPoints,
        stats: newStats,
        ratedChapters: firebase.firestore.FieldValue.arrayUnion(ratingKey),
        lastActive: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    const newLevel = await updateUserLevel(user.uid);
    
    return { 
        success: true, 
        pointsGained: POINTS.RATE_CHAPTER, 
        newPoints,
        newLevel
    };
}

// ========== REGISTRAR COMENTARIO ==========
async function registerComment(chapterNum, episodeNum, commentText, username) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "Debes iniciar sesión" };
    
    const commentData = {
        userId: user.uid,
        username: username,
        chapterNum: chapterNum,
        episodeNum: episodeNum,
        text: commentText,
        likes: 0,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    const commentRef = await db.collection('comments').add(commentData);
    
    const userDoc = await db.collection('users').doc(user.uid).get();
    const currentPoints = userDoc.data().totalPoints || 0;
    const newPoints = currentPoints + POINTS.COMMENT;
    const newStats = { ...(userDoc.data().stats || {}) };
    newStats.commentsWritten = (newStats.commentsWritten || 0) + 1;
    
    await db.collection('users').doc(user.uid).update({
        totalPoints: newPoints,
        stats: newStats,
        lastActive: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    const newLevel = await updateUserLevel(user.uid);
    
    return { 
        success: true, 
        commentId: commentRef.id, 
        pointsGained: POINTS.COMMENT,
        newPoints,
        newLevel
    };
}

// ========== DAR LIKE A COMENTARIO ==========
async function likeComment(commentId, commentAuthorId) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "Debes iniciar sesión" };
    
    if (user.uid === commentAuthorId) {
        return { success: false, error: "No puedes dar like a tu propio comentario" };
    }
    
    const commentRef = db.collection('comments').doc(commentId);
    const commentDoc = await commentRef.get();
    const currentLikes = commentDoc.data().likes || 0;
    
    await commentRef.update({
        likes: currentLikes + 1
    });
    
    const authorDoc = await db.collection('users').doc(commentAuthorId).get();
    const currentPoints = authorDoc.data().totalPoints || 0;
    const newPoints = currentPoints + POINTS.COMMENT_LIKE;
    const newStats = { ...(authorDoc.data().stats || {}) };
    newStats.likesReceived = (newStats.likesReceived || 0) + 1;
    
    await db.collection('users').doc(commentAuthorId).update({
        totalPoints: newPoints,
        stats: newStats
    });
    
    await updateUserLevel(commentAuthorId);
    
    return { success: true };
}

// ========== OBTENER COMENTARIOS DE UN CAPÍTULO ==========
async function getComments(chapterNum, episodeNum) {
    try {
        const snapshot = await db.collection('comments')
            .where('chapterNum', '==', chapterNum)
            .where('episodeNum', '==', episodeNum)
            .orderBy('timestamp', 'desc')
            .get();
        
        const comments = [];
        snapshot.forEach(doc => {
            comments.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return { success: true, comments };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========== TABLA DE CLASIFICACIÓN ==========
async function getLeaderboard(limit = 20) {
    try {
        const snapshot = await db.collection('users')
            .orderBy('totalPoints', 'desc')
            .limit(limit)
            .get();
        
        const leaders = [];
        snapshot.forEach(doc => {
            leaders.push({
                uid: doc.id,
                username: doc.data().username,
                totalPoints: doc.data().totalPoints,
                level: doc.data().level,
                levelBadge: doc.data().levelBadge,
                levelColor: doc.data().levelColor,
                stats: doc.data().stats
            });
        });
        
        return { success: true, leaders };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========== OBTENER ESTADÍSTICAS DE USUARIO ==========
async function getUserStats(uid = null) {
    const result = await getUserProfile(uid);
    if (!result.success) return result;
    
    const profile = result.profile;
    const stats = profile.stats || {};
    
    return {
        success: true,
        stats: {
            chaptersRead: stats.chaptersRead || 0,
            ratingsGiven: stats.ratingsGiven || 0,
            commentsWritten: stats.commentsWritten || 0,
            likesReceived: stats.likesReceived || 0,
            totalPoints: profile.totalPoints || 0,
            level: profile.level,
            levelBadge: profile.levelBadge,
            levelColor: profile.levelColor,
            readChapters: profile.readChapters || [],
            ratedChapters: profile.ratedChapters || []
        }
    };
}

// ========== VERIFICAR ESTADO DE AUTENTICACIÓN ==========
function onAuthStateChanged(callback) {
    auth.onAuthStateChanged(user => {
        if (user) {
            getUserProfile(user.uid).then(result => {
                callback({ 
                    loggedIn: true, 
                    user, 
                    profile: result.success ? result.profile : null 
                });
            });
        } else {
            callback({ loggedIn: false, user: null, profile: null });
        }
    });
}
