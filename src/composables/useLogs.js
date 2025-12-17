import { useApi } from './useApi';

export function useLogs() {
    const { request } = useApi();

    async function deleteLog(id) {
        await request(`/api/log/${id}`, {
            method: 'DELETE'
        });
    }

    return {
        deleteLog
    };
}
