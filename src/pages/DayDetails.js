import React, { useState, useEffect } from "react";
import { withRouter, useHistory, useLocation } from "react-router-dom";
import '../index.css'
import axios from 'axios'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import DayWeather from '../components/DayWeather'
import bgImage from '../assets/background.jpg'

const DayDetails = (props) => {

    const history = useHistory();
    const location = useLocation();

    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [weatherList, setWeatherList] = useState([]);
    const [weatherError, setWeatherError] = useState(false);
    const [currentDate, setCurrentDate] = useState('');

    const weatherIcons = {
        Thunderstorm: "wi-thunderstorm",
        Drizzle: "wi-sleet",
        Rain: "wi-storm-showers",
        Snow: "wi-snow",
        Atmosphere: "wi-fog",
        Clear: "wi-day-sunny",
        Clouds: "wi-day-fog",
    };
    const weekDays = {
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
        0: 'Sunday'
    }

    const API_KEY = 'fbde675dbefa5b71917c7e2f8cb14bdf'
    
    useEffect(() => {
        if(location.state){
            let weather_data = JSON.parse(location.state.data);
            if(weather_data.city && weather_data.country && weather_data.date){
                setCity(weather_data.city);
                setCountry(weather_data.country);
                setCurrentDate(weather_data.date);
                getWeather(weather_data.country, weather_data.city, weather_data.date)
            }
        }
    }, [])

    const redirectPage = (page) => {
        let temp = {
            pathname: page,
            redirected: true,
            state: { data: JSON.stringify({'city': city, 'country': country}) }
        }
        history.push(temp);
    }

    const getWeather = (curr_country, curr_city, req_curr_date) => {
        axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${curr_city},${curr_country}&appid=${API_KEY}`).then(resp => {
            let res_list = resp.data.list;
            let weather_data_list = [];
            setWeatherError(false);
            res_list.map(item => {
                let curr_date_data = new Date();
                let res_date_data = new Date(item.dt_txt);
                let curr_date = curr_date_data.getDate();
                let curr_month = curr_date_data.getMonth();
                let curr_year = curr_date_data.getFullYear();
                let curr_time = curr_date_data.getHours();
                let res_date = res_date_data.getDate(); 
                let res_month = res_date_data.getMonth();
                let res_year = res_date_data.getFullYear();
                let res_time = res_date_data.getHours();
                let res_curr_date = curr_date+'-'+curr_month+'-'+curr_year;
                let tomorrow_curr_date = (curr_date+1)+'-'+curr_month+'-'+curr_year;
                let req_res_date = res_date+'-'+res_month+'-'+res_year;
                let reqd_display_day = item.dt_txt;
                if(req_res_date === req_curr_date){
                    let icon_data = getWeatherIconData(weatherIcons, item.weather[0].id);
                    let temp =  {
                        city: curr_city,
                        country: curr_country,
                        time: res_time,
                        day: reqd_display_day,
                        date: req_res_date,
                        celsius: calCelsius(item.main.temp),
                        temp_min: calCelsius(item.main.temp_min),
                        temp_max: calCelsius(item.main.temp_max),
                        description: item.weather[0].description,
                        icon: icon_data
                    }
                    weather_data_list.push(temp)
                }
            })
            setWeatherList(weather_data_list);
        }).catch(err => {
            setWeatherError(true);
            setTimeout(() => {
                setWeatherError(false);
            }, 8000)
            console.log(err);
            setWeatherList([])
        })
    }

    const getWeatherIconData = (icons, rangeId) => {
        switch (true) {
          case rangeId >= 200 && rangeId < 232:
            return icons.Thunderstorm;
          case rangeId >= 300 && rangeId <= 321:
            return icons.Drizzle;
          case rangeId >= 500 && rangeId <= 521:
            return icons.Rain;
          case rangeId >= 600 && rangeId <= 622:
            return icons.Snow;
          case rangeId >= 701 && rangeId <= 781:
            return icons.Atmosphere;
          case rangeId === 800:
            return icons.Clear;
          case rangeId >= 801 && rangeId <= 804:
            return icons.Clouds;
          default:
            return icons.Clouds;
        }
    }

    const calCelsius = (temp) => {
        let cel = Math.floor(temp - 273.15)
        return cel;
    }
      
    return (
        <Row style={{ height: '100vh', backgroundImage: "url(" + bgImage + ")",backgroundRepeat: 'no-repeat', backgroundSize: 'cover', padding: '20px', margin: '0px'}}>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Button style={{ float: 'left'}} size='sm' onClick={() => redirectPage('/')} variant="primary">Back</Button>
                    </Col>
                </Row>
                <Row style={{ margin: '0px', padding: '10px 0px'}}>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <h1>{currentDate} <p style={{ fontSize: '18px', fontWeight: 'bold', fontStyle: 'italic'}}>(3-Hourly)</p></h1> 
                        <h3></h3>
                    </Col>
                </Row>
                <Row style={{ padding: '0px', margin: '0px' }}>
                    {weatherList?
                        weatherList.map((item, index) => {
                            return (
                                <Col style={{ paddingTop: index>2?'20px': '0px'}} key={"weather"+index} xs={4} sm={4} md={4} lg={4} xl={4}>
                                    <DayWeather
                                        details={true}
                                        city={item.city}
                                        country={item.country}
                                        day={item.day}
                                        time={item.time}
                                        temp_celsius={item.celsius}
                                        temp_max={item.temp_max}
                                        temp_min={item.temp_min}
                                        description={item.description}
                                        weatherIcon={item.icon}
                                    />
                                </Col>
                        )})
                    :''}
            </Row>
            </Col>
        </Row>
    );
    }

export default withRouter(DayDetails);