import axios from 'axios';

class SubmissionApi {

    static getSymbols() {
        return axios.get('http://localhost:8000/symbols');
    }

    static getData(symbol, startDate, endDate, email) {
        return axios.get('http://localhost:8000/data', {
            params: {
                symbol: symbol,
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD'),
                email: email
            }
        });
    }
}

export default SubmissionApi;