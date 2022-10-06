import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";

import FormControl from "@mui/material/FormControl";

import { Typography } from "@mui/material";
import Select from "react-select";
import moment from "moment";
import "./css/weathericons.css";
import "./App.css";

import { TailSpin } from "react-loader-spinner";

export default function WeatherApp() {
  var data = require("./cities-fr.json");

  const [DropDownValues, setDropDownValues] = useState([]);
  const [displayValue, setdisplayValue] = useState("");
  const [CurrentWeather, setCurrentWeather] = useState([]);
  const [ThreeDayForecast, setThreeDayForecast] = useState([]);
  const [IsFetching, setIsFetching] = useState(false);
  const [DayOneData, setDayOneData] = useState([]);
  const [DayTwoData, setDayTwoData] = useState([]);
  const [DayThreeData, setDayThreeData] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);

  useEffect(() => {
    var options = [];
    data.forEach(
      (result) =>
        typeof result !== undefined &&
        options.push({
          label: result.nm,
          value: result.nm,
          id: result.id,
          lat: result.lat,
          lon: result.lon,
        })
    );

    const params = {
      latitude: options[0].lat,
      longitude: options[0].lon,
      id: options[0].id,
    };
    FetchWeatherData(params);
    FiveDayForecast(params);
    setDropDownValues(options);
  }, []);

  async function FiveDayForecast(params) {
    const { latitude, longitude, id } = params;
    const key = "e063e76bab70475f898e3df76e8ed596";
    const response = await fetch(
      "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&appid=" +
        key
    )
      .then((res) => res.json())
      .then((result) => setThreeDayForecast((prevdata) => [result]));
  }

  async function FetchWeatherData(params) {
    const { latitude, longitude, id } = params;
    const key = "e063e76bab70475f898e3df76e8ed596";
    const response = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&appid=" +
        key
    )
      .then((res) => res.json())
      .then((result) => {
        // const data = { result };
        setCurrentWeather((prevdata) => [result]);
        // console.log("CurrentWeather", CurrentWeather);
      })
      .catch((err) => err.message);

    // setCurrentWeather(response);
    console.log("response", response);
    setIsLoading(true);
  }

  // console.log(DropDownValues[0]);
  CurrentWeather && console.log("CurrentWeather", CurrentWeather);

  const onHandleChange = (e) => {
    console.log(e);
    setdisplayValue(e);

    const params = {
      latitude: e.lat,
      longitude: e.lon,
      id: e.id,
    };
    setIsLoading(false);
    FetchWeatherData(params);
    setDayOneData([]);
    setDayTwoData([]);
    setDayThreeData([]);
    FiveDayForecast(params);
    setIsFetching(false);
  };

  console.log("ThreeDayForecast", ThreeDayForecast);

  useEffect(() => {
    if (ThreeDayForecast && ThreeDayForecast[0]) {
      console.log("cityname", ThreeDayForecast[0].city.name);
      setIsFetching(true);
      const { list } = ThreeDayForecast[0];
      console.log("list", list);

      for (var i = 0; i < list.length; i++) {
        if (
          moment(list[i].dt_txt).format("MM/DD/YYYY hh:mm:ss").toString() ===
          moment().add(1, "days").startOf("day").format("L hh:mm:ss")
        ) {
          setDayOneData([list[i]]);

          console.log("main", list[i]);
        }
        if (
          moment(list[i].dt_txt).format("MM/DD/YYYY hh:mm:ss").toString() ===
          moment().add(2, "days").startOf("day").format("L hh:mm:ss")
        ) {
          setDayTwoData([list[i]]);

          console.log("main", list[i]);
        }
        if (
          moment(list[i].dt_txt).format("MM/DD/YYYY hh:mm:ss").toString() ===
          moment().add(3, "days").startOf("day").format("L hh:mm:ss")
        ) {
          setDayThreeData([list[i]]);

          console.log("main", list[i]);
        }
      }
    }
  }, [ThreeDayForecast]);

  console.log("DayOneData", DayOneData, DayTwoData, DayThreeData);

  return (
    <div className="main-container">
      <Typography
        style={{
          color: "aliceblue",
          fontFamily: "monospace",
          fontWeight: "bold",
          fontSize: "50px",
        }}
      >
        WeatherApp
      </Typography>
      <div className="container">
        <Box sx={{ minWidth: 120 }}>
          <FormControl sx={{ m: 1, minWidth: 300 }}>
            <Typography style={{ color: "aliceblue", fontFamily: "monospace" }}>
              Please Select a City
            </Typography>
            <Select
              defaultValue={DropDownValues && DropDownValues[0]}
              options={DropDownValues}
              onChange={onHandleChange}
              value={displayValue ? displayValue : DropDownValues[0]}
            />
          </FormControl>
        </Box>

        <div className="mini-container">
          {IsLoading ? (
            <div>
              <Box
                sx={{ minWidth: 200, minHeight: 50 }}
                display="flex"
                justifyContent="center"
                alignItems="center"
                className="city-name"
              >
                <Typography>
                  {CurrentWeather &&
                    CurrentWeather[0] &&
                    CurrentWeather[0].name}
                </Typography>
              </Box>
            </div>
          ) : (
            <TailSpin
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          )}

          {IsLoading && CurrentWeather ? (
            CurrentWeather.map((result, index) => (
              <>
                <img
                  src={`http://openweathermap.org/img/w/${result.weather[0].icon}.png`}
                  alt=""
                ></img>
                <h1 key={index} style={{ color: "aliceblue" }}>
                  {Math.round(result.main.temp - 273.15)} C
                </h1>
              </>
            ))
          ) : (
            <TailSpin
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          )}
        </div>
        <div className="forecast">
          {IsFetching ? (
            <>
              <div>
                {DayOneData &&
                  Object.values(DayOneData).map((result, index) => (
                    <div key={index}>
                      <h1>{moment(result.dt_txt).format("dddd")}</h1>
                      <img
                        src={`http://openweathermap.org/img/w/${result.weather[0].icon}.png`}
                        alt=""
                      ></img>
                      <p style={{ color: "aliceblue" }}>
                        Max-Temp:{"  "}
                        {Math.round(result.main.temp_max - 273.15)} C
                      </p>
                      <p style={{ color: "aliceblue" }}>
                        Feels-Like:{"  "}
                        {Math.round(result.main.feels_like - 273.15)} C
                      </p>
                    </div>
                  ))}
              </div>
              <div>
                {DayTwoData &&
                  Object.values(DayTwoData).map((result, index) => (
                    <div key={index}>
                      <h1>{moment(result.dt_txt).format("dddd")}</h1>
                      <img
                        src={`http://openweathermap.org/img/w/${result.weather[0].icon}.png`}
                        alt=""
                      ></img>
                      <p style={{ color: "aliceblue" }}>
                        Max-Temp:{"  "}
                        {Math.round(result.main.temp_max - 273.15)} C
                      </p>
                      <p style={{ color: "aliceblue" }}>
                        Feels-Like:{"  "}
                        {Math.round(result.main.feels_like - 273.15)} C
                      </p>
                    </div>
                  ))}
              </div>
              <div>
                {DayThreeData &&
                  Object.values(DayThreeData).map((result, index) => (
                    <div key={index}>
                      <h1>{moment(result.dt_txt).format("dddd")}</h1>
                      <img
                        src={`http://openweathermap.org/img/w/${result.weather[0].icon}.png`}
                        alt=""
                      ></img>
                      <p style={{ color: "aliceblue" }}>
                        Max-Temp:{"  "}
                        {Math.round(result.main.temp_max - 273.15)} C
                      </p>
                      <p style={{ color: "aliceblue" }}>
                        Feels-Like:{"  "}
                        {Math.round(result.main.feels_like - 273.15)} C
                      </p>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <TailSpin
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
