import React, { useState, useEffect } from "react";
import { withRouter, useHistory, useLocation } from "react-router-dom";
import '../index.css'
import axios from 'axios'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import DayWeather from '../components/DayWeather'
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader"
import bgImage from '../assets/background.jpg'

const DayDetails = (props) => {

    const history = useHistory();
    const location = useLocation();

    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')
    const [weatherList, setWeatherList] = useState([]);
    const [weatherError, setWeatherError] = useState(false);
    let [loading, setLoading] = useState(false);
    let [spinnerColor, setSpinnerColor] = useState("#FFD678");

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

    const override = css`
        justify-content: center; 
        align-items: center; 
        padding-top:1px;
        margin-top: 18%;
    `;

    const API_KEY = 'fbde675dbefa5b71917c7e2f8cb14bdf'

    useEffect(() => {
        if (location.redirected) {
            if(location.state){
                let weather_data = JSON.parse(location.state.data);
                if(weather_data.city && weather_data.country){
                    setCity(weather_data.city);
                    setCountry(weather_data.country);
                    getWeather(true, weather_data.city, weather_data.country);
                }
            }
        }
    }, [])


    const clear = () => {
        setCountry('');
        setCity('');
        setWeatherList([]);
    }

    const getWeather = (init, req_city, req_country) => {
        let d_city = init?req_city:city;
        let d_country = init?req_country:country
        setLoading(true);
        setWeatherList([]);
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${d_city},${d_country}&appid=${API_KEY}`).then(resp => {
            let res_list = resp.data.list;
            let weather_data_list = [];
            setLoading(false);
            setWeatherError(false);
            res_list.map(item => {
                let curr_date_data = new Date();
                let res_date_data = new Date(item.dt_txt);
                let curr_date = curr_date_data.getDate();
                let curr_month = curr_date_data.getMonth()+1;
                let curr_year = curr_date_data.getFullYear();
                let curr_time = curr_date_data.getHours();
                let res_date = res_date_data.getDate(); 
                let res_month = res_date_data.getMonth()+1;
                let res_year = res_date_data.getFullYear();
                let res_time = res_date_data.getHours();
                let req_curr_date = curr_date+'-'+curr_month+'-'+curr_year;
                let tomorrow_curr_date = (curr_date+1)+'-'+curr_month+'-'+curr_year;
                let req_res_date = res_date+'-'+res_month+'-'+res_year;
                let reqd_display_day = weekDays[res_date_data.getDay()];
                let disp_time = curr_time + ':' + curr_date_data.getMinutes() + ':' + curr_date_data.getSeconds();
                if(req_res_date === req_curr_date){
                    reqd_display_day = 'Today';
                }else if(req_res_date === tomorrow_curr_date){
                    reqd_display_day = 'Tomorrow';
                }
                if(curr_time >= res_time && curr_time < res_time+3){
                    let icon_data = getWeatherIconData(weatherIcons, item.weather[0].id);
                    let temp =  {
                        city: d_city,
                        country: d_country,
                        time: disp_time,
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
            setLoading(false);
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
                <Row style={{ padding: '0px', margin: '0px' }}>
                    <Col xs={{ offset: 1, span: 4}} sm={{ offset: 1, span: 4}} md={{ offset: 1, span: 4}} lg={{ offset: 1, span: 4}} xl={{ offset: 1, span: 4}}>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="City"
                            aria-label="city"
                            aria-describedby="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </InputGroup>
                    </Col>
                    <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Country"
                            aria-label="country"
                            aria-describedby="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </InputGroup>
                    </Col>
                    <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                        <Button style={{ float: 'left' }} disabled={!city || !country} onClick={() => getWeather()} variant="warning">Get Weather</Button>
                        <Button style={{ float: 'left', marginLeft: '10px' }} disabled={!city && !country} onClick={() => clear()} variant="danger">Clear</Button>
                    </Col>
                </Row>
                {weatherError?<Row style={{ padding: '0px', margin: '0px' }}>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <p style={{marginTop: '5px', color: 'red', textAlign: 'center'}}>Some Error Occured.</p>
                    </Col>
                </Row>:''}
                <ClipLoader color={spinnerColor} loading={loading} css={override} size={150} />
                <Row style={{ padding: '0px', margin: '0px' }}>
                        {weatherList?
                            weatherList.map((item, index) => {
                                return (
                                <Col style={{ paddingTop: index>2?'20px': '0px'}} key={"weather"+index} xs={4} sm={4} md={4} lg={4} xl={4}>
                                    <DayWeather
                                        city={item.city}
                                        country={item.country}
                                        day={item.day}
                                        date={item.date}
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