// src/services/sqlite/SQLiteService.ts

import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "AppData.db";
const database_version = "1.0";
const database_displayname = "SQLite Offline Data Storage";
const database_size = 200000;

let db: SQLite.SQLiteDatabase;

// Function to open the database
export const openDatabase = async () => {
    try {
        if (!db) {
            db = await SQLite.openDatabase(
                database_name,
                database_version,
                database_displayname,
                database_size
            );
            console.log("Database opened");
        }
        return db;
    } catch (error) {
        console.error("Failed to open database: ", error);
        throw error;
    }
};


// Function to close the database
export const closeDatabase = async () => {
    if (db) {
        await db.close();
        console.log("Database closed");
    } else {
        console.log("Database was not opened");
    }
};

// Function to create tables based on your MySQL schema
export const createTables = async () => {
    try {
        await db.transaction((tx: any) => {
            // Categories Table
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS categories (
                    id INTEGER PRIMARY KEY NOT NULL,
                    title TEXT,
                    image TEXT,
                    parent INTEGER DEFAULT 0,
                    description TEXT
                );`
            );

            // Banners Table
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS banners (
                    id INTEGER PRIMARY KEY NOT NULL,
                    title TEXT,
                    image TEXT,
                    url TEXT
                );`
            );

            // Topics Table
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS topics (
                id INTEGER PRIMARY KEY,
                title TEXT,
                description TEXT,
                categorytitle TEXT,
                questionsLength INTEGER,
                totalScore INTEGER,
                image TEXT,
                localImagePath TEXT
                );`
            );

            // Questions Table
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS questions (
                    id INTEGER PRIMARY KEY NOT NULL,
                    title TEXT,
                    option_1 TEXT,
                    option_2 TEXT,
                    option_3 TEXT,
                    option_4 TEXT,
                    correct INTEGER DEFAULT 0,
                    explanation TEXT,
                    score INTEGER,
                    story TEXT,
                    category INTEGER DEFAULT 0,
                    topic INTEGER DEFAULT 0,
                    difficulty INTEGER DEFAULT 0,
                    link TEXT
                );`
            );

            // Users Table
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY NOT NULL,
                    fullname TEXT,
                    age TEXT,
                    relationship TEXT,
                    email TEXT,
                    phone TEXT,
                    nickname TEXT,
                    password TEXT,
                    icon INTEGER DEFAULT 0,
                    badge INTEGER DEFAULT 0,
                    premium INTEGER DEFAULT 0
                );`
            );

            // UserQuizProgress Table
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS UserQuizProgress (
                    id INTEGER PRIMARY KEY NOT NULL,
                    UserID INTEGER,
                    QuizID INTEGER,
                    Score INTEGER,
                    CorrectAnswers INTEGER,
                    TotalQuestions INTEGER,
                    QuizData TEXT,
                    datetime TEXT,
                    synced INTEGER DEFAULT 0
                );`
            );

            // User Responses Table
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS user_responses (
                    id INTEGER PRIMARY KEY NOT NULL,
                    user INTEGER DEFAULT 0,
                    question INTEGER DEFAULT 0,
                    category INTEGER DEFAULT 0,
                    topic INTEGER DEFAULT 0,
                    date TEXT,
                    selected_option_id INTEGER DEFAULT 0,
                    is_correct INTEGER DEFAULT 0
                );`
            );

            // Admin Table
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS admin (
                    id INTEGER PRIMARY KEY NOT NULL,
                    email TEXT NOT NULL,
                    password TEXT NOT NULL,
                    school_code TEXT,
                    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    status INTEGER NOT NULL,
                    android_url TEXT NOT NULL,
                    ios_url TEXT NOT NULL,
                    version INTEGER NOT NULL DEFAULT 1,
                    cbse_link TEXT,
                    ncert TEXT,
                    google_form TEXT,
                    disable_delete INTEGER NOT NULL DEFAULT 0
                );`
            );

            // UserIcons Table
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS usericons (
                    id INTEGER PRIMARY KEY NOT NULL,
                    title TEXT,
                    image TEXT,
                    premium INTEGER DEFAULT 0
                );`
            );

            //quiz results
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS quiz_results (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    userID TEXT,
                    quizId INTEGER,
                    score INTEGER,
                    correctAnswers INTEGER,
                    totalQuestions INTEGER,
                    questions TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                );`
            );
            
        });
        console.log("Tables created successfully");
    } catch (error) {
        console.error("Error creating tables: ", error);
        throw error;
    }
};

// Insert functions for each table
export const insertCategories = async (categories: any[]) => {
    try {
        await db.transaction((tx: any) => {
            categories.forEach(category => {
                tx.executeSql(
                    `INSERT OR REPLACE INTO categories (id, title, image, parent, description) VALUES (?, ?, ?, ?, ?)`,
                    [category.id, category.title, category.image, category.parent, category.description]
                );
            });
        });
        console.log("Categories inserted successfully");
    } catch (error) {
        console.error("Error inserting categories: ", error);
        throw error;
    }
};

