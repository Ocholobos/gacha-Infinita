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

// Emails de administradores (CAMBIAR POR TU EMAIL)
const ADMIN_EMAILS = ['carlos8a10@yahoo.com']; // AÑADE TU EMAIL AQUÍ

// ========== FUNCIONES DE AUTENTICACIÓN ==========

// Registrar nuevo usuario
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

// Iniciar sesión
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

// Cerrar sesión
async function logoutUser() {
    try {
        await auth.signOut();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Obtener perfil de usuario
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

// Verificar si un usuario es administrador
function isAdmin(user) {
    if (!user || !user.email) return false;
    return ADMIN_EMAILS.includes(user.email);
}

// ========== FUNCIONES DE NIVELES ==========

// Calcular nivel según puntos
function calculateLevel(points) {
    for (let i = 0; i < LEVELS.length; i++) {
        if (points >= LEVELS[i].minPoints) {
            return LEVELS[i];
        }
    }
    return LEVELS[LEVELS.length - 1];
}

// Actualizar nivel del usuario
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

// ========== FUNCIONES DE RECOMPENSAS ==========

// Registrar lectura de capítulo
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

// Registrar calificación
async function registerRating(chapterNum, episodeNum, rating) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "Debes iniciar sesión" };
    
    const ratingKey = `${chapterNum}_${episodeNum}`;
    const userDoc = await db.collection('users').doc(user.uid).get();
    const alreadyRated = userDoc.data().ratedChapters || [];
    
    if (alreadyRated.includes(ratingKey)) {
        return { success: false, error: "Ya calificaste este capítulo", alreadyRated: true };
    }
    
    // Guardar calificación
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

// Registrar comentario
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
        reports: 0,
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

// Dar like a comentario
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

// Obtener comentarios de un capítulo
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

// ========== FUNCIONES DE MODERACIÓN ==========

// Reportar un comentario
async function reportComment(commentId, reason, reportedBy) {
    try {
        const commentRef = db.collection('comments').doc(commentId);
        const commentDoc = await commentRef.get();
        
        if (!commentDoc.exists) {
            return { success: false, error: "El comentario no existe" };
        }
        
        // No permitir reportar el propio comentario
        if (commentDoc.data().userId === reportedBy) {
            return { success: false, error: "No puedes reportar tu propio comentario" };
        }
        
        // Verificar si el usuario ya reportó este comentario
        const existingReports = await db.collection('reports')
            .where('commentId', '==', commentId)
            .where('reportedBy', '==', reportedBy)
            .get();
        
        if (!existingReports.empty) {
            return { success: false, error: "Ya reportaste este comentario anteriormente" };
        }
        
        // Incrementar contador de reportes en el comentario
        const currentReports = commentDoc.data().reports || 0;
        await commentRef.update({
            reports: currentReports + 1
        });
        
        // Añadir reporte
        await db.collection('reports').add({
            commentId: commentId,
            commentData: commentDoc.data(),
            reason: reason,
            reportedBy: reportedBy,
            reportedAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'pending' // pending, reviewed, dismissed
        });
        
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Obtener comentarios reportados (solo admin)
async function getReportedComments() {
    try {
        const snapshot = await db.collection('reports')
            .where('status', '==', 'pending')
            .orderBy('reportedAt', 'desc')
            .get();
        
        const reports = [];
        snapshot.forEach(doc => {
            reports.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return { success: true, reports };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Eliminar un comentario (solo admin)
async function deleteComment(commentId, reportId = null) {
    try {
        // Eliminar el comentario
        await db.collection('comments').doc(commentId).delete();
        
        // Si viene de un reporte, marcarlo como revisado
        if (reportId) {
            await db.collection('reports').doc(reportId).update({
                status: 'reviewed',
                reviewedAt: firebase.firestore.FieldValue.serverTimestamp(),
                action: 'deleted'
            });
        }
        
        // Buscar y marcar otros reportes del mismo comentario
        const otherReports = await db.collection('reports')
            .where('commentId', '==', commentId)
            .where('status', '==', 'pending')
            .get();
        
        const batch = db.batch();
        otherReports.forEach(doc => {
            batch.update(doc.ref, { 
                status: 'reviewed', 
                action: 'deleted',
                reviewedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
        await batch.commit();
        
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Ignorar un reporte (marcarlo como revisado sin eliminar)
async function dismissReport(reportId) {
    try {
        await db.collection('reports').doc(reportId).update({
            status: 'reviewed',
            reviewedAt: firebase.firestore.FieldValue.serverTimestamp(),
            action: 'dismissed'
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Obtener conteo de reportes pendientes (para notificación)
async function getPendingReportsCount() {
    try {
        const snapshot = await db.collection('reports')
            .where('status', '==', 'pending')
            .get();
        return { success: true, count: snapshot.size };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ========== FUNCIONES DE ESTADÍSTICAS ==========

// Obtener estadísticas del usuario
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

// Tabla de clasificación
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

// ========== ESTADO DE AUTENTICACIÓN ==========

// Escuchar cambios de autenticación
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
