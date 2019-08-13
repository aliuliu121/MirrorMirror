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
        this.state = {temperature:'',
                      weather:''};
    }

    componentDidMount() {
        this.updateWeather();
        this.timerID = setInterval(
            () => this.updateWeather(),
            300000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    updateWeather() {
        let request = require('request');

        let apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        let city = process.env.REACT_APP_WEATHER_CITY;
        let weatherURL = `https://api.openweathermap.org/data/2.5/weather?id=${city}&units=imperial&appid=${apiKey}`

        request(weatherURL, function (err, response, body) {
        if(err){
            console.log('error retrieving weather');
        } else {
            let weatherGet = JSON.parse(body);
            console.log(weatherGet);
            let temp = `It is ${Math.trunc(weatherGet.main.temp)} degrees in ${weatherGet.name} with a high of ${Math.trunc(weatherGet.main.temp_max)} and a low of ${Math.trunc(weatherGet.main.temp_min)}.`
            let weatherMsg = `${weatherGet.weather[0].description}`
            this.setState({temperature: temp,
                           weather: weatherMsg});
        }
        }.bind(this));
    }

    render() {
        return(
            <div>
                <h1>{this.state.temperature}</h1>
                <h2>current weather: {this.state.weather}</h2>
            </div>
        );
    }
}

class Calendar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            events: []
        };
        this.initClient = this.initClient.bind(this);
        this.listUpcomingEvents = this.listUpcomingEvents.bind(this);
    }
    loadApi() {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        document.body.appendChild(script);
    
        script.onload = () => { 
            window.gapi.load('client:auth2', this.initClient.bind(this));
        }
    }
    componentDidMount(){
        this.loadApi();
    }
    handleAuthClick(){
        window.gapi.auth2.getAuthInstance().signIn();
        this.listUpcomingEvents();
    }
    handleSignoutClick(){
        window.gapi.auth2.getAuthInstance().signOut();
        this.setState({events: []});
    }
    listUpcomingEvents() {
        window.gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
          }).then(function(response) {
            var events = response.result.items;
            var eventList = []
            var i
    
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                  when = event.start.date;
                }
                eventList.push(event.summary + ' (' + when + ')')
            }

            this.setState({events: eventList});
            console.log(eventList);
        }.bind(this));
    }
    initClient() {
        window.gapi.client.init({
          apiKey: process.env.REACT_APP_GCAL_API,
          clientId: process.env.REACT_APP_GCAL_CLIENT_ID,
          discoveryDocs: [process.env.REACT_APP_GCAL_DISCOVERY_DOCS],
          scope: process.env.REACT_APP_GCAL_SCOPES
        });
    }

    render(){
        var eventList = this.state.events.map((event, id) => {
            return <h2 key={event}>{event}</h2>
        });

        return(
            <div className="container">
                <button id="authorize-button" onClick={this.handleAuthClick.bind(this)}>Authorize</button>
                <button id="signout-button" onClick={this.handleSignoutClick.bind(this)}>Sign Out</button>
                <div>{eventList}</div>
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
                <Calendar />
            </div> 
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);