export const insertBanners = async (banners: any[]) => {
    try {
        await db.transaction((tx: any) => {
            banners.forEach(banner => {
                tx.executeSql(
                    `INSERT OR REPLACE INTO banners (id, title, image, url) VALUES (?, ?, ?, ?)`,
                    [banner.id, banner.title, banner.image, banner.url]
                );
            });
        });
        console.log("Banners inserted successfully");
    } catch (error) {
        console.error("Error inserting banners: ", error);
        throw error;
    }
};

export const insertTopics = async (topics: any[]) => {
    try {
        await db.transaction((tx: any) => {
            topics.forEach(topic => {
                tx.executeSql(
                    `INSERT OR REPLACE INTO topics (id, category, title, description, image) VALUES (?, ?, ?, ?, ?)`,
                    [topic.id, topic.category, topic.title, topic.description, topic.image]
                );
            });
        });
        console.log("Topics inserted successfully");
    } catch (error) {
        console.error("Error inserting topics: ", error);
        throw error;
    }
};

// Similarly, create insert functions for other tables as needed

// Fetch functions for each table
export const getCategories = async (): Promise<any[]> => {
    try {
        let results: any[] = [];
        await db.transaction((tx: any) => {
            tx.executeSql(
                "SELECT * FROM categories",
                [],
                (tx: any, resultsSet: any) => {
                    for (let i = 0; i < resultsSet.rows.length; i++) {
                        results.push(resultsSet.rows.item(i));
                    }
                }
            );
        });
        return results;
    } catch (error) {
        console.error("Error fetching categories: ", error);
        throw error;
    }
};

export const getBanners = async (): Promise<any[]> => {
    try {
        let results: any[] = [];
        await db.transaction((tx: any) => {
            tx.executeSql(
                "SELECT * FROM banners",
                [],
                (tx: any, resultsSet: any) => {
                    for (let i = 0; i < resultsSet.rows.length; i++) {
                        results.push(resultsSet.rows.item(i));
                    }
                }
            );
        });
        return results;
    } catch (error) {
        console.error("Error fetching banners: ", error);
        throw error;
    }
};

export const getTopics = async (): Promise<any[]> => {
    try {
        let results: any[] = [];
        await db.transaction((tx: any) => {
            tx.executeSql(
                "SELECT * FROM topics",
                [],
                (tx: any, resultsSet: any) => {
                    for (let i = 0; i < resultsSet.rows.length; i++) {
                        results.push(resultsSet.rows.item(i));
                    }
                }
            );
        });
        return results;
    } catch (error) {
        console.error("Error fetching topics: ", error);
        throw error;
    }
};


// Insert function for UserQuizProgress
export const insertUserQuizProgress = async (progress: any) => {
    try {
        await db.transaction((tx: any) => {
            tx.executeSql(
                `INSERT INTO UserQuizProgress (UserID, QuizID, Score, CorrectAnswers, TotalQuestions, QuizData, datetime) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    progress.UserID,
                    progress.QuizID,
                    progress.Score,
                    progress.CorrectAnswers,
                    progress.TotalQuestions,
                    JSON.stringify(progress.QuizData),
                    progress.datetime
                ]
            );
        });
        console.log("UserQuizProgress inserted successfully");
    } catch (error) {
        console.error("Error inserting UserQuizProgress: ", error);
        throw error;
    }
};

// Fetch unsynced UserQuizProgress
export const getUnsyncedUserQuizProgress = async (): Promise<any[]> => {
    try {
        let results: any[] = [];
        await db.transaction((tx: any) => {
            tx.executeSql(
                "SELECT * FROM UserQuizProgress WHERE synced = 0", // Add 'synced' column to track sync status
                [],
                (tx: any, resultsSet: any) => {
                    for (let i = 0; i < resultsSet.rows.length; i++) {
                        results.push(resultsSet.rows.item(i));
                    }
                }
            );
        });
        return results;
    } catch (error) {
        console.error("Error fetching unsynced UserQuizProgress: ", error);
        throw error;
    }
};


// Update sync status after successful sync
export const markUserQuizProgressAsSynced = async (id: number) => {
    try {
        await db.transaction((tx: any) => {
            tx.executeSql(
                "UPDATE UserQuizProgress SET synced = 1 WHERE id = ?",
                [id]
            );
        });
        console.log(`UserQuizProgress with id ${id} marked as synced`);
    } catch (error) {
        console.error("Error marking UserQuizProgress as synced: ", error);
        throw error;
    }
};

// Similarly, create fetch functions for other tables as needed

export const insertTopic = async (topic: any) => {
    const db = await openDatabase();
    await db.transaction(async (tx) => {
        tx.executeSql(
            'INSERT OR REPLACE INTO topics (id, title, description, categorytitle, questionsLength, totalScore, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                topic.id,
                topic.title || null, // Use null if title is not provided
                topic.description || null, // Use null if description is not provided
                topic.categorytitle || null, // Use null if categorytitle is not provided
                topic.questionsLength || null, // Use null if questionsLength is not provided
                topic.totalScore || null, // Use null if totalScore is not provided
                topic.image || null // Use null if image is not provided
            ]
        );
    });
};


export const getTopicById = async (id: any) => {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM topics WHERE id = ?',
                [id],
                (tx, results) => {
                    if (results.rows.length > 0) {
                        resolve(results.rows.item(0));
                    } else {
                        resolve(null);
                    }
                },
                (tx, error) => {
                    reject(error);
                }
            );
        });
    });
};

export const insertQuestions = async (questions: any) => {
    try {
        await db.transaction(async (tx) => {
            const promises = questions.map((question: any) => {
                return new Promise((resolve, reject) => {
                    tx.executeSql(
                        `INSERT OR REPLACE INTO questions 
                        (id, title, option_1, option_2, option_3, option_4, correct, explanation, score, story, category, topic, difficulty, link) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            question.id,
                            question.title,
                            question.options[0],
                            question.options[1],
                            question.options[2],
                            question.options[3],
                            question.correctAnswer + 1, // Assuming correctAnswer is zero-indexed
                            question.explanation,
                            question.score,
                            question.story,
                            question.category || 0,  // Ensure category is passed or defaults to 0
                            question.topic || 0,      // Ensure topic is passed or defaults to 0
                            question.difficulty || 0,  // Ensure difficulty is passed or defaults to 0
                            question.link
                        ],
                        (_, result) => {
                            resolve(result);
                        },
                        (_, error) => {
                            console.error("Error executing SQL: ", error);
                            reject(error);
                        }
                    );
                });
            });
            await Promise.all(promises);
        });
        console.log("Questions inserted successfully");
    } catch (error) {
        console.error("Error inserting questions: ", error);
        throw error;
    }
};


