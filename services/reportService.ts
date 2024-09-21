import api from './api'

export class ReportService {

    constructor() {
    }

    async getPosts(urlParams: string): Promise<number> {
        return await api.get(`/report/posts?${urlParams}`)
    }
}
