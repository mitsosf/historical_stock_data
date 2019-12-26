import axios from 'axios';

class SubmissionApi {

    static getSymbols() {
        return axios.get(`${process.env.REACT_APP_API_URL}/symbols`);
    }

    static getData(symbol, startDate, endDate, email) {
        return axios.get(`${process.env.REACT_APP_API_URL}/data`, {
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
