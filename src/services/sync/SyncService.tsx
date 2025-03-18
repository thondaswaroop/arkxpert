// src/services/sync/SyncService.ts

import { getUnsyncedUserQuizProgress, markUserQuizProgressAsSynced } from '../sqlite/SQLiteService';
import { httpService } from '../api/Api';
import { loggerService } from '../../utils/CommonUtils';

export const syncUserQuizProgress = async () => {
    try {
        const unsyncedProgress = await getUnsyncedUserQuizProgress();
        if (!unsyncedProgress || unsyncedProgress.length === 0) {
            console.log("No unsynced UserQuizProgress found");
            return;
        }

        const syncPromises = unsyncedProgress.map(async (progress) => {
            try {
                const response: any = await httpService.post('syncUserQuizProgress', {
                    UserID: progress.UserID,
                    QuizID: progress.QuizID,
                    Score: progress.Score,
                    CorrectAnswers: progress.CorrectAnswers,
                    TotalQuestions: progress.TotalQuestions,
                    QuizData: progress.QuizData,
                    datetime: progress.datetime
                });

                if (response.success) {
                    await markUserQuizProgressAsSynced(progress.id);
                } else {
                    loggerService('error', 'Sync failed for UserQuizProgress id:', progress.id);
                }
            } catch (syncError) {
                loggerService('error', 'Error syncing UserQuizProgress id:', progress.id, syncError);
            }
        });

        await Promise.all(syncPromises);
        console.log("UserQuizProgress synchronization complete");
    } catch (error) {
        loggerService('error', 'Error during UserQuizProgress synchronization', error);
    }
};
