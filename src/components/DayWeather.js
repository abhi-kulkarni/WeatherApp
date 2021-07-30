import React, { useState, useEffect } from "react";
import { withRouter, useHistory, Link } from "react-router-dom";
import '../index.css'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from "react-bootstrap/Form";
import Container from 'react-bootstrap/Container'

const DayWeather = (props) => {

    const history = useHistory();

    const redirectData = {
        pathname: '/'+props.day,
        state: { data: JSON.stringify(props) }
    }
    
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const minmaxTemp = (min, max) => {
        if (min && max) {
            return (
                <h3>
                    <span className="px-4">{min}&deg;</span>
                    <span className="px-4">{max}&deg;</span>
                </h3>
            )
        }
    }

    return (
        <Row style={{ padding: '0px', margin: '0px' }}>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="container">
                    <div className="cards pt-3">
                        <h3>{capitalizeFirstLetter(props.city)}</h3>
                        {props.details?
                        <p style={{ fontStyle: 'italic', color: '#0A73F0'}}>
                           {props.day} 
                        </p>:
                        <Link style={{ textDecoration: 'none' }} to={redirectData}>{props.day}</Link>}
                        {props.date?<span style={{ fontStyle: 'italic', fontWeight: 'bold', fontSize: '14px', marginLeft: '5px' }}>({props.date} {props.time})</span>:''}
                        <h5 className={props.details?"py-3":"py-4"}>
                            <i className={`wi ${props.weatherIcon} display-1`}></i>
                        </h5>
                        {props.temp_celsius ?
                            (<h1>{props.temp_celsius}&deg;</h1>) : null}
                        {minmaxTemp(props.temp_min, props.temp_max)}
                        <h4 className="py-1"> {capitalizeFirstLetter(props.description)} </h4>
                    </div>
                </div>
            </Col>
        </Row>
    );
    }

export default withRouter(DayWeather);