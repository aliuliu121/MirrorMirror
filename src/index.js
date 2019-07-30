import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

require('dotenv').config();

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date()};
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render() {
        return (
            <div>
                <h1>Today is {this.state.date.toLocaleDateString()}.</h1>
                <h2>The time is {this.state.date.toLocaleTimeString()}.</h2>
            </div>
        );
    }
}

class Weather extends React.Component {
    constructor(props) {
        super(props);
        this.state = {weatherMsg:''};
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.updateWeather(),
            60000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    updateWeather() {
        let request = require('request');

        let apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        let city = process.env.REACT_APP_WEATHER_CITY;
        let url = `http://api.openweathermap.org/data/2.5/weather?id=${city}&units=imperial&appid=${apiKey}`

        request(url, function (err, response, body) {
        if(err){
            console.log('error retrieving weather');
        } else {
            let weather = JSON.parse(body);
            console.log(weather);
            let weatherStatement = `It is ${Math.trunc(weather.main.temp)} degrees in ${weather.name}.`
            this.setState({weatherMsg: weatherStatement});
        }
        }.bind(this));
    }

    render() {
        return(
            <div>
                <h1>{this.state.weatherMsg}</h1>
            </div>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <div>
                <Clock />
                <Weather />
            </div> 
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);