// App.js is the starting point and mose important component in our application
// useEffect is a function that accepts another callback function, with a dependency array at the end
import React, { useState, useEffect } from 'react'
//  CssBaseline fixes whitespace and margins
import { CssBaseline, Grid } from '@material-ui/core';

import { getPlacesData, getWeatherData } from './api';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

const App = () => {
const [places, setPlaces] = useState([]);

const [weatherData, setWeatherData] = useState([]);
const [filteredPlaces, setFilteredPlaces] = useState([]);
const [childClicked, setChildClicked] = useState(null);

const [coordinates, setCoordinates] = useState({});
const [bounds, setBounds] = useState({});

const [isLoading, setIsLoading] = useState(false);
const [type, setType] = useState('restaurants');
const [rating, setRating] = useState(3);

// destructure navigator.geolocation.getCurrentPosition twice and make it our starting coordinates
// this is the starting useState for our setCoordinates function
// empty dependency array in this useEffect because it only needs to run at the start
	useEffect(() => {
	    navigator.geolocation.getCurrentPosition(({ coords: {latitude, longitude} }) => {
	      setCoordinates({ lat: latitude, lng: longitude });
	    })
	  }, []);

// this one chnages when rating is selected from the list
	useEffect(() => {
		const filtered = places.filter((place) => Number(place.rating) > rating);
	
		setFilteredPlaces(filtered);
	  }, [rating]);

// use .then in the useEffect because the api calls are asynchronous
// .then has the data from the api calls which we can work with
// to rerun the useEffect every time map/coordinates, type, bounds chnage we need to add dependencies "[type, bounds]"
	useEffect(() => {
		if(bounds.sw && bounds.ne){
		  setIsLoading(true);

		  getWeatherData(coordinates.lat, coordinates.lng)
		  .then((data) => setWeatherData(data));

		  getPlacesData(type, bounds.sw, bounds.ne)
			.then((data) => {
				console.log(data);

			  	setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
				setFilteredPlaces([]);
				setIsLoading(false);
			})
		 }
	  }, [type, bounds]);

	return (
		<>
      <CssBaseline />
      <Header setCoordinates={setCoordinates}/>
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          	<List 
		  		places={filteredPlaces.length ? filteredPlaces : places}
				childClicked={childClicked}
				isLoading={isLoading}
				type={type}
				setType={setType}
				rating={rating}
				setRating={setRating}
		  	/>
        </Grid>
        <Grid item xs={12} md={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Map 
		  	// setCoordinates is the function to get the coordinates state which we also use in map
		  	setCoordinates={setCoordinates}
		  	setBounds={setBounds}
		  	coordinates={coordinates}
			places={filteredPlaces.length ? filteredPlaces : places}
			setChildClicked={setChildClicked}
			weatherData={weatherData}
		  />
        </Grid>
      </Grid>
    </>
  );
}

export default App;