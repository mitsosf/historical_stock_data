import axios from 'axios';

class SubmissionApi {

    static getSymbols() {
        return axios.get('http://localhost:8000/symbols');
    }
}

export default SubmissionApi;