export const getQuestionsByTopicId = async (topicId: number) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM questions WHERE topic = ?`,
                [topicId],
                (_, result) => {
                    const questions = [];
                    for (let i = 0; i < result.rows.length; i++) {
                        questions.push(result.rows.item(i));
                    }
                    resolve(questions);
                },
                (_, error) => {
                    console.error("Error fetching questions: ", error);
                    reject(error);
                }
            );
        });
    });
};



// Save quiz result to local database
export const saveQuizResultToLocalDatabase = async (result: any) => {
    try {
        const db = await openDatabase();
        await db.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO quiz_results (userID, quizId, score, correctAnswers, totalQuestions, questions) VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    result.userID,
                    result.quizId,
                    result.score,
                    result.correctAnswers,
                    result.totalQuestions,
                    JSON.stringify(result.questions), // Convert questions to JSON string
                ]
            );
        });
        console.log("Quiz result saved locally");
    } catch (error) {
        console.error("Error saving quiz result to local database: ", error);
    }
};

// Load quiz results from local database
export const loadQuizResultsFromLocalDatabase = async (userID: string) => {
    try {
        const db = await openDatabase();
        const results: any = await new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    `SELECT * FROM quiz_results WHERE userID = ?`,
                    [userID],
                    (_, { rows }) => resolve(rows._array), // returns an array of results
                    (_, error) => reject(error)
                );
            });
        });
        console.log("Fetched quiz results:", results);
        return results;
    } catch (error) {
        console.error("Error fetching quiz results from local database: ", error);
    }
};

export const upsertUserProfile = async (profile: any) => {
    try {
        await db.transaction((tx: any) => {
            tx.executeSql(
                `INSERT OR REPLACE INTO users (id, fullname, age, relationship, email, phone, nickname, password, icon, badge, premium) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    profile.id,
                    profile.fullname,
                    profile.age,
                    profile.relationship,
                    profile.email,
                    profile.phone,
                    profile.nickname,
                    profile.password,
                    profile.icon || 0,
                    profile.badge || 0,
                    profile.premium || 0
                ]
            );
        });
        console.log("User profile saved successfully");
    } catch (error) {
        console.error("Error saving user profile: ", error);
        throw error;
    }
};

export const getUserProfileById = async (userId: number) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM users WHERE id = ?',
                [userId],
                (tx, results) => {
                    if (results.rows.length > 0) {
                        resolve(results.rows.item(0));
                    } else {
                        resolve(null);
                    }
                },
                (tx, error) => {
                    reject(error);
                }
            );
        });
    });
};


export const deleteUserProfile = async (userId: number) => {
    try {
        await db.transaction((tx: any) => {
            tx.executeSql(
                'DELETE FROM users WHERE id = ?',
                [userId]
            );
        });
        console.log("User profile deleted successfully");
    } catch (error) {
        console.error("Error deleting user profile: ", error);
        throw error;
    }
};
